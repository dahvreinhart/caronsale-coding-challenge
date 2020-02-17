import { sha512 } from 'js-sha512';
import Axios from 'axios';
import { CarOnSaleAPIAuthData } from '../types/carOnSale';

export class CarOnSaleAPIHelper {

    public apiBaseURL = 'https://caronsale-backend-service-dev.herokuapp.com/api';
    private axiosInstance = Axios.create({ baseURL: this.apiBaseURL });
    private userMailId = 'salesman@random.com';
    private userPassword = '123test';
    private hashCycles = 5;
    private authData;

    /*
     * Call the CarOnSale authentication API and acquire the auth data for the buyer.
     * Stores the auth data on the instance in case of possible future reuse.
     */
    public async getAuthTokenData(): Promise<CarOnSaleAPIAuthData> {
        let response;
        if (this.authData) {
            // Try to check/refresh the existing auth data if it exists
            try {
                response = await this.checkRefreshAuthData(this.authData);
            } catch (error) {
                // If it fails, just get new credentials
                response = await this.getNewAuthData();
            }
        } else {
            response = await this.getNewAuthData();
        }

        // Set the authData to be reused in the future if needed
        this.authData = response.data;

        return response.data;
    }

    /*
     * Method for acquiring a new set of auth credentials.
     */
    public async getNewAuthData(): Promise<CarOnSaleAPIAuthData> {
        // Hash password in prep to send to API
        const password = this.hashPasswordWithCycles(this.userPassword, this.hashCycles);

        // Retrieve the userId and authToken from API
        return await this.axiosInstance.put(
            `/v1/authentication/${this.userMailId}`,
            { password: password }
        );
    }

    /*
     * Method for checking the vlidity of a set of auth credentials and renewing them
     * if still valid.
     */
    public async checkRefreshAuthData(authData: CarOnSaleAPIAuthData): Promise<CarOnSaleAPIAuthData> {
        return await this.axiosInstance.post(
            `/v1/authentication/${this.userMailId}`,
            authData
        );
    }

    /*
     * Method described in challenge notes to hash password in prep for communication
     * to authentication API.
     */
    private hashPasswordWithCycles(plainTextPassword: string, cycles: number): string {
        let hash = `${plainTextPassword}`;
        for (let i = 0; i < cycles; i++) {
            hash = sha512(hash);
        }

        return hash;
    }

}
