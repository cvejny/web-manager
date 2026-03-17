"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight } from "lucide-react";

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "panthers") {
      localStorage.setItem("websorter_auth", "true");
      onLogin();
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-100 dark:bg-slate-950/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-100 to-slate-200 dark:from-indigo-500/10 dark:via-slate-950 dark:to-slate-950"></div>
      
      <div className="relative glass-card w-full max-w-md p-8 rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900/60 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg border border-white/10 mb-6">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-200 dark:via-purple-200 dark:to-white bg-clip-text text-transparent text-center">
            Web Manager
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Pro přístup zadejte heslo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Zadejte heslo..."
                className={`w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-all ${
                  error 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : "border-black/10 dark:border-white/10 focus:border-indigo-500 focus:ring-indigo-500/50"
                }`}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center animate-in slide-in-from-top-1">
                Nesprávné heslo. Zkuste to znovu.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            Vstoupit
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
