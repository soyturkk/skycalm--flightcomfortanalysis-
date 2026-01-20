import React from 'react';

interface CircleProgressProps {
  percentage: number;
  label: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ percentage, label }) => {
  const radius = 45; // Slightly reduced to ensure stroke doesn't get cut off
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = 'text-green-500';
  if (percentage < 60) color = 'text-orange-400';
  if (percentage < 40) color = 'text-amber-500';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40">
        <svg
          viewBox="0 0 100 100"
          className="transform -rotate-90 w-full h-full"
        >
          {/* Background Circle */}
          <circle
            stroke="#e2e8f0"
            strokeWidth={stroke}
            fill="transparent"
            r={normalizedRadius}
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${color}`}
            stroke="currentColor"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700">
            <span className="text-4xl font-light tracking-tighter">%{percentage}</span>
            <span className="text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">Konfor</span>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium text-slate-700">{label}</p>
    </div>
  );
};

export default CircleProgress;