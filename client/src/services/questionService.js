import axios from "axios";

const basePath = "http://localhost:3000/api/questions";

export const createQuestion = async (req) => {
  const res = await axios.post(`${basePath}`, req);
  console.log(res);
  return res;
};

export const getAllQuestions = async () => {
  const res = await axios.get(`${basePath}`);
  console.log(res);
  return res;
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

export const getRandomQuestionByComplexity = async (complexity) => {
  try {
    const res = await axios.get(
      `${basePath}/random?complexity=${complexity}`
    );
    return res.data;
  } catch (error) {
    console.log("Error getting questionId:", error.message);
    return null;
  }
}

export const updateQuestionById = async (id, req) => {
  const res = await axios.put(`${basePath}/${id}`, req);
  console.log(res);
  return res;
};

export const deleteQuestionById = async (id) => {
  const res = await axios.delete(`${basePath}/${id}`);
  console.log(res);
  return res;
};
