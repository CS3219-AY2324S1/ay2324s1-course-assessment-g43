import { makeAutoObservable } from "mobx";
import {
  initCollaborationSocket,
  leaveSession,
  notifyPeerLanguageChange,
} from "../services/collaborationService";

class ViewSessionStore {
  socket = null;

  state = {
    questionId: -1,
    title: "",
    description: "",
    category: [],
    complexity: "",

    roomId: "",
    language: "",
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
    this.state.roomId = roomId;
  }

  setLanguage(language) {
    if (!language) return;
    if (language === this.state.language) return;
    this.state.language = language;
    notifyPeerLanguageChange(this.socket, this.state.roomId, language.toLowerCase());
  }

  resetState() {
    this.state = {
      questionId: -1,
      title: "",
      description: "",
      category: [],
      complexity: "",
      roomId: "",
      language: "",
    };
  }

  /**
   * Sets up a socket connection to the collaboration service server and joins a room.
   */
  initSocket() {
    const userId = JSON.parse(localStorage.getItem("user")).uid;
    this.socket = initCollaborationSocket(this.state.roomId, userId, (lang) => {
      // Note: use arrow function for correct `this` binding
      this.setLanguage(lang);
    });
  }

  /**
   * Disconnects the socket connection.
   */
  async disconnectFromServer() {
    try {
      this.socket?.disconnect();
      if (this.state.roomId) {
        const userId = JSON.parse(localStorage.getItem("user")).uid;
        await leaveSession(this.state.roomId, userId);
      }
    } catch (err) {
      console.log(err);
    }
    this.socket = null;
  }
}

export const viewSessionStore = new ViewSessionStore();
