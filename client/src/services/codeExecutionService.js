import axios from "axios";

const basePath =
  import.meta.env.VITE_CODE_EXECUTION_BASE_PATH || "http://localhost:5002/api";

export const createSubmission = async (req) => {
  try {
    console.log(req);
    const jwt = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}/createSubmission`, req, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getSubmissionResult = async (token) => {
  try {
    const jwt = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/getSubmissionResult/${token}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
