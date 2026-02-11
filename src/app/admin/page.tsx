"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

type Note = {
  _id: string;
  title: string;
  content: string;
  user: {
    username: string;
    email: string;
  };
};

export default function AdminPage() {
  const router = useRouter();

  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =============================
     CHECK ADMIN ACCESS
  ============================== */
  const checkAdmin = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        withCredentials: true,
      });

      if (!res.data.data.isAdmin) {
        toast.error("Access denied");
        router.push("/profile");
      } else {
        fetchPending();
        fetchStats();
      }
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     FETCH PENDING NOTES
  ============================== */
  const fetchPending = async () => {
    const res = await axios.get("/api/admin/pending-notes");
    setPendingNotes(res.data.data || []);
  };

  /* =============================
     FETCH STATS
  ============================== */
  const fetchStats = async () => {
    const res = await axios.get("/api/admin/note-stats");
    setStats(res.data.data);
  };

  /* =============================
     APPROVE
  ============================== */
  const approveNote = async (id: string) => {
    await axios.patch(`/api/admin/approve-note/${id}`);
    toast.success("Note approved");
    fetchPending();
    fetchStats();
  };

  /* =============================
     REJECT
  ============================== */
  const rejectNote = async (id: string) => {
    await axios.patch(`/api/admin/reject-note/${id}`);
    toast.success("Note rejected");
    fetchPending();
    fetchStats();
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-lg opacity-70">
          Loading Admin Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black text-white p-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-yellow-400">
          🛡 Admin Dashboard
        </h1>

        <Link
          href="/profile"
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Back to Profile
        </Link>
      </div>

      {/* ================= STATS CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">

        <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-2xl backdrop-blur-lg">
          <p className="text-sm opacity-70">Pending Notes</p>
          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            {stats.pending}
          </h2>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl backdrop-blur-lg">
          <p className="text-sm opacity-70">Approved Notes</p>
          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {stats.approved}
          </h2>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl backdrop-blur-lg">
          <p className="text-sm opacity-70">Rejected Notes</p>
          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {stats.rejected}
          </h2>
        </div>

      </div>

      {/* ================= PENDING SECTION ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-6 text-yellow-300">
          Review Pending Notes
        </h2>

        {pendingNotes.length === 0 ? (
          <p className="opacity-60">No pending notes 🎉</p>
        ) : (
          <div className="space-y-6">
            {pendingNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white/5 border border-purple-500/20 p-6 rounded-2xl backdrop-blur-lg"
              >
                <h3 className="text-lg font-semibold">
                  {note.title}
                </h3>

                <p className="opacity-70 mt-2 line-clamp-3">
                  {note.content}
                </p>

                <p className="text-sm text-purple-300 mt-3">
                  By @{note.user?.username}
                </p>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => approveNote(note._id)}
                    className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => rejectNote(note._id)}
                    className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
