"use client";

import { useActionState } from "react";
import { enrollAction } from "@/actions/enroll-actions";
import { emptyActionResult } from "@/lib/action-result";

type EnrollButtonProps = {
  courseId: string;
};

export function EnrollButton({
  courseId,
}: EnrollButtonProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    enrollAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="courseId" value={courseId} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf disabled:opacity-70"
      >
        {isPending ? "Inscrevendo..." : "Inscrever-me neste curso"}
      </button>
      {state.message ? (
        <p role="alert" className="text-sm text-clay">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
