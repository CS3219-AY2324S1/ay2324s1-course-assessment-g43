const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, min: 1 },
  firstUserId: { type: String, required: true },
  secondUserId: { type: String, required: true },
  isActive: { type: Boolean, required: true },
  attempt: { type: Map, of: String },
  currentLanguage: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
