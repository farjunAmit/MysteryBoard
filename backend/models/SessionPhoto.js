const mongoose = require("mongoose");

const SessionPhotoSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "GameSession", 
    },

    slotIndex: { type: Number, required: true },

    contentType: { type: String, required: true }, // "image/jpeg" / "image/png"
    data: { type: Buffer, required: true },   

    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

SessionPhotoSchema.index({ sessionId: 1, slotIndex: 1 }, { unique: true });

SessionPhotoSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("SessionPhoto", SessionPhotoSchema);
