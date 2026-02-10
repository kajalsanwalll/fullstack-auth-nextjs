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
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/users/notes/${id}`);
        setNote(res.data.data);
      } catch (err) {
        toast.error("Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const deleteNote = async () => {
    const ok = confirm("Delete this note permanently?");
    if (!ok) return;

    try {
      setDeleting(true);
      await axios.delete(`/api/users/notes/${id}`);
      toast.success("Note deleted");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Failed to delete note");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!note) return <p className="p-6">Note not found</p>;

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{note.title}</h1>
      <p className="opacity-80 mb-6 whitespace-pre-wrap">
        {note.content}
      </p>

      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
        >
          Back
        </button>

        <button
          onClick={deleteNote}
          disabled={deleting}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
