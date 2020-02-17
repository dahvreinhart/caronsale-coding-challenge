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

    public async getAuthTokenData(): Promise<CarOnSaleAPIAuthData> {
        let response;
        if (this.authData) {
            // Check/refresh the existing auth data if it exists
            response = await this.testAuthData(this.authData);
        } else {
            // Hash password in prep to send to API
            const password = this.hashPasswordWithCycles(this.userPassword, this.hashCycles);

            // Retrieve the userId and authToken
            response = await this.axiosInstance.put(
                `/v1/authentication/${this.userMailId}`,
                { password: password }
            );

            // Set the authData to be reused in the future if needed
            this.authData = response.data;
        }

        return response.data;
    }

    private async testAuthData(authData: CarOnSaleAPIAuthData): Promise<CarOnSaleAPIAuthData> {
        return await this.axiosInstance.post(
            `/v1/authentication/${this.userMailId}`,
            authData
        );
    }

    private hashPasswordWithCycles(plainTextPassword: string, cycles: number): string {
        let hash = `${plainTextPassword}`;
        for (let i = 0; i < cycles; i++) {
            hash = sha512(hash);
        }

        return hash;
    }

}
