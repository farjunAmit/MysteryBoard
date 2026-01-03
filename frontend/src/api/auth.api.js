import { http } from "./http";
import { API_PATHS } from "../config/api";

export const AuthApi = {
  login(payload) {
    return http(`${API_PATHS.auth}/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  register(payload) {
    return http(`${API_PATHS.auth}/register`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};