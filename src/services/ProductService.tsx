import axios, { AxiosResponse } from 'axios';
import authHeader from './AuthHeader';
import { MealModel } from '../models/MealModel';
import { Pageable } from '../pagination/Pageable';
import { Page } from '../pagination/Page';

const API_URL = 'http://localhost:8080/api/v1/meals';

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

  getMealsPage(search: string = '', pageable: Pageable) {
    const params = { search: search !== '' ? search: '', page: pageable.pageNumber, size: pageable.pageSize };
    return axios
      .get(`${API_URL}/page`, { params, headers: authHeader() })
      .then((response: AxiosResponse<Page<MealModel>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }

  getMeal(id: number) {
    return axios
      .get(`${API_URL}/all/${id}`, { headers: authHeader() })
      .then((response: AxiosResponse<MealModel>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }

  deleteProduct(id: number) {
    return axios
      .delete(`${API_URL}/${id}`, { headers: authHeader() })
      .then((response: AxiosResponse<any>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }

  postProduct(data: FormData) {
    const headers = {'Content-Type': 'multipart/form-data', 'Authorization': authHeader().Authorization};
    return axios
      .post(`${API_URL}/`, data, {headers})
      .then((response: AxiosResponse<MealModel>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }

  UndoProductDelete(id: number) {
    return axios
      .post(`${API_URL}/${id}/undo`, {}, {headers: authHeader()})
      .then((response: AxiosResponse<any>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new ProductService();
