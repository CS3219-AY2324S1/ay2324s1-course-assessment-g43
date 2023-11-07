import { makeAutoObservable } from "mobx";
import {
  getQuestionFromSession,
  initCollaborationSocket,
  deleteSession,
  initiateLeaveRoomRequest,
  notifyPeerLanguageChange,
  sendChatMessage,
  initiateNextQuestionRequest,
  rejectNextQuestionRequest,
  acceptNextQuestionRequest,
  updateSessionWithNewQuestion,
} from "../services/collaborationService";
import { getFreshRandomQuestionByComplexity } from "../services/questionService";

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
    isGetNextQuestionLoading: false,

    /*
    Array of objects with the following structure:
      {
        sender: string, // 'self' or 'peer'
        text: string,
        timestamp: string,
      }
    */
    chat: [],
    isPeerConnected: true,
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
    if (!language || language === this.state.language) return;
    this.state.language = language;
    notifyPeerLanguageChange(this.socket, language.toLowerCase());
  }

  setIsGetQuestionLoading(isLoading) {
    console.log("i am inside qn loading");
    console.log(isLoading);

    this.state.isGetNextQuestionLoading = isLoading;
  }

  setChat(jsonStringChat) {
    this.state.chat = jsonStringChat ? JSON.parse(jsonStringChat) : [];
  }

  /**
   * Pushes message into `state.chat`. Call this for messages from PEER.
   *
   * @param {Object} receivedMsg - Message received from peer
   */
  pushMessage(receivedMsg) {
    this.state.chat.push({
      sender: "peer",
      ...receivedMsg,
    });
    // Save chat to local storage -- useful when user resumes session
    localStorage.setItem("sessionChat", JSON.stringify(this.state.chat));
  }

  /**
   * Pushes messages into `state.chat`, and sends message via websocket.
   * Call this for messages sent by USER.
   * Note: message deletions not supported.
   *
   * @param {string} messageString - sent by User.
   */
  pushAndSendMessage(messageString) {
    const socketMessage = {
      text: messageString,
      timestamp: Date.now(),
    };
    this.state.chat.push({
      sender: "self",
      ...socketMessage,
    });
    sendChatMessage(this.socket, socketMessage);
    // Save chat to local storage -- useful when user resumes session
    localStorage.setItem("sessionChat", JSON.stringify(this.state.chat));
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
      await deleteSession(this.state.roomId);
      initiateLeaveRoomRequest(this.socket);
    }
  }

  initChangeQuestion() {
    if (this.state.roomId) {
      initiateNextQuestionRequest(this.socket);
    }
  }

  async acceptChangeQuestion(changeQuestionCallback) {
    if (this.state.roomId) {
      const newQuestion = await getFreshRandomQuestionByComplexity(
        this.state.complexity,
        this.state.questionId
      );
      await updateSessionWithNewQuestion(this.state.roomId, newQuestion);
      acceptNextQuestionRequest(this.socket);
      changeQuestionCallback();
    }
  }

  rejectChangeQuestion() {
    if (this.state.roomId) {
      rejectNextQuestionRequest(this.socket);
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
      isGetNextQuestionLoading: false,
      chat: [],
      isPeerConnected: true,
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
  initSocket(
    onLeaveRoomCallback,
    receiveRequestCallback,
    changeQuestionCallback,
    rejectRequestCallback
  ) {
    const userId = JSON.parse(localStorage.getItem("user")).uid;
    this.socket = initCollaborationSocket(
      this.state.roomId,
      userId,
      // onPeerLanguageChange
      (lang) => {
        // Note: use arrow function for correct `this` binding
        this.setLanguage(lang);
        // Save language to local storage -- useful when user resumes session
        localStorage.setItem("sessionLanguage", lang);
      },
      onLeaveRoomCallback,
      // onChatMessageReceived
      (message) => {
        this.pushMessage(message);
      },
      // onPeerJoined
      () => {
        this.state.isPeerConnected = true;
      },
      // onPeerDisconnected
      () => {
        this.state.isPeerConnected = false;
      },
      // onSocketDisconnect (not in use)
      () => {},
      receiveRequestCallback,
      changeQuestionCallback,
      rejectRequestCallback
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
        await deleteSession(this.state.roomId, userId);
      }
    } catch (err) {
      console.log(err);
    }
    this.socket = null;
  }
}

export const viewSessionStore = new ViewSessionStore();
