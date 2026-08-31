'use client';

import { useActionState, type ReactNode } from 'react';

type AuthState = { error?: string };
type Action = (state: AuthState, formData: FormData) => Promise<AuthState>;

type AuthFormProps = {
  action: Action;
  submitLabel: string;
  children: ReactNode;
};

export function AuthForm({ action, submitLabel, children }: AuthFormProps) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(action, {});

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
