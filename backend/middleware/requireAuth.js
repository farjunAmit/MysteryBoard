const { verifyToken } = require("../utils/jwt");

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || ""; // "Bearer xxx"
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
