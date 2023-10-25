const Session = require("../models/session-model");

exports.createSession = async (req, res) => {
  const { roomId, firstUserId, secondUserId, questionId, title, description, category, complexity } = req.body;

  try {
    if (firstUserId === secondUserId) {
      return res.status(400).json({ message: "Two users cannot be identical" });
    }

    const otherActiveSession = await Session.findOne({
      $or: [
        { firstUserId: firstUserId }, 
        { firstUserId: secondUserId }, 
        { secondUserId: firstUserId},
        { secondUserId: secondUserId }
      ],
    });

    if (otherActiveSession) {
      return res.status(400).json({ message: "User already in another session" });
    }

    DEFAULT_ACTIVE_ROOM_STATUS = true; // by implementation, room will never be inactive. leaving here for compatibility issues moving forward
    DEFAULT_ATTEMPT = "";

    const newSession = new Session({
      roomId,
      firstUserId,
      secondUserId,
      isActive: DEFAULT_ACTIVE_ROOM_STATUS,
      attempt: DEFAULT_ATTEMPT,
      questionId,
      title,
      description,
      category,
      complexity,
    });

    await newSession.validate();
    await newSession.save();
    return res.status(201).json(newSession);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Error creating session" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.status(200).json(session);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching session" });
  }
}

exports.deleteSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const deletedSession = await Session.findOneAndDelete({ roomId });

    return res.status(200).json(deletedSession);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error leaving session" });
  }
}

exports.saveAttempt = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { attempt } = req.body;
    
    console.log(req.body);

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.attempt = attempt;

    await session.validate();
    await session.save();

    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error saving attempt" });
  }
}

