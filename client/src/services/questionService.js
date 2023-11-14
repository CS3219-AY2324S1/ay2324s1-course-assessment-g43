import axios from "axios";

const basePath =
  import.meta.env.VITE_QUESTION_BASE_PATH ||
  "http://question-service:3000/api/questions";

export const createQuestion = async (req) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}`, req, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllQuestions = async () => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${basePath}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  return res;
};

export const getQuestionById = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getRandomQuestionByComplexity = async (complexity) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/random?complexity=${complexity}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error getting questionId:", error.message);
    return null;
  }
};

export const getFreshRandomQuestionByComplexity = async (complexity, currentId) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/random?complexity=${complexity}&currentId=${currentId}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log("Error getting questionId:", error.message);
    return null;
  }
}

export const updateQuestionById = async (id, req) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.put(`${basePath}/${id}`, req, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  return res;
};

export const deleteQuestionById = async (id) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  return res;
};
