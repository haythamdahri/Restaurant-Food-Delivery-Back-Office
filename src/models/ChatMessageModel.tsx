import { UserModel } from "./UserModel";
import { ChatMessageType } from "./ChatMessageType";

export class ChatMessageModel {
    public id?: number;
    public sender: UserModel = new UserModel();
    public receiver: UserModel = new UserModel();
    public content?: string;
    public timestamp?: Date;
    public messageType?: ChatMessageType;
    public read?: boolean;
}