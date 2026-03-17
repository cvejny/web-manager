"use client";

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnData, Company } from "@/types";
import { CompanyCard } from "./CompanyCard";
import { Badge } from "@/components/ui/badge";

interface ColumnProps {
  column: ColumnData;
  companies: Company[];
  onEditCompany: (company: Company) => void;
}

const getColumnColor = (id: string, isDraggingOver: boolean) => {
  if (isDraggingOver) return "ring-2 ring-indigo-500/50 bg-slate-100/60 dark:bg-slate-800/60";
  return "bg-slate-50/40 dark:bg-slate-900/40";
};

const getHeaderColor = (id: string) => {
  switch (id) {
    case "lead": return "border-b-indigo-600 dark:border-b-indigo-500/30 text-indigo-900 dark:text-indigo-200";
    case "contacted": return "border-b-blue-600 dark:border-b-blue-500/30 text-blue-900 dark:text-blue-200";
    case "in-progress": return "border-b-pink-600 dark:border-b-pink-500/30 text-pink-900 dark:text-pink-200";
    case "done": return "border-b-emerald-600 dark:border-b-emerald-500/30 text-emerald-900 dark:text-emerald-200";
    default: return "border-b-slate-600 dark:border-b-slate-500/30 text-black dark:text-slate-200";
  }
};

export function Column({ column, companies, onEditCompany }: ColumnProps) {
  const totalRevenue = companies.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);
  const formattedRevenue = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  return (
    <div className="flex flex-col flex-1 min-w-[280px] md:min-w-0 w-80">
      <div className={`glass-panel bg-white/95 dark:bg-slate-900/40 p-5 mb-4 border-b-2 flex justify-between items-center ${getHeaderColor(column.id)} rounded-b-none shadow-md`}>
        <h2 className="font-bold text-lg uppercase tracking-wider">{column.title}</h2>
        <Badge variant="secondary" className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-black dark:text-slate-200 border-none px-2 py-1 text-sm">
          {companies.length}
        </Badge>
      </div>

      <div className="px-2 mb-3 flex justify-between text-base text-slate-800 dark:text-slate-400 font-bold px-4">
        <span>Obrat sloupce</span>
        <span className="text-black dark:text-slate-300 text-lg">{formattedRevenue}</span>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-2 rounded-xl transition-colors duration-200 min-h-[500px] border border-black/5 dark:border-white/5 ${getColumnColor(
              column.id,
              snapshot.isDraggingOver
            )}`}
          >
            {companies.map((company, index) => (
              <CompanyCard 
                key={company.id} 
                company={company} 
                index={index} 
                onEdit={onEditCompany}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
