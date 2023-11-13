const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
  },
  title: {
    type: String,
    trim: true,
    required: [true, "Title cannot be blank"],
    unique: true,
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description cannot be blank"],
  },
  category: {
    type: [
      {
        type: String,
        trim: true,
        required: [true, "Category cannot be blank"],
      },
    ],
  },
  complexity: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
