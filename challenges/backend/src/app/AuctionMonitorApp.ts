import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
import { AggregateAuctionData, RunningAuction } from "./services/CarOnSaleClient/types/carOnSale";

@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CARONSALECLIENT) private carOnSaleClient: ICarOnSaleClient,
    ) { }

    public async start(): Promise<void> {

        this.logger.log(`Auction Monitor started.`);

        try {
            // Retrieve a list of running auctions from the CarOnSale API
            const runningAuctions: RunningAuction[] = await this.carOnSaleClient.getRunningAuctions();
            console.log(runningAuctions.length);
            console.log(runningAuctions);

            // Parse runing auction data and aggregate data for display
            const aggregateAuctionData = this.aggregateAuctionData(runningAuctions);

            // Print aggregated data to console
            this.logger.log(`
                NUMBER OF AUCTIONS: ${aggregateAuctionData.numAuctions}
                AVERAGE NUMBER OF BIDS: ${aggregateAuctionData.avgNumBids}
                AVERAGE AUCTION PROGRESS (%): ${aggregateAuctionData.avgPercentAuctionProgress}
            `);
        } catch (error) {
            // Exit with error
            this.exit(error);
        }

        // Exit with no errors
        this.exit(null);

    }

    private exit(err=null) {

        if (err) {
            this.logger.log(`Auction Monitor ended with error: ${err}`);
            process.exit(1);
        }

        this.logger.log(`Auction Monitor ended with no errors.`);
        process.exit(0);

    }

    private aggregateAuctionData(runningAuctions: RunningAuction[]): AggregateAuctionData {
        let totalBids = 0, totalPercentAuctionProgress = 0;
        runningAuctions.forEach(ra => {
            totalBids += ra.numBids;
            totalPercentAuctionProgress += (ra.currentHighestBidValue / ra.minimumRequiredAsk);
        });

        return {
            numAuctions: runningAuctions.length,
            avgNumBids: (totalBids / runningAuctions.length),
            avgPercentAuctionProgress: (totalPercentAuctionProgress / runningAuctions.length),
        };
    }

}