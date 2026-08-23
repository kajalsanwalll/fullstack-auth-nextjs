"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#100719] text-white overflow-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap");

        .font-display {
          font-family: "Sora", sans-serif;
        }

        .font-body {
          font-family: "Inter", sans-serif;
        }

        .purple-bg {
          background:
            radial-gradient(
              circle at 50% 15%,
              rgba(132, 72, 210, 0.22),
              transparent 35%
            ),
            radial-gradient(
              circle at 10% 45%,
              rgba(104, 45, 170, 0.14),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 35%,
              rgba(154, 72, 210, 0.12),
              transparent 30%
            ),
            linear-gradient(
              135deg,
              #100719 0%,
              #160a24 45%,
              #1b0b2d 100%
            );
        }

        .story-bg {
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(121, 62, 190, 0.16),
              transparent 38%
            ),
            linear-gradient(
              180deg,
              #1c0c2d 0%,
              #160922 100%
            );
        }
      `}</style>

      {/* HERO */}
      <div className="relative purple-bg">

        {/* subtle ambient glow */}
        <div className="absolute top-[-180px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[140px] pointer-events-none" />

        {/* NAVBAR */}
        <header className="relative z-10 flex justify-between items-center px-6 sm:px-10 py-6 font-body">
          <Link
            href="/"
            className="font-display font-semibold text-lg tracking-tight"
          >
            Notesphere
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/65 hover:text-white transition-colors"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="
                text-sm font-medium
                px-4 py-2
                rounded-lg
                bg-[#A978E8]
                text-[#170A24]
                hover:bg-[#B98AF2]
                shadow-[0_0_25px_rgba(169,120,232,0.18)]
                transition-all duration-300
              "
            >
              Sign up
            </Link>
          </div>
        </header>

        {/* HERO */}
        <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 sm:pt-32 pb-28 sm:pb-36">

          <h2
            className="
              font-display font-bold
              text-4xl sm:text-5xl md:text-6xl
              leading-[1.08]
              max-w-3xl
              tracking-tight
              mb-8
            "
          >
            Good notes shouldn’t be a{" "}
            <span
              className="
                bg-gradient-to-r
                from-[#B68AFF]
                via-[#C99AF5]
                to-[#A875E8]
                bg-clip-text
                text-transparent
              "
            >
              senior’s secret.
            </span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4">

            <Link
              href="/signup"
              className="
                font-body text-sm font-semibold
                px-7 py-3.5
                rounded-xl
                bg-gradient-to-r
                from-[#A978E8]
                to-[#C08AF2]
                text-[#160922]
                shadow-[0_0_35px_rgba(169,120,232,0.20)]
                hover:shadow-[0_0_45px_rgba(169,120,232,0.32)]
                hover:-translate-y-0.5
                transition-all duration-300
              "
            >
              Get Started
            </Link>

            <Link
              href="/public-notes"
              className="
                font-body text-sm font-medium
                px-7 py-3.5
                rounded-xl
                border border-white/10
                bg-white/[0.025]
                text-white/75
                hover:bg-white/[0.06]
                hover:border-[#B68AFF]/30
                hover:text-white
                transition-all duration-300
              "
            >
              Explore Public Notes
            </Link>

          </div>
        </section>
      </div>

      {/* STORY */}
      <section className="relative flex-1 story-bg px-6 py-20 sm:py-28">

        <div className="relative max-w-2xl mx-auto font-body text-[15px] sm:text-base leading-[1.9] text-white/65 space-y-6">

          <p>
            Notesphere started from a pretty simple problem I faced when I
            joined university:{" "}
            <span className="text-white font-medium">
              I didn't have seniors to ask for help.
            </span>
          </p>

          <p>
            Whenever I needed notes, resources, or guidance for a subject,
            finding good material wasn't always easy. Sometimes you'd ask
            around and realize that the notes you needed were sitting
            somewhere with someone else, but there was no simple place where
            students could share them with each other.
          </p>

          <p>
            So I thought - {" "}
            <span className="text-[#C9A2F5] font-medium">
              why not build that place?
            </span>
          </p>

          <p>
            Notesphere is my attempt to make sharing and finding notes a
            little easier for students. You can write notes the way that
            works for you, add images when you need them, pin the important
            ones, and share them publicly so someone else can benefit from
            what you've already learned.
          </p>

          <p>
            I built Notesphere with the hope that juniors joining university
            won't have to feel as lost as I did. Maybe a note you share today
            can save someone else hours of searching tomorrow.
          </p>

          <p className="text-white font-display font-semibold text-lg sm:text-xl pt-3">
            Learn something and help someone.
          </p>

        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="
          font-body
          text-center
          text-sm
          text-white/35
          py-9
          bg-[#100719]
          border-t border-white/[0.04]
        "
      >
        Made with ♥ and caffeine by Kajal Sanwal
      </footer>
    </div>
  );
}