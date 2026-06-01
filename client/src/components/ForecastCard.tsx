import React from 'react';
import { CloudSun } from 'lucide-react';

interface ForecastDay {
  date: string;
  weekday: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
}

interface ForecastCardProps {
  city: string;
  days: ForecastDay[];
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ city, days }) => {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CloudSun className="w-4 h-4 text-bioteal" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previsão 5 Dias — {city}</p>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {days.map((day, i) => (
          <div
            key={i}
            className={`flex flex-col items-center p-3 rounded-[1.5rem] transition-all ${i === 0 ? 'bg-slate-900' : 'bg-slate-50 hover:bg-bioteal/5'}`}
          >
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i === 0 ? 'text-bioteal' : 'text-slate-400'}`}>
              {i === 0 ? 'Hoje' : day.weekday}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${day.icon}.png`}
              alt={day.description}
              className={`w-10 h-10 ${i !== 0 ? 'opacity-70' : ''}`}
            />
            <div className="flex gap-1 mt-1">
              <span className={`font-mono text-[11px] font-black ${i === 0 ? 'text-orange-400' : 'text-slate-700'}`}>
                {day.temp_max}°
              </span>
              <span className={`font-mono text-[11px] font-black ${i === 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                {day.temp_min}°
              </span>
            </div>
            <p className={`text-[9px] font-black uppercase tracking-tighter text-center mt-1 leading-tight ${i === 0 ? 'text-slate-400' : 'text-slate-300'}`}>
              {day.date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
