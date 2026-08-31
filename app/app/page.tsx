import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-medium text-slate-500">SinalZero</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
          Monitoramento energético empresarial.
        </h1>
        <p className="mt-4 max-w-xl text-slate-600">
          A nova aplicação está sendo construída sobre uma base limpa, com autenticação real e Supabase.
        </p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-lg bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-0.5" href="/login">
            Entrar
          </Link>
          <Link className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition-colors duration-200 hover:bg-slate-50" href="/cadastro">
            Criar conta
          </Link>
        </div>
      </section>
    </main>
  );
}
