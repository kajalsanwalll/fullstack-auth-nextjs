"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (user.email && user.password && user.username) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.log("Signup failed!", error.message);
      toast.error(error.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Purple / pink glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 h-100 w-100 rounded-full bg-pink-500/20 blur-[120px]" />
      </div>

      {/* Grain */}
      <div className="pointer-events-none absolute inset-0 noise opacity-20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold text-white">
            {loading ? "Processing..." : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Join the purple side ✨
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-white/70">Username</label>
              <input
                type="text"
                value={user.username}
                onChange={(e) =>
                  setUser({ ...user, username: e.target.value })
                }
                placeholder="your username here..."
                className="mt-1 w-full rounded-lg bg-black/40 text-white border border-white/20 px-4 py-3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Email</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg bg-black/40 text-white border border-white/20 px-4 py-3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="text-sm text-white/70">Password</label>
              <input
                type="password"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-black/40 text-white border border-white/20 px-4 py-3 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              onClick={onSignup}
              disabled={buttonDisabled || loading}
              className="
                w-full rounded-lg
                bg-linear-to-r from-purple-500 to-pink-500
                py-3 font-medium text-white
                transition
                hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                shadow-lg shadow-purple-500/30
              "
            >
              {loading ? "Processing..." : "Sign up"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-white/60">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-purple-400 hover:text-purple-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
