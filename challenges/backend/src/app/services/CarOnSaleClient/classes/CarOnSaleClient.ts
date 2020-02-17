import { ICarOnSaleClient } from "../interface/ICarOnSaleClient";
import { injectable } from "inversify";
import { CarOnSaleAPIHelper } from "./CarOnSaleAPIHelper";
import Axios from "axios";
import { RunningAuction } from "../types/carOnSale";
import 'reflect-metadata';

@injectable()
export class CarOnSaleClient implements ICarOnSaleClient {

    /*
     * Method to consume the API helper for authentication,
     * call the CarOnSale auction API, and parse return data
     * into a typed format which can be aggregated in the future.
     */
    async getRunningAuctions(): Promise<RunningAuction[]> {
        // Connect and authenticate with CarOnSale auction API
        const apiHelper = new CarOnSaleAPIHelper();
        const authData = await apiHelper.getAuthTokenData();

        // Instantiate an axios instance pre-populated with authentication headers
        const axiosInstance = Axios.create({
            baseURL: apiHelper.apiBaseURL,
            headers: {
                userId: authData.userId,
                authtoken: authData.token,
            }
        });

        // Call the API and get all auctions visible to the authenticated buyer
        const response = await axiosInstance.get('/v2/auction/buyer/');

        // Parse response data into typed objects
        const runningAuctions: RunningAuction[] = [];
        for (let item of response.data.items) {
            runningAuctions.push({
                numBids: item.numBids,
                currentHighestBidValue: item.currentHighestBidValue,
                minimumRequiredAsk: item.minimumRequiredAsk,
            })
        }

        return runningAuctions;
    }

}
