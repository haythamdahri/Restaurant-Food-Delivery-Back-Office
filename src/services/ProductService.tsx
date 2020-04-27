import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { MealModel } from "../models/MealModel";

const API_URL = "http://localhost:8080/api/v1/meals";

class ProductService {
  getMeals() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<MealModel>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new ProductService();
