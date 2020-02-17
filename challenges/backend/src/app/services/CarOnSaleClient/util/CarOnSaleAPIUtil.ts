import { AggregateAuctionData, RunningAuction } from "../types/carOnSale";

/*
 * Function to aggregate auction data from the CarOnSale API and calculate values
 * to be displayed to the console.
 */
export function aggregateAuctionData(runningAuctions: RunningAuction[]): AggregateAuctionData {
    // Run through the running auctions from the API and sum properties to get averages
    let totalBids = 0, totalPercentAuctionProgress = 0;
    runningAuctions.forEach(ra => {
        totalBids += ra.numBids;
        totalPercentAuctionProgress += (ra.currentHighestBidValue / ra.minimumRequiredAsk);
    });

    return {
        numAuctions: runningAuctions.length,
        avgNumBids: Number((totalBids / runningAuctions.length).toFixed(2)) || 0,
        avgPercentAuctionProgress: Number((totalPercentAuctionProgress / runningAuctions.length).toFixed(2)) || 0,
    };
}
