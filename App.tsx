
import React, { useState, useEffect, useCallback } from 'react';
import fetchExchangeRate from './services/bcvService';
import { ExchangeRateData } from './types';
import MultiRateDisplay from './components/MultiRateDisplay';
import MultiConverter from './components/MultiConverter';
import History from './components/History';

type Tab = 'converter' | 'history';

const App: React.FC = () => {
  const [rateData, setRateData] = useState<ExchangeRateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('converter');

  const getRate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExchangeRate();
      setRateData(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error desconocido.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#00064B]"></div>
          <p className="text-slate-500 font-medium">Consultando al BCV...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-6 bg-red-50 rounded-xl border border-red-100">
          <p className="font-bold text-red-600 mb-2">Error de conexión</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={getRate}
            className="px-6 py-2 bg-[#00064B] hover:opacity-90 text-white rounded-lg font-bold transition-all shadow-lg shadow-[#00064B]/20"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (rateData) {
      return (
        <div className="space-y-6">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTab('converter')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'converter' 
                  ? 'bg-white text-[#00064B] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Conversor
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'history' 
                  ? 'bg-white text-[#00064B] shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Historial
            </button>
          </div>

          {activeTab === 'converter' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <MultiConverter rateData={rateData} />
              <div className="w-full h-px bg-slate-100"></div>
              <MultiRateDisplay rateData={rateData} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <History />
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <main className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 space-y-6 transform transition-all duration-500 border border-slate-100">
        <header className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="https://res.cloudinary.com/dgoxcbro5/image/upload/v1770936037/eleva_ux_logo_kkppb9.png" 
                alt="Eleva UX Logo" 
                className="h-16 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Conversor de Divisas</h1>
              <p className="text-slate-500 mt-1 font-medium">Tasa oficial del BCV</p>
            </div>
        </header>
        {renderContent()}
      </main>
      <footer className="text-center mt-8 text-slate-400 text-sm space-y-2">
        <p>Los datos de la tasa de cambio se obtienen directamente de la tasa oficial del BCV.</p>
        <p>
          Creado por <span className="text-[#00064B] font-semibold">Rafael Agar</span>
        </p>
        <a 
          href="https://www.linkedin.com/in/rafael-agar-ocanto/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#00064B] hover:opacity-80 transition-colors font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
            <rect x="2" y="9" width="4" height="12"></rect>
            <circle cx="4" cy="4" r="2"></circle>
          </svg>
          LinkedIn Profile
        </a>
      </footer>
    </div>
  );
};

export default App;
