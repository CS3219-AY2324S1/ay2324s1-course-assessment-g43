import { makeAutoObservable } from "mobx";
import {
  getSession,
  initCollaborationSocket,
  deleteSession,
  initiateLeaveRoomRequest,
  notifyPeerLanguageChange,
  sendChatMessage,
  initiateNextQuestionRequest,
  rejectNextQuestionRequest,
  acceptNextQuestionRequest,
  updateSessionWithNewQuestion,
  saveAndChangeCode,
  resetCode,
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
    otherUserName: "",
    isGetNextQuestionLoading: false,
    code: "",
    attempt: new Map(),
    resetTemplateCallback: () => {},

    /*
    Array of objects with the following structure:
      {
        sender: string, // 'self' or 'peer'
        text: string,
        timestamp: string,
      }
    */
    chat: [],
    isPeerConnected: false,
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
  
  setCode(code) {
    this.state.code = code;
  }

  setIsGetQuestionLoading(isLoading) {
    this.state.isGetNextQuestionLoading = isLoading;
  }

  setResetTemplateCallback(callback) {
    this.state.resetTemplateCallback = callback;
  }

  setChat(jsonStringChat) {
    this.state.chat = jsonStringChat ? JSON.parse(jsonStringChat) : [];
  }

  setOtherUsername(otherUserName) {
    this.state.otherUserName = otherUserName;
  }

  setIsPeerConnected(isConnected) {
    this.state.isPeerConnected = isConnected;
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

  initiateSessionState(session) {
    const {
      questionId,
      title,
      description,
      category,
      complexity,
      currentLanguage,
      attempt,
    } = session;

    const otherUserName =
      session.firstUserName ===
      JSON.parse(localStorage.getItem("user")).username
        ? session.secondUserName
        : session.firstUserName;

    this.state = {
      ...this.state,
      language: currentLanguage,
      otherUserName,
      questionId,
      title,
      description,
      category,
      complexity,
      attempt,
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
      await this.state.resetTemplateCallback();
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
      otherUserName: "",
      code: "",
      attempt: new Map(),
      isGetNextQuestionLoading: false,
      resetTemplateCallback: () => {},
      chat: [],
      isPeerConnected: false,
    };
  }

  async fetchSession(roomId) {
    const session = await getSession(roomId);
    // question should never be null -- just a defensive measure
    if (!session) {
      throw new Error("Session is invalid");
    }
    return session;
  }

  async changeLanguage(roomId, newLanguage, oldCode) {
    const res = await saveAndChangeCode(roomId, newLanguage, oldCode);
    return res;
  }

  async resetCode(roomId) {
    const res = await resetCode(roomId);
    return res;
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
        this.setIsPeerConnected(true);
      },
      // onPeerDisconnected
      () => {
        this.setIsPeerConnected(false);
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
