"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

/* ======================
   TYPES
====================== */
type PublicNote = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
    email: string;
    avatar?: string;
  };
};

export default function PublicNotesPage() {
  /* ======================
     STATE
  ====================== */
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] =
    useState<PublicNote["user"] | null>(null);

  /* ======================
     FETCH PUBLIC NOTES
  ====================== */
  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        const res = await axios.get("/api/users/public-notes");
        setNotes(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch public notes", err);
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
    <div className="min-h-screen flex flex-col px-6 py-10 max-w-6xl mx-auto">
      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">🌍 Public Notes</h1>

          <Link
            href="/dashboard"
            className="text-sm opacity-70 hover:opacity-100"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* CTA BANNER */}
        <div className="mb-10 rounded-2xl border border-purple-500/30 bg-purple-900/20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm opacity-80">
            ✨ See the full potential — create, pin, and manage your own notes by
            logging in.
          </p>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg bg-purple-600 text-sm hover:bg-purple-700 transition"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-4 py-2 rounded-lg border border-purple-500/40 text-sm hover:bg-purple-500/10 transition"
            >
              Sign up
            </Link>
          </div>
        </div>

        {/* NOTES GRID */}
        {notes.length === 0 ? (
          <div className="text-center mt-32 opacity-70">
            <p>No public notes yet ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="rounded-2xl p-5 bg-purple-900/30 hover:bg-purple-900/50 transition backdrop-blur flex flex-col"
              >
                {/* NOTE CONTENT */}
                <Link href={`/notes/${note._id}`} className="flex-1">
                  <h2 className="text-lg font-semibold mb-2 truncate">
                    {note.title || "Untitled"}
                  </h2>

                  <p className="text-sm opacity-70 line-clamp-4 break-words">
                    {note.content || "No content"}
                  </p>
                </Link>

                {/* AUTHOR */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-purple-500/20">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedUser(note.user);
                    }}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={note.user.avatar || "/avatar.png"}
                      alt="author"
                      className="w-7 h-7 rounded-full object-cover border border-purple-500/40"
                    />

                    <span className="text-sm text-purple-300 hover:underline">
                      @{note.user.username}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm bg-purple-900/40 rounded-4xl opacity-70">
        Made with <span className="text-red-400">❤️</span> and an unhealthy amount of caffeine ☕ by{" "}
        <span className="font-medium">Kajal Sanwal</span>
      </footer>

      {/* AUTHOR MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Author</h2>
              <button onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <img
                src={selectedUser.avatar || "/avatar.png"}
                className="w-20 h-20 rounded-full object-cover border border-purple-500/40"
              />

              <p className="font-medium text-lg">
                @{selectedUser.username}
              </p>

              <p className="text-sm opacity-70">
                {selectedUser.email}
              </p>

              <button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-purple-600 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
