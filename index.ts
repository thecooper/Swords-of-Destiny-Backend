import {
  IOpeningPriceService,
  WorldTradingDataService
} from "./openingPrice/OpeningPriceService";
import { getMultipleOpeningPrices } from "./openingPrice/getMultipleOpeningPrices";

const service: IOpeningPriceService = new WorldTradingDataService();

const targetSymbols: string[] = ["AAPL", "TWTR", "MSFT"];

getMultipleOpeningPrices(service)(targetSymbols)
  .then(result => {
    console.log(result);
  })
  .catch((error: Error) => {
    console.error(
      `There was an error trying to get opeing price data: ${error.message}`
    );
  });
