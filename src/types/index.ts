export type Priority = "High" | "Medium" | "Low";

export interface Company {
  id: string;
  name: string;
  website: string;
  email?: string;
  address: string;
  phone: string;
  isContacted: boolean;
  lastContact: string; // ISO date string or just string
  notes: string;
  priority: Priority;
  revenue: number; // Předpokládaná cena zakázky
  status: string; // References Column ID
}

export interface ColumnData {
  id: string;
  title: string;
  companyIds: string[];
}

export interface Task {
  id: string;
  companyId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string; // ISO date string
  dueTime?: string; // HH:mm
  isAllDay: boolean;
  isCompleted: boolean;
  createdAt: string;
}

export interface BoardData {
  companies: Record<string, Company>;
  columns: Record<string, ColumnData>;
  tasks: Record<string, Task>;
  columnOrder: string[];
}

export const initialBoardData: BoardData = {
  companies: {},
  tasks: {},
  columns: {
    "lead": { id: "lead", title: "Potenciální (Lead)", companyIds: [] },
    "contacted": { id: "contacted", title: "Kontaktováno", companyIds: [] },
    "in-progress": { id: "in-progress", title: "V realizaci", companyIds: [] },
    "done": { id: "done", title: "Hotovo", companyIds: [] },
  },
  columnOrder: ["lead", "contacted", "in-progress", "done"],
};
