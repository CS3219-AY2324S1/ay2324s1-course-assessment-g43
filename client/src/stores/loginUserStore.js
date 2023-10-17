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
    try {
      const res = await login(this.state);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("jwt", res.data.jwt);
      return res.data.user;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const loginUserStore = new LoginUserStore();
