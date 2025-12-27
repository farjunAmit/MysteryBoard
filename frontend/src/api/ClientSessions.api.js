import { http } from "./http";
import { API_PATHS } from "./config";

export const ClientSessionsApi = {
  async getByJoinCode(joinCode) {
    const { data } = await http.get(
      `${API_PATHS.clientSessions}/by-code/${joinCode}`
    );
    return data;
  },

  async getState(sessionId) {
    const { data } = await http.get(
      `${API_PATHS.clientSessions}/${sessionId}/state`
    );
    return data;
  },
};
