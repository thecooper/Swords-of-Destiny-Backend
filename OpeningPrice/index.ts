import {
  IOpeningPriceService,
  WorldTradingDataService
} from "./OpeningPriceService";

const service: IOpeningPriceService = new WorldTradingDataService();

service
  .getOpeningPrice(["APPL"])
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(
      "There was an error trying to get opeing price data: ",
      error
    );
  });
