import React from 'react';
import { ExchangeRateData } from '../types';

interface MultiRateDisplayProps {
  rateData: ExchangeRateData;
}

const RateItem: React.FC<{ label: string; rate: number; flag: string; currency: string }> = ({ label, rate, flag, currency }) => {
  const formattedRate = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(rate);

  return (
    <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{flag}</span>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{currency}</span>
      </div>
      <p className="text-xl font-bold text-[#00064B]">
        <span className="text-sm font-normal text-slate-500 mr-1">Bs.</span>
        {formattedRate}
      </p>
    </div>
  );
};

const MultiRateDisplay: React.FC<MultiRateDisplayProps> = ({ rateData }) => {
  const isValidDate = rateData.lastUpdated instanceof Date && !isNaN(rateData.lastUpdated.getTime());

  const formattedDate = isValidDate 
    ? new Intl.DateTimeFormat('es-VE', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(rateData.lastUpdated)
    : 'Fecha no disponible';

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <RateItem label="Dólar" rate={rateData.usd} flag="🇺🇸" currency="USD" />
        <RateItem label="Euro" rate={rateData.eur} flag="🇪🇺" currency="EUR" />
        <RateItem label="USDT" rate={rateData.usdt} flag="🪙" currency="USDT" />
      </div>
      <p className="text-center text-[10px] text-slate-400 italic">
        Última actualización: {formattedDate}
      </p>
    </div>
  );
};

export default MultiRateDisplay;
