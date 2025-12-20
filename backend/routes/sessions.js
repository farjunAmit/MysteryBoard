const express = require("express");
const router = express.Router();

const Scenario = require("../models/Scenario");
const GameSession = require("../models/GameSession");
const { assertPhase, assertTransition } = require("../utils/sessionPhase");

// POST /api/sessions
router.post("/", async (req, res) => {
  try {
    const { scenarioId } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ message: "scenarioId is required" });
    }

    const scenario = await Scenario.findById(scenarioId);
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    const mandatory = (scenario.characters || []).filter((c) => c.required);

    const playerCount = mandatory.length;

    const slots = mandatory.map((c, idx) => ({
      slotIndex: idx,
      characterId: c._id,
      photoUrl: null,
    }));

    const session = await GameSession.create({
      scenarioId: scenario._id,
      phase: "setup",
      playerCount,
      slots,
    });

    return res.status(201).json(session);
  } catch (err) {
    console.error("Create session error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/sessions/:id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const session = await GameSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    return res.json(session);
  } catch (err) {
    console.error("Get session error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/sessions/:id/slots/:slotIndex
router.patch("/:id/slots/:slotIndex", async (req, res) => {
  try {
    const { id, slotIndex } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ message: "photoUrl is required" });
    }

    const session = await GameSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const idx = Number(slotIndex);
    if (Number.isNaN(idx) || idx < 0 || idx >= session.slots.length) {
      return res.status(400).json({ message: "Invalid slotIndex" });
    }
    if (assertPhase(session, ["setup"], res)) return;

    session.slots[idx].photoUrl = photoUrl;
    await session.save();

    return res.json(session);
  } catch (err) {
    console.error("Update slot photo error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/:id/phase
router.post("/:id/phase", async (req, res) => {
  try {
    const { id } = req.params;
    const { phase } = req.body;

    const allowed = ["setup", "reveal", "running", "ended"];
    if (!allowed.includes(phase)) {
      return res.status(400).json({ message: "Invalid phase" });
    }

    const session = await GameSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (assertTransition(session, phase, res)) return;

    session.phase = phase;
    await session.save();
    return res.json(session);
  } catch (err) {
    console.error("Update phase error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/:id/events/trait
router.post("/:id/events/trait", async (req, res) => {
  try {
    const id = req.params.id;
    const { characterId, text } = req.body;

    if (!characterId || !text) {
      return res
        .status(400)
        .json({ message: "characterId and text are required" });
    }

    const session = await GameSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (assertPhase(session, ["running"], res)) return;

    session.events.push({
      type: "trait_revealed",
      characterId,
      text,
    });

    await session.save();
    return res.json(session);
  } catch (err) {
    console.error("Add trait event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/:id/chat
router.post("/:id/chat", async (req, res) => {
  try {
    const id = req.params.id;
    const text = req.body.text;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "text is required" });
    }

    const session = await GameSession.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (assertPhase(session, ["reveal", "running"], res)) return;

    session.events.push({
      type: "chat",
      text,
    });
    await session.save();
    return res.json(session);
  } catch (err) {
    console.error("Add chat error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/:id/end
router.post("/:id/end", async (req, res) => {
  try {
    const { id } = req.params;

    const session = await GameSession.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (assertTransition(session, "ended", res)) return;

    session.phase = "ended";
    await session.save();

    return res.json(session);
  } catch (err) {
    console.error("End session error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
