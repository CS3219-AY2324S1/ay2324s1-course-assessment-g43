import { makeAutoObservable, runInAction } from "mobx";
import setupSocket from "../services/matchingService";

class MatchingFormStore {
  uid = "";
  complexity = "";
  isLoading = false;
  countdown = 0;
  socket = null;

  constructor() {
    makeAutoObservable(this);
  }

  resetState() {
    this.isLoading = false;
    this.countdown = 0;

    const message = JSON.stringify({
      uid: this.uid,
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
          if (this.countdown > 0) {
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

  setTest(test) {
    this.test = test;
  }

  setLoading(newVal) {
    this.isLoading = newVal;
  }

  setUid(newVal) {
    this.uid = newVal;
  }

  setComplexity(newComplexity) {
    this.complexity = newComplexity;
  }

  /**
   * Sends a match request to the matching microservice using a websocket.
   * 
   * @param {Function} onMatchSuccess
   * @param {Function} onMatchFailure
   * @param {Function} onSocketDisconnect
   * @returns {socketIOClient.Socket}
   */
  sendMatchRequest(onMatchSuccess, onMatchFailure, onSocketDisconnect) {
    this.socket = setupSocket(
      (data) => {
        console.log(data);
        this.setLoading(false);
        if (onMatchSuccess) {
          onMatchSuccess(data);
        }
      },
      (error) => {
        console.log("Match failed: " + error);
        this.setLoading(false);
        if (onMatchFailure) {
          onMatchFailure(error);
        }
      },
      () => {
        console.log("socket closed");
        this.setLoading(false);
        if (onSocketDisconnect) {
          onSocketDisconnect();
        }
      }
    );

    console.log(`sendMatchRequest() with args ${this.uid}, ${this.complexity}`);
    const message = JSON.stringify({
      uid: this.uid,
      complexity: this.complexity,
    });
    this.socket.emit("match-request", message);

    return this.socket;
  }
}

export const matchingFormStore = new MatchingFormStore();