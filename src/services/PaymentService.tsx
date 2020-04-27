import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { PaymentModel } from "../models/PaymentModel";

const API_URL = "http://localhost:8080/api/v1/payments";

class PaymentService {
  getPayments() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<PaymentModel>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new PaymentService();
