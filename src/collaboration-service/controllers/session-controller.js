const Session = require("../models/session-model");

exports.createSession = async (req, res) => {
  const { roomId, firstUserId, secondUserId, questionId, title, description, category, complexity } = req.body;

  console.log(req.body);

  try {
    DEFAULT_FIRST_USER_STATUS = true;
    DEFAULT_SECOND_USER_STATUS = true;
    DEFAULT_ATTEMPT = "";

    const newSession = new Session({
      roomId,
      firstUserId,
      secondUserId,
      firstUserStatus: DEFAULT_FIRST_USER_STATUS,
      secondUserStatus: DEFAULT_SECOND_USER_STATUS,
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

exports.leaveSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.params.userId;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.firstUserId === userId) {
      session.firstUserStatus = false;
    } else if (session.secondUserId === userId) {
      session.secondUserStatus = false;
    } else {
      return res.status(400).json({ message: "User not in session" });
    }

    await session.validate();
    await session.save();

    return res.status(200).json(session);

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

