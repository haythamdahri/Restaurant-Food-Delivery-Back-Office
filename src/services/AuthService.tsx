import axios, { AxiosResponse } from "axios";
import UserTokenModel from "../models/UserTokenModel";

const API_URL = "http://localhost:8080/auth/";
const STORAGE_USER: string = "user";

class AuthService {
  signin(user: { email: string; password: string }) {
    return axios
      .post(API_URL, user)
      .then((userData: AxiosResponse<{ token: string }>) => {
        let userToken = this.decodeToken(userData.data.token);
        localStorage.setItem(STORAGE_USER, JSON.stringify(userToken));
        return userToken;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  signout(history: any = null) {
    localStorage.removeItem(STORAGE_USER);
    if (history != null) {
      history.push("/signin");
    }
  }

  getCurrentUser(): UserTokenModel {
    return JSON.parse(localStorage.getItem(STORAGE_USER) || "{}");
  }

  isAuthenticated() {
    return localStorage.getItem(STORAGE_USER) != null;
  }

  isAuthorized() {
    return this.isAuthenticated() && (this.isAdmin() || this.isEmployee());
  }

  // Check if user has role
  async hasRole(roleName: string) {
    let userToken: UserTokenModel = JSON.parse(
      localStorage.getItem(STORAGE_USER) || "{}"
    );
    return (
      userToken?.roles?.find((role) => role.authority === roleName) != null
    );
  }

  // Check if connected user is an admin
  isAdmin() {
    let userToken: UserTokenModel = JSON.parse(
      localStorage.getItem(STORAGE_USER) || "{}"
    );
    return (
      userToken?.roles?.find((role) => role.authority === "ROLE_ADMIN") != null
    );
  }

  // Check if connected user is an admin
  isEmployee() {
    let userToken: UserTokenModel = JSON.parse(
      localStorage.getItem(STORAGE_USER) || "{}"
    );
    return (
      userToken?.roles?.find((role) => role.authority === "ROLE_EMPLOYEE") !=
      null
    );
  }

  // Decode token
  decodeToken(token: string) {
    var jwtDecode = require("jwt-decode");
    const decoded = jwtDecode(token);
    let userToken = new UserTokenModel();
    userToken.bearerToken = "Bearer " + token;
    userToken.token = token;
    userToken.email = decoded.sub;
    userToken.roles = decoded.roles;
    userToken.exp = Number(decoded.exp * 1000);
    return userToken;
  }
}

export default new AuthService();
