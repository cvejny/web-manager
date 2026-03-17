"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBoard } from "@/context/BoardContext";
import { Task, Priority } from "@/types";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

interface TaskModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onOpenChange, task }: TaskModalProps) {
  const { boardData, addTask, updateTask } = useBoard();
  
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(true);

  const companies = Object.values(boardData.companies);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setCompanyId(task.companyId);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate);
        setDueTime(task.dueTime || "");
        setIsAllDay(task.isAllDay);
      } else {
        setTitle("");
        // If we have companies and no companyId is set, pick the first one
        if (companies.length > 0 && !companyId) {
          setCompanyId(companies[0].id);
        }
        setDescription("");
        setPriority("Medium");
        setDueDate(new Date().toISOString().split('T')[0]);
        setDueTime("12:00");
        setIsAllDay(true);
      }
    }
  }, [task, isOpen, companies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyId) return;

    const taskData = {
      title,
      companyId,
      description,
      priority,
      dueDate,
      dueTime: isAllDay ? undefined : dueTime,
      isAllDay,
    };

    if (task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900/90 border-black/20 dark:border-white/10 glass-card font-sans">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 dark:from-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            {task ? "Upravit úkol" : "Přidat nový úkol"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="font-bold text-black dark:text-slate-300">Název úkolu <span className="text-red-500">*</span></Label>
            <Input 
              id="title" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required 
              className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="font-bold text-black dark:text-slate-300">Přiřadit k firmě <span className="text-red-500">*</span></Label>
            <Select 
              value={companyId} 
              onValueChange={(val) => setCompanyId(val || "")}
            >
              <SelectTrigger className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10">
                <SelectValue placeholder="Vyberte firmu">
                  {companies.find(c => c.id === companyId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-black/20 dark:border-white/10">
                {companies.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-bold text-black dark:text-slate-300">Datum splnění</Label>
              <Input 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)}
                className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-bold text-black dark:text-slate-300">Čas</Label>
                <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAllDay} 
                    onChange={e => setIsAllDay(e.target.checked)}
                    className="rounded border-grey-300"
                  />
                  Celý den
                </label>
              </div>
              <Input 
                type="time" 
                value={dueTime} 
                onChange={e => setDueTime(e.target.value)}
                disabled={isAllDay}
                className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 disabled:opacity-30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold text-black dark:text-slate-300">Priorita</Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
              <SelectTrigger className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-black/20 dark:border-white/10">
                <SelectItem value="High" className="text-red-500 font-bold">Vysoká</SelectItem>
                <SelectItem value="Medium" className="text-yellow-600 font-bold">Střední</SelectItem>
                <SelectItem value="Low" className="text-green-600 font-bold">Nízká</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="font-bold text-black dark:text-slate-300">Popis úkolu</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 min-h-[100px]"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-black/5 dark:border-white/5">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Zrušit
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold px-8 shadow-lg">
              {task ? "Uložit změny" : "Vytvořit úkol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
