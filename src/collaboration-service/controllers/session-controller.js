const Session = require("../models/session-model");
const { getDefaultAttempt } = require("../utils/utils");

exports.createSession = async (req, res) => {
  const {
    roomId,
    firstUserId,
    firstUserName,
    secondUserId,
    secondUserName,
    questionId,
    title,
    description,
    category,
    complexity,
  } = req.body;

  try {
    const requestorUid = req.decodedToken?.uid;
    if (firstUserId !== requestorUid && secondUserId !== requestorUid) {
      return res.status(403).end();
    }
    if (firstUserId === secondUserId) {
      return res.status(400).json({ message: "Two users cannot be identical" });
    }

    const otherActiveSession = await Session.findOne({
      $or: [
        { firstUserId: firstUserId },
        { firstUserId: secondUserId },
        { secondUserId: firstUserId },
        { secondUserId: secondUserId },
      ],
    });

    if (otherActiveSession) {
      return res
        .status(400)
        .json({ message: "User already in another session" });
    }

    DEFAULT_ACTIVE_ROOM_STATUS = true; // by implementation, room will never be inactive. leaving here for compatibility issues moving forward

    const defaultAttempt = getDefaultAttempt(title);

    const DEFAULT_LANGUAGE = "python";

    const newSession = new Session({
      roomId,
      firstUserId,
      firstUserName,
      secondUserId,
      secondUserName,
      isActive: DEFAULT_ACTIVE_ROOM_STATUS,
      attempt: defaultAttempt,
      currentLanguage: DEFAULT_LANGUAGE,
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
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(400).json({ message: "Error creating session" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const session = await Session.findOne({ roomId });
    // * Note: Only for GET /session/:id we return 404 for 'invalid' id
    // (allows for better error handling on FE)
    return session
      ? res.status(200).json(session)
      : res.status(404).json({ message: "Session not found" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching session" });
  }
};

exports.getLanguage = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const currentLanguage = session.currentLanguage;
    const currentCode = session.attempt.get(currentLanguage);

    return res
      .status(200)
      .json({ language: currentLanguage, code: currentCode });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error getting language" });
  }
};

exports.editLanguage = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { oldCode, newLanguage } = req.body;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const currentLanguage = session.currentLanguage;
    session.attempt.set(currentLanguage, oldCode);

    session.currentLanguage = newLanguage;
    const newCode = session.attempt.get(newLanguage);

    await session.validate();
    await session.save();

    return res.status(200).json({ language: newLanguage, code: newCode });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error resetting language" });
  }
};

exports.resetCode = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const title = session.title;
    const defaultAttempt = getDefaultAttempt(title);

    const currentLanguage = session.currentLanguage;
    const blankCode = defaultAttempt[currentLanguage];

    session.attempt.set(currentLanguage, blankCode);

    await session.validate();
    await session.save();

    return res.status(200).json({ language: currentLanguage, code: blankCode });
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error resetting code" });
  }
};

// Returns deleted Session object if valid roomId given, else `null`.
exports.deleteSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    // Note: deletedSession === null if roomId doesn't exist
    const deletedSession = await Session.findOneAndDelete({ roomId });
    return res.status(200).json(deletedSession);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error leaving session" });
  }
};

// Returns new Session object if valid roomId given, else `null`.
exports.editSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { title, description, category } = req.body;

    const session = await Session.findOne({ roomId });
    if (session) {
      const defaultAttempt = getDefaultAttempt(title);
      session.title = title;
      session.description = description;
      session.category = category;
      session.attempt = defaultAttempt;
      await session.validate();
      await session.save();
    }
    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Error editing session details" });
  }
};

exports.findSessionWithUid = async (req, res) => {
  try {
    const uid = req.params.uid;
    const session = await Session.findOne({
      $or: [{ firstUserId: uid }, { secondUserId: uid }],
    });
    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching session" });
  }
};
