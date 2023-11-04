import { makeAutoObservable } from "mobx";
import { getAttemptsByUserId } from "../services/historyService";

class ViewHistoryStore {
  state = {
    attempts: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  setAttempts(attempts) {
    this.state.attempts = attempts;
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
}

export const viewHistoryStore = new ViewHistoryStore();