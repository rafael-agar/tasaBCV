
export interface ExchangeRateData {
  usd: number;
  eur: number;
  lastUpdated: Date;
}

export interface HistoricalRate extends ExchangeRateData {
  id?: string;
}

export type Currency = 'USD' | 'EUR';
