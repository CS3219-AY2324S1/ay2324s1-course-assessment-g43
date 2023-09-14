import { makeAutoObservable } from "mobx";

class UpdateUserStore {
  state = {
    username: "",
    email: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.state.username = username;
  }

  setEmail(email) {
    this.state.email = email;
  }
}

export const updateUserStore = new UpdateUserStore();
