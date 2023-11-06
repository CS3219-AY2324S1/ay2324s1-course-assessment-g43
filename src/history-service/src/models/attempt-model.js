const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema({
  currentUserId: { type: Number, require: true },
  questionId: { type: Number, required: true, min: 1 },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
  datetime: {
    type: String, // Store as a string
    default: () => {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true , day: '2-digit', month: '2-digit', year: 'numeric' };
      return now.toLocaleDateString(undefined, options);
    },
  },
});

const Attempt = mongoose.model('Attempt', attemptSchema);

module.exports = Attempt;