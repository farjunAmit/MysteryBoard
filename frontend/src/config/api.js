// src/api/config.js
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export const API_PATHS = {
  auth: "/api/auth",                    // auth (register, login)
  scenarios: "/api/scenarios",          // admin
  sessions: "/api/sessions",            // admin
  clientSessions: "/api/client/sessions", // client
};
