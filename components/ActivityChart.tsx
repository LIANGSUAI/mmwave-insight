import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ActivityType, PredictionResult } from '../types';
import { ACTIVITY_COLORS } from '../constants';

interface ActivityChartProps {
  prediction: PredictionResult | null;
}

const ActivityChart: React.FC<ActivityChartProps> = ({ prediction }) => {
  if (!prediction) return <div className="h-full flex items-center justify-center text-slate-500">无数据</div>;

  const data = Object.entries(prediction.probabilities).map(([key, value]) => ({
    name: key,
    prob: (value as number) * 100, // Convert to percentage
  }));

  // Sort by probability for better viz? Or keep static order? 
  // Static order is better to see changes.
  // Let's filter out very low prob for cleaner look or keep all
  const displayData = data.filter(d => d.name !== ActivityType.IDLE);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis 
          dataKey="name" 
          type="category" 
          width={60} 
          tick={{ fill: '#94a3b8', fontSize: 10 }} 
          interval={0}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
          itemStyle={{ color: '#f1f5f9' }}
          formatter={(value: number) => [`${value.toFixed(1)}%`, '置信度']}
          cursor={{fill: 'transparent'}}
        />
        <Bar dataKey="prob" radius={[0, 4, 4, 0]}>
          {displayData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[entry.name as ActivityType] || '#cbd5e1'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ActivityChart;