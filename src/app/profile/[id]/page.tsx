"use client";

import { useParams } from "next/navigation";

export default function UserProfile() {
  const params = useParams();

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Purple glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 noise opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl text-white">
          <h1 className="text-3xl font-semibold">User Profile</h1>
          <p className="mt-1 text-sm text-white/60">
            Dynamic route info!
          </p>

          <div className="mt-6 rounded-lg bg-black/40 border border-white/20 p-4">
            <p className="text-sm text-white/60">User ID</p>
            <p className="mt-2 break-all text-purple-400 text-lg font-medium">
              {params.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
