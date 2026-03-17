"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { LoginScreen } from "@/components/auth/LoginScreen";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("websorter_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return null; // Skip rendering during initial check to avoid flashing
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 overflow-hidden">
        <KanbanBoard />
      </main>
    </div>
  );
}
