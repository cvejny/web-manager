"use client";

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { ColumnData, Company } from "@/types";
import { CompanyCard } from "./CompanyCard";
import { Badge } from "@/components/ui/badge";
import { XCircle, RefreshCw, UserX } from "lucide-react";
import { useBoard } from "@/context/BoardContext";
import { Button } from "@/components/ui/button";

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
  const { boardData, restoreCompany } = useBoard();
  const [showRejected, setShowRejected] = React.useState(false);

  const rejectedCompanies = React.useMemo(() => 
    Object.values(boardData.companies).filter(c => c.isRejected && c.status === column.id),
    [boardData.companies, column.id]
  );

  const totalRevenue = companies.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);
  const formattedRevenue = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0
  }).format(totalRevenue);

  return (
    <div className="flex flex-col flex-1 min-w-[280px] md:min-w-0 w-80">
      <div className={`glass-panel bg-white/95 dark:bg-slate-900/40 p-5 mb-4 border-b-2 flex justify-between items-center ${getHeaderColor(column.id)} rounded-b-none shadow-md relative overflow-visible`}>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg uppercase tracking-wider">{column.title}</h2>
          {column.id === "contacted" && (
            <button 
              onClick={() => setShowRejected(!showRejected)}
              className={`p-1 rounded-full transition-colors ${showRejected ? 'bg-red-100 text-red-600 dark:bg-red-900/40' : 'hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400'}`}
              title="Zobrazit odmítnuté"
            >
              <UserX size={18} />
            </button>
          )}
        </div>
        <Badge variant="secondary" className="bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-black dark:text-slate-200 border-none px-2 py-1 text-sm">
          {companies.length}
        </Badge>

        {showRejected && column.id === "contacted" && (
          <div className="absolute top-full left-0 w-full z-50 bg-white/95 dark:bg-slate-900 shadow-2xl rounded-b-xl border border-indigo-500/20 dark:border-indigo-500/30 p-3 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-black/5 dark:border-white/5">
              <span className="text-xs font-bold uppercase text-slate-500">Odmítnuté firmy</span>
              <button onClick={() => setShowRejected(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={14} /></button>
            </div>
            {rejectedCompanies.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-2">Žádné odmítnuté firmy</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {rejectedCompanies.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-2 rounded bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <span className="text-sm font-medium truncate flex-1 mr-2 text-black dark:text-white">{c.name}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-7 px-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                      onClick={() => restoreCompany(c.id)}
                    >
                      <RefreshCw size={14} className="mr-1" /> Obnovit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
