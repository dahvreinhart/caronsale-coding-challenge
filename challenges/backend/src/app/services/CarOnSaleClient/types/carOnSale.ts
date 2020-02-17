export interface RunningAuction {
    numBids: number;
    currentHighestBidValue: number;
    minimumRequiredAsk: number;
}

export interface AggregateAuctionData {
    numAuctions: number;
    avgNumBids: number;
    avgPercentAuctionProgress: number;
}

export interface CarOnSaleAPIAuthData {
    token: string;
    authenticated: boolean;
    userId: string;
    internalUserId: number;
    InternalUserUUID: string;
    type: number;
    privilages: string;
}