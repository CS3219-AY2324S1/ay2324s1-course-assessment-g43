import axios from "axios";

const basePath = "http://localhost:5002/api";

export const createSubmission = async(req) => {
  console.log(req);
  const res = await axios.post(`${basePath}/createSubmission`, req, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log(res);
  return res;
};

export const getSubmissionResult = async(token) => {
  const res = await axios.get(`${basePath}/getSubmissionResult/${token}`);
  console.log(res);
  return res;
};