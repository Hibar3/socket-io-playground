import { io } from "socket.io-client";
import { removeLogin } from "./storage";

const endpoint = "http://localhost:3341";
export const socket = io(`${endpoint}`, { autoConnect: false });

export const socketConnect = (token: string) => {
  socket.auth = {
    token,
  };

  socket.connect();
};

export const socketDisconnect = () => {
  socket.disconnect();

  removeLogin();
};

export const joinRoom = (id: string) => {
  socket.emit("join", { id });
};

export const leaveRoom = (id: string) => {
  socket.emit("leave", { id });
};

export const replyMessage = (id: string, message: string) => {
  socket.emit("reply_message", {
    id,
    message: {
      body: message,
      contentType: "",
      attachments: [],
    },
  });
};
