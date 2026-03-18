import React, { useState, useEffect, useCallback } from 'react';
import { ExchangeRateData } from '../types';

interface MultiConverterProps {
  rateData: ExchangeRateData;
}

const CurrencyInput: React.FC<{
    currency: string;
    flag: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
}> = ({ currency, flag, value, onChange, label }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 text-2xl">{flag}</span>
            <span className="text-slate-500 ml-2 font-bold">{currency}</span>
        </div>
        <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={onChange}
            placeholder="0.00"
            className="w-full bg-white border-2 border-slate-200 focus:border-[#00064B] rounded-lg text-2xl font-mono text-right py-3 pr-4 pl-28 transition-all focus:outline-none focus:ring-4 focus:ring-[#00064B]/5 text-slate-900"
        />
        {label && <p className="text-[10px] text-slate-400 mt-1 ml-1 uppercase font-bold tracking-wider">{label}</p>}
    </div>
);

const MultiConverter: React.FC<MultiConverterProps> = ({ rateData }) => {
  const [amounts, setAmounts] = useState({
    USD: '1.00',
    EUR: (rateData.usd / rateData.eur).toFixed(2),
    USDT: (rateData.usd / rateData.usdt).toFixed(2),
    VES: rateData.usd.toFixed(2)
  });

  const updateAll = (sourceCurrency: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setAmounts({
        USD: sourceCurrency === 'USD' ? value : '',
        EUR: sourceCurrency === 'EUR' ? value : '',
        USDT: sourceCurrency === 'USDT' ? value : '',
        VES: sourceCurrency === 'VES' ? value : ''
      });
      return;
    }

    let vesValue = 0;
    if (sourceCurrency === 'USD') vesValue = num * rateData.usd;
    else if (sourceCurrency === 'EUR') vesValue = num * rateData.eur;
    else if (sourceCurrency === 'USDT') vesValue = num * rateData.usdt;
    else if (sourceCurrency === 'VES') vesValue = num;

    setAmounts({
      USD: sourceCurrency === 'USD' ? value : (vesValue / rateData.usd).toFixed(2),
      EUR: sourceCurrency === 'EUR' ? value : (vesValue / rateData.eur).toFixed(2),
      USDT: sourceCurrency === 'USDT' ? value : (vesValue / rateData.usdt).toFixed(2),
      VES: sourceCurrency === 'VES' ? value : vesValue.toFixed(2)
    });
  };

  const handleChange = (currency: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) return;
    updateAll(currency, val);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <CurrencyInput currency="USD" flag="🇺🇸" value={amounts.USD} onChange={handleChange('USD')} label="Dólar Estadounidense" />
        <CurrencyInput currency="EUR" flag="🇪🇺" value={amounts.EUR} onChange={handleChange('EUR')} label="Euro" />
        <CurrencyInput currency="USDT" flag="🪙" value={amounts.USDT} onChange={handleChange('USDT')} label="Tether / USDT" />
        
        <div className="flex justify-center py-1">
            <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </div>

        <CurrencyInput currency="VES" flag="🇻🇪" value={amounts.VES} onChange={handleChange('VES')} label="Bolívares (VES)" />
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100">
          <p className="text-center text-[10px] text-slate-400 italic">
            Ingresa un monto en cualquier moneda para ver sus equivalencias.
          </p>
      </div>
    </div>
  );
};

export default MultiConverter;
