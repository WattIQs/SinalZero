import Link from 'next/link';
import { AuthForm } from '@/app/auth/AuthForm';
import { Input } from '@/app/auth/Input';
import { signUp } from '@/app/auth/actions';

export default function CadastroPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-slate-500">SinalZero</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950">Criar conta</h1>
      <p className="mt-2 text-sm text-slate-600">Cadastre seu acesso para iniciar.</p>
      <div className="mt-8">
        <AuthForm action={signUp} submitLabel="Criar conta">
          <label className="block text-sm font-medium text-slate-700">
            Nome
            <Input name="displayName" type="text" autoComplete="name" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            E-mail
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Senha
            <Input name="password" type="password" autoComplete="new-password" minLength={8} required />
          </label>
        </AuthForm>
      </div>
      <p className="mt-6 text-center text-sm text-slate-600">
        Já possui uma conta? <Link className="font-medium text-slate-950 hover:underline" href="/login">Entrar</Link>
      </p>
    </section>
  );
}
