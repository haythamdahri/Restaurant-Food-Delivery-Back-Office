import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Frame } from "stompjs";
import { ChatMessageRequestModel } from "../models/ChatMessageRequestModel";
import { ChatMessageModel } from "../models/ChatMessageModel";
import UserService from "../services/UserService";
import { UserModel } from "../models/UserModel";
import { FILES_ENDOINT, CHANNEL_SEPARATOR } from "../services/ConstantsService";
import ChatSupportService from "../services/ChatSupportService";
import { ChatMessageType } from "../models/ChatMessageType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Moment from "react-moment";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const CHAT_SERVICE_URL = "http://localhost:8080/wschat/";
var socket: any;
var stompClient: any;

/**
 * TODO: IMPLEMENT SECOND USER WITH A PRIVATEMESSAGEBOX COMPONENT
 */
export default (props: { chatUser: UserModel | undefined; update: number }) => {
  const connectionEstablishedRef = useRef(false);
  const [user, setUser] = useState<UserModel>();
  const [writing, setWriting] = useState(false);
  const userRef = useRef(user);
  const messageInput = useRef(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const chatUserRef = useRef<UserModel>();
  const [messages, setMessages] = useState(new Array<ChatMessageModel>());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [triesCounter, setTriesCounter] = useState(0);
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
        chatUserRef.current = props.chatUser;
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
    // Check if user only status is changed
    if (chatUserRef.current?.id === props.chatUser?.id) {
      chatUserRef.current = props.chatUser;
      connect();
    } else {
      setError(false);
      // Check if a chat user is selected
      if (
        props.chatUser !== undefined &&
        props.chatUser.id !== null &&
        props.chatUser.id !== 0
      ) {
        setLoading(true);
        setMessages([]);
        fetchUserAndConnect();
      } else {
        setMessages([]);
        setLoading(false);
        setError(false);
      }
    }
    return () => {
      if (socket != null) {
        socket.close();
      }
      active = false;
    };
  }, [props.update]);

  const connect = () => {
    socket = new SockJS(CHAT_SERVICE_URL);
    socket.onClosed = () => {
      // Update tries counter
      setTriesCounter((counter) => counter + 1);
      if (triesCounter < 5) {
        connectionEstablishedRef.current = false;
        connect();
      } else {
        setMessages([]);
      }
    };
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = async () => {
    try {
      // Set connection as established
      connectionEstablishedRef.current = true;
      // Subscribing to the private topic | Same user message and Chat user message | Unique Socket
      stompClient.subscribe(
        "/user/" +
          userRef.current!.id.toString() +
          CHANNEL_SEPARATOR +
          chatUserRef.current!.id.toString() +
          "/reply",
        onMessageReceived
      );
      // Retrieve messages
      try {
        const messages = (
          await ChatSupportService.getChatMessages(
            userRef.current?.id,
            chatUserRef?.current?.id
          )
        ).map((message: ChatMessageModel, i: number) => {
          message.sender.image.file =
            FILES_ENDOINT + "/" + message.sender.image.id;
          message.receiver.image.file =
            FILES_ENDOINT + "/" + message.receiver.image.id;
          return message;
        });
        if (active) {
          setMessages(messages);
          setTimeout(() => {
            // Scroll Messages wrapper to bottom
            messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
          }, 150);
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
    } catch (err) {
      connect();
    }
  };

  const onError = () => {
    connectionEstablishedRef.current = false;
    fetchUserAndConnect();
  };

  const onMessageReceived = (payload: Frame) => {
    const chatMessage: ChatMessageModel = JSON.parse(payload.body);
    // Update sender and receiver image
    chatMessage.sender.image.file =
      FILES_ENDOINT + "/" + chatMessage?.sender.image.id;
    chatMessage.receiver.image.file =
      FILES_ENDOINT + "/" + chatMessage?.receiver.image.id;
    // Switch Case ChatMessageType
    switch (chatMessage.messageType) {
      case ChatMessageType.MESSAGE:
        if (active) {
          setMessages((messages) => [...messages, chatMessage]);
          // Scroll Messages wrapper to bottom
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      case ChatMessageType.START_WRITING:
        if (active && chatMessage.sender.id === chatUserRef.current?.id) {
          setWriting(true);
          // Scroll Messages wrapper to bottom
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
      case ChatMessageType.STOP_WRITING:
        if (active) {
          setWriting(false);
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        return;
    }
    // Scroll Messages wrapper to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onStartWriting = () => {
    try {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = user?.id;
      chatMessageRequestModel.receiverId = props.chatUser?.id;
      chatMessageRequestModel.messageType = ChatMessageType.START_WRITING;
      stompClient.send(
        "/app/sendPrivateMessage",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onStopWriting = async () => {
    try {
      const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
      chatMessageRequestModel.senderId = user?.id;
      chatMessageRequestModel.receiverId = props.chatUser?.id;
      chatMessageRequestModel.messageType = ChatMessageType.STOP_WRITING;
      stompClient.send(
        "/app/sendPrivateMessage",
        {},
        JSON.stringify(chatMessageRequestModel)
      );
    } catch (err) {}
  };

  const onSendMessage = async (event: any) => {
    event.preventDefault();
    if( ((messageInput.current as unknown) as HTMLInputElement).value.length > 0 ) {
      try {
        const chatMessageRequestModel: ChatMessageRequestModel = new ChatMessageRequestModel();
        chatMessageRequestModel.senderId = user?.id;
        chatMessageRequestModel.receiverId = props.chatUser?.id;
        chatMessageRequestModel.content = ((messageInput.current as unknown) as HTMLInputElement).value;
        chatMessageRequestModel.messageType = ChatMessageType.MESSAGE;
        stompClient.send(
          "/app/sendPrivateMessage",
          {},
          JSON.stringify(chatMessageRequestModel)
        );
        // Clear input
        ((messageInput.current as unknown) as HTMLInputElement).value = "";
        ((messageInput.current as unknown) as HTMLInputElement).blur();
        // Scroll Messages wrapper to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {/* <!-- Chat Box--> */}
      <div className="col-sm-12 col-md-8 col-lg-8 col-xl-8 px-0 bg-white">
        <div className="bg-gray px-4 py-2 bg-light">
          <p className="mb-0 py-1 text-center">
            <FontAwesomeIcon
              color={props.chatUser?.online ? "green" : "red"}
              icon="circle"
              size="xs"
            />{" "}
            {chatUserRef.current?.username || "...."}
          </p>
        </div>
        {!error && !loading && (
          <>
            <div className="px-4 py-5 chat-box bg-white">
              <TransitionGroup className="todo-list">
                {messages.map((message, i) => (
                  <CSSTransition key={i} timeout={500} classNames="item">
                    <div>
                      {message.receiver?.id === user?.id ? (
                        <div className="media w-50">
                          {(i === 0 ||
                            messages[i - 1].receiver?.id !== user?.id) && (
                            <img
                              src={message.sender.image.file}
                              alt="user"
                              width="35"
                              height="35"
                              className="rounded-circle"
                            />
                          )}
                          <div className="media-body ml-2">
                            <div className="bg-light rounded py-2 px-3">
                              <p className="text-small mb-0 text-muted">
                                {message.content}
                              </p>
                            </div>
                            <p className="small text-muted">
                              <Moment
                                format="YYYY/MM/DD HH:mm:ss"
                                date={message.timestamp}
                              />
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="media w-50 ml-auto">
                          <div className="media-body">
                            <div className="bg-primary rounded py-2 px-3">
                              <p className="text-small mb-0 text-white">
                                {message.content}
                              </p>
                            </div>
                            <p className="small text-muted">
                              <Moment
                                format="YYYY/MM/DD HH:mm:ss"
                                date={message.timestamp}
                              />
                            </p>
                          </div>

                          {(i === 0 ||
                            messages[i - 1].sender?.id !== user?.id) && (
                            <img
                              src={message.sender.image.file}
                              alt="user"
                              width="35"
                              height="35"
                              className="rounded-circle float-right ml-2"
                            />
                          )}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </CSSTransition>
                ))}
              </TransitionGroup>
              {/** Writing Message */}
              {writing && (
                <div className="media w-50">
                  <div className="media-body">
                    <div className="rounded">
                      <p className="text-small mb-0 text-muted">Writing ...</p>
                    </div>
                  </div>
                </div>
              )}
              {/** No Messages */}
              {!error && !loading && messages?.length === 0 && (
                <p className="text-center text-muted text-small">
                  No messages ...
                </p>
              )}
            </div>

            {/* <!-- Typing area --> */}
            {connectionEstablishedRef.current && (
              <form onSubmit={onSendMessage}>
                <div className="input-group">
                  <input
                    style={{
                      fontSize: "14px",
                      border: "1px solid blue",
                      borderRadius: 0,
                    }}
                    onKeyPress={onStartWriting}
                    onBlur={onStopWriting}
                    ref={messageInput}
                    type="text"
                    placeholder="Type a message ..."
                    aria-describedby="button-addon2"
                    className="form-control py-3 bg-light"
                  />
                  <div className="input-group-append">
                    <button
                      id="button-addon2"
                      type="submit"
                      className="btn btn-link"
                    >
                      <FontAwesomeIcon icon="paper-plane" />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
        {loading && (
          <div className="col-12">
            <div className="mt4 text-center">
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
            </div>
          </div>
        )}
        {error && !loading && (
          <div className="col-12">
            <div className="alert alert-warning text-center font-weight-bold">
              An error occurred, please refresh page!
            </div>
          </div>
        )}
      </div>
    </>
  );
};
