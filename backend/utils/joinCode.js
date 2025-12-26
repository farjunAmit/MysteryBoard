const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // בלי I,O,0,1
const CODE_LEN = 6;

function randomCode() {
  let out = "";
  for (let i = 0; i < CODE_LEN; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

async function generateUniqueJoinCode(GameSessionModel, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const code = randomCode();
    const exists = await GameSessionModel.exists({ joinCode: code });
    if (!exists) return code;
  }
  throw new Error("Failed to generate unique joinCode");
}

module.exports = { generateUniqueJoinCode };
