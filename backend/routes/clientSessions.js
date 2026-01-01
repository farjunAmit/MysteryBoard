const express = require("express");
const router = express.Router();
const Scenario = require("../models/Scenario");
const GameSession = require("../models/GameSession");

// GET /api/client/sessions/:id/state
router.get("/:id/state", async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const scenario = await Scenario.findById(session.scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const scenarioChars = scenario.characters || [];

    // Build "characters" payload based on session.slots + scenario.characters
    const characters = (session.slots || []).map((slot) => {
      const found = scenarioChars.find(
        (c) => String(c._id) === String(slot.characterId)
      );

      return {
        id: String(slot.characterId),
        name: found?.name || "Unknown",
        traits: found?.traits || [],
        required: Boolean(found?.required),
        photoUrl: slot.photoUrl || null,
        slotIndex: slot.slotIndex,
      };
    });

    return res.json({
      phase: session.phase,
      revealMode: session.reveal?.mode || "slow",
      revealedCount: session.reveal?.revealedCount ?? 0,
      characters,
    });
  } catch (err) {
    console.error("Client session state error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/client/sessions/join
router.post("/join", async (req, res) => {
  try {
    const { joinCode } = req.body;
    if (!joinCode || !String(joinCode).trim()) {
      return res.status(400).json({ message: "joinCode is required" });
    }

    const session = await GameSession.findOne({ joinCode: String(joinCode).trim() });
    if (!session) {
      return res.status(404).json({ message: "Invalid join code or session not available" });
    }

    return res.json({ sessionId: session._id.toString() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
});
module.exports = router;
