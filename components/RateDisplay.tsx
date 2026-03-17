
import React from 'react';
import { Currency } from '../types';

interface RateDisplayProps {
  rate: number;
  currency: Currency;
  lastUpdated: Date;
}

const RateDisplay: React.FC<RateDisplayProps> = ({ rate, currency, lastUpdated }) => {
  const formattedRate = new Intl.NumberFormat('es-VE', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(rate);

  const isValidDate = lastUpdated instanceof Date && !isNaN(lastUpdated.getTime());

  const formattedDate = isValidDate 
    ? new Intl.DateTimeFormat('es-VE', {
        dateStyle: 'long',
        timeStyle: 'short',
      }).format(lastUpdated)
    : 'Fecha no disponible';

  return (
    <div className="bg-slate-50 p-4 rounded-lg text-center transition-shadow hover:shadow-lg hover:shadow-slate-200/50 border border-slate-100">
      <p className="text-sm text-slate-500 font-medium">Tasa de cambio actual</p>
      <p className="text-4xl font-bold text-[#00064B] my-2">
        <span className="text-2xl font-normal text-slate-700 align-middle">Bs.</span> {formattedRate}
      </p>
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">por 1 {currency}</p>
      <p className="text-xs text-slate-400 mt-2 italic">Última consulta: {formattedDate}</p>
    </div>
  );
};

export default RateDisplay;
