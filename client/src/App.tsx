import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Database, FlaskConical, MapPin, Navigation, X, AlertCircle, Globe, Trash2 } from 'lucide-react';
import apiClient from './api/client';
import { WeatherCard } from './components/WeatherCard';
import { WeatherMap } from './components/WeatherMap';
import { BackgroundMap } from './components/BackgroundMap';
import { HistoryChart } from './components/HistoryChart';

function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeCoords, setActiveCoords] = useState<[number, number]>([-27.5954, -48.5480]);
  const [activeCityName, setActiveCityName] = useState('Florianópolis');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const searchTimeout = useRef<any>(null);

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/weather/history');
      // Garantia absoluta de ordenação: o maior ID (mais recente) fica no topo
      const sortedData = (response.data || []).sort((a: any, b: any) => b.id - a.id);
      setHistory(sortedData);
    } catch (err) {
      console.error('Falha na sincronização');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (city.length < 3) {
      setSuggestions([]);
      setSearching(false);
      return;
    }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await apiClient.get(`/weather/search?q=${city}`);
        setSuggestions(res.data || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [city]);

  const handleExtract = async (selectedCity?: any) => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    
    const hasCoords = selectedCity && typeof selectedCity.lat === 'number' && typeof selectedCity.lon === 'number';
    const cityName = selectedCity ? `${selectedCity.name}, ${selectedCity.country}` : city;

    try {
      let res;
      if (hasCoords) {
        res = await apiClient.post(`/weather/extract/geo?lat=${selectedCity.lat}&lon=${selectedCity.lon}`);
      } else {
        res = await apiClient.post(`/weather/extract?city=${cityName}`);
      }
      
      const newRecord = res.data;
      setCity('');

      setHistory(prev => [newRecord, ...prev]);

      if (newRecord.lat && newRecord.lon) {
        setActiveCoords([newRecord.lat, newRecord.lon]);
        setActiveCityName(newRecord.city);
      }


    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erro na extração');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Deseja apagar todos os registros da estação?")) return;
    setClearing(true);
    try {
      await apiClient.delete('/weather/history');
      setHistory([]);
      setSelectedCity(null);
    } catch (err) {
      setError("Falha ao limpar histórico");
    } finally {
      setClearing(false);
    }
  };

  return (
    <>
      <BackgroundMap center={activeCoords} />
      <div className="relative min-h-screen font-sans text-slate-900" style={{ zIndex: 2 }}>
      <header className="bg-white border-b border-slate-200 py-4 px-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FlaskConical className="w-8 h-8 text-bioteal" />
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">GnTech <span className="text-bioteal">Weather</span></h1>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (() => {
              const last = history[0];
              const t = last.temperature, h = last.humidity;
              const ideal = t >= 18 && t <= 24 && h >= 40 && h <= 60;
              const acceptable = t >= 15 && t <= 27 && h >= 35 && h <= 65;
              const label = ideal ? 'Condição Ideal' : acceptable ? 'Condição Aceitável' : 'Condição Crítica';
              const color = ideal ? 'text-green-600 border-green-200 bg-green-50' : acceptable ? 'text-amber-600 border-amber-200 bg-amber-50' : 'text-red-600 border-red-200 bg-red-50';
              const dot = ideal ? 'bg-green-500' : acceptable ? 'bg-amber-500' : 'bg-red-500';
              return (
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border px-3 py-1.5 rounded-full ${color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${dot}`}></div>
                  {label}
                </div>
              );
            })()}
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-2 border-slate-100 px-4 py-1.5 rounded-full">
              Laboratory Clarity
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 relative">
              <h2 className="text-xl font-bold mb-6 flex items-center text-slate-700">
                <Globe className="w-5 h-5 mr-3 text-bioteal" />
                Sondagem Ativa
              </h2>

              <div className="space-y-4 relative">
                <div className="relative">
                  <div className="relative group">
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                      placeholder="Digite a cidade..."
                      className="w-full pl-12 pr-12 py-5 bg-slate-50 border-2 border-transparent focus:border-bioteal/30 rounded-[1.5rem] focus:ring-8 focus:ring-bioteal/5 outline-none transition-all text-sm font-semibold shadow-inner"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-bioteal" />
                    {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-bioteal animate-spin" />}
                  </div>

                  {city.length >= 3 && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-[105%] bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden z-[200] divide-y divide-slate-50">
                      {suggestions.map((s: any, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExtract(s)}
                          className="w-full text-left px-6 py-4 hover:bg-bioteal/5 transition-all flex items-center justify-between group"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                               <p className="text-sm font-bold text-slate-700 group-hover:text-bioteal">{s.name}</p>
                               {s.country === 'BR' && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-black uppercase">Brasil 🇧🇷</span>}
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.state ? `${s.state}, ` : ''}{s.country}</p>
                          </div>
                          <Navigation className="w-4 h-4 text-slate-200 group-hover:text-bioteal rotate-45 transition-all" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleExtract()}
                    disabled={loading || city.length < 3}
                    className="flex-1 bg-bioteal hover:bg-bioteal-dark text-white font-bold py-5 rounded-[1.2rem] shadow-lg shadow-bioteal/20 active:scale-95 disabled:opacity-30"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Extrair Dados'}
                  </button>
                  <button
                    onClick={() => {
                       if (navigator.geolocation) {
                         setLoading(true);
                         navigator.geolocation.getCurrentPosition(
                           (pos) => handleExtract({lat: pos.coords.latitude, lon: pos.coords.longitude, name: 'Localização GPS', country: 'BR'}),
                           () => { setError("GPS Negado"); setLoading(false); }
                         );
                       }
                    }}
                    className="bg-slate-100 text-slate-500 hover:bg-slate-200 p-5 rounded-[1.2rem] transition-all shadow-sm"
                  >
                    <MapPin className="w-6 h-6" />
                  </button>
                </div>
                {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase flex items-center"><AlertCircle className="w-4 h-4 mr-2"/> {error}</div>}
              </div>

            </div>

            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white bg-slate-200">
              <WeatherMap center={activeCoords} city={activeCityName} />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* CABEÇALHO DA ESTAÇÃO COM BOTÃO LIMPAR VISÍVEL */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100">
              <h2 className="text-xl font-bold flex items-center text-slate-700">
                <Database className="w-5 h-5 mr-3 text-bioteal" />
                Estação de Monitoramento
              </h2>
              
              <button 
                onClick={handleClearHistory}
                disabled={clearing || history.length === 0}
                className="group flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-500 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm disabled:opacity-30 disabled:hover:bg-white disabled:border-slate-100"
              >
                {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                <span className="text-xs font-black uppercase tracking-widest">Limpar Histórico</span>
              </button>
            </div>
            
            {selectedCity && (
              <HistoryChart
                data={history}
                city={selectedCity}
                onClose={() => setSelectedCity(null)}
              />
            )}

            <div className="grid grid-cols-1 gap-6 pb-24">
              {history.length === 0 ? (
                <div className="h-64 bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
                  <Database className="w-12 h-12 mb-2 opacity-20" />
                  <p className="font-bold uppercase text-xs tracking-widest">Aguardando Novas Extrações</p>
                </div>
              ) : (
                history.map((item: any) => (
                  <WeatherCard
                    key={item.id || Math.random()}
                    data={item}
                    isSelected={selectedCity === item.city}
                    onSelect={() => setSelectedCity(prev => prev === item.city ? null : item.city)}
                  />
                ))
              )}
            </div>
          </div>

        </div>
      </main>
      </div>
    </>
  );
}

export default App;
