import { makeAutoObservable } from "mobx";
import { getSubmissionResult } from "../services/codeExecutionService";

class GetSubmissionResultStore {
  state = {
    token: "",
    stdout: "",
    stderr: "",
    status: ""
  }

  constructor() {
    makeAutoObservable(this);
  }

  setToken(token) {
    this.state.token = token;
  }

  setStdout(stdout) {
    this.state.stdout = stdout;
  }

  setStderr(stderr) {
    this.state.stderr = stderr;
  }

  setStatus(status) {
    this.state.status = status;
  }

  async getSubmissionResult() {
    try {
      const res = await getSubmissionResult(this.state.token);
      console.log(res.data);
      this.setStdout(res.data.data.stdout);
      this.setStderr(res.data.data.stderr);
      this.setStatus(res.data.data.status.description);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

export const getSubmissionResultStore = new GetSubmissionResultStore();