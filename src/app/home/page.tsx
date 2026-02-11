"use client";

import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get("/api/users/me");
      setUser(res.data.data);
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white relative">

      {/* HEADER */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-bold">✨ Notesphere</h1>

        <Link href="/profile" className="flex items-center gap-2">
          <img
            src={user.avatar || "/avatar.png"}
            className="w-9 h-9 rounded-full border border-purple-500/50 object-cover"
          />
          <span className="text-sm opacity-80">
            @{user.username}
          </span>
        </Link>
      </header>

      {/* HERO */}
      <div className="flex flex-col items-center text-center mt-24 px-6">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6">
          Welcome back, {user.username} 👋
        </h2>

        <p className="max-w-xl text-purple-200 opacity-80 leading-relaxed mb-8">
          Create powerful notes with images, organize your thoughts,
          pin important ideas, and share them publicly.
          Your brain, but structured.
        </p>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Go to Dashboard
          </Link>

          <Link
            href="/notes/new"
            className="px-6 py-3 rounded-xl border border-purple-500/40 hover:bg-purple-500/10 transition"
          >
            Create Note
          </Link>
        </div>
      </div>

      <footer className="absolute bottom-6 w-full text-center text-sm opacity-60">
        Made with ♥ and caffeine by Kajal Sanwal
      </footer>
    </div>
  );
}
