import { http } from "./http";
import { API_PATHS } from "../config/api";

export const ClientSessionsApi = {
  getByJoinCode(joinCode) {
    return http(`${API_PATHS.clientSessions}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ joinCode }),
    });
  },

  getState(sessionId) {
    return http(`${API_PATHS.clientSessions}/${sessionId}/state`);
  },
};
