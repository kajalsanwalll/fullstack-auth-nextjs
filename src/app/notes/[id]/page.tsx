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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/users/notes/${id}`);
        setNote(res.data.data);
        setTitle(res.data.data.title);
        setContent(res.data.data.content);
      } catch {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const saveChanges = async () => {
    try {
      setSaving(true);
      const res = await axios.put(`/api/users/notes/${id}`, {
        title,
        content,
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

  if (loading) return <p className="p-6">Loading...</p>;
  if (!note) return <p className="p-6">Note not found</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl bg-gradient-to-br from-purple-900/40 to-black/60 border border-purple-800/40 p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          {!editing ? (
            <h1 className="text-4xl font-bold text-white">
              {note.title}
            </h1>
          ) : (
            <input
              className="w-full bg-black/40 border border-purple-700 rounded-lg px-4 py-2 text-xl text-white outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          )}
        </div>

        {/* CONTENT */}
        {!editing ? (
          <p className="whitespace-pre-wrap text-purple-100 opacity-90 mb-8">
            {note.content}
          </p>
        ) : (
          <textarea
            className="w-full min-h-50 bg-black/40 border border-purple-700 rounded-lg px-4 py-3 text-purple-100 outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        )}

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
          >
            Back
          </button>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveChanges}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}

          <button
            onClick={deleteNote}
            className="ml-auto px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Delete
          </button>

          <button
            onClick={async () => {
            await axios.patch(`/api/users/notes/${id}`, {
            isPublic: !note.isPublic,
            });
            location.reload();
            }}
            className="px-4 py-2 rounded-lg bg-purple-600 mt-4"
            >
            {note.isPublic ? "Make Private" : "Make Public"}
          </button>

        </div>
      </div>
    </div>
  );
}
