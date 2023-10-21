const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true, min: 1 },
  firstUserId: { type: String, required: true },
  secondUserId: { type: String, required: true },
  firstUserStatus: { type: Boolean, required: true },
  secondUserStatus: { type: Boolean, required: true },
  attempt: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: Array },
  complexity: { type: String, required: true },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
