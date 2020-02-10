import { IOpeningPriceService, OpeningPriceItem } from "./OpeningPriceService";

const sourceHistoricalData = false;

export function getMultipleOpeningPrices(
  openingPriceService: IOpeningPriceService
) {
  return function(symbols: string[]): Promise<OpeningPriceItem[]> {
    if (sourceHistoricalData) {
      return Promise.all(
        symbols.map(symbol =>
          openingPriceService
            .getSymbolHistory(symbol)
            .catch((error: Error | string) => {
              if (typeof error === "string") {
                console.log(
                  `There was an error trying to fetch symbol data for ${symbol}: ${error}`
                );
              } else {
                console.log(
                  `There was an error trying to fetch symbol data for ${symbol}: ${error.message}`
                );
              }

              return {
                symbol,
                price_open: -1
              };
            })
        )
      ).then(openingPriceData =>
        openingPriceData.filter(x => x.price_open > -1)
      );
    } else {
      return openingPriceService.getRealtimeData(symbols);
    }
  };
}
