const mongoose = require("mongoose");

const CharacterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    traits: { type: [String], default: [] },
    required: { type: Boolean, default: true },
  },
  { _id: true }
);

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sharedInfo: { type: String, default: "", trim: true },

    characters: { type: [CharacterSchema], default: [] },
  },
  { _id: true }
);

const ScenarioSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    minPlayers: { type: Number, required: true, min: 1 },
    maxPlayers: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, default: "", trim: true },
    mode: {
      type: String,
      enum: ["characters", "groups"],
      default: "characters",
    },
    characters: { type: [CharacterSchema], default: [] },
    groups: { type: [GroupSchema], default: [] },
  },
  { timestamps: true }
);

ScenarioSchema.pre("validate", function (next) {
  if (this.minPlayers > this.maxPlayers) {
    return next(new Error("minPlayers cannot be greater than maxPlayers"));
  }

  if (this.mode === "characters") {
    if (Array.isArray(this.characters) && this.characters.length > 0) {
      if (this.characters.length !== this.maxPlayers) {
        return next(new Error("characters count must equal maxPlayers"));
      }
    }

    if (Array.isArray(this.groups) && this.groups.length > 0) {
      return next(new Error('mode="characters" cannot include groups'));
    }
  }

  if (this.mode === "groups") {
    if (Array.isArray(this.characters) && this.characters.length > 0) {
      return next(
        new Error('mode="groups" cannot include top-level characters')
      );
    }

    if (Array.isArray(this.groups) && this.groups.length > 0) {
      const totalCharacters = this.groups.reduce((sum, g) => {
        const n = Array.isArray(g.characters) ? g.characters.length : 0;
        return sum + n;
      }, 0);
      
      if (totalCharacters > 0 && totalCharacters !== this.maxPlayers) {
        return next(
          new Error("total characters in groups must equal maxPlayers")
        );
      }
    }
  }

  next();
});

module.exports = mongoose.model("Scenario", ScenarioSchema);
