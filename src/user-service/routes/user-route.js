const express = require("express");
const router = express.Router();

const userController = require("../controller/user-controller.js");
const authFunctions = require("../utils/auth-functions.js");


/**
 * A User Payload for POST requests
 * @typedef {object} UserPayload
 * @property {string} username - The user's username
 * @property {string} email - The user's email
 * @property {string} password - The user's password
 */

/**
 * A User Payload for PUT requests
 * @typedef {object} UserPutPayload
 * @property {string} username - The user's username
 * @property {string} email - The user's email
 */

/**
 * A User Data Document
 * @typedef {object} UserDocument
 * @property {integer} uid - The user's unique identification number
 * @property {string} username - The user's username
 * @property {string} email - The user's email
 */

/**
 * A Message User Data Document
 * @typedef {object} MessageUserDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {UserDocument} data.user - The user document
 */

/**
 * A Message Users Data Document
 * @typedef {object} MessageUsersDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {array<UserDocument>} data.users - The list of user documnets
 */

/**
 * An error response
 * @typedef {object} ErrorResponse
 * @property {string} message - The error message
 * @property {string} data - The error data which is usually empty.
 */

/**
 * POST /api/register
 * @summary Registers a new user
 * @param {UserPayload} request.body.required - The user's info
 * @return {MessageUserDocument} 201 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example request - example payload
 * {
 *      "username": "jing",
 *      "email": "jing@email.com",
 *      "password": "123"
 * }
 * @example response - 201 - example 201 response
 * {
 *	"message": "User added with ID: 12",
 *	"data": {
 *		"user": {
 *			"uid": 12,
 *			"username": "jing",
 *			"email": "jing@email.com"
 *		}
 *	}
 *}
 * @example response - 401 - example 401 response
{
	"message": "Username or email already exists",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */
router.post("/register", userController.createUser);

/**
 * A Login Payload for POST requests
 * @typedef {object} LoginPayload
 * @property {string} email - The user's email
 * @property {string} password - The user's password
 */

/**
 * POST /api/login
 * @summary Logs the user in.
 * @param {LoginPayload} request.body.required - The user's login info
 * @return {MessageUserDocument} 200 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - aplication/json
 * @example request - example payload
 * {
 *      "email": "jing@email.com",
 *      "password": "123"
 * }
 * @example response - 200 - example 200 response
{
	"message": "User logged in",
	"data": {
		"user": {
			"uid": 12,
			"username": "jing",
			"email": "jing@email.com"
		}
	}
}
 * @example response - 401 - example 401 response
{
	"message": "Password is wrong",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */
router.post("/login", userController.userLogin);

/**
 * GET /api/getUsers
 * @summary Gets a list of all users
 * @return {MessageUsersDocument} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
{
	"message": "Users retrieved",
	"data": {
		"users": [
			{
				"uid": 2,
				"username": "chang",
				"email": "chang@email.com"
			},
			{
				"uid": 4,
				"username": "clevon",
				"email": "clevon@email.com"
			},
			{
				"uid": 5,
				"username": "branda",
				"email": "branda@email.com"
			},
			{
				"uid": 6,
				"username": "ish",
				"email": "ish@email.com"
			},
			{
				"uid": 12,
				"username": "jing",
				"email": "jing@email.com"
			},
            {
				"uid": 14,
				"username": "rachel",
				"email": "rachel@email.com"
			}
		]
	}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */

router.get("/getUsers", authFunctions.authenticateRequest, userController.getUsers);

/**
 * GET /api/getUsers/{id}
 * @summary Gets a single user
 * @param {integer} id.path.required - The user's id
 * @return {MessageUserDocument} 200 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - aplication/json
 * @example response - 200 - example 200 response
{
	"message": "User retrieved",
	"data": {
		"user": {
			"uid": 12,
			"username": "jing",
			"email": "jing@email.com"
		}
	}
}
 * @example response - 401 - example 401 response
{
	"message": "User does not exist",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */

router.get("/getUsers/:id", authFunctions.authenticateRequest, userController.getUser);

/**
 * PUT /api/update/{id}
 * @summary Updates details for a single user
 * @param {integer} id.path.required - The user's id
 * @param {UserPutPayload} request.body.required - The user's update
 * @return {MessageUserDocument} 200 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - aplication/json
 * @example response - 200 - example 200 response
{
	"message": "User modified with ID: 12",
	"data": {
		"user": {
			"uid": 12,
			"username": "jy",
			"email": "jy@email.com"
		}
	}
}
 * @example response - 401 - example 401 response
{
	"message": "User does not exist",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */
router.put("/update/:id", authFunctions.authenticateRequest, userController.updateProfile);

/**
 * DELETE /api/update/{id}
 * @summary Deletes a single user
 * @param {integer} id.path.required - The user's id
 * @return {MessageUserDocument} 200 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - aplication/json
 * @example response - 200 - example 200 response
{
	"message": "User deleted with ID: 12",
	"data": {
		"user": {
			"uid": 12,
			"username": "jy",
			"email": "jy@email.com",
			"password": "123"
		}
	}
}
 * @example response - 401 - example 401 response
{
	"message": "User does not exist",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server errorconnect ETIMEDOUT 18.166.86.175:5432",
	"data": {}
}
 */

router.delete("/delete/:id", authFunctions.authenticateRequest, userController.deleteProfile);

router.get("/verifyToken", authFunctions.authenticateToken);

module.exports = router;