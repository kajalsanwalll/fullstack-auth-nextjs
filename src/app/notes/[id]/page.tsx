"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function NotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);
  const [zoomImg, setZoomImg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/users/notes/${id}`);
        setNote(res.data.data);
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
        setImages(res.data.data.images || []);
      } catch {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  /* ======================
     SAVE CHANGES
  ====================== */
  const saveChanges = async () => {
    try {
      setSaving(true);

      const res = await axios.put(`/api/users/notes/${id}`, {
        title,
        content,
        images, // ✅ KEEP UPDATED ORDER
      });

      setNote(res.data.data);
      setEditing(false);
      toast.success("Note updated ✨");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ======================
     DELETE NOTE
  ====================== */
  const deleteNote = async () => {
    if (!confirm("Delete this note permanently?")) return;

    try {
      await axios.delete(`/api/users/notes/${id}`);
      toast.success("Note deleted");
      router.push("/dashboard");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ======================
     IMAGE REORDER (DRAG)
  ====================== */
  const moveImage = (from: number, to: number) => {
    const updated = [...images];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setImages(updated);
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!note) return <p className="p-6">Note not found</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl bg-gradient-to-br from-purple-900/40 to-black/60 border border-purple-800/40 p-6 shadow-xl">

        {/* TITLE */}
        {!editing ? (
          <h1 className="text-4xl font-bold text-white mb-4">
            {note.title}
          </h1>
        ) : (
          <input
            className="w-full bg-black/40 border border-purple-700 rounded-lg px-4 py-2 text-xl text-white mb-4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        {/* CONTENT */}
        {!editing ? (
          <p className="whitespace-pre-wrap text-purple-100 opacity-90">
            {note.content}
          </p>
        ) : (
          <textarea
            className="w-full min-h-[150px] bg-black/40 border border-purple-700 rounded-lg px-4 py-3 text-purple-100"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {/* 🖼️ IMAGES */}
        {images.length > 0 && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                draggable={editing}
                onDragStart={(e) =>
                  e.dataTransfer.setData("imgIndex", idx.toString())
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("imgIndex")
                  );
                  moveImage(from, idx);
                }}
                className="relative group cursor-pointer"
              >
                <img
                  src={img}
                  onClick={() => setZoomImg(img)}
                  className="rounded-xl border border-purple-500/30 object-cover"
                />

                {/* DELETE IMAGE (EDIT MODE) */}
                {editing && (
                  <button
                    onClick={() =>
                      setImages(images.filter((_, i) => i !== idx))
                    }
                    className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                )}

                {/* DRAG LABEL */}
                {editing && (
                  <span className="absolute bottom-2 left-2 text-xs bg-black/60 px-2 py-1 rounded">
                    drag
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg bg-gray-700"
          >
            Back
          </button>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg bg-purple-600"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}

          <button
            onClick={deleteNote}
            className="ml-auto px-4 py-2 rounded-lg bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {/* 🔍 ZOOM MODAL */}
      {zoomImg && (
        <div
          onClick={() => setZoomImg(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
        >
          <img
            src={zoomImg}
            className="max-h-[90vh] max-w-[90vw] rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
