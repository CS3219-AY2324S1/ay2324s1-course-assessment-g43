import { makeAutoObservable } from "mobx";
import { createAttempt, getAttemptsByUserId } from "../services/historyService";

class ViewHistoryStore {
  state = {
    attempts: [],
    selectedAttempt: {},
  };

  constructor() {
    makeAutoObservable(this);
  }

  setAttempts(attempts) {
    this.state.attempts = attempts;
  }

  setSelectedAttempt(selectedAttempt) {
    this.state.selectedAttempt = selectedAttempt;
  }

  async getAttemptsByUserId(id) {
    try {
      const res = await getAttemptsByUserId(id);
      console.log(res);
      this.setAttempts(res.data);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  async createAttempt(attempt) {
    try {
      const res = await createAttempt(attempt);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
    }
  }
}

export const viewHistoryStore = new ViewHistoryStore();
