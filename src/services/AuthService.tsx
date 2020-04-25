import axios from "axios";
import User from "../models/User";

const API_URL = "http://localhost:8080/api/v1/admin/auth/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  getCurrentUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isAuthenticated() {
    return localStorage.getItem('user') != null;
  }
}

export default new AuthService();
