import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from "../config/env";

export const TOKEN_KEY = "skyntrix_admin_token";

export const getToken = () => SecureStore.getItemAsync(TOKEN_KEY);
export const setToken = (token) => SecureStore.setItemAsync(TOKEN_KEY, token);
export const clearToken = () => SecureStore.deleteItemAsync(TOKEN_KEY);

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Set by AuthContext so a 401 can force a logout from anywhere in the app.
let onUnauthorized = null;
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    const status = error.response?.status;
    const isLogin = error.config?.url?.includes("/auth/login");
    if (status === 401 && !isLogin) onUnauthorized?.();
    const msg = error.response?.data?.message || error.message || "Request failed.";
    return Promise.reject(new Error(msg));
  }
);

const withHeaders = (data, extra = {}) => {
  const isForm = typeof FormData !== "undefined" && data instanceof FormData;
  return {
    ...(isForm ? { "Content-Type": "multipart/form-data" } : {}),
    ...extra,
  };
};

export const adminGet = (url, params) => api.get(url, { params });
export const adminPost = (url, data) => api.post(url, data, { headers: withHeaders(data) });
export const adminPut = (url, data) => api.put(url, data, { headers: withHeaders(data) });
export const adminDelete = (url) => api.delete(url);

export default api;
