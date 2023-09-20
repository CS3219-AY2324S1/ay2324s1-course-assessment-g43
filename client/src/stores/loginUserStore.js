import { makeAutoObservable } from "mobx";
import { login } from "../services/userService";

class LoginUserStore {
  state = {
    email: "",
    password: "",
    showPassword: false,
  };

  constructor() {
    makeAutoObservable(this);
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

  async login() {
    const res = await login(this.state);
    if (res.message == "User logged in" && !!res.data) {
      localStorage.setItem("user", res.data.user);
    }
  }
}

export const loginUserStore = new LoginUserStore();
