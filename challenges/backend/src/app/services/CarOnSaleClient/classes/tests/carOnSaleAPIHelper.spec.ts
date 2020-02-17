import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { CarOnSaleAPIHelper } from '../CarOnSaleAPIHelper';

describe('CarOnSaleAPIHelper Class Tests', () => {

    describe('getAuthTokenData()', () => {

        it('should succeed and return initial credentials', async () => {
            const instance = new CarOnSaleAPIHelper();
            instance.getNewAuthData = sinon.fake.returns({ data: 'test' });

            const result = await instance.getAuthTokenData();

            expect(result).to.equal('test');
        });

        it('should succeed and return updated credentials when some already exist', async () => {
            const instance = new CarOnSaleAPIHelper();
            instance.getNewAuthData = sinon.fake.returns({ data: 'test' });
            instance.checkRefreshAuthData = sinon.fake.returns({ data: 'updated' });

            await instance.getAuthTokenData();
            const result = await instance.getAuthTokenData();

            expect(result).to.equal('updated');
        });

    });

});
