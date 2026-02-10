"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Note = {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isPublic: boolean;
};

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH NOTES
  ====================== */
  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/users/notes", {
        withCredentials: true,
      });
      setNotes(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  /* ======================
     ACTIONS
  ====================== */
  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/users/notes/${id}`, {
        withCredentials: true,
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success("Note deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    try {
      await axios.patch(
        `/api/users/notes/${id}`,
        { isPinned: !isPinned },
        { withCredentials: true }
      );
      fetchNotes();
    } catch {
      toast.error("Failed to update pin");
    }
  };

  const togglePublic = async (id: string, isPublic: boolean) => {
    try {
      await axios.patch(
        `/api/users/notes/${id}`,
        { isPublic: !isPublic },
        { withCredentials: true }
      );
      fetchNotes();
      toast.success(isPublic ? "Made private" : "Made public");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  /* ======================
     FILTER + SORT
  ====================== */
  const filtered = notes.filter((note) => {
    const q = search.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q)
    );
  });

  const pinnedNotes = filtered.filter((n) => n.isPinned);
  const otherNotes = filtered.filter((n) => !n.isPinned);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-70">Loading…</p>
      </div>
    );
  }

  /* ======================
     NOTE CARD
  ====================== */
  const NoteCard = ({ note }: { note: Note }) => (
    <div className="group relative rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 transition backdrop-blur overflow-hidden min-h-[200px] flex flex-col">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-2">
        <button
          onClick={() => togglePin(note._id, note.isPinned)}
          className="text-yellow-400 text-lg"
        >
          {note.isPinned ? "★" : "☆"}
        </button>

        <button
          onClick={() => deleteNote(note._id)}
          className="opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* CONTENT */}
      <Link href={`/notes/${note._id}`} className="px-4 py-2 flex-1">
        <h2 className="text-lg font-semibold mb-2 truncate">
          {note.title || "Untitled"}
        </h2>
        <p className="text-sm opacity-70 line-clamp-4 break-words">
          {note.content || "No content"}
        </p>
      </Link>

      {/* FOOTER */}
      <div className="px-4 py-2 border-t border-purple-500/20 flex justify-between items-center">
        <button
          onClick={() => togglePublic(note._id, note.isPublic)}
          className="text-xs px-2 py-1 rounded-lg bg-black/40 border border-purple-500/30 hover:bg-purple-600/30"
        >
          {note.isPublic ? "Public" : "Private"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold">Your Notes</h1>

        <div className="flex items-center gap-3">
          {/* 🌍 PUBLIC NOTES LINK */}
          <Link
            href="/public-notes"
            className="px-4 py-2 rounded-xl border border-purple-500/40 text-sm hover:bg-purple-500/10 transition"
          >
            🌍 Explore Public Notes
          </Link>

          {/* ➕ NEW NOTE */}
          <Link
            href="/notes/new"
            className="px-5 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
          >
            + New Note
          </Link>
        </div>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search notes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-10 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/30 outline-none focus:border-purple-500"
      />

      {/* PINNED */}
      {pinnedNotes.length > 0 && (
        <>
          <h2 className="mb-3 text-sm uppercase tracking-wide opacity-70">
            📌 Pinned
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {pinnedNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        </>
      )}

      {/* OTHERS */}
      {otherNotes.length > 0 ? (
        <>
          <h2 className="mb-3 text-sm uppercase tracking-wide opacity-70">
            Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        </>
      ) : (
        pinnedNotes.length === 0 && (
          <div className="text-center mt-32 opacity-70">
            <p className="text-lg">No notes found ✨</p>
          </div>
        )
      )}
    </div>
  );
}
