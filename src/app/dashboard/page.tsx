"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("/api/users/notes", {
         withCredentials: true,
         });
        setNotes(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Notes</h1>

        {/* 🔥 ADD NOTE BUTTON */}
        <Link
          href="/notes/new"
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          + New Note
        </Link>
      </div>

      {notes.length === 0 && (
        <p className="opacity-70">No notes yet. Create one ✨</p>
      )}

      {/* NOTES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Link
            key={note._id}
            href={`/notes/${note._id}`}
            className="p-4 rounded-lg bg-purple-900/30 hover:bg-purple-900/50"
          >
            <h2 className="font-semibold">{note.title}</h2>
            <p className="text-sm opacity-70 line-clamp-2">
              {note.content}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
