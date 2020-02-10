import axios, { AxiosResponse } from "axios";

export type OpeningPriceItem = {
  symbol: string;
  price_open: number;
};

export interface IOpeningPriceService {
  getSymbolHistory(symbol: string): Promise<OpeningPriceItem>;
  getRealtimeData(symbols: string[]): Promise<OpeningPriceItem[]>;
}

type WorldTradingDataStockMessage = {
  Message: string;
};

type WorldTradingDataHistoryResponse = {
  name: string;
  history: {
    [date: string]: {
      open: number;
      close: number;
      high: number;
      low: number;
      volume: number;
    };
  };
};

type WorldTradingDataStockResponse = {
  symbols_requested: number;
  symbols_returned: number;
  data: {
    symbol: string;
    name: string;
    currency: string;
    price: number;
    price_open?: number;
    day_high?: number;
    day_low?: number;
    "52_week_high"?: number;
    "52_week_low"?: number;
    day_change?: number;
    change_pct?: number;
    close_yesterday?: number;
    market_cap?: number;
    volume?: number;
    volume_avg?: number;
    shares?: number;
    stock_exchange_long?: string;
    stock_exchange_short?: string;
    timezone?: string;
    timezone_name?: string;
    gmt_offset?: number;
    last_trade_time?: string;
    pe?: string;
    eps?: number;
  }[];
};

export class WorldTradingDataService implements IOpeningPriceService {
  private apiBaseURL = `https://api.worldtradingdata.com/api/`;
  private apiAuthToken = `v1odpqQ4IATxk7xllY0wvBtSjAdaa0775Sy0IlIZURkBBKm7gndvGdRgfPUm`; // TODO: Secure this by making the runtime environment provide this information

  constructor() {}

  public getRealtimeData(symbols: string[]): Promise<OpeningPriceItem[]> {
    const symbolQueryParam = `symbol=${symbols.join(",")}`;
    const apiTokenQueryParam = `api_token=${this.apiAuthToken}`;
    const queryParams = [symbolQueryParam, apiTokenQueryParam].join("&");

    return axios
      .get(`${this.apiBaseURL}/v1/stock?${queryParams}`)
      .then(
        (
          response: AxiosResponse<
            WorldTradingDataStockResponse | WorldTradingDataStockMessage
          >
        ) => {
          if ("Message" in response.data) {
            throw new Error(
              "There was an error trying to get opening price data: " +
                response.data.Message
            );
          } else {
            return response.data;
          }
        }
      )
      .then(stockResponse => {
        return stockResponse.data.map(stockData => ({
          symbol: stockData.symbol,
          price_open: stockData.price_open || -1
        }));
      });
  }

  public getSymbolHistory(symbol: string): Promise<OpeningPriceItem> {
    const symbolQueryParam = `symbol=${symbol}`;
    const apiTokenQueryParam = `api_token=${this.apiAuthToken}`;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0");
    const currentDay = (currentDate.getDate() + 1).toString().padStart(2, "0");
    const dateFrom = `${currentYear}-${currentMonth}-${currentDay}`;
    const dateFromQueryParam = `date_from=${dateFrom}`;

    const queryParams = [
      symbolQueryParam,
      apiTokenQueryParam,
      dateFromQueryParam
    ].join("&");

    return axios
      .get(`${this.apiBaseURL}/v1/history?${queryParams}`)
      .then(
        (
          response: AxiosResponse<
            WorldTradingDataHistoryResponse | WorldTradingDataStockMessage
          >
        ) => {
          if ("Message" in response.data) {
            throw new Error(
              "There was an error trying to get opening price data: " +
                response.data.Message
            );
          } else {
            return response.data;
          }
        }
      )
      .then(stockResponse => ({
        symbol,
        price_open: stockResponse.history[dateFrom].open
      }));
  }
}
