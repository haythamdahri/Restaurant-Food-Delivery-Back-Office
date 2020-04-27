import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { UserModel } from "../models/UserModel";
import { ENABLE, DISABLE } from "./Constants";

const API_URL = "http://localhost:8080/api/v1/users";

class UserService {
  getUsers() {
    return axios
      .get(`${API_URL}/`, { headers: authHeader() })
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
          .then((response: AxiosResponse<Array<UserModel>>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
      case DISABLE:
        return axios
          .get(`${API_URL}/${DISABLE}`, { params: {id: id}, headers: authHeader() })
          .then((response: AxiosResponse<Array<UserModel>>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
    }
  }
}

export default new UserService();
