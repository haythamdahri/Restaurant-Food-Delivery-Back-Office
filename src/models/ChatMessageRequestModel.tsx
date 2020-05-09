import { ChatMessageType } from "./ChatMessageType";

export class ChatMessageRequestModel {
    public id?: number;
    public senderId?: number;
    public receiverId?: number;
    public content?: string;
    public messageType?: ChatMessageType;
    public timestamp?: Date;
}