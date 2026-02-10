"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful!");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");
    console.log(res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Purple glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 h-100 w-100 rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 noise opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl text-white">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="mt-1 text-sm text-white/60">
            You’re logged in!
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-black/40 border border-white/20 p-4">
              <p className="text-sm text-white/60">User ID</p>
              <div className="mt-2">
                {data === "nothing" ? (
                  <span className="text-white/40">Not loaded</span>
                ) : (
                  <Link
                    href={`/profile/${data}`}
                    className="text-purple-400 hover:text-purple-300 break-all"
                  >
                    {data}
                  </Link>
                )}
              </div>
            </div>

            <button
              onClick={getUserDetails}
              className="w-full rounded-lg bg-linear-to-r from-purple-500 to-pink-500 py-3 font-medium transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
            >
              Get User Info
            </button>

            <button
              onClick={logout}
              className="w-full rounded-lg bg-red-500/80 hover:bg-red-500 py-3 font-medium transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
