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

    await question.save();
    res.status(201).json(question);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Error creating question" });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Error fetching question" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Error fetching questions" });
  }
};

exports.updateQuestion = async (req, res) => {
  const { title, description, category, complexity } = req.body;
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });

    if (!question) {
      res.status(404).json({ error: "Question not found" });
      return;
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
    res.status(200).json(question);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Error updating question" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const deletedDoc = await Question.findOneAndDelete({ questionId });
    if (deletedDoc) {
      res.status(200).json(deletedDoc);
    } else {
      res.status(404).json({ error: "Question not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Error deleting question" });
  }
};
