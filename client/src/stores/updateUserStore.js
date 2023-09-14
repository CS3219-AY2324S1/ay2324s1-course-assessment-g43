import { makeAutoObservable } from "mobx";
import { deleteUser, getUserById, updateUser } from "../services/userService";

class UpdateUserStore {
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

  setUsername(username) {
    this.state.username = username;
  }

  setEmail(email) {
    this.state.email = email;
  }

  setPassword(password) {
    this.state.password = password;
  }

  async updateUser(id) {
    const res = await updateUser(id, this.state);
    console.log(res);
  }

  async deleteUser(id) {
    const res = await deleteUser(id);
    console.log(res);
  }
}

export const updateUserStore = new UpdateUserStore();
