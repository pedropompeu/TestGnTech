import React, { useState } from 'react';
import {
  Thermometer, Droplets, Calendar, Wind,
  ArrowDownCircle, ArrowUpCircle, Gauge, Umbrella, Waves,
  ChevronDown, Loader2
} from 'lucide-react';
import apiClient from '../api/client';

interface WeatherData {
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
}

interface ForecastDay {
  date: string;
  weekday: string;
  temp_min: number;
  temp_max: number;
  humidity: number;
  description: string;
  icon: string;
}

interface WeatherProps {
  data: WeatherData;
  isSelected?: boolean;
  onSelect?: () => void;
}

function getLabIndex(temp: number, humidity: number) {
  if (temp >= 18 && temp <= 24 && humidity >= 40 && humidity <= 60)
    return { label: 'Ideal', color: 'text-green-400', dot: 'bg-green-400' };
  if (temp >= 15 && temp <= 27 && humidity >= 35 && humidity <= 65)
    return { label: 'Aceitável', color: 'text-amber-400', dot: 'bg-amber-400' };
  return { label: 'Crítico', color: 'text-red-400', dot: 'bg-red-400' };
}

export const WeatherCard: React.FC<WeatherProps> = ({ data, isSelected, onSelect }) => {
  const formattedDate = new Date(data.extracted_at).toLocaleString('pt-BR');
  const labIndex = getLabIndex(data.temperature, data.humidity);

  const [forecastOpen, setForecastOpen] = useState(false);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [forecastLoading, setForecastLoading] = useState(false);

  const handleForecastToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!forecastOpen && forecastData.length === 0) {
      setForecastLoading(true);
      try {
        const res = await apiClient.get(`/weather/forecast?city=${encodeURIComponent(data.city)}`);
        setForecastData(res.data || []);
      } catch {
        setForecastData([]);
      } finally {
        setForecastLoading(false);
      }
    }
    setForecastOpen(o => !o);
  };

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
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-bioteal rounded-full animate-ping"></div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">Telemetry Active</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full">
              <div className={`w-1.5 h-1.5 rounded-full ${labIndex.dot}`}></div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${labIndex.color}`}>{labIndex.label}</span>
            </div>
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

        {/* Módulo de temperatura — dark */}
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

        {/* Módulos secundários */}
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

      {/* Botão expansível — Previsão 5 dias */}
      <div className="relative z-10 mt-6 border-t border-slate-100 pt-5">
        <button
          onClick={handleForecastToggle}
          className="w-full flex items-center justify-between px-2 group/forecast"
        >
          <div className="flex items-center gap-2">
            {forecastLoading
              ? <Loader2 className="w-4 h-4 text-bioteal animate-spin" />
              : <Waves className="w-4 h-4 text-bioteal" />
            }
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Previsão 5 Dias
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${forecastOpen ? 'rotate-180' : ''}`} />
        </button>

        {forecastOpen && forecastData.length > 0 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {forecastData.map((day, i) => (
              <div
                key={i}
                className={`flex flex-col items-center py-4 px-2 rounded-[1.8rem] transition-all ${
                  i === 0 ? 'bg-slate-900' : 'bg-slate-50'
                }`}
              >
                <span className={`text-[9px] font-black uppercase tracking-wider mb-2 ${i === 0 ? 'text-bioteal' : 'text-slate-400'}`}>
                  {i === 0 ? 'Hoje' : day.weekday}
                </span>

                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.description}
                  className={`w-12 h-12 -my-1 ${i !== 0 ? 'opacity-70' : ''}`}
                />

                <span className={`font-mono text-sm font-black mt-1 ${i === 0 ? 'text-orange-400' : 'text-slate-700'}`}>
                  {day.temp_max}°
                </span>
                <span className={`font-mono text-xs font-black ${i === 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                  {day.temp_min}°
                </span>

                <span className={`text-[9px] font-black mt-2 ${i === 0 ? 'text-slate-500' : 'text-slate-300'}`}>
                  {day.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scanner de leitura */}
      <div className="absolute left-0 right-0 h-[120px] bg-gradient-to-b from-bioteal/8 to-transparent -top-[120px] group-hover:top-full transition-all duration-[2000ms] pointer-events-none"></div>
    </div>
  );
};
