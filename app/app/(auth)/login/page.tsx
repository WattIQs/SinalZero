import Link from 'next/link';
import { AuthForm } from '@/app/auth/AuthForm';
import { Input } from '@/app/auth/Input';
import { signIn } from '@/app/auth/actions';

export default function LoginPage() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-slate-500">SinalZero</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-950">Entrar</h1>
      <p className="mt-2 text-sm text-slate-600">Acesse sua conta para continuar.</p>

      <div className="mt-8">
        <AuthForm action={signIn} submitLabel="Entrar">
          <label className="block text-sm font-medium text-slate-700">
            E-mail
            <Input name="email" type="email" autoComplete="email" required />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Senha
            <Input name="password" type="password" autoComplete="current-password" required />
          </label>
        </AuthForm>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link className="text-slate-600 hover:text-slate-950" href="/recuperar-senha">Esqueci minha senha</Link>
        <Link className="font-medium text-slate-950 hover:underline" href="/cadastro">Criar conta</Link>
      </div>
    </section>
  );
}
