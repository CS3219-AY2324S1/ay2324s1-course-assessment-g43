import axios from "axios";

const basePath = "http://localhost:5000/api";

export const getUserById = async (id) => { //functions called by user? need to authenticate or not? if not called by user wont have token
  const res = await axios.get(`${basePath}/getUsers/${id}`);
  return res.data.data;
};

export const getAllUsers = async () => { //functions called by user? need to authenticate or not? if not called by user wont have token
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

export const logout = async (req) => { //api not called in function??? check with team //navbar directly toggle to landing page
  // const token = localStorage.getItem("jwt");
  // console.log("retrieved logout token"); //delete
  const res = await axios.post(`${basePath}/logout`, req, //{
  //   headers: {
  //     authorization:`Bearer ${token}`,
  //   }
  // }
  );
  console.log(res);
  // localStorage.removeItem("jwt");
  return res;
};

export const updateUser = async (id, req) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.put(`${basePath}/update/${id}`, req, {
    headers: {
      authorization:`Bearer ${token}`,
    }
  });
  console.log(res);
  return res;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.delete(`${basePath}/delete/${id}`, {
    headers: {
      authorization:`Bearer ${token}`,
    }
  });
  console.log(res);
  localStorage.removeItem("jwt");
  return res;
};
