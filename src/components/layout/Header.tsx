"use client";

import React, { useMemo } from "react";
import { useBoard } from "@/context/BoardContext";
import { Layers, CircleDollarSign, Loader2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const { boardData } = useBoard();
  const { theme, setTheme } = useTheme();

  const stats = useMemo(() => {
    const companies = Object.values(boardData.companies);
    
    // Total potential revenue (all except done)
    const potentialRevenue = companies
      .filter(c => c.status !== "done")
      .reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);

    const formattedRevenue = new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      maximumFractionDigits: 0
    }).format(potentialRevenue);

    // In progress websites
    const inProgressCount = boardData.columns["in-progress"]?.companyIds.length || 0;

    return { formattedRevenue, inProgressCount };
  }, [boardData]);

  return (
    <header className="sticky top-0 z-20 w-full mb-8 border-b border-black/10 dark:border-white/10 shadow-xl bg-white dark:bg-slate-900/60 transition-all duration-300">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row h-auto md:h-20 items-center justify-between px-6 py-4 md:py-0 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg border border-white/10">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-200 dark:via-purple-200 dark:to-white bg-clip-text text-transparent">
              Web Manager
            </h1>
            <p className="text-xs text-slate-900 dark:text-slate-400 font-medium">Pipeline Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 mr-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-black/10 dark:border-transparent"
          >
            <Sun className="h-5 w-5 dark:hidden" />
            <Moon className="h-5 w-5 hidden dark:block" />
          </button>
          
          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl hidden sm:flex bg-white dark:bg-transparent border border-black/10 dark:border-white/5">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg border border-indigo-200 dark:border-indigo-500/30">
              <CircleDollarSign className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold">Potenciální obrat</p>
              <p className="font-semibold text-black dark:text-slate-100">{stats.formattedRevenue}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl hidden sm:flex bg-white dark:bg-transparent border border-black/10 dark:border-white/5">
            <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-lg border border-pink-200 dark:border-pink-500/30">
              <Loader2 className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-800 dark:text-slate-400 font-bold">Rozdělané weby</p>
              <p className="font-semibold text-black dark:text-slate-100">{stats.inProgressCount}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
