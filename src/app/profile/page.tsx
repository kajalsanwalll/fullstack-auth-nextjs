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

  // 🔐 FETCH USER
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

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-16 bg-gradient-to-br from-black via-purple-950 to-black">
      
      {/* GLOW BACKGROUND */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />

      {/* PROFILE CARD */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-white/5 backdrop-blur-xl border border-purple-500/20 p-10 shadow-2xl">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6">

          {/* AVATAR */}
          <div className="relative">
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
          </div>

          {/* USER INFO */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              {user.name}
            </h1>
            <p className="text-purple-300 mt-1">
              {user.email}
            </p>
            <p className="text-xs opacity-60 mt-2">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* INFO SECTION */}
        <div className="mt-10 grid gap-4 text-sm">
          <div className="flex justify-between items-center bg-purple-900/20 px-4 py-3 rounded-xl border border-purple-500/10">
            <span className="opacity-60">User ID</span>
            <span className="break-all text-xs text-purple-300">
              {user._id}
            </span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">

          <Link
            href="/dashboard"
            className="flex-1 text-center rounded-xl bg-purple-600 py-3 font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-purple-500/30"
          >
            Go to Dashboard
          </Link>

          <button
            onClick={logout}
            className="flex-1 rounded-xl bg-red-500/80 py-3 font-medium hover:bg-red-500 transition-all duration-200 shadow-lg hover:shadow-red-500/30"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
