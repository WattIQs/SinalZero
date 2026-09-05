import { useEffect, useRef, useState } from "react";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { searchPlacesServer, type PlaceSuggestion } from "@/lib/geo.functions";
import {
  resolveMunicipalityServer,
  searchMunicipalitiesServer,
  type MunicipalitySuggestion,
} from "@/lib/municipality-search";
import { findBrazilianStates, type BrazilianState } from "@/lib/brazilian-states";
import { cn } from "@/lib/utils";

interface PlaceSearchBarProps {
  onPick: (place: PlaceSuggestion | null) => void;
  scanning: boolean;
  currentLabel: string | null;
}
type SearchSuggestion =
  | { kind: "state"; value: BrazilianState }
  | { kind: "municipality"; value: MunicipalitySuggestion }
  | { kind: "place"; value: PlaceSuggestion };

const MIN_SEARCH_FEEDBACK_MS = 180;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function PlaceSearchBar({ onPick, scanning, currentLabel }: PlaceSearchBarProps) {
  const searchMunicipalities = useServerFn(searchMunicipalitiesServer);
  const resolveMunicipality = useServerFn(resolveMunicipalityServer);
  const searchPlaces = useServerFn(searchPlacesServer);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const pickedLabelRef = useRef<string | null>(null);
  useEffect(() => {
    if (pickedLabelRef.current !== null && value === pickedLabelRef.current) return;
    const term = value.trim();
    if (term.length < 2) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    const id = ++requestIdRef.current;
    let cancelled = false;
    const startedAt = performance.now();
    const states = findBrazilianStates(term);
    setSuggestions(states.map((item) => ({ kind: "state" as const, value: item })));
    setHighlight(0);
    setOpen(states.length > 0);
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const municipalities = await searchMunicipalities({ data: { q: term } });
        if (cancelled || id !== requestIdRef.current) return;
        const places =
          municipalities.length || states.length ? [] : await searchPlaces({ data: { q: term } });
        if (cancelled || id !== requestIdRef.current) return;
        const next: SearchSuggestion[] = [
          ...states.map((item) => ({ kind: "state" as const, value: item })),
          ...municipalities
            .slice(0, states.length ? 5 : 8)
            .map((item) => ({ kind: "municipality" as const, value: item })),
          ...(!municipalities.length
            ? places
                .slice(0, Math.max(0, 8 - states.length))
                .map((item) => ({ kind: "place" as const, value: item }))
            : []),
        ];
        if (cancelled || id !== requestIdRef.current) return;
        setSuggestions(next);
        setHighlight(0);
        setOpen(next.length > 0);
      } catch {
        if (!cancelled && id === requestIdRef.current) {
          setSuggestions(states.map((item) => ({ kind: "state" as const, value: item })));
          setOpen(states.length > 0);
        }
      } finally {
        if (!cancelled && id === requestIdRef.current) {
          const remaining = Math.max(0, MIN_SEARCH_FEEDBACK_MS - (performance.now() - startedAt));
          if (remaining) await wait(remaining);
          if (!cancelled && id === requestIdRef.current) setLoading(false);
        }
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, searchMunicipalities, searchPlaces]);
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!boxRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const pick = async (suggestion: SearchSuggestion) => {
    const pickId = ++requestIdRef.current;
    setLoading(false);
    if (suggestion.kind === "state") {
      const state = suggestion.value;
      const place: PlaceSuggestion = {
        label: `Estado de ${state.name}, Brasil`,
        shortLabel: `${state.name}, ${state.code}`,
        lat: state.lat,
        lon: state.lon,
        boundingBox: null,
        scope: "state",
        stateCode: state.code,
      };
      pickedLabelRef.current = place.shortLabel;
      setSuggestions([]);
      setValue(place.shortLabel);
      setOpen(false);
      onPick(place);
      return;
    }
    if (suggestion.kind === "place") {
      const place = suggestion.value;
      pickedLabelRef.current = place.shortLabel;
      setSuggestions([]);
      setValue(place.shortLabel);
      setOpen(false);
      onPick(place);
      return;
    }
    const startedAt = performance.now();
    setLoading(true);
    setOpen(false);
    try {
      const resolved = await resolveMunicipality({
        data: { name: suggestion.value.name, uf: suggestion.value.uf },
      });
      if (!resolved || pickId !== requestIdRef.current) return;
      pickedLabelRef.current = resolved.shortLabel;
      setSuggestions([]);
      setValue(resolved.shortLabel);
      onPick(resolved);
    } catch {
      setSuggestions([]);
    } finally {
      const remaining = Math.max(0, MIN_SEARCH_FEEDBACK_MS - (performance.now() - startedAt));
      if (remaining) await wait(remaining);
      setLoading(false);
    }
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !suggestions.length) {
      if (event.key === "Escape") setOpen(false);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlight((n) => (n + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlight((n) => (n - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = suggestions[highlight];
      if (item) void pick(item);
    } else if (event.key === "Escape") setOpen(false);
  };
  const showSpinner = loading || scanning;
  return (
    <div ref={boxRef} className="relative min-w-0 flex-1">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 flex h-4 w-4 -translate-y-1/2 items-center justify-center text-muted-foreground">
        {showSpinner ? (
          <LoaderCircle className="h-4 w-4 search-spinner text-primary" aria-hidden="true" />
        ) : (
          <Search className="h-3.5 w-3.5" />
        )}
      </span>
      <input
        disabled={scanning}
        role="combobox"
        aria-expanded={open}
        aria-controls="place-suggestions"
        value={value}
        onChange={(e) => {
          pickedLabelRef.current = null;
          requestIdRef.current += 1;
          onPick(null);
          setValue(e.target.value);
        }}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={currentLabel ?? "Buscar cidade, estado, bairro ou endereço"}
        aria-label="Buscar lugar no mapa"
        autoComplete="off"
        inputMode="search"
        className="h-10 w-full rounded-full border border-border bg-background/95 pl-9 pr-3 text-[13px] outline-none transition-[border-color,box-shadow,transform] duration-500 ease-out placeholder:text-muted-foreground/70 focus:-translate-y-px focus:border-primary focus:ring-4 focus:ring-primary/10 sm:h-9 sm:text-xs"
      />
      {open && value !== pickedLabelRef.current && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-[900] origin-top overflow-hidden rounded-2xl border border-border bg-popover/98 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2 text-[10px] font-medium text-muted-foreground">
            <span>Selecione o local correto antes de varrer</span>
            <span>
              {suggestions.length} resultado{suggestions.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul
            id="place-suggestions"
            className="max-h-[min(18rem,55vh)] overflow-y-auto overscroll-contain"
          >
            {suggestions.map((suggestion, index) => {
              const label =
                suggestion.kind === "state"
                  ? `Estado · ${suggestion.value.name}`
                  : suggestion.kind === "municipality"
                    ? suggestion.value.label
                    : suggestion.value.shortLabel;
              const detail =
                suggestion.kind === "state"
                  ? `${suggestion.value.code} · buscar em todo o estado`
                  : suggestion.kind === "place"
                    ? suggestion.value.label
                    : undefined;
              return (
                <li key={`${suggestion.kind}-${index}`}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => void pick(suggestion)}
                    className={cn(
                      "flex min-h-12 w-full items-start gap-2 px-3 py-2.5 text-left transition-all duration-200 ease-out active:scale-[.99]",
                      index === highlight ? "bg-muted" : "hover:bg-muted/60",
                    )}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="min-w-0">
                      <span className="block truncate text-xs font-semibold text-foreground sm:text-sm">
                        {label}
                      </span>
                      {detail && (
                        <span className="mt-0.5 block line-clamp-2 text-[10px] leading-4 text-muted-foreground sm:text-[11px]">
                          {detail}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
