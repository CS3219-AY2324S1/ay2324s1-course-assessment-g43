import { makeAutoObservable } from "mobx";
import {
  getAllQuestions,
  deleteQuestionById,
} from "../services/questionService";

class ViewQuestionsStore {
  state = {
    questions: [],
    selectedQuestion: {},
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

  setSelectedQuestion(selectedQuestion) {
    this.state.selectedQuestion = selectedQuestion;
  }

  async deleteQuestion(id) {
    try {
      const res = deleteQuestionById(id);
      console.log(res);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const viewQuestionsStore = new ViewQuestionsStore();
