"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]);

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
        <div className="w-full max-w-lg rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-8 shadow-2xl text-white text-center">
          <h1 className="text-3xl font-semibold">Verify Email</h1>
          <p className="mt-2 text-sm text-white/60">
            We’re checking your verification link ✨
          </p>

          <div className="mt-6 rounded-lg bg-black/40 border border-white/20 p-4 break-all text-sm text-purple-400">
            {token ? token : "No token found"}
          </div>

          {verified && (
            <div className="mt-6">
              <h2 className="text-2xl font-medium text-green-400">
                Email verified!
              </h2>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-6 py-3 font-medium transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
              >
                Go to Login
              </Link>
            </div>
          )}

          {error && (
            <div className="mt-6">
              <h2 className="text-xl font-medium text-red-400">
                Verification failed
              </h2>
              <p className="mt-2 text-sm text-white/60">
                The link may be expired or invalid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
