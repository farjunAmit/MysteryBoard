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

// GET /api/sessions/:id/full  (session + scenario)
router.get("/:id/full", async (req, res) => {
  try {
    const id = req.params.id;

    const session = await GameSession.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const scenario = await Scenario.findById(session.scenarioId);
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

    return res.json({ session, scenario });
  } catch (err) {
    console.error("Get session full error:", err);
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

// POST /api/sessions/:id/slots  (add a character to session slots)
router.post("/:id/slots", async (req, res) => {
  try {
    const { id } = req.params;
    const { characterId } = req.body;

    if (!characterId) {
      return res.status(400).json({ message: "characterId is required" });
    }

    const session = await GameSession.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (assertPhase(session, ["setup"], res)) return;

    const scenario = await Scenario.findById(session.scenarioId);
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });

    const char = (scenario.characters || []).find(
      (c) => String(c._id) === String(characterId)
    );
    if (!char) {
      return res.status(400).json({ message: "characterId not in scenario" });
    }

    // prevent duplicates
    const alreadyPicked = (session.slots || []).some(
      (s) => String(s.characterId) === String(characterId)
    );
    if (alreadyPicked) {
      return res.status(400).json({ message: "Character already in session" });
    }

    // only optional can be added (mandatory are already there)
    if (char.required) {
      return res
        .status(400)
        .json({ message: "Mandatory character already included" });
    }

    const nextIndex = session.slots.length;
    session.slots.push({
      slotIndex: nextIndex,
      characterId: char._id,
      photoUrl: null,
    });

    session.playerCount = session.slots.length;

    await session.save();
    return res.json(session);
  } catch (err) {
    console.error("Add slot error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/sessions/:id/start
router.post("/:id/start", async (req, res) => {
  try {
    const { id } = req.params;
    const { mode } = req.body; // "fast" | "slow"

    if (!["fast", "slow"].includes(mode)) {
      return res.status(400).json({
        error: "INVALID_MODE",
        message: "mode must be 'fast' or 'slow'",
      });
    }

    const session = await GameSession.findById(id);
    if (!session) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Session not found" });
    }

    const phaseErr = assertPhase(session, ["setup"], res);
    if (phaseErr) return;

    const transitionErr = assertTransition(session, "reveal", res);
    if (transitionErr) return;

    session.phase = "reveal";
    session.reveal = session.reveal || {};
    session.reveal.mode = mode;

    const total = (session.slots || []).length;
    session.reveal.revealedCount = mode === "fast" ? total : 0;

    await session.save();
    return res.json(session);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: err.message });
  }
});

// POST /api/sessions/:id/reveal/next
router.post("/:id/reveal/next", async (req, res) => {
  try {
    const { id } = req.params;

    const session = await GameSession.findById(id);
    if (!session) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Session not found" });
    }

    const phaseErr = assertPhase(session, ["reveal"], res);
    if (phaseErr) return;

    if (session.reveal?.mode !== "slow") {
      return res.status(409).json({
        error: "INVALID_REVEAL_MODE",
        message: "Reveal next is allowed only in slow mode",
        mode: session.reveal?.mode ?? null,
      });
    }

    const total = (session.slots || []).length;
    const curr = session.reveal?.revealedCount ?? 0;
    session.reveal.revealedCount = Math.min(curr + 1, total);

    await session.save();
    return res.json(session);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: err.message });
  }
});

// POST /api/sessions/:id/reveal/complete
router.post("/:id/reveal/complete", async (req, res) => {
  try {
    const { id } = req.params;

    const session = await GameSession.findById(id);
    if (!session) {
      return res
        .status(404)
        .json({ error: "NOT_FOUND", message: "Session not found" });
    }

    const phaseErr = assertPhase(session, ["reveal"], res);
    if (phaseErr) return;

    const total = (session.slots || []).length;
    const curr = session.reveal?.revealedCount ?? 0;

    if (curr !== total) {
      return res.status(409).json({
        error: "REVEAL_INCOMPLETE",
        message: "Cannot complete reveal before all slots are revealed",
        revealedCount: curr,
        totalSlots: total,
      });
    }

    const transitionErr = assertTransition(session, "running", res);
    if (transitionErr) return;

    session.phase = "running";
    await session.save();

    return res.json(session);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: err.message });
  }
});

module.exports = router;
