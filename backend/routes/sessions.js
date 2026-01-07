const express = require("express");
const router = express.Router();
const { generateUniqueJoinCode } = require("../utils/joinCode");
const Scenario = require("../models/Scenario");
const GameSession = require("../models/GameSession");
const SessionPhoto = require("../models/SessionPhoto");
const requireAuth = require("../middleware/requireAuth");
const { assertPhase, assertTransition } = require("../utils/sessionPhase");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1_000_000,
  },
});

// POST /api/sessions
router.post("/", requireAuth, async (req, res) => {
  try {
    const { scenarioId } = req.body;

    if (!scenarioId) {
      return res.status(400).json({ message: "scenarioId is required" });
    }

    const scenario = await Scenario.findOne({
      _id: scenarioId,
      ownerId: req.user.id,
    });
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    let mandatory = [];

    if (scenario.mode === "characters") {
      mandatory = (scenario.characters || []).filter((c) => c.required);
    } else if (scenario.mode === "groups") {
      // Extract mandatory characters from all groups
      (scenario.groups || []).forEach((group) => {
        const groupMandatory = (group.characters || []).filter(
          (c) => c.required
        );
        mandatory.push(...groupMandatory);
      });
    }

    const playerCount = mandatory.length;

    const slots = mandatory.map((c, idx) => ({
      slotIndex: idx,
      characterId: c._id,
      photoUrl: null,
    }));

    const session = await GameSession.create({
      scenarioId: scenario._id,
      ownerId: req.user.id,
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

// GET /api/sessions/all
router.get("/all", requireAuth, async (req, res) => {
  try {
    const sessions = await GameSession.find({ ownerId: req.user.id });
    return res.json(sessions);
  } catch (err) {
    console.error("Get all sessions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/sessions/join/:code
router.get("/join/:code", async (req, res) => {
  const code = (req.params.code || "").toUpperCase().trim();

  const session = await GameSession.findOne({ joinCode: code });
  if (!session) return res.status(404).json({ message: "Session not found" });

  res.json(session);
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

// POST /api/sessions/:id/events/chat
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

    let char = null;

    if (scenario.mode === "characters") {
      char = (scenario.characters || []).find(
        (c) => String(c._id) === String(characterId)
      );
    } else if (scenario.mode === "groups") {
      // Search for character in all groups
      for (const group of scenario.groups || []) {
        char = (group.characters || []).find(
          (c) => String(c._id) === String(characterId)
        );
        if (char) break;
      }
    }

    if (!char) {
      return res.status(400).json({ message: "characterId not in scenario" });
    }
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

// POST /api/sessions/:id/slots/:slotIndex/photo/upload
router.post(
  "/:id/slots/:slotIndex/photo/upload",
  requireAuth,
  upload.single("file"),
  async (req, res) => {
    try {
      const { id, slotIndex } = req.params;

      if (!req.file) {
        return res.status(400).json({ message: "file is required" });
      }

      const session = await GameSession.findById(id);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      const phaseErr = assertPhase(session, ["setup"], res);
      if (phaseErr) return;

      const idx = Number(slotIndex);
      const slot = (session.slots || []).find((s) => s.slotIndex === idx);
      if (!slot) {
        return res.status(404).json({ message: "Slot not found" });
      }

      const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000);

      await SessionPhoto.findOneAndUpdate(
        { sessionId: id, slotIndex: idx },
        {
          sessionId: id,
          slotIndex: idx,
          contentType: req.file.mimetype,
          data: req.file.buffer,
          expiresAt,
        },
        { upsert: true, new: true }
      );
      slot.photoUrl = "uploaded";

      await session.save();
      return res.json({ ok: true });
    } catch (err) {
      console.error("Upload photo error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

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

    const slotIndexes = (session.slots || []).map((s) => s.slotIndex);

    const photos = await SessionPhoto.find(
      { sessionId: id },
      { slotIndex: 1, _id: 0 }
    );

    const have = new Set(photos.map((p) => p.slotIndex));
    const missing = slotIndexes.filter((idx) => !have.has(idx));

    if (missing.length > 0) {
      return res.status(409).json({
        error: "MISSING_PHOTOS",
        message: "Cannot start reveal before all slots have photos",
        missingSlotIndexes: missing,
      });
    }

    session.phase = "reveal";
    session.reveal = session.reveal || {};
    session.reveal.mode = mode;
    if (!session.joinCode) {
      session.joinCode = await generateUniqueJoinCode(GameSession);
    }

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

// PATCH /api/sessions/:id/slots/:slotIndex/photo
router.patch("/:id/slots/:slotIndex/photo", async (req, res) => {
  try {
    const { id, slotIndex } = req.params;
    const { photoUrl } = req.body;

    if (!photoUrl || typeof photoUrl !== "string" || !photoUrl.trim()) {
      return res.status(400).json({
        error: "INVALID_PHOTO_URL",
        message: "photoUrl is required and must be a non-empty string",
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

    const idx = Number(slotIndex);
    if (!Number.isInteger(idx) || idx < 0) {
      return res.status(400).json({
        error: "INVALID_SLOT_INDEX",
        message: "slotIndex must be a non-negative integer",
      });
    }

    const slot = (session.slots || []).find((s) => s.slotIndex === idx);
    if (!slot) {
      return res.status(404).json({
        error: "SLOT_NOT_FOUND",
        message: `No slot with slotIndex=${idx} in this session`,
      });
    }

    slot.photoUrl = photoUrl.trim();

    await session.save();
    return res.json(session);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: err.message });
  }
});

// DELETE /api/sessions/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await GameSession.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Session not found" });
    await SessionPhoto.deleteMany({ sessionId: id });
    return res.json({ message: "Session deleted" });
  } catch (err) {
    console.error("Delete session error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/:id/chat/clear", async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const phaseErr = assertPhase(session, ["running"], res);
    if (phaseErr) return;

    session.events.push({
      type: "chat_cleared",
      text: "cleared", 
      characterId: null,
    });

    await session.save();
    return res.json(session);
  } catch (err) {
    console.error("chat clear error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
});

// GET /api/sessions/:id/slots/:slotIndex/photo
router.get("/:id/slots/:slotIndex/photo", async (req, res) => {
  try {
    const { id, slotIndex } = req.params;

    const photo = await SessionPhoto.findOne({
      sessionId: id,
      slotIndex: Number(slotIndex),
    });

    if (!photo) return res.status(404).json({ message: "No photo" });

    res.setHeader("Content-Type", photo.contentType);
    res.setHeader("Cache-Control", "no-store");
    return res.send(photo.data);
  } catch (e) {
    return res.status(500).json({ message: "Failed to load photo" });
  }
});

module.exports = router;
