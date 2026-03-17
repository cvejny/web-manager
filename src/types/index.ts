export type Priority = "High" | "Medium" | "Low";

export interface Company {
  id: string;
  name: string;
  website: string;
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

export interface BoardData {
  companies: Record<string, Company>;
  columns: Record<string, ColumnData>;
  columnOrder: string[];
}

export const initialBoardData: BoardData = {
  companies: {},
  columns: {
    "lead": { id: "lead", title: "Potenciální (Lead)", companyIds: [] },
    "contacted": { id: "contacted", title: "Kontaktováno", companyIds: [] },
    "in-progress": { id: "in-progress", title: "V realizaci", companyIds: [] },
    "done": { id: "done", title: "Hotovo", companyIds: [] },
  },
  columnOrder: ["lead", "contacted", "in-progress", "done"],
};
