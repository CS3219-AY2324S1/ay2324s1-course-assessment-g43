import axios from "axios";

const basePath = "http://localhost:8001/api/session";

export const createSession = async (req) => {
  try {
    const token = localStorage.getItem("jwt");
    const res = await axios.post(`${basePath}`, req, {
      headers: {
        authorization:`Bearer ${token}`,
      }
    });
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};