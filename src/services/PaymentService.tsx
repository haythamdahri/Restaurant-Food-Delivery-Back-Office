import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { PaymentModel } from "../models/PaymentModel";
import { Pageable } from "../pagination/Pageable";
import { Page } from "../pagination/Page";

const API_URL = "http://localhost:8080/api/v1/payments";

class PaymentService {
  getPaymentsPage(search: string = '', pageable: Pageable) {
    const params = { search: search !== '' ? search: '', page: pageable.pageNumber, size: pageable.pageSize };
    return axios
      .get(`${API_URL}/`, { params, headers: authHeader() })
      .then((response: AxiosResponse<Page<PaymentModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  getPayments() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<PaymentModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

}

export default new PaymentService();
