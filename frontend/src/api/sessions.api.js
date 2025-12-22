import { http } from "./http";
import { API_PATHS } from "../config/api";

export const SessionsApi = {
  getById(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}`);
  },

  create(scenarioId) {
    return http(API_PATHS.sessions, {
      method: "POST",
      body: JSON.stringify({ scenarioId }),
    });
  },
};
