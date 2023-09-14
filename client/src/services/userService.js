import axios from "axios";

const basePath = "/api";

export const getUserById = async (id) => {
  try {
    const res = axios.get(`${basePath}/getUsers/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const updateUser = async (id, req) => {
  try {
    const url = `${basePath}/update/${id}`;
    const res = axios.put(url, req);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const deleteUser = async (id) => {
  try {
    const res = axios.delete(`${basePath}/delete/${id}`);
    console.log(res);
    return res;
  } catch (err) {
    console.log(err);
  }
};
