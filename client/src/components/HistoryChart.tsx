import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { X, TrendingUp } from 'lucide-react';

interface HistoryChartProps {
  data: any[];
  city: string;
  onClose: () => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 shadow-xl text-xs">
      <p className="text-slate-400 font-black uppercase tracking-widest mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono font-black">
          {p.name}: {p.value}{p.dataKey === 'humidity' ? '%' : p.dataKey === 'pressure' ? ' hPa' : '°'}
        </p>
      ))}
    </div>
  );
};

export const HistoryChart: React.FC<HistoryChartProps> = ({ data, city, onClose }) => {
  const cityData = data
    .filter(d => d.city === city)
    .sort((a, b) => new Date(a.extracted_at).getTime() - new Date(b.extracted_at).getTime())
    .map(d => ({
      time: new Date(d.extracted_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(d.extracted_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      temperature: parseFloat(d.temperature.toFixed(1)),
      humidity: d.humidity,
      pressure: d.pressure,
    }));

  if (cityData.length < 2) {
    return (
      <div className="bg-slate-900 rounded-[2.2rem] p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-black text-bioteal uppercase tracking-widest">Série Temporal</p>
            <h3 className="text-lg font-black text-white tracking-tighter uppercase">{city}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-24 text-slate-600">
          <TrendingUp className="w-8 h-8 mb-2 opacity-30" />
          <p className="text-xs font-black uppercase tracking-widest">Mínimo 2 extrações para gerar série</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-[2.2rem] p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] font-black text-bioteal uppercase tracking-widest">Série Temporal</p>
          <h3 className="text-lg font-black text-white tracking-tighter uppercase">{city}</h3>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{cityData.length} leituras</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={cityData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="temp"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <YAxis
            yAxisId="hum"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '10px', fontFamily: 'Inter', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '12px' }}
            formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Temp °C"
            stroke="#0D9488"
            strokeWidth={2}
            dot={{ fill: '#0D9488', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#14B8A6' }}
          />
          <Line
            yAxisId="hum"
            type="monotone"
            dataKey="humidity"
            name="Humid %"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={{ fill: '#60a5fa', r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
