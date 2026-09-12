"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile-actions";
import { emptyActionResult } from "@/lib/action-result";

type ProfileFormProps = {
  name: string;
  email: string;
  phone: string;
  isPwd: boolean;
};

export function ProfileForm({
  name,
  email,
  phone,
  isPwd,
}: ProfileFormProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    updateProfileAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium text-ink">
        Nome completo
        <input
          name="name"
          defaultValue={name}
          required
          className="mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2"
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        E-mail
        <input
          value={email}
          disabled
          className="mt-1 w-full rounded-2xl border border-ink/10 bg-mist px-3 py-2.5 text-base text-ink/60"
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Telefone
        <input
          name="phone"
          type="tel"
          defaultValue={phone}
          placeholder="(11) 99999-0000"
          className="mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2"
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-ink">
        <input
          type="checkbox"
          name="isPwd"
          defaultChecked={isPwd}
          className="h-4 w-4 accent-forest"
        />
        Sou pessoa com deficiência (PcD)
      </label>
      {state.message ? (
        <p role="alert" className="text-sm text-clay">
          {state.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Salvar perfil"}
      </button>
    </form>
  );
}
