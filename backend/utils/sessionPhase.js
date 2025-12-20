function assertPhase(session, allowedPhases, res) {
  if (!allowedPhases.includes(session.phase)) {
    return res.status(409).json({
      error: "INVALID_PHASE",
      message: `Action not allowed in phase '${session.phase}'`,
      phase: session.phase,
      allowed: allowedPhases,
    });
  }
  return null;
}

const PHASE_ORDER = ["setup", "reveal", "running", "ended"];

function isValidTransition(from, to) {
  const fromIdx = PHASE_ORDER.indexOf(from);
  const toIdx = PHASE_ORDER.indexOf(to);

  if (fromIdx === -1 || toIdx === -1) return false;
  if (toIdx <= fromIdx) return false;
  if (toIdx !== fromIdx + 1) return false;

  return true;
}

function assertTransition(session, nextPhase, res) {
  if (!isValidTransition(session.phase, nextPhase)) {
    return res.status(409).json({
      error: "INVALID_TRANSITION",
      message: `Cannot transition from '${session.phase}' to '${nextPhase}'`,
      from: session.phase,
      to: nextPhase,
      allowedNext: [PHASE_ORDER[PHASE_ORDER.indexOf(session.phase) + 1]].filter(Boolean),
    });
  }
  return null;
}

module.exports = { assertPhase, assertTransition };
