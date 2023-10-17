import { makeAutoObservable } from "mobx";

class ViewSessionStore {
  state = {
    questionId: -1,
    title: "",
    description: "",
    category: [],
    complexity: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setQuestionId(questionId) {
    this.state.questionId = questionId;
  }

  setTitle(title) {
    this.state.title = title;
  }

  setDescription(description) {
    this.state.description = description;
  }

  setCategory(category) {
    this.state.category = category;
  }

  setComplexity(complexity) {
    this.state.complexity = complexity;
  }
}

export const viewSessionStore = new ViewSessionStore();
