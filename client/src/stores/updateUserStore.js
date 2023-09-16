import { makeAutoObservable } from "mobx";
import { getUserById, updateUser } from "../services/userService";

class UpdateUserStore {
  state = {
    username: "",
    email: "",
    pass: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  async getInitialState(id) {
    const user = await getUserById(id);
    this.state.username = user.username;
    this.state.email = user.email;
    this.state.pass = user.pass;
  }

  setUsername(username) {
    this.state.username = username;
  }

  setEmail(email) {
    this.state.email = email;
  }

  setPassword(password) {
    this.state.pass = password;
  }

  async updateUser(id) {
    const res = await updateUser(id, this.state);
    console.log(res);
  }
}

export const updateUserStore = new UpdateUserStore();
