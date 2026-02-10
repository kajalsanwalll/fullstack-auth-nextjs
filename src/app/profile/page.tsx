"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 FETCH LOGGED-IN USER
  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/users/me", {
        withCredentials: true,
      });
      setUser(res.data.data);
    } catch {
      toast.error("Not authenticated");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await axios.get("/api/users/logout", {
        withCredentials: true,
      });
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="opacity-70">Loading profile…</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen px-6 py-16 max-w-3xl mx-auto">
      {/* CARD */}
      <div className="rounded-2xl bg-purple-900/30 backdrop-blur border border-purple-500/20 p-8">
        {/* HEADER */}
        <div className="flex items-center gap-5">
          {/* AVATAR */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover border border-purple-500/30"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
          )}

          <div>
            <h1 className="text-2xl font-semibold">
              {user.name}
            </h1>
            <p className="text-sm opacity-70">
              {user.email}
            </p>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-8 space-y-4 text-sm">
          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="opacity-60">User ID</span>
            <span className="break-all">{user._id}</span>
          </div>

          <div className="flex justify-between border-b border-purple-500/20 pb-2">
            <span className="opacity-60">Joined</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
