import React, { useState, useEffect } from 'react';
import { HistoricalRate, Currency } from '../types';
import { fetchHistory, fetchRateByDate } from '../services/bcvService';

const History: React.FC = () => {
  const [history, setHistory] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filteredRate, setFilteredRate] = useState<HistoricalRate | null>(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory();
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('No se pudo cargar el historial.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setFilterDate(date);
    
    if (!date) {
      setFilteredRate(null);
      return;
    }

    try {
      const rate = await fetchRateByDate(date);
      if (rate) {
        setFilteredRate({ ...rate });
      } else {
        setFilteredRate(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const displayList = filteredRate ? [filteredRate] : history.slice(0, 7);

  if (loading) return <div className="text-center py-4 text-slate-500">Cargando historial...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="date-filter" className="text-sm font-bold text-slate-700">Filtrar por fecha:</label>
        <input
          id="date-filter"
          type="date"
          value={filterDate}
          onChange={handleDateFilter}
          className="w-full p-2 border-2 border-slate-200 rounded-lg focus:border-[#00064B] focus:outline-none transition-all text-slate-700"
        />
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50">
        {displayList.length > 0 ? (
          <div className="divide-y divide-slate-200">
            {/* Desktop Header */}
            <div className="hidden md:grid md:grid-cols-4 sticky top-0 bg-slate-100 text-slate-600 font-bold uppercase text-[10px] tracking-wider px-4 py-2 z-10">
              <div>Fecha</div>
              <div className="text-right">USD</div>
              <div className="text-right">EUR</div>
              <div className="text-right">USDT</div>
            </div>

            {displayList.map((rate, index) => {
              const isValidDate = rate.lastUpdated instanceof Date && !isNaN(rate.lastUpdated.getTime());
              const dateStr = isValidDate 
                ? new Intl.DateTimeFormat('es-VE', { dateStyle: 'medium' }).format(rate.lastUpdated)
                : 'Fecha inválida';

              return (
                <div key={index} className="p-4 md:px-4 md:py-3 hover:bg-white transition-colors">
                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fecha</span>
                      <span className="text-sm font-bold text-slate-700">{dateStr}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="bg-white p-2 rounded border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">USD</p>
                        <p className="text-xs font-mono font-bold text-[#00064B]">{rate.usd.toFixed(2)}</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">EUR</p>
                        <p className="text-xs font-mono font-bold text-[#00064B]">{rate.eur.toFixed(2)}</p>
                      </div>
                      <div className="bg-white p-2 rounded border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">USDT</p>
                        <p className="text-xs font-mono font-bold text-[#00064B]">{rate.usdt.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-4 items-center">
                    <div className="text-slate-600 text-sm">{dateStr}</div>
                    <div className="text-right font-mono font-bold text-[#00064B]">{rate.usd.toFixed(4)}</div>
                    <div className="text-right font-mono font-bold text-[#00064B]">{rate.eur.toFixed(4)}</div>
                    <div className="text-right font-mono font-bold text-[#00064B]">{rate.usdt.toFixed(4)}</div>
                  </div>
                </div>
              );
            })}
            
            {!filteredRate && history.length > 7 && (
              <div className="p-3 text-center bg-white/50">
                <p className="text-[10px] text-slate-400 italic">
                  Mostrando los últimos 7 registros. Usa el filtro para fechas anteriores.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 italic">
            No se encontraron registros para esta fecha.
          </div>
        )}
      </div>
      
      {filteredRate && (
        <button 
          onClick={() => { setFilterDate(''); setFilteredRate(null); }}
          className="text-xs text-[#00064B] font-bold hover:underline"
        >
          Ver todo el historial
        </button>
      )}
    </div>
  );
};

export default History;
