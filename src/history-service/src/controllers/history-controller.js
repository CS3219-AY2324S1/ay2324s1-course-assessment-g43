const Attempt = require("../models/attempt-model");

exports.createAttempt = async (req, res) => {
  const {
    currentUserId,
    title,
    description,
    category,
    complexity,
    attemptDetails,
  } = req.body;
  if (currentUserId !== req.decodedToken?.uid) {
    return res.status(403).end();
  }
  try {
    const attempt = new Attempt({
      currentUserId,
      title,
      description,
      category,
      complexity,
      attemptDetails
    });
    await attempt.validate();
    await attempt.save();
    return res.status(201).json(attempt);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error creating attempt" });
  }
};

exports.getAttemptsByUserId = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (userId !== req.decodedToken?.uid) {
    return res.status(403).end();
  }
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
