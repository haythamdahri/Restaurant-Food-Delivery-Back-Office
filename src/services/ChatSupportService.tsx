import axios, { AxiosResponse } from "axios";
import authHeader from "./AuthHeader";
import { ChatMessageRequestModel } from "../models/ChatMessageRequestModel";
import { ChatMessageModel } from "../models/ChatMessageModel";
import { UserModel } from "../models/UserModel";

export const CHAT_SERVICE_URL = "http://localhost:8080/api/v1/chat";

class ChatSupportService {
  sendMessage(receiver: number, message: string) {
    const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
    chatMessageRequestModel.receiverId = receiver;
    chatMessageRequestModel.content = message;
    return axios
      .post(`${CHAT_SERVICE_URL}/send`, chatMessageRequestModel, {
        headers: authHeader(),
      })
      .then((response: AxiosResponse<ChatMessageModel>) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
  }

  getChatMessages(senderId: number | undefined, receiverId: number | undefined) {
    return axios
      .get(`${CHAT_SERVICE_URL}/messages`, {
        params: {senderId, receiverId},
        headers: authHeader(),
      })
      .then((response: AxiosResponse<Array<ChatMessageModel>>) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
  }

  getChatUsers(userId: number | undefined) {
    return axios
      .get(`${CHAT_SERVICE_URL}/users`, {
        params: {userId},
        headers: authHeader(),
      })
      .then((response: AxiosResponse<Array<UserModel>>) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
  }
}

export default new ChatSupportService();
