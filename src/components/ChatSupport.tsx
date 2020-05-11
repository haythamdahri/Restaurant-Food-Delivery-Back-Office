import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Frame } from "stompjs";
import { ChatMessageRequestModel } from "../models/ChatMessageRequestModel";
import { ChatMessageModel } from "../models/ChatMessageModel";
import UserService from "../services/UserService";
import { UserModel } from "../models/UserModel";
import { FILES_ENDOINT } from "../services/ConstantsService";
import ChatSupportService from "../services/ChatSupportService";
import { ChatMessageType } from "../models/ChatMessageType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";
import ChatSupportRoom from "./ChatSupportRoom";

const CHAT_SERVICE_URL = "http://localhost:8080/wschat/";
var socket: any;
var stompClient: any;

/**
 * TODO: IMPLEMENT SECOND USER WITH A PRIVATEMESSAGEBOX COMPONENT
 */
export default () => {
  const connectionEstablishedRef = useRef(false);
  const [user, setUser] = useState<UserModel>();
  const [populateUpdate, setPopulateUpdate] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<UserModel>();
  const userRef = useRef(user);
  const [users, setUsers] = useState(new Array<UserModel>());
  const usersRef = useRef(users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  let active = true;

  const fetchUserAndConnect = async () => {
    try {
      if (active) {
        setLoading(true);
        setError(false);
      }
      const user = await UserService.getAuthenticatedUserDetails();
      user.image.file = FILES_ENDOINT + "/" + user.image.id;
      if (active) {
        setUser(user);
        userRef.current = user;
        setError(false);
        // Connect to Chat WS
        connect();
      }
    } catch (err) {
      if (active) {
        setError(true);
      }
    }
  };

  useEffect(() => {
    document.title = "Support Chat";
    fetchUserAndConnect();
    // Window close event
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      disconnectUser();
      return true;
    });
    return () => {
      window.removeEventListener("beforeunload", () => {});
      disconnectUser();
      if (socket != null) {
        socket.close();
      }
      active = false;
    };
  }, []);

  const connect = () => {
    socket = new SockJS(CHAT_SERVICE_URL);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const disconnectUser = () => {
    // Send user left to queue if connection is already established
    if (connectionEstablishedRef?.current === true) {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = userRef.current?.id;
      chatMessageRequestModel.messageType = ChatMessageType.LEAVE;
      stompClient.send(
        "/app/removeUser",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    }
  };

  const onConnected = async () => {
    // Set connection as established
    connectionEstablishedRef.current = true;
    // Subscribing to the public topic
    stompClient.subscribe("/topic/public", onMessageReceived);
    // Registering user to server as a public chat user | Online user
    const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
    chatMessageRequestModel.senderId = userRef.current?.id;
    chatMessageRequestModel.messageType = ChatMessageType.JOINED;
    stompClient.send(
      "/app/addUser",
      {},
      JSON.stringify(chatMessageRequestModel)
    );
    // Retrieve messages with all users + Non messaged users
    try {
      const users = (
        await ChatSupportService.getChatUsers(userRef.current?.id)
      ).map((tempUser: UserModel, i: number) => {
        tempUser.image.file = FILES_ENDOINT + "/" + tempUser.image.id;
        return tempUser;
      });
      if (active) {
        setUsers(users);
        usersRef.current = users;
      }
    } catch (err) {
      if (active) {
        setError(true);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  const onError = () => {
    if (active) {
      setError(true);
    }
  };

  const onMessageReceived = (payload: Frame) => {
    const chatMessage: ChatMessageModel = JSON.parse(payload.body);
    // On Message Receive | Online or Offline
    if (
      chatMessage.messageType === ChatMessageType.JOINED ||
      chatMessage.messageType === ChatMessageType.LEAVE ||
      chatMessage.sender?.id !== userRef.current?.id
    ) {
      // Update Image Image Path and User status | Online
      chatMessage.sender.image.file = FILES_ENDOINT + "/" + chatMessage?.sender.image.id;
      usersRef.current = usersRef.current
        ?.map((tempUser, i) => {
          if (tempUser.id === chatMessage.sender.id) {
            tempUser = chatMessage.sender;
          }
          return tempUser;
        })
        .sort((u1, u2) => (u1.online === true ? -1 : 1));
      setUsers(usersRef.current);
      // Populate user status if current selected user online status is changed
      if( chatMessage.sender?.id === selectedUser?.id ) {
        chatMessage.sender.online = chatMessage.messageType === ChatMessageType.JOINED ? true : false;
        setSelectedUser(chatMessage.sender);
        setPopulateUpdate(!populateUpdate);
      }
    }
  };

  const onUserSelect = async (user: UserModel) => {
    setSelectedUser(user);
    setPopulateUpdate(!populateUpdate);
  }

  return (
    <div className="row">
      <div className="col-12 py-3 px-3">
        <div className="row rounded-lg overflow-hidden shadow">
          {/* <!-- Users box--> */}
          <div className="col-sm-12 col-md-4 col-lg-4 col-xl-4 px-0">
            <div className="bg-white">
              <div className="bg-gray px-4 py-2 bg-light">
                <p className="h5 mb-0 py-1">Recent</p>
              </div>

              <div className="messages-box">
                <div className="list-group rounded-0">
                  {users.map((user, i) => (
                    <div onClick={e => onUserSelect(user)} style={{cursor: 'pointer'}} key={i} className="list-group-item list-group-item-action rounded-0">
                      <div className="media">
                        <img
                          src={user.image.file}
                          alt="user"
                          width="50"
                          height="50"
                          className="rounded-circle"
                        />
                        <div className="media-body ml-4">
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <h6 className="mb-0">{user.username}</h6>
                            <small className="small font-weight-bold" style={{display: 'flex'}}>
                              {user.online ? (
                                <FontAwesomeIcon icon="circle" size="xs" color="green" />
                              ) : (
                                <small className="text-center">
                                  <Moment className="mr-2" fromNow>
                                    {user.lastOnlineTime}
                                  </Moment>
                                  <FontAwesomeIcon icon="circle" size="xs" color="red" className="float-right" />
                                </small>
                              )}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/** User Chat Room Component */}
          <ChatSupportRoom chatUser={selectedUser} update={populateUpdate} />

        </div>
      </div>
    </div>
  );
};
