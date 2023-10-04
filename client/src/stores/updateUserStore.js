import { makeAutoObservable } from "mobx";
import { getUserById, updateUser } from "../services/userService";

class UpdateUserStore {
  state = {
    username: "",
    email: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  async populateStateWithUserById(id) {
    try {
      const data = await getUserById(id);
      this.setUsername(data.user.username);
      this.setEmail(data.user.email);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  setUsername(username) {
    this.state.username = username;
  }

  setEmail(email) {
    this.state.email = email;
  }

  async updateUser(id) {
    try {
      const res = await updateUser(id, this.state);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const updateUserStore = new UpdateUserStore();
