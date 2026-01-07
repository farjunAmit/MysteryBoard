import { http, httpAuth, httpAuthFormData } from "./http";
import { API_PATHS } from "../config/api";

export const SessionsApi = {
  getById(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}`);
  },

  getAll() {
    return httpAuth(`${API_PATHS.sessions}/all`);
  },

  create(scenarioId) {
    return httpAuth(API_PATHS.sessions, {
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
  start(sessionId, mode) {
    return http(`${API_PATHS.sessions}/${sessionId}/start`, {
      method: "POST",
      body: JSON.stringify({ mode }),
    });
  },

  revealTrait(sessionId, characterId, text) {
    return http(`${API_PATHS.sessions}/${sessionId}/events/trait`, {
      method: "POST",
      body: JSON.stringify({ characterId, text }),
    });
  },

  addChat(sessionId, text) {
    return http(`${API_PATHS.sessions}/${sessionId}/chat`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
  },

  end(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}/end`, {
      method: "POST",
    });
  },

  delete(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}`, {
      method: "DELETE",
    });
  },
  clearChat(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}/chat/clear`, {
      method: "POST",
    });
  },
  uploadSlotPhoto(sessionId, slotIndex, file) {
    const fd = new FormData();
    fd.append("file", file);

    return httpAuthFormData(
      `${API_PATHS.sessions}/${sessionId}/slots/${slotIndex}/photo/upload`,
      fd
    );
  },

  getPhotoStatus(sessionId) {
    return http(`${API_PATHS.sessions}/${sessionId}/photos/status`);
  },
};
