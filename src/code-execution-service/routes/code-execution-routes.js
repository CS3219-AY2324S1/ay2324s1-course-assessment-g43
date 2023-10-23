const express = require("express");
const router = express.Router();

const codeExecutionController = require("../controller/code-execution-controller.js");

/**
 * A Language Data Document
 * @typedef {object} LanguageDocument
 * @property {string} id - The ID of the language
 * @property {string} name - The name of the language
 */

/**
 * A Message Languages Data Document
 * @typedef {object} MessageLanguagesDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {array<LanguageDocument>} data.languages - The list of languages documents
 */

/**
 * An error response
 * @typedef {object} ErrorResponse
 * @property {string} message - The error message
 * @property {string} data - The error data which is usually empty.
 */

/**
 * GET /api/getLanguages
 * @summary Gets a list of all languages and corresponding id
 * @return {MessageLanguagesDocument} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
{
	"message": "Languages retrieved",
	"data": {
		"languages": [
			{
				"id": 45,
				"name": "Assembly (NASM 2.14.02)"
			},
			{
				"id": 46,
				"name": "Bash (5.0.0)"
			},
			{
				"id": 47,
				"name": "Basic (FBC 1.07.1)"
			},
			{
				"id": 75,
				"name": "C (Clang 7.0.1)"
			},
			{
				"id": 76,
				"name": "C++ (Clang 7.0.1)"
			},
			{
				"id": 48,
				"name": "C (GCC 7.4.0)"
			},
			{
				"id": 52,
				"name": "C++ (GCC 7.4.0)"
			},
			{
				"id": 49,
				"name": "C (GCC 8.3.0)"
			},
			{
				"id": 53,
				"name": "C++ (GCC 8.3.0)"
			},
			{
				"id": 50,
				"name": "C (GCC 9.2.0)"
			},
			{
				"id": 54,
				"name": "C++ (GCC 9.2.0)"
			},
			{
				"id": 86,
				"name": "Clojure (1.10.1)"
			},
			{
				"id": 51,
				"name": "C# (Mono 6.6.0.161)"
			},
			{
				"id": 77,
				"name": "COBOL (GnuCOBOL 2.2)"
			},
			{
				"id": 55,
				"name": "Common Lisp (SBCL 2.0.0)"
			},
			{
				"id": 90,
				"name": "Dart (2.19.2)"
			},
			{
				"id": 56,
				"name": "D (DMD 2.089.1)"
			},
			{
				"id": 57,
				"name": "Elixir (1.9.4)"
			},
			{
				"id": 58,
				"name": "Erlang (OTP 22.2)"
			},
			{
				"id": 44,
				"name": "Executable"
			},
			{
				"id": 87,
				"name": "F# (.NET Core SDK 3.1.202)"
			},
			{
				"id": 59,
				"name": "Fortran (GFortran 9.2.0)"
			},
			{
				"id": 60,
				"name": "Go (1.13.5)"
			},
			{
				"id": 95,
				"name": "Go (1.18.5)"
			},
			{
				"id": 88,
				"name": "Groovy (3.0.3)"
			},
			{
				"id": 61,
				"name": "Haskell (GHC 8.8.1)"
			},
			{
				"id": 91,
				"name": "Java (JDK 17.0.6)"
			},
			{
				"id": 62,
				"name": "Java (OpenJDK 13.0.1)"
			},
			{
				"id": 63,
				"name": "JavaScript (Node.js 12.14.0)"
			},
			{
				"id": 93,
				"name": "JavaScript (Node.js 18.15.0)"
			},
			{
				"id": 78,
				"name": "Kotlin (1.3.70)"
			},
			{
				"id": 64,
				"name": "Lua (5.3.5)"
			},
			{
				"id": 89,
				"name": "Multi-file program"
			},
			{
				"id": 79,
				"name": "Objective-C (Clang 7.0.1)"
			},
			{
				"id": 65,
				"name": "OCaml (4.09.0)"
			},
			{
				"id": 66,
				"name": "Octave (5.1.0)"
			},
			{
				"id": 67,
				"name": "Pascal (FPC 3.0.4)"
			},
			{
				"id": 85,
				"name": "Perl (5.28.1)"
			},
			{
				"id": 68,
				"name": "PHP (7.4.1)"
			},
			{
				"id": 43,
				"name": "Plain Text"
			},
			{
				"id": 69,
				"name": "Prolog (GNU Prolog 1.4.5)"
			},
			{
				"id": 70,
				"name": "Python (2.7.17)"
			},
			{
				"id": 92,
				"name": "Python (3.11.2)"
			},
			{
				"id": 71,
				"name": "Python (3.8.1)"
			},
			{
				"id": 80,
				"name": "R (4.0.0)"
			},
			{
				"id": 72,
				"name": "Ruby (2.7.0)"
			},
			{
				"id": 73,
				"name": "Rust (1.40.0)"
			},
			{
				"id": 81,
				"name": "Scala (2.13.2)"
			},
			{
				"id": 82,
				"name": "SQL (SQLite 3.27.2)"
			},
			{
				"id": 83,
				"name": "Swift (5.2.3)"
			},
			{
				"id": 74,
				"name": "TypeScript (3.7.4)"
			},
			{
				"id": 94,
				"name": "TypeScript (5.0.3)"
			},
			{
				"id": 84,
				"name": "Visual Basic.Net (vbnc 0.0.0.5943)"
			}
		]
	}
}
 * @example response - 500 - example 500 response
{
	"message": "Server error connect ECONNREFUSED 127.0.0.1:80",
	"data": {}
}
 */
router.get("/getLanguages", codeExecutionController.getLanguages);

/**
 * A Message Language Data Document
 * @typedef {object} MessageLanguageDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {LanguageDocument} data.language - The corresponding language document
 */

/**
 * GET /api/getLanguage/{id}
 * @summary Gets corresponding language
 * @param {integer} id.path.required - The language id
 * @return {MessageLanguageDocument} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
 * {
	"message": "Language retrieved",
	"data": {
		"language": {
			"id": 71,
			"name": "Python (3.8.1)",
			"is_archived": false,
			"source_file": "script.py",
			"compile_cmd": null,
			"run_cmd": "/usr/local/python-3.8.1/bin/python3 script.py"
		}
	}
}
* @example response - 500 - example 500 response
{
	"message": "Server error connect ECONNREFUSED 127.0.0.1:80",
	"data": {}
}
*/
router.get("/getLanguage/:id", codeExecutionController.getLanguage);

/**
 * A Status Data Document
 * @typedef {object} StatusDocument
 * @property {string} id - The ID of status
 * @property {string} description - The description of status
 */

/**
 * A Message Status Data Document
 * @typedef {object} MessageStatusesDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {array<StatusDocument>} data.statuses - The list of status documents
 */

/**
 * GET /api/getStatuses
 * @summary Gets a list of all status id and corresponding description
 * @return {MessageStatusesDocument} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example response - 200 - example 200 response
{
	"message": "Statuses retrieved",
	"data": {
		"Statuses": [
			{
				"id": 1,
				"description": "In Queue"
			},
			{
				"id": 2,
				"description": "Processing"
			},
			{
				"id": 3,
				"description": "Accepted"
			},
			{
				"id": 4,
				"description": "Wrong Answer"
			},
			{
				"id": 5,
				"description": "Time Limit Exceeded"
			},
			{
				"id": 6,
				"description": "Compilation Error"
			},
			{
				"id": 7,
				"description": "Runtime Error (SIGSEGV)"
			},
			{
				"id": 8,
				"description": "Runtime Error (SIGXFSZ)"
			},
			{
				"id": 9,
				"description": "Runtime Error (SIGFPE)"
			},
			{
				"id": 10,
				"description": "Runtime Error (SIGABRT)"
			},
			{
				"id": 11,
				"description": "Runtime Error (NZEC)"
			},
			{
				"id": 12,
				"description": "Runtime Error (Other)"
			},
			{
				"id": 13,
				"description": "Internal Error"
			},
			{
				"id": 14,
				"description": "Exec Format Error"
			}
		]
	}
}
 *  @example response - 500 - example 500 response
{
	"message": "Server error connect ECONNREFUSED 127.0.0.1:80",
	"data": {}
}
*/
router.get("/getStatuses", codeExecutionController.getStatuses);

/**
 * A Submission Data Document
 * @typedef {object} SubmissionDocument
 * @property {string} token - The submission token
 */

/**
 * A Message Submission Data Document
 * @typedef {object} MessageSubmissionDocument
 * @property {string} message - The message of the response
 * @property {string} data - The data
 * @property {SubmissionDocument} data.token - The submission token
 */

/**
 * A Submission Payload for POST requests
 * @typedef {object} SubmissionPayload
 * @property {string} language_id - Id of the language of the source code
 * @property {string} source_code - Source code for compilation
 * @property {string} stdin - Input for source code
 * @property {string} expectedOutput - 	Expected output of program
 */

/**
 * POST /api/createSubmission
 * @summary Creates a submission for compilation of source code
 * @param {SubmissionPayload} request.body.required - The code information
 * @return {MessageSubmissionDocument} 200 - success response - application/json
 * @return {ErrorResponse} 401 - unauthorized response - application/json
 * @return {ErrorResponse} 500 - error response - aplication/json
 * @example request - example payload
 {
  "language_id": "71",
  "source_code": "print(input())",
  "stdin": "this is the input"
}
 * @example response - 200 - example 200 response
{
	"message": "Successful submission",
	"data": {
		"token": "8575239f-d4bd-4193-a95a-1f1a5d46425c"
	}
}
 * @example response - 401 - example 401 response
{
	"message": "Language ID, source code, stdin and expected output are necessary for a submission.",
	"data": {}
}
 * @example response - 500 - example 500 response
{
	"message": "Server error connect ECONNREFUSED 127.0.0.1:80",
	"data": {}
}
 */
router.post("/createSubmission", codeExecutionController.createSubmission);

/**
 * A Submission Result Payload for POST requests
 * @typedef {object} SubmissionResultPayload
 * @property {string} token - The submission token
 */

/**
 * A Submission Result Data Document
 * @typedef {object} SubmissionResultDocument
 * @property {string} expectedOutput - 	Expected output of program
 * @property {string} stdOut - Standard output of the program after execution
 * @property {string} stderr - Standard error of the program after execution
 * @property {string} status - Submission Status
 */

/**
 * A Message Submission Result Data Document
 * @typedef {object} MessageSubmissionResultDocument
 * @property {string} message - The message of the response
 * @property {SubmissionResultDocument} data - The relavant data
 */

/**
 * GET /api/getSubmissionResult
 * @summary Gets relevant data from submission result
 * @param {SubmissionResultPayload} request.body.required - The submission token
 * @return {MessageSubmissionResultDocument} 200 - success response - application/json
 * @return {ErrorResponse} 500 - error response - application/json
 * @example request - example payload
{
	"token": "79143ebf-18f9-468d-bb40-6a1fa1d3bf98"
}
 * @example response - 200 - example 200 response
{
	"message": "Successful retrieval of submission",
	"data": {
		"expected_output": "123\nthis is the input\n",
		"stdout": "123\nthis is the input\n",
		"stderr": null,
		"status": {
			"id": 3,
			"description": "Accepted"
		}
	}
}
 * @example response - 401 - example 401 response
{
	"message": "A submission token is required to retrieve results.",
	"data": {}
}
* @example response - 500 - example 500 response
{
	"message": "Server error connect ECONNREFUSED 127.0.0.1:80",
	"data": {}
}
*/

router.get("/getSubmissionResult", codeExecutionController.getSubmissionResult);

module.exports = router;