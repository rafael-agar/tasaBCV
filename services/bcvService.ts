
import { ExchangeRateData, HistoricalRate } from '../types';

const BASE_URL = 'https://tasa-bcv-yz4g.onrender.com/api/rates';

export const fetchExchangeRate = async (): Promise<ExchangeRateData> => {
  try {
    const response = await fetch(`${BASE_URL}/latest`);
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const json = await response.json();

    if (!json.success || !json.data) {
      throw new Error("La respuesta de la API no es válida.");
    }

    return {
      usd: json.data.usd,
      eur: json.data.eur,
      usdt: json.data.usdt || 0,
      lastUpdated: new Date(json.data.updatedAt || json.data.date || json.data.createdAt || Date.now()),
    };
  } catch (error) {
    console.error("Error al obtener la tasa de cambio:", error);
    throw new Error("No se pudo obtener la tasa de cambio del BCV. Inténtelo de nuevo más tarde.");
  }
};

export const fetchHistory = async (): Promise<HistoricalRate[]> => {
  try {
    const response = await fetch(`${BASE_URL}/history`);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const json = await response.json();
    if (!json.success || !json.data) throw new Error("Respuesta no válida");

    return json.data.map((item: any) => ({
      usd: item.usd,
      eur: item.eur,
      usdt: item.usdt || 0,
      lastUpdated: new Date(item.updatedAt || item.date || item.createdAt || Date.now()),
    }));
  } catch (error) {
    console.error("Error al obtener el historial:", error);
    throw error;
  }
};

export const fetchRateByDate = async (date: string): Promise<ExchangeRateData | null> => {
  try {
    const response = await fetch(`${BASE_URL}/date/${date}`);
    if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Error HTTP: ${response.status}`);
    }
    const json = await response.json();
    if (!json.success || !json.data) return null;

    return {
      usd: json.data.usd,
      eur: json.data.eur,
      usdt: json.data.usdt || 0,
      lastUpdated: new Date(json.data.updatedAt || json.data.date || json.data.createdAt || Date.now()),
    };
  } catch (error) {
    console.error("Error al obtener tasa por fecha:", error);
    throw error;
  }
};

export default fetchExchangeRate;
