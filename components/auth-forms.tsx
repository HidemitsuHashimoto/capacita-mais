"use client";

import { useActionState } from "react";
import { loginAction, registerAction } from "@/actions/auth-actions";
import { emptyActionResult, type ActionResult } from "@/lib/action-result";

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
}: FieldProps): React.ReactElement {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2"
      />
    </label>
  );
}

function FormError({ state }: { state: ActionResult }): React.ReactElement | null {
  if (!state.message) {
    return null;
  }
  return (
    <p role="alert" className="rounded-2xl bg-clay/10 px-3 py-2 text-sm text-clay">
      {state.message}
    </p>
  );
}

export function LoginForm({
  nextPath,
}: {
  nextPath: string;
}): React.ReactElement {
  const [state, action, isPending] = useActionState(
    loginAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={nextPath} />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="current-password"
      />
      <FormError state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-forest px-4 py-3 font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export function RegisterForm(): React.ReactElement {
  const [state, action, isPending] = useActionState(
    registerAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      <Field label="Nome completo" name="name" autoComplete="name" />
      <Field
        label="E-mail"
        name="email"
        type="email"
        autoComplete="email"
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
      />
      <FormError state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-forest px-4 py-3 font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}
