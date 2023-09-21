import { makeAutoObservable } from "mobx";
import {
  getQuestionById,
  updateQuestionById,
} from "../services/questionService";

class UpdateQuestionStore {
  state = {
    questions: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  async getQuestionById(id) {
    const qn = await getQuestionById(id);
    this.state.title = qn.title;
    this.state.description = qn.description;
    this.state.tag = qn.tag;
  }

  setTitle(title) {
    this.state.title = title;
  }

  setDescription(description) {
    this.state.description = description;
  }

  async updateQuestionById(id) {
    const res = await updateQuestionById(id, this.state);
    console.log(res);
  }
}

export const UpdateQuestionStore = new UpdateQuestionStore();
