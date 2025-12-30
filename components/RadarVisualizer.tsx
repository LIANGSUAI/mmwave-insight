import React, { useEffect, useRef } from 'react';
import { RadarPoint } from '../types';

interface RadarVisualizerProps {
  points: RadarPoint[];
}

const RadarVisualizer: React.FC<RadarVisualizerProps> = ({ points }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const centerX = canvas.width / 2;
    const maxY = canvas.height; // Bottom of canvas is radar origin (y=0)

    // Draw Grid (Polar coordinates simulation)
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.lineWidth = 1;
    
    // Arcs representing distance (Range)
    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      ctx.arc(centerX, maxY, (maxY / 4) * r, Math.PI, 2 * Math.PI);
      ctx.stroke();
    }

    // Lines representing angle (Azimuth)
    for (let deg = 30; deg <= 150; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, maxY);
      ctx.lineTo(
        centerX + Math.cos(rad) * maxY,
        maxY - Math.sin(rad) * maxY
      );
      ctx.stroke();
    }

    // Draw Points
    points.forEach(p => {
      // Map radar coordinates (x: -2 to 2, y: 0 to 5) to canvas
      // Simple 2D projection top-down view
      const scale = maxY / 4; // 4 meters max range
      
      const screenX = centerX + (p.x * scale);
      const screenY = maxY - (p.y * scale);

      const size = p.intensity * 5;

      ctx.beginPath();
      ctx.arc(screenX, screenY, size, 0, 2 * Math.PI);
      
      // Color based on velocity (Doppler)
      // Blue = static, Red = fast
      const velocityRatio = Math.min(p.velocity / 3, 1);
      const r = Math.floor(velocityRatio * 255);
      const b = Math.floor((1 - velocityRatio) * 255);
      
      ctx.fillStyle = `rgba(${r}, 50, ${b}, 0.8)`;
      ctx.fill();
      
      // Glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.fillStyle;
    });

    // Draw Sensor Icon at bottom center
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(centerX, maxY - 10, 10, 0, Math.PI * 2);
    ctx.fill();

  }, [points]);

  return (
    <div className="relative w-full h-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
        <div className="absolute top-4 left-4 text-xs text-slate-500 font-mono">
            <div>传感器: IWR6843ISK (仿真)</div>
            <div>视场角: 120° 方位角</div>
            <div>最大探测范围: 4米</div>
        </div>
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={400} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default RadarVisualizer;