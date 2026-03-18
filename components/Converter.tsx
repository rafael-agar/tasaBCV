import React, { useState, useCallback, useEffect } from 'react';
import { Currency } from '../types';

interface ConverterProps {
  rate: number;
  currency: Currency;
}

const CurrencyInput: React.FC<{
    currency: string;
    flag: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ currency, flag, value, onChange }) => (
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
            className="w-full bg-white border-2 border-slate-200 focus:border-[#00064B] rounded-lg text-3xl font-mono text-right py-4 pr-4 pl-28 transition-all focus:outline-none focus:ring-4 focus:ring-[#00064B]/5 text-slate-900"
        />
    </div>
);

const Converter: React.FC<ConverterProps> = ({ rate, currency }) => {
  const [foreignAmount, setForeignAmount] = useState<string>('1.00');
  const [ves, setVes] = useState<string>(rate.toFixed(2));
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Update VES when rate or currency changes, keeping the foreign amount
  useEffect(() => {
    const num = parseFloat(foreignAmount);
    if (!isNaN(num)) {
      setVes((num * rate).toFixed(2));
    }
  }, [rate, currency]);

  const handleForeignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and one dot
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) return;
    
    setForeignAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setVes((num * rate).toFixed(2));
    } else {
      setVes('');
    }
  };

  const handleVesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and one dot
    const val = e.target.value.replace(/[^0-9.]/g, '');
    if ((val.match(/\./g) || []).length > 1) return;

    setVes(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setForeignAmount((num / rate).toFixed(2));
    } else {
      setForeignAmount('');
    }
  };

  const getShareText = useCallback(() => {
    const f = parseFloat(foreignAmount) || 0;
    const v = parseFloat(ves) || 0;
    const source = currency === 'USDT' ? 'Binance P2P' : 'BCV';
    return `El resultado de la conversión es:\n${f.toFixed(2)} ${currency} equivalen a ${v.toFixed(2)} VES.\n\n(Tasa de cambio ${source}: ${rate.toFixed(4)} Bs/${currency})`;
  }, [foreignAmount, ves, rate, currency]);

  const handleCopy = useCallback(() => {
    if (!foreignAmount || !ves) {
        alert('Por favor, realiza un cálculo antes de copiar.');
        return;
    }
    navigator.clipboard.writeText(getShareText()).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
        console.error('Error al copiar al portapapeles:', err);
        alert('No se pudo copiar el resultado.');
    });
  }, [foreignAmount, ves, getShareText]);

  const handleNativeShare = useCallback(async () => {
    if (!foreignAmount || !ves) {
        alert('Por favor, realiza un cálculo antes de compartir.');
        return;
    }
    
    const shareData = {
      title: 'Resultado de Conversión de Divisas',
      text: getShareText(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error al compartir:', err);
      }
    } else {
      alert('La función de compartir no es compatible con tu navegador. Por favor, copia el resultado manualmente.');
    }
  }, [foreignAmount, ves, getShareText]);

  const getFlag = () => {
    switch (currency) {
        case 'USD': return '🇺🇸';
        case 'EUR': return '🇪🇺';
        case 'USDT': return '🪙';
        default: return '💵';
    }
  };

  const flag = getFlag();

  return (
    <div className="space-y-4">
        <CurrencyInput currency={currency} flag={flag} value={foreignAmount} onChange={handleForeignChange} />
        <div className="flex justify-center">
            <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
            </div>
        </div>
        <CurrencyInput currency="VES" flag="🇻🇪" value={ves} onChange={handleVesChange} />
        
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
            <button
                onClick={handleCopy}
                disabled={!foreignAmount || !ves}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed ${
                    isCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-[#00064B] hover:opacity-90 text-white shadow-lg shadow-[#00064B]/20'
                }`}
            >
                {isCopied ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>¡Copiado!</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Copiar resultado</span>
                    </>
                )}
            </button>
            <button
                onClick={handleNativeShare}
                disabled={!foreignAmount || !ves}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition-colors disabled:bg-slate-50 disabled:text-slate-300 disabled:cursor-not-allowed text-slate-700 border border-slate-200"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span>Compartir resultado</span>
            </button>
        </div>
    </div>
  );
};

export default Converter;