"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white flex flex-col">

      {/* NAVBAR */}
      <header className="flex justify-between items-center px-8 py-6">
        <h1 className="text-xl font-bold">✨ Notesphere</h1>

        <div className="flex gap-4">
          <Link href="/login" className="opacity-80 border py-2 rounded-lg px-4 hover:opacity-100">
            Login
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h2 className="text-5xl font-bold mb-6">
          Your thoughts. Organized. Visual. Shareable.
        </h2>

        <p className="max-w-xl text-purple-200 opacity-80 mb-8 leading-relaxed">
          Notesphere helps you create structured notes with images,
          pin important ideas, and even publish them publicly.
          A smarter way to think digitally.
        </p>

        <div className="flex gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/public-notes"
            className="px-6 py-3 rounded-xl border border-purple-500/40 hover:bg-purple-500/10 transition"
          >
            Explore Public Notes
          </Link>
        </div>
      </div>

      <footer className="text-center text-sm opacity-60 mb-6">
        Made with ♥ and caffeine by Kajal Sanwal
      </footer>
    </div>
  );
}
