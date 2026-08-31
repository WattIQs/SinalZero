'use client';

import { useActionState } from 'react';

type AuthState = { error?: string };
type Action = (formData: FormData) => Promise<AuthState>;

export function AuthForm({ action, submitLabel, children }: { action: Action; submitLabel: string; children: React.ReactNode }) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-5">
      {children}
      {state.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-slate-950 px-4 py-3 text-sm font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Processando…' : submitLabel}
      </button>
    </form>
  );
}
