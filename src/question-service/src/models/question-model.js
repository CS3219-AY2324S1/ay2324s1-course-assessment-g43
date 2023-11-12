const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true, unique: true, min: 1 },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
