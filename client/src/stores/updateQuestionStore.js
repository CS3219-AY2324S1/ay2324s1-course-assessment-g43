import { makeAutoObservable } from "mobx";
import { updateQuestionById } from "../services/questionService";

class UpdateQuestionStore {
  state = {
    questionId: -1,
    title: "",
    description: "",
    updatingCat: "",
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

  setUpdatingCat(cat) {
    this.state.updatingCat = cat;
  }

  addCategory() {
    if (this.state.updatingCat != "") {
      this.state.category.push(this.state.updatingCat);
      this.setUpdatingCat("");
    }
  }

  removeCategory(category) {
    const index = this.state.category.indexOf(category);
    this.state.category.splice(index, 1);
  }

  setComplexity(complexity) {
    this.state.complexity = complexity;
  }

  async updateQuestionById() {
    try {
      const res = await updateQuestionById(this.state.questionId, this.state);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const updateQuestionStore = new UpdateQuestionStore();
