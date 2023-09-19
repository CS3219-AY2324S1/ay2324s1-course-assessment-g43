class QuestionPayloadBuilder {
  constructor() {
    this.title = "Default title";
    this.description = "Default description";
    this.category = [];
    this.complexity = "Easy";
  }

  setTitle(title) {
    this.title = title;
    return this;
  }

  setDescription(description) {
    this.description = description;
    return this;
  }

  setCategory(category) {
    this.category.push(category);
    return this;
  }

  setComplexity(complexity) {
    if (complexity) {
      this.complexity = complexity;
    }
    return this;
  }

  build() {
    const { title, description, category, complexity } = this;
    return {
      title,
      description,
      category,
      complexity,
    };
  }
}

module.exports = QuestionPayloadBuilder;
