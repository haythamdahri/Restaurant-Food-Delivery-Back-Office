import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { ReviewModel } from "../models/ReviewModel";

const API_URL = "http://localhost:8080/api/v1/reviews";

class ReviewService {
  getReviews() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<ReviewModel>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new ReviewService();
