import * as tf from '@tensorflow/tfjs';
import { ActivityType, RadarPoint, PredictionResult } from '../types';

// 注册 L2 正则化器，解决 "Unknown regularizer: L2" 错误
class L2 {
  static className = 'L2';
  constructor(config: any) {
     return tf.regularizers.l1l2({l1: 0, l2: config.l2});
  }
}
tf.serialization.registerClass(L2);

// Define the classes in the exact order as the model output (alphabetical order of folders)
const MODEL_CLASSES = [
  ActivityType.BOXING,          // 0: box
  ActivityType.FALL,            // 1: fall
  ActivityType.JUMP,            // 2: jump
  ActivityType.LEFT_FORERAKE,   // 3: left_forerake
  ActivityType.LEFT_HAND_WAVE,  // 4: left_hand_wave
  ActivityType.OPEN_ARMS,       // 5: open_arms
  ActivityType.RIGHT_FORERAKE,  // 6: right_forerake
  ActivityType.RIGHT_HAND_WAVE, // 7: right_hand_wave
  ActivityType.SIT,             // 8: sit
  ActivityType.SQUAT,           // 9: squat
  ActivityType.STAND,           // 10: stand
  ActivityType.WALK             // 11: walk
];

let model: tf.LayersModel | null = null;

// Load the converted model from the public folder
export const loadRadarModel = async (): Promise<boolean> => {
  try {
    // Note: The model must be converted to TF.js format and placed in public/model/
    // 使用 window.location.origin 确保路径绝对正确，避免相对路径问题
    const modelUrl = `${window.location.origin}/model/model.json`;
    console.log(`Attempting to load model from: ${modelUrl}`);
    
    model = await tf.loadLayersModel(modelUrl);
    console.log('Model loaded successfully');
    return true;
  } catch (error) {
    console.error('Failed to load model. Please ensure you have run "python scripts/convert_model.py" to convert the .h5 model.', error);
    return false;
  }
};

// Run inference on real data loaded from JSON
export const runInferenceOnData = async (): Promise<PredictionResult | null> => {
  if (!model) {
    console.error('Model not loaded');
    return null;
  }

  try {
    // 1. Load the test data
    console.log('Loading test data...');
    const response = await fetch('/data/test_sample.json');
    if (!response.ok) {
      throw new Error('Failed to load test data');
    }
    const data = await response.json();
    console.log('Data loaded, converting to tensor...');
    
    // Give UI a chance to update
    await new Promise(resolve => setTimeout(resolve, 10));

    // 2. Convert to Tensor & Predict inside tf.tidy to avoid memory leaks
    // Use tf.tidy for automatic memory cleanup of intermediate tensors
    const result = tf.tidy(() => {
        let tensor = tf.tensor(data);
        
        // 自动调整维度
        if (tensor.shape.length === 4) {
          tensor = tensor.expandDims(-1);
        }
        if (tensor.shape.length === 5) {
          tensor = tensor.expandDims(0);
        }

        console.log('Input Tensor Shape:', tensor.shape);
        return model!.predict(tensor) as tf.Tensor;
    });

    console.log('Prediction done, downloading results...');
    const probabilities = await result.data();
    result.dispose(); // Manually dispose the result tensor after reading data
    
    // 4. Process results
    const resultProbabilities = {} as Record<ActivityType, number>;
    
    let maxProb = -1;
    let maxActivity = ActivityType.IDLE;

    console.log('Raw probabilities:', probabilities);

    // Map probabilities to ActivityType using MODEL_CLASSES
    probabilities.forEach((prob, index) => {
      if (index < MODEL_CLASSES.length) {
        const activity = MODEL_CLASSES[index];
        resultProbabilities[activity] = prob;
        if (prob > maxProb) {
          maxProb = prob;
          maxActivity = activity;
        }
      }
    });

    return {
      activity: maxActivity,
      confidence: maxProb,
      probabilities: resultProbabilities,
      timestamp: Date.now(),
    };

  } catch (error) {
    console.error('Inference failed:', error);
    if (error instanceof Error) {
        console.error(error.stack);
    }
    return null;
  }
};

// Helper to generate random number in range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// Simulates a point cloud based on the current "fake" activity
export const generateMockRadarPoints = (activity: ActivityType): RadarPoint[] => {
  const points: RadarPoint[] = [];
  let numPoints = 20;
  let spreadX = 0.5;
  let spreadY = 0.5;
  let velocityBase = 0;

  switch (activity) {
    case ActivityType.BOXING:
    case ActivityType.JUMP:
    case ActivityType.OPEN_ARMS:
    case ActivityType.LEFT_HAND_WAVE:
    case ActivityType.RIGHT_HAND_WAVE:
      numPoints = 60;
      velocityBase = 2.0;
      spreadX = 1.2;
      break;
    case ActivityType.FALL:
      numPoints = 40;
      velocityBase = 3.0; // Fast downward
      spreadX = 1.5;
      break;
    case ActivityType.SIT:
    case ActivityType.STAND:
    case ActivityType.LEFT_FORERAKE:
    case ActivityType.RIGHT_FORERAKE:
      numPoints = 15;
      velocityBase = 0.1;
      spreadX = 0.3;
      spreadY = 0.3;
      break;
    default:
      numPoints = 30;
      velocityBase = 1.0;
  }

  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: random(-spreadX, spreadX),
      y: random(0.5, spreadY + 2), // Forward distance
      z: random(0, 2), // Height
      velocity: random(velocityBase * 0.5, velocityBase * 1.5),
      intensity: random(0.5, 1.0),
    });
  }
  return points;
};

// Simulate model softmax output
export const simulateInference = (forcedActivity?: ActivityType): PredictionResult => {
  const activities = Object.values(ActivityType).filter(a => a !== ActivityType.IDLE);
  
  // Pick a random activity if none forced, with some persistence bias in a real app
  // For demo, we just pick random or stick to one for a few frames ideally.
  // Here we just pick one for simplicity of the function call.
  const currentActivity = forcedActivity || activities[Math.floor(Math.random() * activities.length)];

  const probabilities = {} as Record<ActivityType, number>;
  let remainingProb = 1.0;

  // Assign high probability to target
  const confidence = random(0.75, 0.98);
  probabilities[currentActivity] = confidence;
  remainingProb -= confidence;

  // Distribute rest noise
  Object.values(ActivityType).forEach(act => {
    if (act !== currentActivity) {
      const p = Math.min(remainingProb, random(0, 0.05));
      probabilities[act] = p;
      remainingProb -= p;
    }
  });

  return {
    activity: currentActivity,
    confidence: confidence,
    probabilities: probabilities,
    timestamp: Date.now(),
  };
};