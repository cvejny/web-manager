"use client";

import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { useBoard } from "@/context/BoardContext";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Circle, Clock, Building2, Trash2, Pencil, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaskModal } from "@/components/modals/TaskModal";
import { Task } from "@/types";
import { format, isToday, isPast, isTomorrow } from "date-fns";
import { cs } from "date-fns/locale";

export default function TasksPage() {
  const { boardData, toggleTaskStatus, deleteTask } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("pending");

  const tasks = Object.values(boardData.tasks || {});
  const companies = boardData.companies;

  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (filter === "pending") result = result.filter(t => !t.isCompleted);
    if (filter === "completed") result = result.filter(t => t.isCompleted);
    
    // Sort by due date (newest first)
    return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, filter]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const getDueDateLabel = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return "Dnes";
    if (isTomorrow(d)) return "Zítra";
    return format(d, "d. MMMM", { locale: cs });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300";
      case "Medium": return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300";
      case "Low": return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300";
      default: return "bg-slate-100 dark:bg-slate-500/20 text-slate-600";
    }
  };

  return (
    <main className="min-h-screen pb-20">
      <Header />
      
      <div className="container mx-auto max-w-5xl px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-black dark:text-white mb-1">Správa Úkolů</h2>
            <p className="text-slate-800 dark:text-slate-400 font-bold">Co je potřeba udělat pro vaše klienty</p>
          </div>
          
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl h-12 px-6 rounded-xl font-bold"
          >
            <Plus className="mr-2 h-5 w-5" /> Nový úkol
          </Button>
        </div>

        <div className="flex gap-2 mb-8 bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-fit border border-black/5 dark:border-white/5">
          <button 
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "pending" ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-400 hover:text-indigo-500"}`}
          >
            Aktivní
          </button>
          <button 
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "completed" ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-400 hover:text-indigo-500"}`}
          >
            Hotové
          </button>
          <button 
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === "all" ? "bg-white dark:bg-slate-800 shadow-md text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-400 hover:text-indigo-500"}`}
          >
            Všechny
          </button>
        </div>

        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="glass-card py-20 text-center border-dashed border-2">
              <p className="text-slate-500 font-bold">Žádné úkoly v této kategorii</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className={`glass-card p-5 border-l-4 transition-all hover:scale-[1.01] ${
                  task.priority === "High" ? "border-red-500 shadow-red-500/5" : 
                  task.priority === "Medium" ? "border-yellow-500 shadow-yellow-500/5" : "border-green-500 shadow-green-500/5"
                } ${task.isCompleted ? "opacity-60 grayscale-[0.5]" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-1 transition-transform active:scale-90"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-indigo-500 transition-colors" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-lg ${task.isCompleted ? "line-through text-slate-500" : "text-black dark:text-white"}`}>
                        {task.title}
                      </h3>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(task)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => confirm("Smazat úkol?") && deleteTask(task.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">
                        <Building2 className="w-3.5 h-3.5" />
                        {companies[task.companyId]?.name || "Neznámá firma"}
                      </div>
                      
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md ${
                        isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.isCompleted
                          ? "bg-red-100 dark:bg-red-500/20 text-red-600"
                          : "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-slate-400"
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        {getDueDateLabel(task.dueDate)} {task.dueTime && `@ ${task.dueTime}`}
                      </div>

                      <Badge variant="outline" className={`text-[10px] uppercase font-black ${getPriorityColor(task.priority)} border-none`}>
                        {task.priority}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-sm text-slate-800 dark:text-slate-400 leading-relaxed font-medium italic">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        task={editingTask}
      />
    </main>
  );
}
