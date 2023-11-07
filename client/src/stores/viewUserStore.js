import { makeAutoObservable } from "mobx";
import { deleteUser, getUserById } from "../services/userService";

class ViewUserStore {
  state = {
    Username: "",
    Email: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.state.Username = username;
  }

  setEmail(email) {
    this.state.Email = email;
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

  async deleteUser(id) {
    try {
      const res = await deleteUser(id);
      console.log(res);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const viewUserStore = new ViewUserStore();
