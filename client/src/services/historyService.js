import axios from "axios";

const basePath =
  import.meta.env.VITE_HISTORY_BASE_PATH || "http://localhost:3001/api";

export const createAttempt = async (req) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}/createAttempt`, req, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAttemptsByUserId = async (id) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.get(`${basePath}/getAttemptsByUserId/${id}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (err) {
    console.log(err);
  }
};
