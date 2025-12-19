const express = require("express");
const Scenario = require("../models/Scenario");

const router = express.Router();

// GET /api/scenarios
router.get("/", async (req, res) => {
  try {
    const list = await Scenario.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scenarios" });
  }
});

// POST /api/scenarios
router.post("/", async (req, res) => {
  try {
    const { name, description, minPlayers, maxPlayers, characters, imageUrl } =
      req.body;
    const min = Number(minPlayers);
    const max = Number(maxPlayers);

    //name is required
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Scenario name is required" });
    }

    //min Players is a positive number validation
    if (!Number.isFinite(min) || min <= 0) {
      return res
        .status(400)
        .json({ error: "minPlayers must be a positive number" });
    }

    //max Players is a positive number validation
    if (!Number.isFinite(max) || max <= 0) {
      return res
        .status(400)
        .json({ error: "maxPlayers must be a positive number" });
    }

    // min is smaller them max
    if (min > max) {
      return res
        .status(400)
        .json({ error: "minPlayers cannot be greater than maxPlayers" });
    }

    //characters is an array validation
    if (characters !== undefined && !Array.isArray(characters)) {
      return res.status(400).json({ error: "characters must be an array" });
    }

    //characters length is valid
    if (Array.isArray(characters) && characters.length !== max) {
      return res
        .status(400)
        .json({ error: "characters count must equal maxPlayers" });
    }

    const scenario = await Scenario.create({
      name,
      description,
      minPlayers: Number(minPlayers),
      maxPlayers: Number(maxPlayers),
      characters: characters ?? [],
      imageUrl,
    });

    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/scenarios/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deleted = await Scenario.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(400).json({ error: "Invalid scenario id" });
  }
});

module.exports = router;
