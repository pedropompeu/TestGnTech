import React from 'react';
import {
  Thermometer, Droplets, Calendar, Wind,
  ArrowDownCircle, ArrowUpCircle, Gauge, Umbrella, Waves
} from 'lucide-react';

interface WeatherProps {
  data: {
    id?: number;
    city: string;
    temperature: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    pressure?: number;
    humidity: number;
    wind_speed?: number;
    wind_deg?: number;
    rain_1h?: number;
    description: string;
    icon?: string;
    extracted_at: string;
  };
  isSelected?: boolean;
  onSelect?: () => void;
}

export const WeatherCard: React.FC<WeatherProps> = ({ data, isSelected, onSelect }) => {
  const formattedDate = new Date(data.extracted_at).toLocaleString('pt-BR');

  return (
    <div
      onClick={onSelect}
      className={`group relative atmospheric-card p-8 rounded-[3rem] hover:shadow-[0_40px_80px_-15px_rgba(13,148,136,0.2)] hover:-translate-y-2 ${onSelect ? 'cursor-pointer' : ''} ${isSelected ? 'ring-2 ring-bioteal/40 shadow-teal' : ''}`}
    >

      {/* Textura analógica de sensor */}
      <div className="absolute inset-0 bg-rain opacity-30 pointer-events-none rounded-[3rem]"></div>

      {/* Linha de acento superior */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-bioteal/50 to-transparent"></div>

      {/* Header: cidade + status + timestamp */}
      <div className="relative z-10 flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-bioteal rounded-full animate-ping"></div>
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Telemetry Active</span>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{data.city}</h3>
          <div className="flex items-center gap-2 mt-2">
            <Waves className="w-3 h-3 text-bioteal" />
            <p className="text-[11px] font-black text-bioteal uppercase tracking-widest">{data.description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center text-[10px] font-black text-white bg-slate-900 px-4 py-2 rounded-full shadow-lg">
            <Calendar className="w-3 h-3 mr-2 text-bioteal" />
            <span className="font-mono">{formattedDate}</span>
          </span>
        </div>
      </div>

      {/* Grid de dados */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">

        {/* Módulo de temperatura — dark, alto contraste */}
        <div className="col-span-2 relative bg-slate-900 p-6 rounded-[2.2rem] shadow-2xl overflow-hidden group/temp">
          <div className="absolute inset-0 bg-gradient-to-br from-bioteal/20 to-transparent opacity-50"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="p-4 bg-bioteal rounded-2xl shadow-[0_0_20px_rgba(13,148,136,0.4)]">
              <Thermometer className="w-8 h-8 text-white" />
            </div>
            <div className="text-right text-white">
              <span className="font-mono text-5xl font-black tracking-tighter">{data.temperature.toFixed(1)}°</span>
              <p className="text-[10px] font-black text-bioteal uppercase tracking-widest mt-1">Celsius Protocol</p>
            </div>
          </div>

          <div className="relative z-10 mt-6 grid grid-cols-3 gap-2 text-[10px] font-black uppercase tracking-tighter">
            <div className="bg-white/10 p-2 rounded-xl text-blue-400 flex flex-col items-center">
              <ArrowDownCircle className="w-4 h-4 mb-1" />
              <span className="font-mono">{data.temp_min != null ? data.temp_min.toFixed(1) : '—'}°</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl text-slate-300 flex flex-col items-center justify-center">
              <span className="text-[8px] opacity-60 mb-1">Feels</span>
              <span className="font-mono">{data.feels_like != null ? data.feels_like.toFixed(1) : '—'}°</span>
            </div>
            <div className="bg-white/10 p-2 rounded-xl text-orange-400 flex flex-col items-center">
              <ArrowUpCircle className="w-4 h-4 mb-1" />
              <span className="font-mono">{data.temp_max != null ? data.temp_max.toFixed(1) : '—'}°</span>
            </div>
          </div>
        </div>

        {/* Módulos secundários — light */}
        <div className="bg-white p-5 rounded-[2.2rem] border-2 border-slate-100 flex flex-col justify-between shadow-sm group-hover:border-bioteal/20 transition-all">
          <Droplets className="w-6 h-6 text-blue-600" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Humidity</p>
            <p className="font-mono text-xl font-black text-slate-900 tracking-tighter">{data.humidity}<small className="text-xs not-italic">%</small></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2.2rem] border-2 border-slate-100 flex flex-col justify-between shadow-sm group-hover:border-bioteal/20 transition-all">
          <Wind className="w-6 h-6 text-slate-800" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wind</p>
            <p className="font-mono text-xl font-black text-slate-900 tracking-tighter">{data.wind_speed ?? '—'}<small className="text-xs font-sans ml-1">m/s</small></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2.2rem] border-2 border-slate-100 flex flex-col justify-between shadow-sm group-hover:border-bioteal/20 transition-all">
          <Gauge className="w-6 h-6 text-bioteal" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pressure</p>
            <p className="font-mono text-xl font-black text-slate-900 tracking-tighter">{data.pressure ?? '—'}<small className="text-xs font-sans ml-1">hPa</small></p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2.2rem] border-2 border-slate-100 flex flex-col justify-between shadow-sm group-hover:border-bioteal/20 transition-all">
          <Umbrella className="w-6 h-6 text-indigo-600" />
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precip</p>
            <p className="font-mono text-xl font-black text-slate-900 tracking-tighter">{data.rain_1h || 0}<small className="text-xs font-sans ml-1">mm</small></p>
          </div>
        </div>
      </div>

      {/* Scanner de leitura — passa sobre o card no hover */}
      <div className="absolute left-0 right-0 h-[120px] bg-gradient-to-b from-bioteal/8 to-transparent -top-[120px] group-hover:top-full transition-all duration-[2000ms] pointer-events-none"></div>
    </div>
  );
};
