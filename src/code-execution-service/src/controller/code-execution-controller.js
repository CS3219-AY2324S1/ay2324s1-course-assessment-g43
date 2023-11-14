const axios = require("axios");
require("dotenv").config({ path: `.env.${process.env.PEERPREP_ENV}` });

const baseURL = process.env.REACT_APP_RAPID_API_URL;
const host = process.env.REACT_APP_RAPID_API_HOST;
const key = process.env.REACT_APP_RAPID_API_KEY;

exports.getLanguages = async (req, res) => {
  const options = {
    method: "GET",
    url: baseURL + "/languages",
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      message: "Languages retrieved",
      data: { languages: response.data },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error " + error.message,
      data: {},
    });
  }
};

exports.getLanguage = async (req, res) => {
  const id = parseInt(req.params.id);

  const options = {
    method: "GET",
    url: baseURL + "/languages/" + id,
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      message: "Language retrieved",
      data: { language: response.data },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error " + error.message,
      data: {},
    });
  }
};

exports.getStatuses = async (req, res) => {
  const options = {
    method: "GET",
    url: baseURL + "/statuses",
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      message: "Statuses retrieved",
      data: { Statuses: response.data },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error " + error.message,
      data: {},
    });
  }
};

exports.createSubmission = async (req, res) => {
  const { language_id, source_code } = req.body;

  // if (!language_id || !source_code || !stdin) {
  if (!language_id || !source_code) {
    return res.status(400).json({
      message: "Language ID and source code are necessary for a submission.",
      data: {},
    });
  }

  // Encode the source code as a base64 string
  const base64SourceCode = Buffer.from(source_code).toString("base64");

  const options = {
    method: "POST",
    url: baseURL + "/submissions",
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
    data: {
      source_code: base64SourceCode,
      language_id: language_id,
    },
  };

  try {
    const response = await axios.request(options);

    return res.status(200).json({
      message: "Successful submission",
      data: { token: response.data.token },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error " + error.message,
      data: {},
    });
  }
};

exports.getSubmissionResult = async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.status(400).json({
      message: "A submission token is required to retrieve results.",
      data: {},
    });
  }
  const options = {
    method: "GET",
    url: baseURL + "/submissions/" + token,
    params: {
      base64_encoded: "true",
      fields: "*",
    },
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": host,
    },
  };

  try {
    const response = await axios.request(options);

    let stdout = response.data.stdout;
    if (stdout) {
      stdout = Buffer.from(stdout, "base64").toString("utf-8");
    }
    let stderr = response.data.stderr;
    if (stderr) {
      stderr = Buffer.from(stderr, "base64").toString("utf-8");
    }
    const status = response.data.status;
    return res.status(200).json({
      message: "Successful retrieval of submission",
      data: {
        stdout,
        stderr,
        status,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Server error " + error.message,
      data: {},
    });
  }
};
