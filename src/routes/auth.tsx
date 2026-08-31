import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Mail, Radar, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => { if (data.session) void navigate({ to: "/" }); });
    const { data } = supabase.auth.onAuthStateChange((event, session) => { if (event === "SIGNED_IN" && session) void navigate({ to: "/" }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError(""); setMessage("");
    if (!supabase) { setError("Supabase não está configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
        if (error) throw error;
        await navigate({ to: "/" });
      } else {
        const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { full_name: name.trim() } } });
        if (error) throw error;
        if (data.session) await navigate({ to: "/" });
        else setMessage("Conta criada. Confirme seu e-mail para entrar.");
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível concluir a autenticação."); }
    finally { setLoading(false); }
  }

  return <main className="auth-page"><div className="auth-grid" /><div className="auth-orbit" /><section className="auth-card">
    <div className="brand-center"><Radar size={28} /><span>SINAL<span>ZERO</span></span></div>
    <div className="auth-icon">{mode === "login" ? <LockKeyhole /> : <UserRound />}</div>
    <h1>{mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}</h1>
    <p className="muted">{mode === "login" ? "Entre para acessar sua central de prospecção." : "Comece a encontrar e qualificar leads."}</p>
    <form onSubmit={submit}>
      {mode === "signup" && <label>Nome<div className="input-wrap"><UserRound size={17}/><input required value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" /></div></label>}
      <label>E-mail<div className="input-wrap"><Mail size={17}/><input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></div></label>
      <label>Senha<div className="input-wrap"><LockKeyhole size={17}/><input required minLength={6} type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"/><button type="button" onClick={() => setShowPassword(v => !v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
      {error && <div className="alert error">{error}</div>}{message && <div className="alert success">{message}</div>}
      <button className="primary full" disabled={loading}>{loading ? "Entrando..." : mode === "login" ? "Entrar" : "Criar conta"}</button>
    </form>
    <button className="link-button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); setMessage(""); }}>{mode === "login" ? "Ainda não tenho uma conta" : "Já tenho uma conta"}</button>
  </section></main>;
}
