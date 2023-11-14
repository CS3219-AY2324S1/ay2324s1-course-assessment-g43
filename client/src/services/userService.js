import axios from "axios";

const basePath =
  import.meta.env.VITE_USER_BASE_PATH || "http://user-service:8000/api";

export const getUserById = async (id) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${basePath}/getUsers/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};

export const getAllUsers = async () => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${basePath}/getUsers`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const register = async (req) => {
  const res = await axios.post(`${basePath}/register`, req);
  return res;
};

export const login = async (req) => {
  const res = await axios.post(`${basePath}/login`, req);
  return res.data;
};

export const logout = async (req) => {
  const res = await axios.post(`${basePath}/logout`, req);
  return res;
};

export const updateUser = async (id, req) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.put(`${basePath}/update/${id}`, req, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  return res;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/delete/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  localStorage.removeItem("jwt");
  return res;
};
