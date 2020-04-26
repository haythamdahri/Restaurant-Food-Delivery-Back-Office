import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'http://localhost:8080/api/v1/orders/';

class OrderService {
  getOrders() {
    return axios.get(API_URL, {headers: authHeader()});
  }
}

export default new OrderService();