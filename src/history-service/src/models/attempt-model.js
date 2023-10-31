const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  currentUserId: { type: Number, require: true},
  questionId: { type: Number, required: true, min: 1 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
  datetime: { type: Date, default: Date.now }, // Date and time of the attempt
});

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;