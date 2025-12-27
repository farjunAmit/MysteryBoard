import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClientSessionsApi } from "../../api/clientSessions.api";

export default function ClientJoin() {
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      setError("Please enter a join code");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const session = await ClientSessionsApi.getByJoinCode(joinCode.trim());
      navigate(`/client/${session._id}`);
    } catch (err) {
      setError("Invalid join code or session not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Join Game</h1>

      <input
        type="text"
        placeholder="Enter join code"
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        disabled={loading}
        style={styles.input}
      />

      <button onClick={handleJoin} disabled={loading} style={styles.button}>
        {loading ? "Checking..." : "Join"}
      </button>

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 320,
    margin: "80px auto",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    textAlign: "center",
  },
  input: {
    padding: 10,
    fontSize: 16,
  },
  button: {
    padding: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
};
