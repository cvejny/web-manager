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
import { Company, Priority } from "@/types";

interface CompanyModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  company?: Company | null;
}

export function CompanyModal({ isOpen, onOpenChange, company }: CompanyModalProps) {
  const { addCompany, updateCompany } = useBoard();
  
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [isContacted, setIsContacted] = useState(false);
  const [lastContact, setLastContact] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [revenue, setRevenue] = useState("");
  const [status, setStatus] = useState("lead");

  useEffect(() => {
    if (company) {
      setName(company.name);
      setWebsite(company.website);
      setAddress(company.address);
      setPhone(company.phone || "");
      setIsContacted(company.isContacted ?? true);
      setLastContact(company.lastContact);
      setNotes(company.notes);
      setPriority(company.priority);
      setRevenue(company.revenue.toString());
      setStatus(company.status);
    } else {
      setName("");
      setWebsite("");
      setAddress("");
      setPhone("");
      setIsContacted(false);
      setLastContact(new Date().toISOString().split('T')[0]);
      setNotes("");
      setPriority("Medium");
      setRevenue("0");
      setStatus("lead");
    }
  }, [company, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    if (company) {
      updateCompany(company.id, {
        name,
        website,
        address,
        phone,
        isContacted,
        lastContact,
        notes,
        priority,
        revenue: Number(revenue) || 0,
      });
    } else {
      addCompany({
        name,
        website,
        address,
        phone,
        isContacted,
        lastContact,
        notes,
        priority,
        revenue: Number(revenue) || 0,
      }, status);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-white dark:bg-slate-900/90 border-black/20 dark:border-white/10 text-black dark:text-slate-200 glass-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 dark:from-indigo-200 dark:to-purple-200 bg-clip-text text-transparent">
            {company ? "Upravit firmu" : "Přidat novou firmu"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Název firmy <span className="text-red-600 dark:text-red-400">*</span></Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Webová adresa</Label>
              <Input id="website" placeholder="www.example.com" value={website} onChange={e => setWebsite(e.target.value)} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Předpokládaná cena (Kč)</Label>
              <Input id="revenue" type="number" placeholder="50000" value={revenue} onChange={e => setRevenue(e.target.value)} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Fyzická adresa</Label>
              <Input id="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Telefonní číslo</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-black font-semibold dark:text-slate-300 dark:font-normal">Priorita</Label>
              <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                <SelectTrigger className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus:ring-indigo-500/50 text-black dark:text-slate-200">
                  <SelectValue placeholder="Vyberte prioritu" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-black/20 dark:border-white/10 text-black dark:text-slate-200">
                  <SelectItem value="High" className="text-red-600 font-semibold dark:text-red-400 focus:bg-slate-100 dark:focus:bg-white/5">Vysoká</SelectItem>
                  <SelectItem value="Medium" className="text-yellow-600 font-semibold dark:text-yellow-400 focus:bg-slate-100 dark:focus:bg-white/5">Střední</SelectItem>
                  <SelectItem value="Low" className="text-green-600 font-semibold dark:text-green-400 focus:bg-slate-100 dark:focus:bg-white/5">Nízká</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lastContact" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Datum posledního kontaktu</Label>
                <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={!isContacted} onChange={e => setIsContacted(!e.target.checked)} className="rounded border-black/20 dark:border-white/10 bg-white dark:bg-slate-800/50 text-indigo-600 focus:ring-indigo-500/50" />
                  Zatím nekontaktováno
                </label>
              </div>
              <Input id="lastContact" type="date" value={lastContact} onChange={e => setLastContact(e.target.value)} disabled={!isContacted} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus-visible:ring-indigo-500/50 disabled:opacity-50 text-black dark:text-slate-200" />
            </div>
          </div>
          
          {!company && (
            <div className="space-y-2">
              <Label className="text-black font-semibold dark:text-slate-300 dark:font-normal">Výchozí status (sloupec)</Label>
              <Select value={status} onValueChange={(val) => setStatus(val || "lead")}>
                <SelectTrigger className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 focus:ring-indigo-500/50 text-black dark:text-slate-200">
                  <SelectValue placeholder="Vyberte sloupec" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-black/20 dark:border-white/10 text-black dark:text-slate-200">
                  <SelectItem value="lead" className="focus:bg-slate-100 dark:focus:bg-white/5">Potenciální (Lead)</SelectItem>
                  <SelectItem value="contacted" className="focus:bg-slate-100 dark:focus:bg-white/5">Kontaktováno</SelectItem>
                  <SelectItem value="in-progress" className="focus:bg-slate-100 dark:focus:bg-white/5">V realizaci</SelectItem>
                  <SelectItem value="done" className="focus:bg-slate-100 dark:focus:bg-white/5">Hotovo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-black font-semibold dark:text-slate-300 dark:font-normal">Poznámky</Label>
            <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} className="bg-white dark:bg-slate-800/50 border-black/20 dark:border-white/10 min-h-[80px] focus-visible:ring-indigo-500/50 text-black dark:text-slate-200" />
          </div>

          <DialogFooter className="pt-4 border-t border-black/20 dark:border-white/10">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-red-50 hover:dark:bg-red-500/20 hover:text-red-700 hover:dark:text-red-300 text-slate-700 dark:text-slate-400 transition-colors">
              Zrušit
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white shadow-lg font-bold">
              {company ? "Uložit změny" : "Přidat firmu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
