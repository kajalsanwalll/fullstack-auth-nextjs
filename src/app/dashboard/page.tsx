"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
/* ======================
   TYPES
====================== */
type Note = {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isPublic: boolean;
};

type User = {
  username: string;
  email: string;
  avatar?: string;
};

/* ======================
   COMPONENT
====================== */
export default function DashboardPage() {
  /* ======================
     STATE
  ====================== */
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  // profile
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ======================
     FETCH USER
  ====================== */
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      setUser(res.data.data);
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ======================
     FETCH NOTES
  ====================== */
  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/users/notes", {
        withCredentials: true,
      });
      setNotes(res.data.data || []);
    } catch {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotes();
  }, []);

  /* ======================
     ACTIONS
  ====================== */
  const logout = async () => {
    await axios.get("/api/users/logout");
    toast.success("Logged out");
    window.location.href = "/landing";
  };

  const deleteNote = async (id: string) => {
    await axios.delete(`/api/users/notes/${id}`, {
      withCredentials: true,
    });
    setNotes((prev) => prev.filter((n) => n._id !== id));
    toast.success("Note deleted");
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    await axios.patch(
      `/api/users/notes/${id}`,
      { isPinned: !isPinned },
      { withCredentials: true }
    );
    fetchNotes();
  };

  const togglePublic = async (id: string, isPublic: boolean) => {
    await axios.patch(
      `/api/users/notes/${id}`,
      { isPublic: !isPublic },
      { withCredentials: true }
    );
    fetchNotes();
  };

  /* ======================
     UPDATE PROFILE (AVATAR ONLY)
  ====================== */
  const saveProfile = async () => {
    if (!avatarFile) {
      toast("No changes to save");
      return;
    }

    try {
      setSavingProfile(true);

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      await axios.patch("/api/users/profile", formData, {
        withCredentials: true,
      });

      toast.success("Profile updated");
      setAvatarFile(null);
      fetchUser();
    } catch {
      toast.error("Profile update failed");
    } finally {
      setSavingProfile(false);
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
      <div className="min-h-screen flex items-center justify-center opacity-70">
        Loading…
      </div>
    );
  }

  /* ======================
     NOTE CARD
  ====================== */
  const NoteCard = ({ note }: { note: Note }) => (
    <div className="group rounded-2xl bg-purple-900/30 hover:bg-purple-900/50 transition min-h-[200px] flex flex-col">
      <div className="flex justify-between px-4 py-2">
        <button onClick={() => togglePin(note._id, note.isPinned)}>
          {note.isPinned ? "★" : "☆"}
        </button>
        <button
          onClick={() => deleteNote(note._id)}
          className="opacity-0 group-hover:opacity-100 text-red-400"
        >
          ✕
        </button>
      </div>

      <Link href={`/notes/${note._id}`} className="px-4 py-2 flex-1">
        <h2 className="font-semibold truncate">
          {note.title || "Untitled"}
        </h2>
        <p className="text-sm opacity-70 line-clamp-4">
          {note.content || "No content"}
        </p>
      </Link>

      <div className="px-4 py-2 border-t border-purple-500/20">
        <button
          onClick={() => togglePublic(note._id, note.isPublic)}
          className="text-xs px-2 py-1 rounded-lg bg-black/40"
        >
          {note.isPublic ? "Public" : "Private"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-sm opacity-70">
            Hi,{" "}
            <span className="font-medium text-purple-300">
              {user?.username || "there"}
            </span>{" "}
            👋
          </p>
          <h1 className="text-3xl font-bold">Your Notes</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/public-notes"
            className="px-4 py-2 rounded-xl border border-purple-500/40"
          >
            🌍 Public Notes
          </Link>

          <Link
            href="/notes/new"
            className="px-5 py-2 rounded-xl bg-purple-600 text-white"
          >
            + New Note
          </Link>

          <button
            onClick={() => setShowProfile(true)}
            className="w-10 h-10 rounded-full overflow-hidden border border-purple-500/40"
          >
            <img
              src={user?.avatar || "/avatar.png"}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search notes…"
        className="w-full mb-10 px-4 py-3 rounded-xl bg-black/40 border border-purple-500/30"
      />

      {/* NOTES */}
      {pinnedNotes.length > 0 && (
        <>
          <h2 className="mb-3 opacity-70">📌 Pinned</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {pinnedNotes.map((n) => (
              <NoteCard key={n._id} note={n} />
            ))}
          </div>
        </>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherNotes.map((n) => (
          <NoteCard key={n._id} note={n} />
        ))}
      </div>

      {/* PROFILE MODAL */}
      {showProfile && user && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="w-full max-w-sm bg-zinc-900 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Profile</h2>
              <button onClick={() => setShowProfile(false)}>✕</button>
            </div>

            <div className="flex flex-col items-center gap-4">
              {/* AVATAR */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative"
              >
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : user.avatar || "/avatar.png"
                  }
                  className="w-24 h-24 rounded-full object-cover border border-purple-500/40"
                />
                <span className="absolute bottom-0 right-0 bg-purple-500/90 text-xs px-2 py-0.5 rounded-full">
                  Change
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setAvatarFile(e.target.files?.[0] || null)
                }
              />

              {/* USERNAME (READ ONLY) */}
              <p className="font-medium">{user.username}</p>
              <p className="text-sm opacity-70">{user.email}</p>

              <button
                onClick={saveProfile}
                disabled={savingProfile}
                className="w-full bg-purple-500/40 py-2 rounded-lg disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Profile"}
              </button>

              <Link
                href="/profile"
                onClick={() => setShowProfile(false)}
                className="w-full text-center rounded-lg border border-purple-500/40 py-2 text-sm hover:bg-purple-500/10 transition"
              >
                View Full Profile →
              </Link>

              <button
                onClick={logout}
                className="w-full bg-red-500/80 py-2 rounded-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
