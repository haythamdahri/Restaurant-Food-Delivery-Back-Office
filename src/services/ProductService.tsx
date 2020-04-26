import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { Meal } from "../models/Meal";

const API_URL = "http://localhost:8080/api/v1/meals";

class ProductService {
  getMeals() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<Meal>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new ProductService();
