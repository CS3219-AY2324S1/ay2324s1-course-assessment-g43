import { makeAutoObservable } from "mobx";
import { deleteUser, getUserById } from "../services/userService";

class ViewUserStore {
  state = {
    username: "",
    email: "",
    password: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  async getInitialState(id) {
    const user = await getUserById(id);
    this.state.username = user.username;
    this.state.email = user.email;
    this.state.password = user.password;
  }

  async deleteUser(id) {
    const res = await deleteUser(id);
    console.log(res);
  }
}

export const viewUserStore = new ViewUserStore();
