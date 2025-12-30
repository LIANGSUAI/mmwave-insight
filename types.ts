export enum ActivityType {
  BOXING = '打拳',
  FALL = '跌倒',
  JUMP = '跳跃',
  LEFT_FORERAKE = '左前倾',
  LEFT_HAND_WAVE = '左挥手',
  OPEN_ARMS = '张开双臂',
  RIGHT_FORERAKE = '右前倾',
  RIGHT_HAND_WAVE = '右挥手',
  SIT = '坐下',
  SQUAT = '深蹲',
  STAND = '站立',
  WALK = '走路',
  IDLE = '未知/静止'
}

export interface RadarPoint {
  x: number;
  y: number;
  z: number;
  velocity: number; // Doppler info
  intensity: number;
}

export interface PredictionResult {
  activity: ActivityType;
  confidence: number;
  probabilities: Record<ActivityType, number>;
  timestamp: number;
}

export interface SystemStatus {
  isConnected: boolean;
  fps: number;
  modelLoaded: boolean;
  recording: boolean;
}