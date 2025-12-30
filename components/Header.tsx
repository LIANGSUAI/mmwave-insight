import React from 'react';
import { Radio, ScanLine, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
          <ScanLine className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-100 tracking-tight">毫米波雷达智能感知</h1>
          <p className="text-xs text-slate-400">人体行为识别研究演示系统</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">传感器在线</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
          <Activity className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-slate-300">模型: CNN-LSTM (.h5)</span>
        </div>
      </div>
    </header>
  );
};

export default Header;