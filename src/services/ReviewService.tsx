import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { ReviewModel } from "../models/ReviewModel";
import { Page } from "../pagination/Page";
import { Pageable } from "../pagination/Pageable";
import { APPROVE, DISAPPROVE } from "./Constants";
import { MealModel } from "../models/MealModel";

const API_URL = "http://localhost:8080/api/v1/reviews";

class ReviewService {
  getReviews() {
    return axios
      .get(`${API_URL}/all`, { headers: authHeader() })
      .then((response: AxiosResponse<Array<ReviewModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getReviewsPage(search: string = "", pageable: Pageable) {
    const params = { search: search !== '' ? search: '', page: pageable.pageNumber, size: pageable.pageSize };
    return axios
      .get(`${API_URL}/`, { params, headers: authHeader() })
      .then(async (response: AxiosResponse<Page<ReviewModel>>) => {
        // Set meal for each review
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getReviewMeal(id: number) {
    return axios
      .get(`${API_URL}/${id}/meal`, { headers: authHeader() })
      .then((response: AxiosResponse<MealModel>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  updateReviewStatus(status: string, id: number) {
    switch (status) {
      case APPROVE:
        return axios
          .get(`${API_URL}/${APPROVE}`, {
            params: { id: id },
            headers: authHeader(),
          })
          .then((response: AxiosResponse<ReviewModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
      case DISAPPROVE:
        return axios
          .get(`${API_URL}/${DISAPPROVE}`, {
            params: { id: id },
            headers: authHeader(),
          })
          .then((response: AxiosResponse<ReviewModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
    }
  }
}

export default new ReviewService();
