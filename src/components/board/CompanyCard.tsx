"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Company } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Building2, Globe, MapPin, Calendar, Pencil, Trash2, Phone } from "lucide-react";
import { useBoard } from "@/context/BoardContext";
import { format } from "date-fns";
import { cs } from "date-fns/locale";

interface CompanyCardProps {
  company: Company;
  index: number;
  onEdit: (company: Company) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-300 border-red-300 dark:border-red-500/30";
    case "Medium": return "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-300 dark:border-yellow-500/30";
    case "Low": return "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-300 border-green-300 dark:border-green-500/30";
    default: return "bg-slate-100 dark:bg-slate-500/20 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-500/30";
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    maximumFractionDigits: 0
  }).format(value);
};

export function CompanyCard({ company, index, onEdit }: CompanyCardProps) {
  const { deleteCompany } = useBoard();

  return (
    <Draggable draggableId={company.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`glass-card p-4 mb-3 group relative border-l-4 ${
            snapshot.isDragging ? "shadow-2xl border-indigo-400 rotate-2 scale-105" : "hover:border-indigo-400/50"
          } ${company.status === "done" ? "border-emerald-500/50" : "border-transparent"}`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-black dark:text-slate-100 flex items-center gap-2 text-sm">
              <Building2 className="w-4 h-4 text-slate-900 dark:text-slate-400" />
              {company.name}
            </h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(company)}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-slate-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => {
                  if(confirm("Opravdu smazat?")) deleteCompany(company.id)
                }}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-900 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            {company.website && (
              <a 
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-200 flex items-center gap-1.5 w-max transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="w-3 h-3 text-indigo-800 dark:text-indigo-300" /> {company.website}
              </a>
            )}
            
            {company.address && (
              <p className="text-xs text-slate-900 dark:text-slate-400 flex items-center gap-1.5 line-clamp-1">
                <MapPin className="w-3 h-3 flex-shrink-0 text-slate-900 dark:text-slate-400" /> {company.address}
              </p>
            )}

            {company.phone && (
              <p className="text-xs text-slate-900 dark:text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3 h-3 flex-shrink-0 text-slate-900 dark:text-slate-400" /> 
                <a href={`tel:${company.phone}`} className="hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors" onClick={(e) => e.stopPropagation()}>{company.phone}</a>
              </p>
            )}

            <p className="text-xs text-slate-900 dark:text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 flex-shrink-0 text-slate-900 dark:text-slate-400" /> 
              {company.isContacted ? company.lastContact : <span className="text-amber-700 dark:text-amber-500/80 font-bold italic">Zatím nekontaktováno</span>}
            </p>
          </div>

          {company.notes && (
            <p className="text-xs text-slate-900 dark:text-slate-400 mb-3 bg-slate-200/50 dark:bg-white/5 p-2 rounded border border-black/10 dark:border-white/5 italic line-clamp-2">
              "{company.notes}"
            </p>
          )}

          <div className="flex items-center justify-between mt-4">
            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-bold border-black/10 dark:border-transparent ${getPriorityColor(company.priority)}`}>
              {company.priority} Priority
            </Badge>
            <span className="text-xs font-black text-black dark:text-slate-200">
              {formatCurrency(company.revenue)}
            </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}
