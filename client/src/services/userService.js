import axios from "axios";

const basePath = "http://localhost:5000/api";

export const getUserById = async (id) => {
  const res = await axios.get(`${basePath}/getUsers/${id}`);
  return res.data.data;
};

export const getAllUsers = async () => {
  const res = await axios.get(`${basePath}/getUsers`);
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
  const res = await axios.put(`${basePath}/update/${id}`, req);
  console.log(res);
  return res;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${basePath}/delete/${id}`);
  return res;
};
