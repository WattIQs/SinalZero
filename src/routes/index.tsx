import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Filter, MapPinned, Radar, Search, Star, LogOut, Bookmark, Crosshair, Instagram, Globe, Phone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LeadMap } from "../components/LeadMap";
import { searchLeads, searchPlaces } from "../lib/leads";
import type { Lead, SearchPlace } from "../lib/types";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/")({ component: Dashboard });
const categories = ["Restaurantes", "Academias", "Clínicas", "Salões", "Imobiliárias", "Hotéis", "Lojas"];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(undefined);
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState<SearchPlace | null>(null);
  const [suggestions, setSuggestions] = useState<SearchPlace[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selected, setSelected] = useState<string>();
  const [saved, setSaved] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [noWebsite, setNoWebsite] = useState(false);
  const [signal, setSignal] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem("sinalzero:saved") ?? "[]")); } catch { setSaved([]); } }, []);
  useEffect(() => { if (!supabase) { setUser(null); return; } void supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null)); const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null)); return () => data.subscription.unsubscribe(); }, []);
  useEffect(() => { if (user === null && supabase) void navigate({ to: "/auth" }); }, [user, navigate]);

  async function findPlaces() { if (!query.trim()) return; setError(""); try { setSuggestions(await searchPlaces(query)); } catch (e) { setError(e instanceof Error ? e.message : "Erro na busca."); } }
  async function scan() { if (!place) { setError("Escolha uma cidade ou região primeiro."); return; } setLoading(true); setError(""); try { const data = await searchLeads(place, selectedCategories); setLeads(data); if (!data.length) setError("Nenhum lead encontrado nessa área."); } catch (e) { setError(e instanceof Error ? e.message : "Erro ao buscar leads."); } finally { setLoading(false); } }
  function toggleSaved(id: string) { const next = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id]; setSaved(next); localStorage.setItem("sinalzero:saved", JSON.stringify(next)); }
  const visible = useMemo(() => leads.filter(l => (!noWebsite || !l.website) && (signal === "all" || (signal === "zero" ? l.signals === 3 : signal === "medium" ? l.signals === 2 : l.signals <= 1))), [leads, noWebsite, signal]);
  const center = place ? { lat: Number(place.lat), lon: Number(place.lon) } : { lat: -23.55, lon: -46.63 };

  if (user === undefined) return <div className="loading-screen"><Radar size={30}/> Carregando SinalZero...</div>;

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><Radar size={22}/><strong>SINAL<span>ZERO</span></strong><small>LEAD HUNTER</small></div>
      <div className="location-search"><MapPinned size={17}/><input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && void findPlaces()} placeholder="Busque cidade, bairro ou região..."/><button onClick={() => void findPlaces()}><Search size={17}/></button></div>
      <div className="top-actions"><span className="user-pill">{user?.user_metadata?.full_name || user?.email}</span><button className="icon-btn" title="Sair" onClick={async () => { await supabase?.auth.signOut(); await navigate({ to: "/auth" }); }}><LogOut size={17}/></button></div>
    </header>
    {suggestions.length > 0 && <div className="suggestions">{suggestions.map(s => <button key={`${s.lat}-${s.lon}`} onClick={() => { setPlace(s); setQuery(s.display_name); setSuggestions([]); }}><MapPinned size={15}/><span>{s.display_name}</span></button>)}</div>}
    <div className="workspace">
      <aside className="sidebar">
        <div className="scan-head"><div><span className="eyebrow">PROSPECÇÃO</span><h1>Caçar leads</h1></div><Crosshair size={26}/></div>
        <p className="muted">Encontre negócios, descubra sinais de oportunidade e monte sua lista comercial.</p>
        <div className="panel"><div className="panel-title"><span>Categoria</span><span>{selectedCategories.length} selecionadas</span></div><div className="chips">{categories.map(c => <button key={c} className={selectedCategories.includes(c) ? "chip active" : "chip"} onClick={() => setSelectedCategories(v => v.includes(c) ? v.filter(x => x !== c) : [...v, c])}>{c}</button>)}</div></div>
        <div className="panel"><div className="panel-title"><span><Filter size={15}/> Filtros de oportunidade</span></div><label className="check"><input type="checkbox" checked={noWebsite} onChange={e => setNoWebsite(e.target.checked)}/> Sem site</label><select value={signal} onChange={e => setSignal(e.target.value)}><option value="all">Todos os sinais</option><option value="zero">Sinal Zero — alta oportunidade</option><option value="medium">Sinal médio</option><option value="weak">Sinal fraco</option></select></div>
        <button className="primary scan" disabled={loading} onClick={() => void scan()}>{loading ? "Pesquisando..." : <><Radar size={18}/> PESQUISAR LEADS</>}</button>
        {error && <div className="alert error">{error}</div>}
        <div className="stats"><div><b>{visible.length}</b><span>encontrados</span></div><div><b>{visible.filter(l => l.signals === 3).length}</b><span>sinal zero</span></div><div><b>{saved.length}</b><span>salvos</span></div></div>
      </aside>
      <main className="results"><div className="results-header"><div><span className="eyebrow">RESULTADOS</span><h2>{place ? place.display_name.split(",")[0] : "Mapa de oportunidades"}</h2></div><div className="view-tabs"><button className="active">Lista</button><button>Mapa</button></div></div><div className="results-grid"><div className="lead-list">{visible.map(lead => <article key={lead.id} className={selected === lead.id ? "lead-card selected" : "lead-card"} onClick={() => setSelected(lead.id)}><div className="lead-top"><div className="signal"><span className={`dot s${lead.signals}`}/><b>{lead.signals === 3 ? "SINAL ZERO" : lead.signals === 2 ? "SINAL MÉDIO" : "SINAL FRACO"}</b></div><button className={saved.includes(lead.id) ? "save saved" : "save"} onClick={e => { e.stopPropagation(); toggleSaved(lead.id); }}><Bookmark size={17}/></button></div><h3>{lead.name}</h3><p className="address">{lead.address || "Endereço não informado"}</p><div className="lead-meta">{lead.website ? <span><Globe size={14}/> Site</span> : <span className="missing">Sem site</span>}{lead.phone && <span><Phone size={14}/> {lead.phone}</span>}{lead.instagram && <span><Instagram size={14}/> Instagram</span>}</div></article>)}{!visible.length && <div className="empty"><Radar size={34}/><h3>Pronto para caçar</h3><p>Escolha uma região, categoria e clique em pesquisar leads.</p></div>}</div><div className="map-wrap"><LeadMap leads={visible} selected={selected} onSelect={l => setSelected(l.id)} center={center}/><div className="map-badge"><Star size={14}/> {visible.length} oportunidades no mapa</div></div></div></main>
    </div>
  </div>;
}
