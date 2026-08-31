import Link from 'next/link';
import { AuthForm } from '@/app/auth/AuthForm';
import { Input } from '@/app/auth/Input';
import { requestPasswordReset } from '@/app/auth/actions';

export default function RecuperarSenhaPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-slate-500">SinalZero</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950">Recuperar senha</h1>
      <p className="mt-2 text-sm text-slate-600">Informe seu e-mail para receber o link de recuperação.</p>
      <div className="mt-8">
        <AuthForm action={requestPasswordReset} submitLabel="Enviar link">
          <label className="block text-sm font-medium text-slate-700">
            E-mail
            <Input name="email" type="email" autoComplete="email" required />
          </label>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        <Link className="font-medium text-slate-950 hover:underline" href="/login">Voltar para o login</Link>
      </p>
    </section>
  );
}
