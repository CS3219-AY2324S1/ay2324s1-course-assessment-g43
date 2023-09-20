import { makeAutoObservable } from "mobx";
import { getAllQuestions } from "../services/questionService";

class ViewQuestionsStore {
  state = {
    questions: [],
  };

  constructor() {
    makeAutoObservable(this);
  }

  async getAllQuestions() {
    const res = await getAllQuestions();
    this.setQuestions(res.data);
  }

  setQuestions(questions) {
    this.state.questions = questions;
  }
}

export const viewQuestionsStore = new ViewQuestionsStore();
