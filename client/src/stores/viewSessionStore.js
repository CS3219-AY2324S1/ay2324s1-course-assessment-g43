import { makeAutoObservable } from "mobx";
import {
  setupSocket,
  joinRoom,
  leaveSession,
} from "../services/collaborationService";

class ViewSessionStore {
  socket = null;
  roomId = "";

  state = {
    questionId: -1,
    title: "",
    description: "",
    category: [],
    complexity: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setQuestionId(questionId) {
    this.state.questionId = questionId;
  }

  setTitle(title) {
    this.state.title = title;
  }

  setDescription(description) {
    this.state.description = description;
  }

  setCategory(category) {
    this.state.category = category;
  }

  setComplexity(complexity) {
    this.state.complexity = complexity;
  }

  setRoomId(roomId) {
    this.roomId = roomId;
  }

  /**
   * Sets up a socket connection to the collaboration service server.
   */
  connectToServer() {
    const userId = JSON.parse(localStorage.getItem("user")).uid;
    if (!this.socket) {
      this.socket = setupSocket();
    }
    joinRoom(this.socket, this.roomId, userId);
  }

  /**
   * Disconnects the socket connection.
   */
  async disconnectFromServer() {
    try {
      this.socket?.disconnect();
      if (this.roomId) {
        const userId = JSON.parse(localStorage.getItem("user")).uid;
        await leaveSession(this.roomId, userId);
      }
    } catch (err) {
      console.log(err);
    }
  }
}

export const viewSessionStore = new ViewSessionStore();
