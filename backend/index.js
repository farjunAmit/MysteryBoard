const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

let scenarios = [
  {
    id: "1",
    name: "מי רצח את קונוליוס פאדג",
    description: "תרחיש לדוגמא",
    minPlayers: 6,
    maxPlayers: 10,
    characters: [],
    imageUrl: "https://placehold.co/400x250?text=Example",
  },
];

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong from backend 🧩" });
});

app.get("/api/scenarios", (req, res) => {
  res.json(scenarios);
});

app.post("/api/scenarios", (req, res) => {
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

  const newScenario = {
    id: Date.now().toString(),
    name: name,
    description: description,
    minPlayers: min,
    maxPlayers: max,
    characters: characters,
    imageUrl: imageUrl,
  };

  scenarios.push(newScenario);
  res.status(201).json(newScenario);
});

app.delete("/api/scenarios/:id", (req, res) => {
  const id = req.params.id;

  const before = scenarios.length;
  scenarios = scenarios.filter((s) => s.id !== id);

  if (scenarios.length === before) {
    return res.status(404).json({ error: "Scenario not found" });
  }

  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
