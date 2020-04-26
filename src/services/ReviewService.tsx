import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { Review } from "../models/Review";

const API_URL = "http://localhost:8080/api/v1/reviews";

class ReviewService {
  getReviews() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<Review>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new ReviewService();
