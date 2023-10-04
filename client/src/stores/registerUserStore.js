import { makeAutoObservable } from "mobx";
import { register } from "../services/userService";

class RegisterUserStore {
  state = {
    username: "",
    email: "",
    password: "",
    showPassword: false,
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

  setPassword(password) {
    this.state.password = password;
  }

  toggleShowPassword() {
    this.state.showPassword = !this.state.showPassword;
  }

  async register() {
    try {
      const res = await register(this.state);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const registerUserStore = new RegisterUserStore();
