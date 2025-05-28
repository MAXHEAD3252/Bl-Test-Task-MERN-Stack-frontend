import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true, // Important for Google OAuth session cookies
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('userToken');
  if (token) req.headers.Authorization = token;
  return req;
});
