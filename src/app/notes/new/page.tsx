"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function NewNotePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ======================
     IMAGE UPLOAD
  ====================== */
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.url) throw new Error("Upload failed");

      setImages((prev) => [...prev, data.url]);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
  };

  /* ======================
     CREATE NOTE
  ====================== */
  const createNote = async () => {
    if (uploading) {
      toast.error("Wait for image upload");
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content required");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/users/notes", {
        title,
        content,
        images,
      });

      toast.success("Note created ✨");
      router.push(`/notes/${res.data.data._id}`);
    } catch {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center px-4 py-12 bg-gradient-to-br from-purple-950 via-black to-purple-900">

      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-purple-800/40 rounded-2xl p-8 shadow-2xl">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-purple-300 hover:text-white transition mb-6"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-white mb-6">
          Create New Note
        </h1>

        {/* TITLE */}
        <input
          className="w-full p-3 rounded-xl bg-black/40 border border-purple-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* CONTENT */}
        <textarea
          className="w-full p-3 rounded-xl bg-black/40 border border-purple-700 text-purple-100 mb-6 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-purple-600"
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* IMAGE SECTION */}
        <div className="mb-6">
          <label className="block text-sm text-purple-300 mb-2">
            Add Images
          </label>

          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
            className="mb-4 text-sm text-purple-200"
          />

          {/* URL INPUT */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 p-2 rounded-lg bg-black/40 border border-purple-700 text-sm text-white focus:outline-none"
            />
            <button
              onClick={handleAddImageUrl}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white"
            >
              Add
            </button>
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img}
                  className="h-32 w-full object-cover rounded-xl border border-purple-700/40"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">

          <button
            onClick={() => router.push("/dashboard")}
            className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-800 transition text-white"
          >
            Cancel
          </button>

          <button
            onClick={createNote}
            disabled={loading || uploading}
            className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
          >
            {uploading
              ? "Uploading..."
              : loading
              ? "Saving..."
              : "Create Note"}
          </button>
        </div>

      </div>
    </div>
  );
}
