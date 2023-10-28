import { makeAutoObservable } from "mobx";
import { createSubmission, getSubmissionResult } from "../services/codeExecutionService";

class CreateSubmissionStore {
  state = {
    language_id: "",
    source_code: "",
    // stdin: "hardcode", //MUST CHANGE
    // expected_output: "True", //MUST CHANGE
  }

  constructor() {
    makeAutoObservable(this);
  }

  setLanguageId(languageId) {
    this.state.language_id = languageId;
  }

  setSourceCode(sourceCode) {
    this.state.source_code = sourceCode;
  }

  // setStdin(stdin) {
  //   this.state.stdin = stdin;
  // }

  // setExpectedOutput(expectedOutput) {
  //   this.state.expected_output = expectedOutput;
  // }

  async createSubmission() {
    try {
      const res = await createSubmission(JSON.stringify(this.state));
      console.log(res.data.data.token)
      return res.data.data.token;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

export const createSubmissionStore = new CreateSubmissionStore();