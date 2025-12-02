const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(cors());
let scenarios = [
	{
		id: '1',
		name: 'מי רצח את קונוליוס פאדג',
		description: 'תרחיש לדוגמא',
		minPlayers: 6,
		maxPlayers: 10,
		imageUrl: 'https://placehold.co/400x250?text=Example',
	},
];

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong from backend 🧩' });
});

app.get('/api/scenarios', (req, res) => {
  res.json(scenarios);
});

app.post('/api/scenarios', (req, res) => {
	const { name, description, minPlayers, maxPlayers, imageUrl } = req.body;
	const newScenario = {
		id: Date.now().toString(),
		name: name,
		description: description,
		minPlayers: minPlayers,
		maxPlayers: maxPlayers,
		imageUrl: imageUrl,

	};
	
	scenarios.push(newScenario);
	res.status(201).json(newScenario);
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
