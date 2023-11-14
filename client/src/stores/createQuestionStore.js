import { makeAutoObservable } from "mobx";
import { createQuestion } from "../services/questionService";

class CreateQuestionStore {
  state = {
    title: "",
    description: "",
    creatingCat: "",
    category: [],
    complexity: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  resetState() {
    this.state = {
      title: "",
      description: "",
      creatingCat: "",
      category: [],
      complexity: "",
    };
  }

  setTitle(title) {
    this.state.title = title;
  }

  setDescription(description) {
    this.state.description = description;
  }

  setCreatingCat(cat) {
    this.state.creatingCat = cat;
  }

  addCategory() {
    if (this.state.creatingCat != "") {
      this.state.category.push(this.state.creatingCat);
      this.setCreatingCat("");
    }
  }

  hasCategory() {
    if (this.state.category.indexOf(this.state.creatingCat) !== -1) {
      console.log(true);
      return true;
    }
  }

  removeCategory(category) {
    const index = this.state.category.indexOf(category);
    this.state.category.splice(index, 1);
  }

  setComplexity(complexity) {
    this.state.complexity = complexity;
  }

  async createQuestion() {
    try {
      const res = await createQuestion(this.state);
      console.log(res);
      return res;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export const createQuestionStore = new CreateQuestionStore();
