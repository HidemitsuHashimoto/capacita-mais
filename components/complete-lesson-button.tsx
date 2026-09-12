"use client";

import { useActionState } from "react";
import { completeLessonAction } from "@/actions/progress-actions";
import { emptyActionResult } from "@/lib/action-result";

type CompleteLessonButtonProps = {
  courseId: string;
  lessonId: string;
  nextPath: string;
};

export function CompleteLessonButton({
  courseId,
  lessonId,
  nextPath,
}: CompleteLessonButtonProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    completeLessonAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="nextPath" value={nextPath} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Salvando..." : "Marcar aula como concluída"}
      </button>
      {state.message ? (
        <p role="alert" className="text-sm text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
