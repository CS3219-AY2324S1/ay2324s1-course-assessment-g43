import axios from "axios";

const basePath =
  import.meta.env.VITE_USER_BASE_PATH || "http://34.87.120.150:30000/api";

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
  console.log(res);
  return res;
};

export const register = async (req) => {
  const res = await axios.post(`${basePath}/register`, req);
  console.log(res);
  return res;
};

export const login = async (req) => {
  const res = await axios.post(`${basePath}/login`, req);
  console.log(res);
  return res.data;
};

export const logout = async (req) => {
  const res = await axios.post(`${basePath}/logout`, req);
  console.log(res);
  return res;
};

export const updateUser = async (id, req) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.put(`${basePath}/update/${id}`, req, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  return res;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/delete/${id}`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  localStorage.removeItem("jwt");
  return res;
};
