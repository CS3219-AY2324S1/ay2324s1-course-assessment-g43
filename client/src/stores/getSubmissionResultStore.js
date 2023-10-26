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
      let statusId = res.data.status?.id;
      // // Processed - we have a result
      // if (statusId === 1 || statusId === 2) {
      //   // still processing
      //   setTimeout(() => {
      //     this.getSubmissionResult();
      //   }, 2000)
      //   return
      // } else {
        console.log(res.data);
        this.setStdout(res.data.data.stdout);
        this.setStderr(res.data.data.stderr);
        this.setStatus(res.data.data.status.description);
        return res.data;
      // }
      console.log("inside result store");
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

export const getSubmissionResultStore = new GetSubmissionResultStore();