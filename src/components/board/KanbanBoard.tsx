"use client";

import React, { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useBoard } from "@/context/BoardContext";
import { Column } from "./Column";
import { Company } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { CompanyModal } from "@/components/modals/CompanyModal";

export function KanbanBoard() {
  const { boardData, moveCompany } = useBoard();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveCompany(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-900 dark:text-slate-400" />
            <Input 
              placeholder="Vyhledat firmu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-900/50 border-black/20 dark:border-white/10 text-black dark:text-slate-200 focus:border-indigo-500/50 focus:ring-indigo-500/20 backdrop-blur-md h-12 rounded-xl"
            />
          </div>
          
          <Button 
            onClick={handleAddNew}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 whitespace-nowrap h-12 px-6 rounded-xl"
          >
            <Plus className="mr-2 h-5 w-5" /> Přidat firmu
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-8 px-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full items-start w-max mx-auto px-2">
            {boardData.columnOrder.map((colId) => {
              const column = boardData.columns[colId];
              const companies = column.companyIds
                .map((companyId) => boardData.companies[companyId])
                .filter(company => 
                  company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  company.website.toLowerCase().includes(searchTerm.toLowerCase())
                );

              return (
                <Column 
                  key={column.id} 
                  column={column} 
                  companies={companies} 
                  onEditCompany={handleEdit}
                />
              );
            })}
          </div>
        </DragDropContext>
      </div>

      <CompanyModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        company={editingCompany}
      />
    </div>
  );
}
