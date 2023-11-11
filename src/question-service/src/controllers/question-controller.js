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
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Error creating question" });
    }
    return res.status(500).json({ message: "Error creating question" });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });
    return res.status(200).json(question);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching question" });
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
    return res.status(500).json({ message: "Error fetching questions" });
  }
};

exports.updateQuestion = async (req, res) => {
  const { title, description, category, complexity } = req.body;
  try {
    const questionId = req.params.id;
    const question = await Question.findOne({ questionId });

    if (question) {
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
    }
    return res.status(200).json(question);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Error updating question" });
    }
    return res.status(500).json({ message: "Error updating question" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    const deletedDoc = await Question.findOneAndDelete({ questionId });
    return res.status(200).json(deletedDoc);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error deleting question" });
  }
};

exports.getRandomQuestion = async (req, res) => {
  try {
    const complexity = req.query.complexity;
    const currentId = req.query.currentId;

    let randomQuestion;

    if (!complexity) {
      // If no complexity is specified, get a random question from the entire collection
      randomQuestion = await Question.aggregate([{ $sample: { size: 1 } }]);
    } else if (!currentId) {
      // If no current question is specified, get a random question of that complexity.
      randomQuestion = await Question.aggregate([
        { $match: { complexity } },
        { $sample: { size: 1 } },
      ]);
    } else {
      const idNum = parseInt(currentId);
      // Get a random question of that complexity, excluding the current question.
      randomQuestion = await Question.aggregate([
        { $match: { questionId: { $ne: idNum }, complexity } },
        { $sample: { size: 1 } },
      ]);

      // If no question is found, return the current question.
      randomQuestion[0] = randomQuestion.length === 1
        ? randomQuestion[0]
        : await Question.find({ questionId: idNum });
    }

    return randomQuestion.length === 1
      ? res.status(200).json(randomQuestion[0])
      : res.status(200).json(null);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching random question" });
  }
};
