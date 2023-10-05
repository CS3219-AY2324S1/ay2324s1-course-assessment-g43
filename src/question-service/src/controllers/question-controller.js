const Question = require("../models/question-model");
const Counter = require("../models/counter-model");

exports.createQuestion = async (req, res) => {
  const { title, description, category, complexity } = req.body;
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "questionsCounter" },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
    const question = new Question({
      questionId: counter.count,
      title,
      description,
      category,
      complexity,
    });

    await question.validate();
    await question.save();
    return res.status(201).json(question);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error creating question" });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });
    return question
      ? res.status(200).json(question)
      : res.status(404).json({ error: "Question not found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error fetching question" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    return questions
      ? res.status(200).json(questions)
      : res.status(200).json([]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error fetching questions" });
  }
};

exports.updateQuestion = async (req, res) => {
  const { title, description, category, complexity } = req.body;
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    if (title) {
      question.title = title;
    }
    if (description) {
      question.description = description;
    }
    if (category) {
      question.category = category;
    }
    if (complexity) {
      question.complexity = complexity;
    }

    await question.validate();
    await question.save();
    return res.status(200).json(question);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error updating question" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const deletedDoc = await Question.findOneAndDelete({ questionId });
    return deletedDoc
      ? res.status(200).json(deletedDoc)
      : res.status(404).json({ error: "Question not found" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: "Error deleting question" });
  }
};

exports.getRandomQuestionId = async (req, res) => {
  try {
    const complexity = req.query.complexity;
    const filteredQuestions = complexity
      ? await Question.find({ complexity })
      : await Question.find();

    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const randomQuestion = filteredQuestions[randomIndex];
    return randomQuestion
      ? res.status(200).json({ questionId: randomQuestion.questionId })
      : res.status(404).json({ error: "Question not found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error fetching random question" });
  }
};