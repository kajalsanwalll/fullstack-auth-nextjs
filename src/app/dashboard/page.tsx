"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/users/notes", {
        withCredentials: true,
      });
      setNotes(res.data.data || []);
      setFilteredNotes(res.data.data || []);
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

  // 🔍 SEARCH
  useEffect(() => {
  const q = search.toLowerCase();

  setFilteredNotes(
    notes.filter((note) => {
      const title = note.title?.toLowerCase() || "";
      const content = note.content?.toLowerCase() || "";

      return title.includes(q) || content.includes(q);
    })
  );
 }, [search, notes]);


  // 🗑 DELETE
  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/api/users/notes/${id}`, {
        withCredentials: true,
      });
      toast.success("Note deleted");
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  // ⭐ PIN / UNPIN
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-70">Loading…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-6 py-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold">Your Notes</h1>

        <Link
          href="/notes/new"
          className="px-5 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition"
        >
          + New Note
        </Link>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search notes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-8 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/30 outline-none focus:border-purple-500"
      />

      {/* EMPTY */}
      {filteredNotes.length === 0 && (
        <div className="text-center mt-32 opacity-70">
          <p className="text-lg">No matching notes ✨</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className="relative group rounded-2xl p-5 bg-purple-900/30 hover:bg-purple-900/50 transition backdrop-blur"
          >
            {/* ⭐ PIN */}
            <button
              onClick={(e) => {
                e.preventDefault();
                togglePin(note._id, note.isPinned);
              }}
              className="absolute top-3 left-3 text-yellow-400 text-lg"
            >
              {note.isPinned ? "★" : "☆"}
            </button>

            {/* 🗑 DELETE */}
            <button
              onClick={() => deleteNote(note._id)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-red-400 hover:text-red-500"
            >
              ✕
            </button>

            {/* NOTE LINK */}
            <Link href={`/notes/${note._id}`} className="block">
              <h2 className="text-lg font-semibold mb-2 truncate">
                {note.title}
              </h2>
              <p className="text-sm opacity-70 line-clamp-3">
                {note.content}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
