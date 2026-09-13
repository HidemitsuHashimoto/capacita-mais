"use client";

import { useActionState } from "react";
import {
  createCourseAction,
  updateCourseAction,
} from "@/actions/admin-actions";
import { emptyActionResult, type ActionResult } from "@/lib/action-result";

export type AdminCourseFormValues = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  workloadHours: number;
  isFree: boolean;
  priceLabel: string;
  isAccessible: boolean;
  targetAudience: string;
  maxSeats: number;
  listedSeatsRemaining: number;
  isDemo: boolean;
};

type AdminCourseFormProps = {
  courseId?: string;
  values: AdminCourseFormValues;
  submitLabel: string;
};

const fieldClass =
  "mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2";

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

export function AdminCourseForm({
  courseId,
  values,
  submitLabel,
}: AdminCourseFormProps): React.ReactElement {
  const actionFn = courseId ? updateCourseAction : createCourseAction;
  const [state, action, isPending] = useActionState(
    actionFn,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      {courseId ? <input type="hidden" name="courseId" value={courseId} /> : null}
      <label className="block text-sm font-medium text-ink">
        Título
        <input
          name="title"
          defaultValue={values.title}
          required
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Endereço (slug)
        <input
          name="slug"
          defaultValue={values.slug}
          placeholder="gerado a partir do título se ficar em branco"
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Resumo
        <textarea
          name="summary"
          defaultValue={values.summary}
          required
          rows={3}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Descrição
        <textarea
          name="description"
          defaultValue={values.description}
          required
          rows={6}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        Público-alvo
        <input
          name="targetAudience"
          defaultValue={values.targetAudience}
          required
          className={fieldClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Carga horária (horas)
          <input
            name="workloadHours"
            type="number"
            min={1}
            step={1}
            defaultValue={values.workloadHours}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Rótulo de preço
          <input
            name="priceLabel"
            defaultValue={values.priceLabel}
            placeholder="Gratuito ou R$ 89"
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Vagas totais
          <input
            name="maxSeats"
            type="number"
            min={0}
            step={1}
            defaultValue={values.maxSeats}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Vagas restantes (listadas)
          <input
            name="listedSeatsRemaining"
            type="number"
            min={0}
            step={1}
            defaultValue={values.listedSeatsRemaining}
            required
            className={fieldClass}
          />
        </label>
      </div>
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="isFree"
            defaultChecked={values.isFree}
            className="h-4 w-4 accent-forest"
          />
          Curso gratuito
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="isAccessible"
            defaultChecked={values.isAccessible}
            className="h-4 w-4 accent-forest"
          />
          Conteúdo acessível
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="isDemo"
            defaultChecked={values.isDemo}
            className="h-4 w-4 accent-forest"
          />
          Curso demonstração
        </label>
      </div>
      <FormError state={state} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}
