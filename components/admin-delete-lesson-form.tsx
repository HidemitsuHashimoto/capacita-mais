"use client";

import { useActionState } from "react";
import { deleteLessonAction } from "@/actions/admin-actions";
import { emptyActionResult } from "@/lib/action-result";

type AdminDeleteLessonFormProps = {
  courseId: string;
  lessonId: string;
  title: string;
};

export function AdminDeleteLessonForm({
  courseId,
  lessonId,
  title,
}: AdminDeleteLessonFormProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    deleteLessonAction,
    emptyActionResult,
  );
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir a aula “${title}”?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full border border-clay/30 px-3 py-1.5 text-sm font-semibold text-clay hover:bg-clay/10 disabled:opacity-70"
      >
        {isPending ? "Excluindo..." : "Excluir"}
      </button>
      {state.message ? (
        <p role="alert" className="mt-1 text-xs text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
