const mockingoose = require("mockingoose");

const Counter = require("../../src/models/counter-model");
const Question = require("../../src/models/question-model");
const QuestionModelBuilder = require("../utils/builders/question-model-builder");
const QuestionPayloadBuilder = require("../utils/builders/question-payload-builder");
const {
  createQuestion,
  getQuestion,
  getAllQuestions,
  updateQuestion,
  deleteQuestion,
} = require("../../src/controllers/question-controller");

describe("QuestionController", () => {
  /**
   * Compares two questions and asserts that they are equal.
   */
  function compareQuestions(question, expectedQuestion) {
    const keysToCompare = [
      "questionId",
      "title",
      "description",
      "category",
      "complexity",
    ];

    keysToCompare.forEach((prop) => {
      expect(question[prop]).toEqual(expectedQuestion[prop]);
    });
  }

  function createMockRequest(params, body) {
    return {
      params,
      body,
    };
  }

  function createMockResult() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  }

  beforeEach(() => {
    mockingoose.resetAll();
  });

  describe("createQuestion", () => {
    it("should create a question with valid input successfully", async () => {
      const validQuestionPayload = new QuestionPayloadBuilder()
        .setCategory("Test Category1")
        .setCategory("Test Category1")
        .build();
      const req = createMockRequest(null, { ...validQuestionPayload });
      const res = createMockResult();

      // Mock Counter#findOneAndUpdate()
      const counter = { count: 1 };
      mockingoose(Counter).toReturn(counter, "findOneAndUpdate");

      // Mock Question#save()
      const savedQuestion = {
        questionId: 1,
        ...req.body,
      };
      mockingoose(Question).toReturn(savedQuestion, "save");

      await createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      compareQuestions(res.json.mock.calls[0][0], savedQuestion);
    });

    it("should fail on invalid input", async () => {
      const invalidQuestionPayload1 = new QuestionPayloadBuilder()
        .setTitle(null)
        .build();
      const invalidQuestionPayload2 = new QuestionPayloadBuilder()
        .setComplexity(null)
        .build();

      const req1 = createMockRequest(null, { ...invalidQuestionPayload1 });
      const req2 = createMockRequest(null, { ...invalidQuestionPayload2 });
      const res1 = createMockResult();
      const res2 = createMockResult();

      // Mock Counter#findOneAndUpdate()
      const counter = { count: 1 };
      mockingoose(Counter).toReturn(counter, "findOneAndUpdate");

      // Mock Question#save() -- value doesn't matter as it should not be called
      const savedQuestion = "dummy";
      mockingoose(Question).toReturn(savedQuestion, "save");
      mockingoose(Question).toReturn(savedQuestion, "save");

      await createQuestion(req1, res1);
      await createQuestion(req2, res2);

      expect(res1.status).toHaveBeenCalledWith(400);
      expect(res2.status).toHaveBeenCalledWith(400);
      expect(res1.json).toHaveBeenCalledWith({
        error: "Error creating question",
      });
      expect(res2.json).toHaveBeenCalledWith({
        error: "Error creating question",
      });
    });
  });

  describe("getQuestion", () => {
    it("should get a question successfully", async () => {
      const req = createMockRequest({ id: 1 }, null);
      const res = createMockResult();

      // Mock Question#findOne()
      const question = new QuestionModelBuilder().build();
      mockingoose(Question).toReturn(question, "findOne");

      await getQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      compareQuestions(res.json.mock.calls[0][0], question);
    });

    it("should return 404 if question is not found", async () => {
      const req = createMockRequest({ id: 100 }, null);
      const res = createMockResult();

      await getQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });

  describe("getAllQuestions", () => {
    it("should return all questions successfully", async () => {
      const req = createMockRequest(null, null);
      const res = createMockResult();
      const question1 = new QuestionModelBuilder().build();
      const question2 = new QuestionModelBuilder().setQuestionId(2).build();
      const questions = [question1, question2];

      // Mock Question#find()
      mockingoose(Question).toReturn(questions, "find");

      await getAllQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const questionsReturned = res.json.mock.calls[0][0];
      expect(questionsReturned.length).toEqual(2);
      questionsReturned.forEach((question, index) => {
        compareQuestions(question, questions[index]);
      });
    });

    it("should return an empty array if no questions are found", async () => {
      const req = createMockRequest(null, null);
      const res = createMockResult();

      // Mock Question#find()
      mockingoose(Question).toReturn([], "find");

      await getAllQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe("updateQuestion", () => {
    it("should update a question successfully", async () => {
      const req = createMockRequest({ id: 1 }, { complexity: "Hard" });
      const res = createMockResult();

      // Mock Question#findOne()
      const question = new QuestionModelBuilder().build();
      mockingoose(Question).toReturn(question, "findOne");

      // Mock Question#save()
      const updatedQuestion = {
        ...new QuestionModelBuilder().build(),
        complexity: req.body.complexity,
      };
      mockingoose(Question).toReturn(updatedQuestion, "save");

      await updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      compareQuestions(res.json.mock.calls[0][0], updatedQuestion);
    });

    it("should return 404 if question is not found", async () => {
      const req = createMockRequest({ id: 100 }, { title: "Updated title" });
      const res = createMockResult();

      await updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });

  describe("deleteQuestion", () => {
    it("should delete a question successfully", async () => {
      const req = createMockRequest({ id: 1 }, null);
      const res = createMockResult();

      // Mock Question#findOneAndDelete()
      const question = new QuestionModelBuilder().build();
      mockingoose(Question).toReturn(question, "findOneAndDelete");

      await deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      compareQuestions(res.json.mock.calls[0][0], question);
    });

    it("should return 404 if question is not found", async () => {
      const req = createMockRequest({ id: 1 }, null);
      const res = createMockResult();

      await deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });
});
