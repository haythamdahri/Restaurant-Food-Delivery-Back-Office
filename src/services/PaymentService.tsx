import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { Payment } from "../models/Payment";

const API_URL = "http://localhost:8080/api/v1/payments";

class PaymentService {
  getPayments() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<Payment>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new PaymentService();
