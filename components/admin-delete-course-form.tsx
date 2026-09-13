"use client";

import { useActionState } from "react";
import { deleteCourseAction } from "@/actions/admin-actions";
import { emptyActionResult } from "@/lib/action-result";

type AdminDeleteCourseFormProps = {
  courseId: string;
  title: string;
  enrollmentCount: number;
};

export function AdminDeleteCourseForm({
  courseId,
  title,
  enrollmentCount,
}: AdminDeleteCourseFormProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    deleteCourseAction,
    emptyActionResult,
  );
  const isBlocked = enrollmentCount > 0;
  return (
    <form
      action={action}
      className="space-y-2"
      onSubmit={(event) => {
        if (isBlocked) {
          event.preventDefault();
          return;
        }
        if (!window.confirm(`Excluir o curso “${title}”? Esta ação não pode ser desfeita.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="courseId" value={courseId} />
      <button
        type="submit"
        disabled={isPending || isBlocked}
        title={
          isBlocked
            ? "Há inscrições neste curso"
            : "Excluir curso"
        }
        className="rounded-full border border-clay/30 px-3 py-1.5 text-sm font-semibold text-clay hover:bg-clay/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Excluindo..." : "Excluir"}
      </button>
      {isBlocked ? (
        <p className="text-xs text-ink/55">
          {enrollmentCount} inscrição(ões). Exclusão bloqueada.
        </p>
      ) : null}
      {state.message ? (
        <p role="alert" className="text-xs text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
