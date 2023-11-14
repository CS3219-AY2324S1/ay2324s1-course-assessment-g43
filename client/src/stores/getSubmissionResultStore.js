import { makeAutoObservable } from "mobx";
import { getSubmissionResult } from "../services/codeExecutionService";

class GetSubmissionResultStore {
  state = {
    token: "",
    stdout: "",
    stderr: "",
    // status: ""
    status: {
      id: "",
      description: "",
    }
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

  setStatus(id, description) {
    this.state.status.id = id;
    this.state.status.description = description;
  }

  async getSubmissionResult() {
    try {
      const res = await getSubmissionResult(this.state.token);
      this.setStdout(res.data.data.stdout);
      this.setStderr(res.data.data.stderr);
      this.setStatus(res.data.data.status.id, res.data.data.status.description);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

export const getSubmissionResultStore = new GetSubmissionResultStore();