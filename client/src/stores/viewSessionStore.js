import { makeAutoObservable } from "mobx";
import {
  getQuestionFromSession,
  initCollaborationSocket,
  leaveSession,
  initiateLeaveRoomRequest,
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
    console.log("trying to set room ")

    this.state.roomId = roomId;
  }

  setLanguage(language) {
    if (!language || language === this.state.language) return;
    this.state.language = language;
    notifyPeerLanguageChange(this.socket, language.toLowerCase());
  }

  initQuestionState(question) {
    const { questionId, title, description, category, complexity } = question;
    this.state = {
      ...this.state,
      questionId,
      title,
      description,
      category,
      complexity,
    };
  }

  async initLeaveRoom() {
    if (this.state.roomId) {
      await leaveSession(this.state.roomId);
      initiateLeaveRoomRequest(this.socket);
    }
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

  async fetchQuestion(roomId) {
    const question = await getQuestionFromSession(roomId);
    // question should never be null -- just a defensive measure
    if (!question) {
      throw new Error("Session is invalid");
    }
    return question;
  }

  /**
   * Sets up a socket connection to the collaboration service server and joins a room.
   */
  initSocket(onLeaveRoomCallback) {
    const userId = JSON.parse(localStorage.getItem("user")).uid;
    this.socket = initCollaborationSocket(
      this.state.roomId,
      userId,
      (lang) => {
        // Note: use arrow function for correct `this` binding
        this.setLanguage(lang);
        // Save language to local storage -- useful when user resumes session
        localStorage.setItem("sessionLanguage", lang);
      },
      onLeaveRoomCallback
    );
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
