const express = require("express");
const router = express.Router();

const GameSession = require("../models/GameSession");

// GET /api/client/sessions/by-code/:joinCode
router.get("/by-code/:joinCode", async (req, res) => {
  try {
    const { joinCode } = req.params;

    const session = await GameSession.findOne({ joinCode });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({
      _id: session._id,
      phase: session.phase,
      scenarioId: session.scenarioId,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/client/sessions/:id/state
router.get("/:id/state", async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({
      phase: session.phase,
      slots: session.slots,
      revealedEvents: session.revealedEvents || [],
      chat: session.chat || [],
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
