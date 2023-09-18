const express = require("express");
const questionController = require("../controllers/question-controller");

const router = express.Router();

/**
 * A question
 * @typedef {object} Question
 * @property {integer} questionId - The unique integer ID
 * @property {string} title - The title
 * @property {string} description - The description
 * @property {array<string>} category - The array of categories
 * @property {string} complexity - The complexity
 */

/**
 * POST /api/questions
 * @summary Creates a new question.
 * @param {Question} request.body.required - question info
 * @return {object} 201 - success response - application/json
 * @return {object} 400 - error response - application/json
 * @example request - example payload
 * {
 *   "title": "Two Sum",
 *   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
 *   "category": ["Array", "Hash Table"],
 *   "complexity": "Easy"
 * }
 * @example response - 200 - example 200 response
 * {
 *   "question": {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 6,
 *   "title": "Two Sum",
 *   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
 *   "category": ["Array", "Hash Table"],
 *   "complexity": "Easy"
 *   "__v": 0
 *  }
 * }
 * @example response - 400 - example 400 response
 * {
 *  "error": "Error creating question"
 * }
 */
router.post("/questions", questionController.createQuestion);

/**
 * GET /api/questions/{id}
 * @summary Gets a question.
 * @param {integer} questionId.path.required - The `questionId`
 * @return {Question} 200 - success response - application/json
 * @return {object} 500 - error response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "question": {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 2,
 *   "title": "second question",
 *   "description": "desc1",
 *   "category": [
 *     "cat1, cat3, cat33"
 *   ],
 *   "complexity": "easy",
 *   "__v": 0
 *  }
 * }
 * @example response - 500 - example 500 response
 * {
 *  "error": "Error fetching question"
 * }
 */
router.get("/questions/:id", questionController.getQuestion);

/**
 * GET /api/questions
 * @summary Gets all questions.
 * @return {array<Question>} 200 - success response - application/json
 * @return {object} 500 - error response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "questions": [
 *     {
 *       "_id": "64fefe5516358d7601e35f9a",
 *       "questionId": 1,
 *       "title": "first question",
 *       "description": "desc1",
 *       "category": [
 *         "cat1",
 *         "cat3",
 *         "cat33"
 *       ],
 *       "complexity": "easy",
 *       "__v": 0
 *     },
 *     {
 *       "_id": "64fefe7816358d7601e35fa0",
 *       "questionId": 2,
 *       "title": "second question",
 *       "description": "desc1",
 *       "category": [
 *         "cat1",
 *         "cat3",
 *         "cat33"
 *       ],
 *       "complexity": "easy",
 *       "__v": 0
 *     }
 *   ]
 * }
 * @example response - 500 - example 500 response
 * {
 *  "error": "Error fetching questions"
 * }
 */
router.get("/questions", questionController.getAllQuestions);

/**
 * PUT /api/questions/{id}
 * @summary Updates an existing question.
 * @param {integer} questionId.path.required - The `questionId`
 * @param {Question} request.body.required - question info
 * @return {object} 200 - success reponse - application/json
 * @return {object} 400 - bad request response - application/json
 * @example response - 400 - example 400 response
 * {
 *  "error": "Error updating question"
 * }
 * @example response - 404 - example 404 response
 * {
 *  "error": "Question not found"
 * }
 */
router.put("/questions/:id", questionController.updateQuestion);

/**
 * DELETE /api/questions/{id}
 * @summary Deletes a question.
 * @param {integer} questionId.path.required - The `questionId`
 * @return {object} 200 - success reponse - application/json
 * @return {object} 400 - bad request response - application/json
 * @return {object} 404 - bad request response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "question": {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 4,
 *   "title": "fourth question",
 *   "description": "desc1",
 *   "category": [
 *     "cat1, cat3, cat33"
 *   ],
 *   "complexity": "easy",
 *   "__v": 0
 *  }
 * }
 * @example response - 400 - example 400 response
 * {
 *  "error": "Error deleting question"
 * }
 * @example response - 404 - example 404 response
 * {
 *  "error": "Question not found"
 * }
 */
router.delete("/questions/:id", questionController.deleteQuestion);

module.exports = router;
