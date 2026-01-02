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

const EventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["trait_revealed", "chat", "chat_cleared"],
      required: true,
    },
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
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

    events: {
      type: [EventSchema],
      default: [],
    },

    reveal: {
      mode: {
        type: String,
        enum: ["fast", "slow"],
        default: "slow",
      },
      revealedCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    joinCode: { type: String, unique: true, index: true, sparse: true },
  },
  { timestamps: true }
);

GameSessionSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});
module.exports = mongoose.model("GameSession", GameSessionSchema);
