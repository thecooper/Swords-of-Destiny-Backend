import axios, { AxiosResponse } from "axios";

type OpeningPriceItem = {
  symbol: string;
  price_open: number;
};

export interface IOpeningPriceService {
  getOpeningPrice(symbols: string[]): Promise<OpeningPriceItem[]>;
}

type WorldTradingDataStockMessage = {
  Message: string;
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
  private apiBaseURL = `https://api.worldtradingdata.com/api/v1`;
  private apiAuthToken = `v1odpqQ4IATxk7xllY0wvBtSjAdaa0775Sy0IlIZURkBBKm7gndvGdRgfPUm`; // TODO: Secure this by making the runtime environment provide this information

  constructor() {}

  public getOpeningPrice(symbols: string[]): Promise<OpeningPriceItem[]> {
    const symbolQueryParam = `symbol=${symbols.join(",")}`;
    const apiTokenQueryParam = `api_token=${this.apiAuthToken}`;
    const queryParams = [symbolQueryParam, apiTokenQueryParam].join("&");

    return axios
      .get(`${this.apiBaseURL}/stock?${queryParams}`)
      .then(
        (
          response: AxiosResponse<
            WorldTradingDataStockResponse | WorldTradingDataStockMessage
          >
        ) => {
          console.log(typeof response.data);
          if ((response.data as WorldTradingDataStockResponse) !== null) {
            return response.data;
          } else if ((response.data as WorldTradingDataStockMessage) !== null) {
            const message: WorldTradingDataStockMessage = response.data as WorldTradingDataStockMessage;

            throw new Error(
              `A non-successful response (status: ${response.status}) was received from the server: ${message.Message}`
            );
          } else {
            throw new Error(
              `A non-successful response (status: ${response.status}) was received from the server: ${response.data}`
            );
          }
        }
      )
      .then(stockResponse => {
        console.log("Retrieved from the server: ", stockResponse);
        return stockResponse.data.map(x => ({
          symbol: x.symbol,
          price_open: x.price_open || -1
        }));
      });
  }
}
