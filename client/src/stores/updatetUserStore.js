import { makeAutoObservable, observable, action } from "mobx";

class UpdateUserStore {
  state = {
    username: "",
    email: "",
  };

  constructor() {
    makeAutoObservable(this, {
      state: observable,
      setUsername: action,
      setEmail: action,
    });
  }

  setUsername(username) {
    this.state.username = username;
  }

  setEmail(email) {
    this.state.email = email;
  }
}

export const updateUserStore = new UpdateUserStore();
