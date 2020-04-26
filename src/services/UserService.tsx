import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import User from "../models/UserToken";

const API_URL = "http://localhost:8080/api/v1/users/";

class UserService {
  getUsers() {
    return axios
      .get(API_URL, { headers: authHeader() })
      .then((response: AxiosResponse<Array<User>>) => {
        return response.data;
      }).catch((err) => {
        throw new Error(err);
      });
  }
}

export default new UserService();
