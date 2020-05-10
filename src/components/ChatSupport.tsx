import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Frame } from "stompjs";
import { ChatMessageRequestModel } from "../models/ChatMessageRequestModel";
import { ChatMessageModel } from "../models/ChatMessageModel";
import UserService from "../services/UserService";
import { UserModel } from "../models/UserModel";
import { FILES_ENDOINT } from "../services/ConstantsService";
import { connect } from "http2";
import ChatSupportService from "../services/ChatSupportService";
import { ChatMessageType } from "../models/ChatMessageType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CHAT_SERVICE_URL = "http://localhost:8080/wschat/";
var socket: any;
var stompClient: any;

/**
 * TODO: IMPLEMENT SECOND USER WITH A PRIVATEMESSAGEBOX COMPONENT
 */
export default () => {
  const connectionEstablishedRef = useRef(false);
  const [user, setUser] = useState<UserModel>();
  const [otherUser, setOtherUser] = useState<UserModel>();
  const [writing, setWriting] = useState(false);
  const userRef = useRef(user);
  const messageInput = useRef(null);
  const otherUserRef = useRef(otherUser);
  const [messages, setMessages] = useState(new Array<ChatMessageModel>());
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
        const otherUser: UserModel = new UserModel();
        otherUser.id = user.id === 1 ? 2 : 1;
        setOtherUser(otherUser);
        setUser(user);
        userRef.current = user;
        otherUserRef.current = otherUser;
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
    return () => {
      console.log('LEAVING ...');
      // Send user left to queue if connection is already established
      if( connectionEstablishedRef?.current === true ) {
        const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
        chatMessageRequestModel.senderId = userRef.current?.id;
        chatMessageRequestModel.receiverId = otherUserRef.current?.id === 2 ? 1 : 2;
        chatMessageRequestModel.messageType = ChatMessageType.LEAVE;
        stompClient.send("/app/removeUser", {}, JSON.stringify(chatMessageRequestModel))
      }
      setTimeout(() => {
        socket.close();
      }, 2500);
      active = false;
    };
  }, []);

  const connect = () => {
    socket = new SockJS(CHAT_SERVICE_URL);
    stompClient = Stomp.over(socket);
    console.log(otherUser);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = async () => {
    // Set connection as established
    connectionEstablishedRef.current = true;
    // Subscribing to the public topic
    stompClient.subscribe("/topic/public", onMessageReceived);
    // Subscribing to the private topic | Same user message and Other user message
    stompClient.subscribe(
      "/user/" + userRef.current?.id.toString() + "/reply",
      onMessageReceived
    );
    stompClient.subscribe(
      "/user/" + otherUserRef.current?.id.toString() + "/reply",
      onMessageReceived
    );
     // Registering user to server as a public chat user
     const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
     chatMessageRequestModel.senderId = userRef.current?.id;
     chatMessageRequestModel.receiverId = otherUserRef.current?.id === 2 ? 1 : 2;
     chatMessageRequestModel.messageType = ChatMessageType.JOINED;
     stompClient.send("/app/addUser", {}, JSON.stringify(chatMessageRequestModel));
    // Retrieve messages
    try {
      const messages = await ChatSupportService.getChatMessages(
        userRef.current?.id,
        otherUserRef?.current?.id
      );
      if( active ) {
        setMessages(messages);
      }
    } catch (err) {
      if( active ) {
        setError(true);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  const onError = () => {
    if( active ) {
      setError(true);
    }
  };

  const onMessageReceived = (payload: Frame) => {
    console.log("MESSAGE RECEIVED");
    const chatMessage: ChatMessageModel = JSON.parse(payload.body);
    console.log("MESSAGE TYPE: " + chatMessage.messageType);
    // Switch Case ChatMessageType
    switch(chatMessage.messageType) {
      case ChatMessageType.JOINED:
        if( chatMessage.sender?.id !== userRef.current?.id ) {
          alert('A new user joined');
        }
        return;
      case ChatMessageType.LEAVE:
        if( chatMessage.sender?.id !== userRef.current?.id ) {
          alert('User left!');
        }
        return;
      case ChatMessageType.MESSAGE:
        if( active ) {
          setMessages((messages) => messages.concat(chatMessage));
          // Scroll window to bottom
          window.scrollTo({
            top: document.body.scrollHeight,
            left: 0,
            behavior: "smooth",
          });
        }
        return;
      case ChatMessageType.START_WRITING:
        if( active && chatMessage.sender?.id !== userRef.current?.id ) {
        setWriting(true);
        }
        return;
      case ChatMessageType.STOP_WRITING:
        if( active ) {
          setWriting(false);
        }
        return;
    }
  };

  const onStartWriting = () => {
    try {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = user?.id;
      chatMessageRequestModel.receiverId = user?.id === 2 ? 1 : 2;
      chatMessageRequestModel.messageType = ChatMessageType.START_WRITING;
      stompClient.send(
        "/app/sendPrivateMessage",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    } catch (err) {
      console.log(err);
    }
  }

  const onStopWriting = async () => {
    try {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = user?.id;
      chatMessageRequestModel.receiverId = user?.id === 2 ? 1 : 2;
      chatMessageRequestModel.messageType = ChatMessageType.STOP_WRITING;
      stompClient.send(
        "/app/sendPrivateMessage",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    } catch (err) {
      console.log(err);
    }
  }

  const onSendMessage = async (event: any) => {
    try {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = user?.id;
      chatMessageRequestModel.receiverId = user?.id === 2 ? 1 : 2;
      chatMessageRequestModel.content = (messageInput.current as unknown as HTMLInputElement).value;
      chatMessageRequestModel.messageType = ChatMessageType.MESSAGE;
      stompClient.send(
        "/app/sendPrivateMessage",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-10 mx-auto text-center">
        {writing && (
          <p className="text-center mt-3">Writing ...</p>
        )}
        {!error && !loading && (
          <>
            <input ref={messageInput} type="text" onKeyPress={onStartWriting} onBlur={onStopWriting} className="form-control" placeholder="Write something ..." />
            <button className="btn btn-primary btn-block" onClick={onSendMessage}>
              Send Message
            </button>
            <p>
              {messages?.map((message, index) => (
                <label
                  key={index}
                  className={
                    message.sender?.id === user?.id
                      ? "text-secondary"
                      : "text-warning"
                  }
                >
                  {JSON.stringify(message)}
                </label>
              ))}
            </p>
          </>
        )}
        {loading && (
          <>
            <div className="spinner-grow text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-secondary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-success" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-danger" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-warning" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-light" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </>
        )}
        {error && !loading && (
          <div className="alert alert-warning text-center font-weight-bold">
            An error occurred, please refresh page!
          </div>
        )}
      </div>
    </div>
  );
};
