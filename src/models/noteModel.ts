import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    images: {
      type: [String], // 🔥 image URLs
      default: [],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPinned: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note =
  mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
