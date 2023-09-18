const QuestionPayloadBuilder = require("./question-payload-builder");

class QuestionModelBuilder extends QuestionPayloadBuilder {
  constructor() {
    super();
    this.questionId = 1;
  }

  setQuestionId(questionId) {
    this.questionId = questionId;
    return this;
  }

  build() {
    return {
      questionId: this.questionId,
      ...super.build(),
    };
  }
}

module.exports = QuestionModelBuilder;
