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
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const getShareText = useCallback(() => {
    return `Conversión de Divisas (BCV):\n` +
           `🇺🇸 ${amounts.USD} USD\n` +
           `🇪🇺 ${amounts.EUR} EUR\n` +
           `🪙 ${amounts.USDT} USDT\n` +
           `🇻🇪 ${amounts.VES} VES\n\n` +
           `Tasas: USD: ${rateData.usd.toFixed(2)} | EUR: ${rateData.eur.toFixed(2)} | USDT: ${rateData.usdt.toFixed(2)}`;
  }, [amounts, rateData]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(getShareText()).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
    });
  }, [getShareText]);

  const handleNativeShare = useCallback(async () => {
    const shareData = {
      title: 'Conversión de Divisas',
      text: getShareText(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      handleCopy();
    }
  }, [getShareText, handleCopy]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <CurrencyInput currency="USD" flag="🇺🇸" value={amounts.USD} onChange={handleChange('USD')} label="Dólar Estadounidense" />
        <CurrencyInput currency="EUR" flag="🇪🇺" value={amounts.EUR} onChange={handleChange('EUR')} label="Euro" />
        <CurrencyInput currency="USDT" flag="🪙" value={amounts.USDT} onChange={handleChange('USDT')} label="Tether / USDT" />
        
        <CurrencyInput currency="VES" flag="🇻🇪" value={amounts.VES} onChange={handleChange('VES')} label="Bolívares (VES)" />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
            <button
                onClick={handleCopy}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-300 ${
                    isCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-[#00064B] hover:opacity-90 text-white shadow-lg shadow-[#00064B]/20'
                }`}
            >
                {isCopied ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">¡Copiado!</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">Copiar</span>
                    </>
                )}
            </button>
            <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition-colors text-slate-700 border border-slate-200"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-sm">Compartir</span>
            </button>
      </div>

      <div className="pt-2 mt-2 border-t border-slate-100">
          <p className="text-center text-[10px] text-slate-400 italic">
            Ingresa un monto en cualquier moneda para ver sus equivalencias.
          </p>
      </div>
    </div>
  );
};

export default MultiConverter;
