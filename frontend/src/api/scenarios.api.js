import { http } from "./http";
import { API_PATHS } from "../config/api";

export const ScenariosApi = {
  getAll() {
    return http(API_PATHS.scenarios); 
  },

  create(payload) {
    return http(API_PATHS.scenarios, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return http(`${API_PATHS.scenarios}/${id}`, {
      method: "DELETE",
    });
  },
};
