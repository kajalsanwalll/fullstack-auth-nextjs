"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white">

      {/* ================= NAVBAR ================= */}
      <header className="flex justify-between items-center px-8 py-6">

        <h1 className="text-xl font-bold">
          ✨ Notesphere
        </h1>

        <div className="flex gap-4">

          <Link
            href="/login"
            className="opacity-80 border py-2 rounded-lg px-4 hover:opacity-100"
          >
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


      {/* ================= HERO ================= */}
      <section className="min-h-[calc(100vh-88px)] flex flex-col items-center justify-center text-center px-6">

        <div className="-mt-16">

          <h2 className="text-5xl font-bold mb-6">
            Good notes shouldnt be a Senior&apos;s Secret.
          </h2>

          <p className="max-w-xl text-purple-200 opacity-80 mb-8 leading-relaxed">
            Notesphere helps you create structured notes with images,
            pin important ideas, and even publish them publicly.
            A smarter way to think digitally.
          </p>

          <div className="flex gap-4 items-center justify-center">

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

      </section>


      {/* ================= SPACE BEFORE STORY ================= */}
      <div className="h-32 bg-black" />


      {/* ================= STORY ================= */}
      <section className="bg-gradient-to-b from-black via-purple-950/40 to-purple-950 px-6 py-28">

        <div className="max-w-2xl mx-auto">

          <p className="text-purple-400 text-sm font-medium mb-5">
            Why I built Notesphere
          </p>

          <h3 className="text-3xl sm:text-4xl font-bold leading-tight mb-8">
            I didn&apos;t have seniors when I joined university.
          </h3>

          <div className="space-y-6 text-purple-100/70 leading-relaxed text-base sm:text-lg">

            <p>
              When I joined university, I didn&apos;t really have seniors to
              ask for notes, resources, or guidance. Whenever I needed good
              notes for a subject, finding them wasn&apos;t always easy.
            </p>

            <p>
              Sometimes the notes I needed were sitting somewhere with
              someone else. Sometimes I had to ask around, search through
              different places, or simply figure things out on my own.
            </p>

            <p>
              And I kept thinking —{" "}
              <span className="text-purple-300">
                why isn&apos;t there just one place where students can share
                what they&apos;ve already learned?
              </span>
            </p>

            <p>
              So I decided to build that place.
            </p>

            <p>
              Notesphere is my small attempt to make things a little easier
              for students coming after me. A place where you can keep your
              notes, share what you know, and maybe help a junior who is
              struggling with the same thing you once struggled with.
            </p>

            <p>
              Maybe a note someone shares today can save someone else hours
              of searching tomorrow.
            </p>

          </div>

          <p className="mt-10 text-purple-300 font-medium text-lg">
            Learn something. Write it down. Share it forward. 💜
          </p>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-purple-950 text-center text-sm opacity-60 py-8">
        Made with ♥ and caffeine by Kajal Sanwal
      </footer>

    </div>
  );
}