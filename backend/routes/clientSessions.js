const express = require("express");
const router = express.Router();
const Scenario = require("../models/Scenario");
const GameSession = require("../models/GameSession");
const { assertPhase, assertTransition } = require("../utils/sessionPhase");

// GET /api/client/sessions/:id/state
router.get("/:id/state", async (req, res) => {
  try {
    const session = await GameSession.findById(req.params.id); // Get session using URL param
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const scenario = await Scenario.findById(session.scenarioId); // Now we can use session.scenarioId
    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    let characters = [];
    let families = [];

    if (scenario.mode === "groups") {
      // Build characters with family grouping
      (scenario.groups || []).forEach((group) => {
        families.push({
          id: group._id.toString(),
          name: group.name,
          sharedInfo: group.sharedInfo || "",
        });
      });

      characters = (session.slots || []).map((slot) => {
        let character = null;
        let groupId = null;

        // Find character and its group
        for (const group of scenario.groups || []) {
          character = (group.characters || []).find(
            (c) => String(c._id) === String(slot.characterId)
          );
          if (character) {
            groupId = group._id.toString();
            break;
          }
        }

        const revealedForChar = (session.events || [])
          .filter(
            (e) =>
              e.type === "trait_revealed" &&
              String(e.characterId) === String(slot.characterId)
          )
          .map((e) => e.text);

        return {
          id: String(slot.characterId),
          name: character?.name || "Unknown",
          traits: revealedForChar,
          required: Boolean(character?.required),
          photoUrl: slot.photoUrl || null,
          slotIndex: slot.slotIndex,
          familyId: groupId,
          roleHint: character?.description || "",
        };
      });
    } else {
      // Standard mode - flat character list
      const scenarioChars = scenario.characters || [];

      characters = (session.slots || []).map((slot) => {
        const found = scenarioChars.find(
          (c) => String(c._id) === String(slot.characterId)
        );
        const revealedForChar = (session.events || [])
          .filter(
            (e) =>
              e.type === "trait_revealed" &&
              String(e.characterId) === String(slot.characterId)
          )
          .map((e) => e.text);
        return {
          id: String(slot.characterId),
          name: found?.name || "Unknown",
          traits: revealedForChar,
          required: Boolean(found?.required),
          photoUrl: slot.photoUrl || null,
          slotIndex: slot.slotIndex,
          roleHint: found?.description || "",
        };
      });
    }

    let latestChat = null;
    for (let i = (session.events?.length ?? 0) - 1; i >= 0; i--) {
      const e = session.events[i];
      if (e.type === "chat_cleared") {
        latestChat = null;
        break;
      }
      if (e.type === "chat") {
        latestChat = { text: e.text, createdAt: e.createdAt };
        break;
      }
    }

    return res.json({
      phase: session.phase,
      reveal: {
        mode: session.reveal?.mode ?? "slow",
        revealedCount: session.reveal?.revealedCount ?? 0,
      },
      scenarioMode: scenario.mode,
      families: scenario.mode === "groups" ? families : [],
      characters,
      latestChat,
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

    const session = await GameSession.findOne({
      joinCode: String(joinCode).trim(),
    });
    if (!session) {
      return res
        .status(404)
        .json({ message: "Invalid join code or session not available" });
    }

    return res.json({ sessionId: session._id.toString() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message || "Server error" });
  }
});

// POST /api/client/sessions/:id/reveal/next
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

    if ((session.reveal?.mode ?? "").toLowerCase() !== "slow") {
      return res.status(409).json({
        error: "INVALID_REVEAL_MODE",
        message: "Reveal next is allowed only in slow mode",
        mode: session.reveal?.mode ?? null,
      });
    }

    const total = (session.slots || []).length;
    const curr = session.reveal?.revealedCount ?? 0;
    const next = Math.min(curr + 1, total);

    session.reveal.revealedCount = next;

    if (next >= total && session.phase !== "running") {
      const transitionErr = assertTransition(session, "running", res);
      if (transitionErr) return;
      session.phase = "running";
    }

    await session.save();
    return res.json(session);
  } catch (err) {
    return res
      .status(500)
      .json({ error: "SERVER_ERROR", message: err.message });
  }
});

// POST /api/client/sessions/:id/reveal/complete
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
