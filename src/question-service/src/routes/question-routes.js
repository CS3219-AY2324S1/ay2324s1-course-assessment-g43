const express = require("express");
const questionController = require("../controllers/question-controller");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * A Question Payload for POST and PUT requests
 * @typedef {object} QuestionPayload
 * @property {string} title - The question title
 * @property {string} description - The question description
 * @property {array<string>} category - The array of categories
 * @property {string} complexity - The question complexity
 */

/**
 * A Question document
 * @typedef {object} QuestionDocument
 * @property {string} _id - The document id
 * @property {integer} questionId - The question id
 * @property {string} title - The question title
 * @property {string} description - The question description
 * @property {array<string>} category - The array of categories
 * @property {string} complexity - The question complexity
 * @property {string} __v - The document version
 */

/**
 * An error response
 * @typedef {object} ErrorResponse
 * @property {string} message - The error message
 */

/**
 * GET /api/questions/random
 * @summary Gets a random `questionId` by complexity.
 * 
 * @param {string} complexity.query.optional - The complexity to filter by - enum:Easy,Medium,Hard
 * @return {integer} 200 - success response - application/json
 * @return {ErrorResponse} 404 - not found response - application/json
 * @example response - 200 - example 200 response
 * {
 *  "questionId": 4
 * }
 * @example response - 404 - example 404 response
 * {
 *  "message": "Question not found"
 * }
 */
router.get(
  "/questions/random",
  auth.authenticate,
  questionController.getRandomQuestion
);

/**
 * POST /api/questions
 * @summary Creates a new question.
 * @param {QuestionPayload} request.body.required - question info
 * @return {QuestionDocument} 201 - success response - application/json
 * @return {ErrorResponse} 400 - error response - application/json
 * @example request - example payload
 * {
 *   "title": "Two Sum",
 *   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
 *   "category": ["Array", "Hash Table"],
 *   "complexity": "Easy"
 * }
 * @example response - 201 - example 201 response
 * {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 6,
 *   "title": "Two Sum",
 *   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
 *   "category": ["Array", "Hash Table"],
 *   "complexity": "Easy",
 *   "__v": 0
 * }
 * @example response - 400 - example 400 response
 * {
 *  "message": "Error creating question"
 * }
 */
router.post(
  "/questions",
  auth.authenticate,
  auth.checkAuthorization,
  questionController.createQuestion
);

/**
 * GET /api/questions/{id}
 * @summary Gets a question.
 * @param {integer} questionId.path.required - The `questionId`
 * @return {QuestionPayload} 200 - success response - application/json
 * @return {ErrorResponse} 404 - not found response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 2,
 *   "title": "second question",
 *   "description": "desc1",
 *   "category": [
 *     "cat1, cat3, cat33"
 *   ],
 *   "complexity": "easy",
 *   "__v": 0
 * }
 * @example response - 404 - example 404 response
 * {
 *  "message": "Question not found"
 * }
 * @example response - 500 - example 500 response
 * {
 *  "message": "Error fetching question"
 * }
 */
router.get("/questions/:id", auth.authenticate, questionController.getQuestion);

/**
 * GET /api/questions
 * @summary Gets all questions.
 * @return {array<QuestionPayload>} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
 * [
 *   {
 *     "_id": "64fefe5516358d7601e35f9a",
 *     "questionId": 1,
 *     "title": "first question",
 *     "description": "desc1",
 *     "category": [
 *       "cat1",
 *       "cat3",
 *       "cat33"
 *     ],
 *     "complexity": "easy",
 *     "__v": 0
 *   },
 *   {
 *     "_id": "64fefe7816358d7601e35fa0",
 *     "questionId": 2,
 *     "title": "second question",
 *     "description": "desc1",
 *     "category": [
 *       "cat1",
 *       "cat3",
 *       "cat33"
 *     ],
 *     "complexity": "easy",
 *     "__v": 0
 *   }
 * ]
 * @example response - 500 - example 500 response
 * {
 *  "message": "Error fetching questions"
 * }
 */
router.get("/questions", auth.authenticate, questionController.getAllQuestions);

/**
 * PUT /api/questions/{id}
 * @summary Updates an existing question.
 * @param {integer} questionId.path.required - The `questionId`
 * @param {QuestionPayload} request.body.required - The question info
 * @return {QuestionDocument} 200 - success reponse - application/json
 * @return {ErrorResponse} 400 - bad request response - application/json
 * @return {ErrorResponse} 404 - not found response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "_id": "64fefe9c16358d7601e35fa3",
 *	 "questionId": 3,
 *	 "title": "New title",
 *	 "description": "desc1",
 *	 "category": [
 *	   "cat1, cat3, cat33"
 *	 ],
 *	 "complexity": "easy",
 *   "__v": 0
 * }
 * @example response - 400 - example 400 response
 * {
 *  "message": "Error updating question"
 * }
 * @example response - 404 - example 404 response
 * {
 *  "message": "Question not found"
 * }
 */
router.put(
  "/questions/:id",
  auth.authenticate,
  auth.checkAuthorization,
  questionController.updateQuestion
);

/**
 * DELETE /api/questions/{id}
 * @summary Deletes a question.
 * @param {integer} questionId.path.required - The `questionId`
 * @return {QuestionDocument} 200 - success reponse - application/json
 * @return {ErrorResponse} 400 - bad request response - application/json
 * @return {ErrorResponse} 404 - not found response - application/json
 * @example response - 200 - example 200 response
 * {
 *   "_id": "64fefe7816358d7601e35fa0",
 *   "questionId": 4,
 *   "title": "fourth question",
 *   "description": "desc1",
 *   "category": [
 *     "cat1, cat3, cat33"
 *   ],
 *   "complexity": "easy",
 *   "__v": 0
 * }
 * @example response - 400 - example 400 response
 * {
 *  "message": "Error deleting question"
 * }
 * @example response - 404 - example 404 response
 * {
 *  "message": "Question not found"
 * }
 */
router.delete(
  "/questions/:id",
  auth.authenticate,
  auth.checkAuthorization,
  questionController.deleteQuestion
);

module.exports = router;
