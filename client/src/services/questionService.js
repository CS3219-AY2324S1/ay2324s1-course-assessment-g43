import axios from "axios";

const basePath = "http://localhost:3000/api/questions";

export const createQuestion = async (req) => {
  try {
    const res = await axios.post(`${basePath}`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllQuestions = async () => {
  try {
    const res = await axios.get(`${basePath}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getQuestionById = async (id) => {
  try {
    const res = await axios.get(`${basePath}/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateQuestionById = async (id, req) => {
  try {
    const res = await axios.put(`${basePath}/${id}`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteQuestionById = async (id) => {
  try {
    const res = await axios.delete(`${basePath}/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
