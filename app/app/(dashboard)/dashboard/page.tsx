import { createClient } from '@/app/lib/supabase/server';
import { signOut } from '@/app/auth/actions';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-500">SinalZero</p>
            <h1 className="text-xl font-semibold text-slate-950">Dashboard</h1>
          </div>
          <form action={signOut}>
            <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:bg-slate-50" type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Conta autenticada</p>
          <p className="mt-2 font-medium text-slate-950">{user.email}</p>
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8">
            <h2 className="font-semibold text-slate-900">Nenhum dado de consumo disponível</h2>
            <p className="mt-2 text-sm text-slate-600">O período selecionado ainda não possui leituras cadastradas.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
