const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  currentUserId: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  attemptDetails: {
    code: { type: String },
    language: { type: String},
  }
});

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;