import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { Pageable } from "../pagination/Pageable";
import { Page } from "../pagination/Page";
import { ContactMessageModel } from "../models/ContactMessageModel";

const API_URL = "http://localhost:8080/api/v1/contactmessages";

class UserService {

  getContactMessages(search: string = "", pageable: Pageable) {
    const params = {
      search: search !== "" ? search : "",
      page: pageable.pageNumber,
      size: pageable.pageSize,
    };
    return axios
      .get(`${API_URL}/`, { params, headers: authHeader() })
      .then((response: AxiosResponse<Page<ContactMessageModel>>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  respondContactMessages(id: number, response: string) {
    return axios
      .post(`${API_URL}/${id}/respond`, {response}, { headers: authHeader() })
      .then((response: AxiosResponse<ContactMessageModel>) => {
        return response.data;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

}

export default new UserService();
