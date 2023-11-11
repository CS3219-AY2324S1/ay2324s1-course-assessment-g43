const Attempt = require("../models/attempt-model");

exports.createAttempt = async (req, res) => {
  const { currentUserId, title, description, category, complexity } = req.body;
  try {
    const attempt = new Attempt({
      currentUserId,
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
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: "Error creating attempt" });
    }
    return res.status(500).json({ message: "Error creating attempt" });
  }
};

exports.getAttemptsByUserId = async (req, res) => {
  const userId = req.params.userId;
  try {
    const attempts = await Attempt.find({ currentUserId: userId }).sort({
      datetime: -1,
    });
    return res.status(200).json(attempts);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: `Error getting attempts for user with uid ${userId}` });
  }
};
