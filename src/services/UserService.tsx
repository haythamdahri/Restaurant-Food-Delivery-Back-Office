import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { UserModel } from "../models/UserModel";
import { ENABLE, DISABLE } from "./ConstantsService";
import { Pageable } from "../pagination/Pageable";
import { Page } from "../pagination/Page";

const API_URL = "http://localhost:8080/api/v1/users";

class UserService {
  getBasicUsersPage(search: string = "", pageable: Pageable) {
    const params = {
      search: search !== "" ? search : "",
      page: pageable.pageNumber,
      size: pageable.pageSize,
    };
    return axios
      .get(`${API_URL}/`, { params, headers: authHeader() })
      .then((response: AxiosResponse<Page<UserModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  getBasicUsers(search: string = "") {
    const params = { search: search !== "" ? search : "" };
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
          .get(`${API_URL}/${ENABLE}`, {
            params: { id: id },
            headers: authHeader(),
          })
          .then((response: AxiosResponse<UserModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
      case DISABLE:
        return axios
          .get(`${API_URL}/${DISABLE}`, {
            params: { id: id },
            headers: authHeader(),
          })
          .then((response: AxiosResponse<UserModel>) => {
            return response.data;
          })
          .catch((err) => {
            throw new Error(err);
          });
    }
  }

  updateUserImage(formData: FormData) {
    
    return axios
      .post(`${API_URL}/image`, formData, { headers: authHeader() })
      .then((response: AxiosResponse<{ status: boolean; message: string; user: UserModel }>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  saveUser(id: number, email: string, username :string, location: string) {
    return axios
      .patch(`${API_URL}/${id}`, {email, username, location}, { headers: authHeader() })
      .then((response: AxiosResponse<UserModel>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err?.response?.data?.message || 'An error occurred, please try again!');
      });
  }

  getAuthenticatedUserDetails() {
    return axios
      .get(`${API_URL}/current`, { headers: authHeader() })
      .then((response: AxiosResponse<UserModel>) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
}

export default new UserService();
