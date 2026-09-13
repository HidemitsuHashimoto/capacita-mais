"use client";

import { useActionState } from "react";
import {
  createLessonAction,
  updateLessonAction,
} from "@/actions/admin-actions";
import { emptyActionResult, type ActionResult } from "@/lib/action-result";

export type AdminLessonFormValues = {
  title: string;
  body: string;
  videoUrl: string;
  sortOrder: number;
  durationMinutes: number;
};

type AdminLessonFormProps = {
  courseId: string;
  lessonId?: string;
  values: AdminLessonFormValues;
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

export function AdminLessonForm({
  courseId,
  lessonId,
  values,
  submitLabel,
}: AdminLessonFormProps): React.ReactElement {
  const actionFn = lessonId ? updateLessonAction : createLessonAction;
  const [state, action, isPending] = useActionState(
    actionFn,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="courseId" value={courseId} />
      {lessonId ? <input type="hidden" name="lessonId" value={lessonId} /> : null}
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
        Conteúdo (Markdown)
        <textarea
          name="body"
          defaultValue={values.body}
          required
          rows={14}
          className={fieldClass}
        />
      </label>
      <label className="block text-sm font-medium text-ink">
        URL do vídeo (opcional)
        <input
          name="videoUrl"
          type="url"
          defaultValue={values.videoUrl}
          placeholder="https://"
          className={fieldClass}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-ink">
          Ordem
          <input
            name="sortOrder"
            type="number"
            min={1}
            step={1}
            defaultValue={values.sortOrder}
            required
            className={fieldClass}
          />
        </label>
        <label className="block text-sm font-medium text-ink">
          Duração (minutos)
          <input
            name="durationMinutes"
            type="number"
            min={1}
            step={1}
            defaultValue={values.durationMinutes}
            required
            className={fieldClass}
          />
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
