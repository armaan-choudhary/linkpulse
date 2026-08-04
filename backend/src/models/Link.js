import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[A-Za-z0-9_-]{6,10}$/
    },
    originalUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Index for newest-first management listing
linkSchema.index({ createdAt: -1 });

export const Link = mongoose.model('Link', linkSchema);
