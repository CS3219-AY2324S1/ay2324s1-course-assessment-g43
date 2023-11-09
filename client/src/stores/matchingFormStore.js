import { makeAutoObservable, runInAction } from "mobx";
import setupSocket from "../services/matchingService";

class MatchingFormStore {
  uid = "";
  userName = "";
  complexity = "";
  isLoading = false;
  isCancelLoading = false;
  countdown = 0;
  socket = null;

  constructor() {
    makeAutoObservable(this);
  }

  resetState() {
    this.isLoading = false;
    this.isCancelLoading = false;
    this.countdown = 0;

    const message = JSON.stringify({
      uid: this.uid,
      name: this.userName,
      complexity: this.complexity,
    });

    this.socket?.emit("cancel-request", message);
  }

  startLoading() {
    this.isLoading = true;
    this.countdown = 30;

    return new Promise((resolve, reject) => {
      const countdownInterval = setInterval(() => {
        runInAction(() => {
          if (!this.isLoading) {
            clearInterval(countdownInterval);
          } else if (this.countdown > 0) {
            this.countdown -= 1;
          } else {
            this.isLoading = false;
            reject("Sorry, but we could not find a match. Please try again!");
            clearInterval(countdownInterval);
          }
        });
      }, 1000);
    });
  }

  setLoading(loading) {
    this.isLoading = loading;
  }

  setIsCancelLoading(loading) {
    this.isCancelLoading = loading;
  }

  setUid(uid) {
    this.uid = uid;
  }

  setUserName(userName) {
    this.userName = userName;
  }

  setComplexity(newComplexity) {
    this.complexity = newComplexity;
  }

  /**
   * Sends a match request to the matching microservice using a websocket.
   *
   * @param {Function} onMatchSuccess - callback function for successful match
   * @param {Function} onMatchFailure - callback function for failed match
   * @param {Function} onMatchCancel - callback function for successful match cancellation
   * @param {Function} onSocketDisconnect - callback function for socket disconnect
   * @returns null
   */
  sendMatchRequest(
    onMatchSuccess,
    onMatchFailure,
    onMatchCancel,
    onSocketDisconnect
  ) {
    this.socket = setupSocket(
      (data) => {
        console.log(data);
        this.setLoading(false);
        onMatchSuccess?.(data);
      },
      (error) => {
        console.log("Match failed: " + error);
        this.setLoading(false);
        onMatchFailure?.(error);
      },
      () => {
        this.setLoading(false);
        this.setIsCancelLoading(false);
        onMatchCancel?.();
      },
      () => {
        console.log("socket closed");
        this.setLoading(false);
        onSocketDisconnect?.();
      }
    );

    console.log(`sendMatchRequest() with args ${this.uid}, ${this.complexity}`);
    const message = JSON.stringify({
      uid: this.uid,
      name: this.userName,
      complexity: this.complexity,
    });
    console.log("yay sending match request");
    console.log(this.userName);

    this.socket.emit("match-request", message);
  }

  sendMatchCancelRequest() {
    const message = JSON.stringify({
      uid: this.uid,
      name: this.userName,
      complexity: this.complexity,
    });

    this.socket?.emit("cancel-request", message);
  }
}

export const matchingFormStore = new MatchingFormStore();
