import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RadarVisualizer from './components/RadarVisualizer';
import ActivityChart from './components/ActivityChart';
import { ActivityType, RadarPoint, PredictionResult } from './types';
import { generateMockRadarPoints, simulateInference, loadRadarModel, runInferenceOnData } from './services/simulationService';
import { ACTIVITY_COLORS, ACTIVITY_DESCRIPTIONS } from './constants';
import { Play, Pause, AlertTriangle, FileUp, Info } from 'lucide-react';

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState<PredictionResult | null>(null);
  const [radarPoints, setRadarPoints] = useState<RadarPoint[]>([]);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [forcedMode, setForcedMode] = useState<ActivityType | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Load Model on Mount
  useEffect(() => {
    const initModel = async () => {
      const loaded = await loadRadarModel();
      setIsModelLoaded(loaded);
    };
    initModel();
  }, []);

  // Simulation Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning) {
      interval = setInterval(() => {
        // 1. Get Prediction (Simulated based on forced mode or random)
        const prediction = simulateInference(forcedMode || undefined);
        setCurrentPrediction(prediction);

        // 2. Generate corresponding Point Cloud
        const points = generateMockRadarPoints(prediction.activity);
        setRadarPoints(points);

        // 3. Update History (keep last 50)
        setHistory(prev => [prediction, ...prev].slice(0, 50));

      }, 200); // 5 FPS update rate for visual smoothness
    }

    return () => clearInterval(interval);
  }, [isRunning, forcedMode]);

  const toggleSimulation = () => setIsRunning(!isRunning);

  const handleRealDataTest = async () => {
    if (!isModelLoaded) {
      alert("请先等待模型加载完成");
      return;
    }
    
    const result = await runInferenceOnData();
    if (result) {
      setCurrentPrediction(result);
      
      // 生成对应动作的模拟点云，以便在界面上展示
      const points = generateMockRadarPoints(result.activity);
      setRadarPoints(points);

      setHistory(prev => [result, ...prev].slice(0, 50));
      alert(`推理完成！\n识别结果: ${result.activity}\n置信度: ${(result.confidence * 100).toFixed(2)}%`);
    } else {
      alert("推理失败，请检查控制台日志或确保已运行 python scripts/convert_data.py");
    }
  };

  const currentActivityName = currentPrediction ? currentPrediction.activity : '等待中...';
  const isFallDetected = currentPrediction?.activity === ActivityType.FALL;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <Header />

      <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column: Visuals & Control (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Visualizer Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-2xl relative overflow-hidden group">
             {/* Critical Alert Overlay */}
            {isFallDetected && (
              <div className="absolute inset-0 z-20 bg-red-500/20 animate-pulse pointer-events-none flex items-center justify-center">
                 <div className="bg-red-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 border-2 border-red-400">
                    <AlertTriangle className="w-10 h-10" />
                    <span className="text-3xl font-black uppercase tracking-widest">检测到跌倒</span>
                 </div>
              </div>
            )}

            <div className="h-[400px] md:h-[500px] w-full relative">
               <RadarVisualizer points={radarPoints} />
               
               {/* Overlay Info */}
               <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur border border-slate-700 p-4 rounded-xl text-right">
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">识别结果</div>
                  <div 
                    className="text-3xl font-bold transition-colors duration-300"
                    style={{ color: currentPrediction ? ACTIVITY_COLORS[currentPrediction.activity] : '#94a3b8' }}
                  >
                    {currentActivityName}
                  </div>
                  <div className="text-sm font-mono text-slate-300 mt-1">
                    置信度: {currentPrediction ? (currentPrediction.confidence * 100).toFixed(1) : 0}%
                  </div>
               </div>
            </div>
          </div>

          {/* Control Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Playback Controls */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
                <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
                   <Info className="w-4 h-4" /> 系统控制
                </h3>
                <div className="flex gap-3">
                   <button 
                    onClick={toggleSimulation}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold transition-all ${isRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                   >
                     {isRunning ? <><Pause className="w-5 h-5"/> 暂停流</> : <><Play className="w-5 h-5"/> 开始推理</>}
                   </button>
                   
                   <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${isModelLoaded ? 'bg-slate-800 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                      <FileUp className="w-5 h-5" />
                      <span className="text-sm font-medium">{isModelLoaded ? '模型已加载' : '加载模型中...'}</span>
                   </div>
                   
                   <button 
                    onClick={handleRealDataTest}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all"
                   >
                      <Play className="w-5 h-5" />
                      <span className="text-sm">测试真实数据</span>
                   </button>
                </div>
             </div>

             {/* Mode Selector (For Demo Purposes) */}
             <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">模拟特定行为</h3>
                <div className="grid grid-cols-4 gap-2">
                   {Object.values(ActivityType).filter(a => a !== ActivityType.IDLE).map((activity) => (
                      <button
                        key={activity}
                        onClick={() => setForcedMode(activity === forcedMode ? null : activity)}
                        className={`text-xs py-2 px-1 rounded border transition-all truncate ${
                           forcedMode === activity 
                           ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25' 
                           : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                        }`}
                      >
                         {activity}
                      </button>
                   ))}
                </div>
             </div>
          </div>

        </div>

        {/* Right Column: Analytics (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Probability Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 h-[320px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">分类概率分布 (Softmax)</h3>
            <div className="flex-1 min-h-0">
               <ActivityChart prediction={currentPrediction} />
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-0 flex flex-col flex-1 overflow-hidden min-h-[300px]">
             <div className="p-4 border-b border-slate-800 bg-slate-900/50">
               <h3 className="text-sm font-bold text-slate-300">历史记录</h3>
             </div>
             <div className="overflow-y-auto p-2 space-y-1 flex-1">
                {history.length === 0 && <div className="text-center text-slate-600 py-10 text-sm">暂无记录</div>}
                {history.map((item, idx) => (
                  <div key={item.timestamp + idx} className="flex items-center justify-between p-2 rounded hover:bg-slate-800/50 text-sm border-l-2" style={{ borderLeftColor: ACTIVITY_COLORS[item.activity] }}>
                     <span className="font-medium text-slate-300">{item.activity}</span>
                     <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{(item.confidence * 100).toFixed(0)}%</span>
                        <span className="text-xs font-mono text-slate-600">
                           {new Date(item.timestamp).toLocaleTimeString([], { hour12: false, second: '2-digit', fractionalSecondDigits: 1 } as any)}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Context Info */}
          <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-4">
             <h4 className="text-blue-400 text-xs font-bold uppercase mb-2">当前状态上下文</h4>
             <p className="text-sm text-slate-300">
               {currentPrediction 
                  ? ACTIVITY_DESCRIPTIONS[currentPrediction.activity] 
                  : "系统就绪。请点击“开始推理”启动实时分析。"}
             </p>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;