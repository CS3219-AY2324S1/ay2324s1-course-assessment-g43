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

    return res.status(200).json({ language: currentLanguage, code: currentCode });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching session" });
  }
}

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
    return res.status(500).json({ message: "Error fetching session" });
  }
}

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

exports.editSession = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { title, description, category } = req.body;

    const session = await Session.findOne({ roomId });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.title = title;
    session.description = description;
    session.category = category;

    await session.validate();
    await session.save();

    return res.status(200).json(session);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error editing session details" });
  }
}

