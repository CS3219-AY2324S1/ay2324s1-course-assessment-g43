const express = require("express");
const historyController = require("../controllers/history-controller");
const auth = require("../middleware/auth");
const router = express.Router();

/**
 * An Attempt Payload for POST requests
 * @typedef {object} AttemptPayload
 * @property {Number} currentUserId - The uid of User
 * @property {string} title - The question title
 * @property {string} description - The question description
 * @property {array<string>} category - The array of categories
 * @property {string} complexity - The question complexity
 */

/**
 * An Attempt Document
 * @typedef {object} AttemptDocument
 * @property {string} _id - The document id
 * @property {string} __v - The document version
 * @property {Number} currentUserId - The uid of User
 * @property {string} title - The question title
 * @property {string} description - The question description
 * @property {array<string>} category - The array of categories
 * @property {string} complexity - The question complexity
 * @property {Date} datetime - Date and time of the attempt
 */

/**
 * POST /api/createAttempt
 * @summary Creates a new attempt.
 * @param {AttemptPayload} request.body.required - question attempt info
 * @return {AttemptDocument} 201 - success response - application/json
 * @return {ErrorResponse} 400 - error response - application/json
 * @example request - example payload
{
  "currentUserId": 1,
  "title": "Sample Title2",
  "description": "Sample Description2",
  "category": ["Category3", "Category4"],
  "complexity": "Hard"
}
 * @example response - 201 - example 201 response
{
	"currentUserId": 1,
	"title": "Sample Title2",
	"description": "Sample Description2",
	"category": [
		"Category3",
		"Category4"
	],
	"complexity": "Hard",
	"_id": "6540b0a261f323178cf99b25",
	"datetime": "2023-10-31T07:45:38.621Z",
	"__v": 0
}
 * @example response - 400 - example 400 response
{
	"message": "Error creating attempt"
}
 */

router.post("/createAttempt", auth.authenticate, historyController.createAttempt);

/**
 * GET /api/getAttemptsByUserId/{userId}
 * @summary Gets all attempts by user.
 * @param {integer} userId.path.required - The `userId`
 * @return {array<AttemptDocument>} 200 - success response - application/json
 * @return {ErrorResponse} 404 - not found response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
[
	{
		"_id": "6540b01261f323178cf99b23",
		"currentUserId": 1,
		"title": "Sample Title",
		"description": "Sample Description",
		"category": [
			"Category1",
			"Category2"
		],
		"complexity": "Medium",
		"datetime": "2023-10-31T07:43:14.932Z",
		"__v": 0
	},
	{
		"_id": "6540b0a261f323178cf99b25",
		"currentUserId": 1,
		"title": "Sample Title2",
		"description": "Sample Description2",
		"category": [
			"Category3",
			"Category4"
		],
		"complexity": "Hard",
		"datetime": "2023-10-31T07:45:38.621Z",
		"__v": 0
	}
]
 * @example response - 404 - example 404 response
{
	"message": "No attempts found for user with uid 50"
}
 * @example response - 500 - example 500 response
 * {
 *  "message": "Error getting attempts for user with uid 50"
 * }
 */

router.get("/getAttemptsByUserId/:userId", auth.authenticate, historyController.getAttemptsByUserId);

module.exports = router;