"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BoardData, Company, Task, initialBoardData } from "@/types";

interface BoardContextType {
  boardData: BoardData;
  addCompany: (company: Omit<Company, "id" | "status">, status?: string) => void;
  updateCompany: (id: string, updatedFields: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  moveCompany: (companyId: string, sourceCol: string, destCol: string, sourceIndex: number, destIndex: number) => void;
  addTask: (task: Omit<Task, "id" | "isCompleted" | "createdAt">) => void;
  updateTask: (id: string, updatedFields: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boardData, setBoardData] = useState<BoardData>(initialBoardData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("crm-board-data");
    if (saved) {
      try {
        setBoardData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse board data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("crm-board-data", JSON.stringify(boardData));
    }
  }, [boardData, isLoaded]);

  const addCompany = (companyData: Omit<Company, "id" | "status">, status: string = "lead") => {
    const newId = crypto.randomUUID();
    const newCompany: Company = {
      ...companyData,
      id: newId,
      status,
    };

    setBoardData((prev) => {
      const newCompanies = { ...prev.companies, [newId]: newCompany };
      const newCol = {
        ...prev.columns[status],
        companyIds: [...prev.columns[status].companyIds, newId],
      };
      return {
        ...prev,
        companies: newCompanies,
        columns: { ...prev.columns, [status]: newCol },
      };
    });
  };

  const updateCompany = (id: string, updatedFields: Partial<Company>) => {
    setBoardData((prev) => ({
      ...prev,
      companies: {
        ...prev.companies,
        [id]: { ...prev.companies[id], ...updatedFields },
      },
    }));
  };

  const deleteCompany = (id: string) => {
    setBoardData((prev) => {
      const company = prev.companies[id];
      if (!company) return prev;
      
      const newCompanies = { ...prev.companies };
      delete newCompanies[id];

      const status = company.status;
      const newCol = {
        ...prev.columns[status],
        companyIds: prev.columns[status].companyIds.filter((cId) => cId !== id),
      };

      return {
        ...prev,
        companies: newCompanies,
        columns: { ...prev.columns, [status]: newCol },
      };
    });
  };

  const moveCompany = (companyId: string, sourceCol: string, destCol: string, sourceIndex: number, destIndex: number) => {
    // ... Existing moveCompany implementation ...
  };

  const addTask = (taskData: Omit<Task, "id" | "isCompleted" | "createdAt">) => {
    const newId = crypto.randomUUID();
    const newTask: Task = {
      ...taskData,
      id: newId,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };

    setBoardData((prev) => ({
      ...prev,
      tasks: { ...prev.tasks, [newId]: newTask },
    }));
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: { ...prev.tasks[id], ...updatedFields },
      },
    }));
  };

  const deleteTask = (id: string) => {
    setBoardData((prev) => {
      const newTasks = { ...prev.tasks };
      delete newTasks[id];
      return { ...prev, tasks: newTasks };
    });
  };

  const toggleTaskStatus = (id: string) => {
    setBoardData((prev) => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [id]: { ...prev.tasks[id], isCompleted: !prev.tasks[id].isCompleted },
      },
    }));
  };

  if (!isLoaded) return null;

  return (
    <BoardContext.Provider value={{ 
      boardData, 
      addCompany, 
      updateCompany, 
      deleteCompany, 
      moveCompany,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus 
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
}
