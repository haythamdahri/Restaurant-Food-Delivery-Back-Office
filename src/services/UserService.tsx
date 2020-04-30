import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { UserModel } from "../models/UserModel";
import { ENABLE, DISABLE } from "./Constants";
import { Pageable } from "../pagination/Pageable";
import { Page } from "../pagination/Page";

const API_URL = "http://localhost:8080/api/v1/users";

class UserService {
  getBasicUsersPage(search: string = '', pageable: Pageable){
    let url = API_URL + '/'
    + '?page=' + pageable.pageNumber
    + '&size=' + pageable.pageSize;
    const params = {search: ''};
    if(search !== '' ) {
      params['search'] = search;
    }
    return axios
      .get(url, { params, headers: authHeader() })
      .then((response: AxiosResponse<Page<UserModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getBasicUsers(search: string = ''){
    const params = {search: ''};
    if(search !== '' ) {
      params['search'] = search;
    }
    return axios
      .get(`${API_URL}/basics`, { params, headers: authHeader() })
      .then((response: AxiosResponse<Array<UserModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  updateAcountStatus(status: string, id: number) {
    switch (status) {
      case ENABLE:
        return axios
          .get(`${API_URL}/${ENABLE}`, { params: {id: id}, headers: authHeader() })
          .then((response: AxiosResponse<UserModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
      case DISABLE:
        return axios
          .get(`${API_URL}/${DISABLE}`, { params: {id: id}, headers: authHeader() })
          .then((response: AxiosResponse<UserModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
    }
  }
}

export default new UserService();
