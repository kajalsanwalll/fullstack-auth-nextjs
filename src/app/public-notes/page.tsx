"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

type PublicNote = {
  _id: string;
  title: string;
  content: string;
};

export default function PublicNotesPage() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const res = await axios.get("/api/users/public-notes");
        setNotes(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicNotes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-70">Loading public notes…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">🌍 Public Notes</h1>

        <Link
          href="/dashboard"
          className="text-sm opacity-70 hover:opacity-100"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center mt-32 opacity-70">
          <p>No public notes yet ✨</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Link
              key={note._id}
              href={`/notes/${note._id}`}
              className="rounded-2xl p-5 bg-purple-900/30 hover:bg-purple-900/50 transition backdrop-blur"
            >
              <h2 className="text-lg font-semibold mb-2 truncate">
                {note.title || "Untitled"}
              </h2>

              <p className="text-sm opacity-70 line-clamp-4 break-words">
                {note.content || "No content"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
