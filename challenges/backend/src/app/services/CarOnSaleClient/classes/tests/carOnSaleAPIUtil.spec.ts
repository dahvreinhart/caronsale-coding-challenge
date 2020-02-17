import { expect } from 'chai';
import 'mocha';
import { aggregateAuctionData } from '../../util/CarOnSaleAPIUtil';

describe('CarOnSaleAPIUtil Class Tests', () => {

    describe('aggregateAuctionData()', () => {

        it('should succeed and return correct values when data is empty', () => {
            const runningAuctions = [];
            const result = aggregateAuctionData(runningAuctions);
            expect(result.numAuctions).to.be.equal(0);
            expect(result.avgNumBids).to.be.equal(0);
            expect(result.avgPercentAuctionProgress).to.be.equal(0);
        });

        it('should succeed and return correct values when data is supplied', () => {
            const runningAuctions = [
                { numBids: 100, currentHighestBidValue: 1000, minimumRequiredAsk: 10000 },
                { numBids: 200, currentHighestBidValue: 2000, minimumRequiredAsk: 20000 },
                { numBids: 300, currentHighestBidValue: 3000, minimumRequiredAsk: 30000 },
            ];
            const result = aggregateAuctionData(runningAuctions);
            expect(result.numAuctions).to.be.equal(3);
            expect(result.avgNumBids).to.be.equal(200);
            expect(result.avgPercentAuctionProgress).to.be.equal(0.1);
        });

    });

});