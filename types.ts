
export interface ExchangeRateData {
  usd: number;
  eur: number;
  usdt: number;
  lastUpdated: Date;
}

export interface HistoricalRate extends ExchangeRateData {
  id?: string;
}

export type Currency = 'USD' | 'EUR' | 'USDT';
