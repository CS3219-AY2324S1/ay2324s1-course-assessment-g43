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
    try {
      const res = await getAllQuestions();
      console.log(res);
      this.setQuestions(res.data);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  setQuestions(questions) {
    this.state.questions = questions;
  }
}

export const viewQuestionsStore = new ViewQuestionsStore();
