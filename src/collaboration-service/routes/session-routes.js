const express = require("express");
const sessionController = require("../controllers/session-controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/session", auth.authenticate, sessionController.createSession);

router.get(
  "/session/:roomId",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.getSession
);

router.get(
  "/session/:roomId/language",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.getLanguage
);

router.put(
  "/session/:roomId",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.editSession
);

router.put(
  "/session/:roomId/language",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.editLanguage
);

router.put(
  "/session/:roomId/resetCode",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.resetCode
);

router.delete(
  "/session/:roomId",
  auth.authenticate,
  auth.checkAuthorization,
  sessionController.deleteSession
);

router.get(
  "/session/findWithUid/:uid",
  auth.authenticate,
  sessionController.findSessionWithUid
);

module.exports = router;
