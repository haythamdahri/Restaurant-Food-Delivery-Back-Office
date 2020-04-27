import axios, { AxiosResponse } from 'axios';
import authHeader from './AuthHeader';
import { OrderModel } from '../models/OrderModel';

const API_URL = 'http://localhost:8080/api/v1/orders';

class OrderService {
  getOrders() {
    return axios.get(`${API_URL}/all`, {headers: authHeader()}).then((response: AxiosResponse<Array<OrderModel>>) => {
      return response.data;
    }).catch((err) => {
      throw new Error(err);
    });
  }
}

export default new OrderService();