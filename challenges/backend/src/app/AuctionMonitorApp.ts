import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { aggregateAuctionData } from './services/CarOnSaleClient/util/CarOnSaleAPIUtil';
import { AggregateAuctionData, RunningAuction } from "./services/CarOnSaleClient/types/carOnSale";

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CARONSALECLIENT) private carOnSaleClient: ICarOnSaleClient,
    ) { }

    /*
     * Executive method to handle retrieving data from the API access client,
     * aggregating it, printing results to the console and, ultimately, detemining
     * the exit code based on success/failure of previous operations.
     */
    public async start(): Promise<void> {
        this.logger.log(`Auction Monitor started.`);

        try {
            // Retrieve a list of running auctions from the CarOnSale API
            const runningAuctions: RunningAuction[] = await this.carOnSaleClient.getRunningAuctions();

            // Parse runing auction data and aggregate data for display
            const auctionDataToPrint: AggregateAuctionData = aggregateAuctionData(runningAuctions);

            // Print aggregated data to console
            this.logger.log(`
                NUMBER OF AUCTIONS: ${auctionDataToPrint.numAuctions}
                AVERAGE NUMBER OF BIDS: ${auctionDataToPrint.avgNumBids}
                AVERAGE AUCTION PROGRESS (%): ${auctionDataToPrint.avgPercentAuctionProgress}
            `);
        } catch (error) {
            // Exit with error
            this.exit(error);
        }

        // Exit with no errors
        this.exit(null);
    }

    /*
     * Simple method to shut down the app and print any error encountered to the console.
     */
    private exit(err=null) {
        if (err) {
            this.logger.log(`Auction Monitor ended with error: ${err}`);
            process.exit(1);
        }

        this.logger.log(`Auction Monitor ended with no errors.`);
        process.exit(0);
    }
}
