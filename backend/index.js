require("dotenv").config();
const scenariosRouter = require("./routes/scenarios");
const sessionsRouter = require("./routes/sessions");
const clientSessionsRouter = require("./routes/clientSessions");
const authRoutes = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/api/scenarios", scenariosRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/client/sessions",clientSessionsRouter);
app.use("/api/auth", authRoutes);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend 🧩" });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB or server connection error:", err);
    process.exit(1);
  }
}

startServer();
