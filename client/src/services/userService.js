import axios from "axios";

const basePath = "http://localhost:5000/api";

export const getUserById = async (id) => {
  try {
    const res = await axios.get(`${basePath}/getUsers/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${basePath}/getUsers`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const register = async (req) => {
  try {
    const res = await axios.post(`${basePath}/register`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req) => {
  try {
    const res = await axios.post(`${basePath}/login`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const logout = async (req) => {
  try {
    const res = await axios.post(`${basePath}/logout`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (id, req) => {
  try {
    const res = await axios.put(`${basePath}/update/${id}`, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = await axios.delete(`${basePath}/delete/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
