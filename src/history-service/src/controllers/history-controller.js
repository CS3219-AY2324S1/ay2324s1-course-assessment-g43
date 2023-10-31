const Attempt = require("../models/attempt-model");

exports.createAttempt = async (req, res) => {
  const { currentUserId, questionId, title, description, category, complexity } = req.body;
  try {
    const attempt = new Attempt({
      currentUserId,
      questionId,
      title,
      description,
      category,
      complexity,
    });
    await attempt.validate();
    await attempt.save();
    return res.status(201).json(attempt);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error creating attempt" });
  }
}

exports.getAttemptsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const attempts = await Attempt.find({ currentUserId: userId });

    if (!attempts || attempts.length === 0) {
      return res.status(404).json({ message: `No attempts found for user with uid ${userId}` });
    }
    return res.status(200).json(attempts);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: `Error getting attempts for user with uid ${userId}` });
  }
};