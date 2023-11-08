const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  currentUserId: { type: Number, require: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  },
);

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;