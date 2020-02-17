import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import Axios from 'axios';
import { CarOnSaleAPIHelper } from '../CarOnSaleAPIHelper';
import { CarOnSaleClient } from '../CarOnSaleClient';

describe('CarOnSaleClient Class Tests', () => {

    describe('getRunningAuctions()', () => {

        it('should succeed and return an empty list when no data is found', async () => {
            Axios.create = sinon.fake.returns({ get: () => { return { data: { items: [] } } } });
            CarOnSaleAPIHelper.prototype.getAuthTokenData = sinon.fake.returns(true);
            const instance = new CarOnSaleClient();

            const result = await instance.getRunningAuctions();

            expect(result.length).to.equal(0);
        });

        it('should succeed and return a list of running action objects when data is found', async () => {
            const returnList = [
                { numBids: 1, currentHighestBidValue: 1, minimumRequiredAsk: 10 },
                { numBids: 2, currentHighestBidValue: 2, minimumRequiredAsk: 20 },
                { numBids: 3, currentHighestBidValue: 3, minimumRequiredAsk: 30 },
            ]
            Axios.create = sinon.fake.returns({ get: () => {
                return {
                    data: {
                        items: returnList
                    }
                }
            }});
            CarOnSaleAPIHelper.prototype.getAuthTokenData = sinon.fake.returns(true);
            const instance = new CarOnSaleClient();

            const result = await instance.getRunningAuctions();

            expect(JSON.stringify(result)).to.equal(JSON.stringify(returnList));
        });

    });

});