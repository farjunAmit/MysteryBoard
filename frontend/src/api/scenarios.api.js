import { httpAuth } from "./http";
import { API_PATHS } from "../config/api";

export const ScenariosApi = {
  getAll() {
    return httpAuth(API_PATHS.scenarios); 
  },

  create(payload) {
    return httpAuth(API_PATHS.scenarios, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  remove(id) {
    return httpAuth(`${API_PATHS.scenarios}/${id}`, {
      method: "DELETE",
    });
  },
};
