import axios from "../../../config/axios.js";


export const loginAPI = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  return response.data;
};

export const registerAPI = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const refreshAccessTokenAPI = async (refreshToken) => {
  const response = await axios.post('/auth/refresh-token', { refreshToken });
  return response.data;
};

export const logoutAPI = async (refreshToken) => {
  const response = await axios.post('/auth/logout', { refreshToken });
  return response.data;
};

// user API

export const getUserAPI = async () => {
  const response = await axios.get('/user/me');
  return response.data;
};

export const updateUserAPI = async (userData) => {
  const response = await axios.put('/users/me', userData);
  return response.data;
};

export const getUserIdAPI = async (userId) => {
  const response = await axios.get(`/users/${userId}`);
  return response.data;
};
