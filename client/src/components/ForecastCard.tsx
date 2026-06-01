import React, { useState } from 'react';
import { CloudSun, ChevronDown } from 'lucide-react';

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
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-slate-100 pt-4 mt-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-2">
          <CloudSun className="w-4 h-4 text-bioteal" />
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
            Previsão 5 dias — <span className="text-bioteal">{city}</span>
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {days.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-3 px-1 rounded-2xl transition-all ${
                i === 0
                  ? 'bg-slate-900'
                  : 'bg-slate-50 hover:bg-bioteal/5'
              }`}
            >
              {/* Dia da semana */}
              <span className={`text-[9px] font-black uppercase tracking-wider mb-1 ${
                i === 0 ? 'text-bioteal' : 'text-slate-400'
              }`}>
                {i === 0 ? 'Hoje' : day.weekday}
              </span>

              {/* Ícone OWM */}
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.description}
                width={40}
                height={40}
                className={i !== 0 ? 'opacity-75' : ''}
              />

              {/* Temp max */}
              <span className={`font-mono text-[12px] font-black leading-none ${
                i === 0 ? 'text-orange-400' : 'text-slate-700'
              }`}>
                {day.temp_max}°
              </span>

              {/* Temp min */}
              <span className={`font-mono text-[11px] font-black leading-none mt-0.5 ${
                i === 0 ? 'text-blue-400' : 'text-slate-400'
              }`}>
                {day.temp_min}°
              </span>

              {/* Data */}
              <span className={`text-[9px] font-black mt-1.5 ${
                i === 0 ? 'text-slate-600' : 'text-slate-300'
              }`}>
                {day.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
