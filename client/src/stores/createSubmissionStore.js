import { makeAutoObservable } from "mobx";
import { createSubmission, getSubmissionResult } from "../services/codeExecutionService";

class CreateSubmissionStore {
  state = {
    language_id: "",
    source_code: "",
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

  async createSubmission() {
    try {
      const res = await createSubmission(JSON.stringify(this.state));
      return res.data.data.token;
    } catch (err) {
      console.log(err);
      throw err;
    } 
  }
}

export const createSubmissionStore = new CreateSubmissionStore();