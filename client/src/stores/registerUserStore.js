import { makeAutoObservable } from "mobx";
import { register } from "../services/userService";

class RegisterUserStore {
  state = {
    username: "",
    email: "",
    pass: "",
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
    this.state.pass = password;
  }

  toggleShowPassword() {
    this.state.showPassword = !this.state.showPassword;
  }

  async register(id) {
    const res = await register(id, this.state);
    console.log(res);
  }
}

export const registerUserStore = new RegisterUserStore();
