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

  getFullById(id) {
    return http(`${API_PATHS.sessions}/${id}/full`);
  },

  addSlot(sessionId, characterId) {
    return http(`${API_PATHS.sessions}/${sessionId}/slots`, {
      method: "POST",
      body: JSON.stringify({ characterId }),
    });
  },
};
