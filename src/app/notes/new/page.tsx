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

      toast.success("Note created!");
      router.push(`/notes/${res.data.data._id}`);
    } catch {
      toast.error("Failed to create note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">New Note</h1>

        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 border rounded"
          rows={6}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="text-sm opacity-70">Add images</label>

        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) =>
            e.target.files && handleImageUpload(e.target.files[0])
          }
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 p-2 border rounded text-sm"
          />
          <button
            onClick={handleAddImageUrl}
            className="px-3 py-2 bg-purple-600 text-white rounded"
          >
            Add
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="h-32 w-full object-cover rounded"
                />
                <button
                  onClick={() =>
                    setImages(images.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={createNote}
          disabled={loading || uploading}
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          {uploading ? "Uploading..." : loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
