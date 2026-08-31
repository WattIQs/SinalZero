import Link from 'next/link';
import { AuthForm } from '@/app/auth/AuthForm';
import { Input } from '@/app/auth/Input';
import { updatePassword } from '@/app/auth/actions';

export default function RedefinirSenhaPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-slate-500">SinalZero</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950">Nova senha</h1>
      <p className="mt-2 text-sm text-slate-600">Defina uma nova senha para sua conta.</p>
      <div className="mt-8">
        <AuthForm action={updatePassword} submitLabel="Atualizar senha">
          <label className="block text-sm font-medium text-slate-700">
            Nova senha
            <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
          </label>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link className="font-medium text-slate-950 hover:underline" href="/login">Voltar para o login</Link>
      </p>
    </section>
  );
}
