const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema(
  {
    slotIndex: {
      type: Number,
      required: true,
    },

    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    photoUrl: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const GameSessionSchema = new mongoose.Schema(
  {
    scenarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scenario",
      required: true,
    },

    phase: {
      type: String,
      enum: ["setup", "reveal", "running", "ended"],
      default: "setup",
    },

    playerCount: {
      type: Number,
      required: true,
    },

    slots: {
      type: [SlotSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GameSession", GameSessionSchema);
