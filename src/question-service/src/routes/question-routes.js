const express = require("express");
const router = express.Router();

const questionController = require("../controllers/question-controller");

router.post("/questions", questionController.createQuestion);

router.get("/questions/:id", questionController.getQuestion);

router.get("/questions", questionController.getAllQuestions);

router.put("/questions/:id", questionController.updateQuestion);

router.delete("/questions/:id", questionController.deleteQuestion);

module.exports = router;
