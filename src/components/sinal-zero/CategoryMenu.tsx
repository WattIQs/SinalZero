import { Check, LayoutGrid, ChevronDown, Radar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, type CategoryKey } from "@/lib/types";

interface CategoryMenuProps { value: CategoryKey[]; onChange: (value: CategoryKey[]) => void; onScan?: () => void; scanning?: boolean; }
const ALL_KEYS = Object.keys(CATEGORY_LABELS) as CategoryKey[];

export function CategoryMenu({ value, onChange, onScan, scanning = false }: CategoryMenuProps) {
  const [open, setOpen] = useState(false);
  const toggle = (key: CategoryKey) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  return (
    <div className="flex min-w-0 shrink-0 items-center gap-1.5 overflow-visible">
      <Button type="button" onClick={onScan} disabled={scanning || !onScan} aria-label="Varrer área" className={cn("scan-action group relative h-9 max-w-full shrink-0 gap-2 rounded-lg border border-primary/70 px-3 text-xs font-semibold", "bg-primary text-primary-foreground hover:border-primary hover:bg-primary/95", "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0", "disabled:cursor-not-allowed disabled:opacity-60")}>
        <span className="relative flex min-w-0 items-center gap-2"><Radar className="h-3.5 w-3.5 shrink-0" /><span className="truncate">Varrer área</span></span>
      </Button>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild><Button variant="outline" size="sm" aria-expanded={open} className={cn("menu-trigger menu-trigger-categories relative z-[3001] h-10 shrink-0 gap-2 px-3.5 text-xs", open ? "border-cyan/75 bg-cyan/10 text-cyan" : value.length > 0 && "border-primary bg-primary/5")}><LayoutGrid className="h-4 w-4" /><span className="hidden sm:inline">{open ? "Categorias abertas" : "Categorias"}</span>{value.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">{value.length}</span>}<ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")} /></Button></PopoverTrigger>
        <PopoverContent align="start" sideOffset={10} className="menu-popover menu-popover-categories z-[5000] w-[min(94vw,340px)] max-w-[calc(100vw-24px)] p-3 text-foreground">
          <div className="mb-2.5 flex items-center justify-between gap-2 px-1"><div><span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-primary">Categorias</span><span className="text-[10px] text-foreground">Escolha uma ou mais áreas</span></div><button type="button" onClick={() => onChange(value.length === ALL_KEYS.length ? [] : ALL_KEYS)} className="rounded-md border border-primary/60 px-2 py-1 text-[10px] font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/10">{value.length === ALL_KEYS.length ? "Limpar" : "Todas"}</button></div>
          <div className="grid max-h-80 grid-cols-1 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">{ALL_KEYS.map((key) => { const active = value.includes(key); return <button key={key} type="button" onClick={() => toggle(key)} className={cn("flex min-h-9 items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] font-medium transition-colors duration-150", active ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_16px_-12px_rgba(255,173,0,.9)]" : "border-primary/30 text-foreground hover:border-primary/60 hover:bg-primary/5")}>{CATEGORY_LABELS[key]}{active && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}</button>; })}</div>
          <p className="mt-2 border-t border-primary/40 pt-2 text-center text-[9px] leading-relaxed text-foreground">Sem seleção = buscar todas as categorias disponíveis.</p>
        </PopoverContent>
      </Popover>
    </div>
  );
}
