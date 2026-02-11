"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

/* ======================
   TYPES
====================== */

type User = {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  isAdmin?: boolean;
};

type PendingNote = {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    email: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([]);
  const [loading, setLoading] = useState(true);

  /* ======================
     FETCH USER
  ====================== */
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        withCredentials: true,
      });

      setUser(res.data.data);

      if (res.data.data.isAdmin) {
        fetchPendingNotes();
      }
    } catch {
      toast.error("Not authenticated");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     FETCH PENDING NOTES
  ====================== */
  const fetchPendingNotes = async () => {
    try {
      const res = await axios.get("/api/admin/pending-notes");
      setPendingNotes(res.data.data || []);
    } catch {
      console.error("Failed to fetch pending notes");
    }
  };

  /* ======================
     APPROVE NOTE
  ====================== */
  const approveNote = async (id: string) => {
    try {
      await axios.patch(`/api/admin/approve-note/${id}`);
      toast.success("Note approved");
      fetchPendingNotes();
    } catch {
      toast.error("Failed to approve");
    }
  };

  /* ======================
     REJECT NOTE
  ====================== */
  const rejectNote = async (id: string) => {
    try {
      await axios.patch(`/api/admin/reject-note/${id}`);
      toast.success("Note rejected");
      fetchPendingNotes();
    } catch {
      toast.error("Failed to reject");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  /* ======================
     LOGOUT
  ====================== */
  const logout = async () => {
    try {
      await axios.get("/api/users/logout", {
        withCredentials: true,
      });
      toast.success("Logged out");
      router.push("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-70 text-lg animate-pulse">
          Loading your profile…
        </p>
      </div>
    );
  }

  if (!user) return null;

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const initials = user.username
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-black via-purple-950 to-black overflow-hidden">

      {/* ✨ Animated Glow Background */}
      <div className="absolute top-10 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative w-full max-w-4xl rounded-3xl bg-white/5 backdrop-blur-xl border border-purple-500/20 p-10 shadow-2xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="h-24 w-24 rounded-full object-cover border-4 border-purple-500/40 shadow-lg"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold shadow-lg">
              {initials}
            </div>
          )}

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-purple-300 mt-1">{user.email}</p>
            <p className="text-xs opacity-60 mt-2">
              Member since {formattedDate}
            </p>

            {user.isAdmin && (
              <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold">
                ADMIN
              </span>
            )}
          </div>
        </div>

        {/* USER INFO */}
        <div className="mt-10 grid gap-4 text-sm">
          <div className="flex justify-between items-center bg-purple-900/20 px-4 py-3 rounded-xl border border-purple-500/10">
            <span className="opacity-60">User ID</span>
            <span className="break-all text-xs text-purple-300">
              {user._id}
            </span>
          </div>
        </div>

        {/* ADMIN PANEL */}
        {user.isAdmin && (
          <div id="admin-panel" className="mt-12">
            <h2 className="text-xl font-semibold mb-4 text-yellow-400">
              🛡 Admin Panel — Pending Public Notes
            </h2>

            {pendingNotes.length === 0 ? (
              <p className="opacity-60">No pending notes.</p>
            ) : (
              <div className="space-y-4">
                {pendingNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 rounded-xl bg-black/40 border border-purple-500/20"
                  >
                    <h3 className="font-semibold">{note.title}</h3>
                    <p className="text-sm opacity-70 line-clamp-2">
                      {note.content}
                    </p>
                    <p className="text-xs text-purple-300 mt-2">
                      By @{note.user?.username}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => approveNote(note._id)}
                        className="px-4 py-2 bg-green-600 rounded-lg text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectNote(note._id)}
                        className="px-4 py-2 bg-red-600 rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4">

          {user.isAdmin && (
            <button
              onClick={() => {
                const el = document.getElementById("admin-panel");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 text-center rounded-xl bg-yellow-500 py-3 font-medium text-black hover:bg-yellow-400 transition shadow-lg"
            ><Link href="/admin">
              🛡 Open Admin Panel
            </Link>
            </button>
          )}

          <Link
            href="/dashboard"
            className="flex-1 text-center rounded-xl bg-purple-600 py-3 font-medium hover:bg-purple-700 transition"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={logout}
            className="flex-1 rounded-xl bg-red-500/80 py-3 font-medium hover:bg-red-500 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
