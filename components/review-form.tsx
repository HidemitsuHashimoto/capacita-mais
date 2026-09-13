"use client";

import { useActionState } from "react";
import { submitReviewAction } from "@/actions/review-actions";
import { emptyActionResult } from "@/lib/action-result";

type ReviewFormProps = {
  slug: string;
  savedRating?: number;
};

export function ReviewForm({
  slug,
  savedRating,
}: ReviewFormProps): React.ReactElement {
  const [state, action, isPending] = useActionState(
    submitReviewAction,
    emptyActionResult,
  );
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-ink">Sua avaliação</legend>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <label key={rating} className="flex items-center gap-1 text-sm">
              <input
                type="radio"
                name="rating"
                value={rating}
                defaultChecked={savedRating === rating}
                required
                className="accent-sun"
              />
              {rating} {rating === 1 ? "estrela" : "estrelas"}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block text-sm font-medium text-ink">
        Comentário (opcional)
        <textarea
          name="comment"
          rows={3}
          className="mt-1 w-full rounded-2xl border border-ink/15 bg-paper px-3 py-2.5 text-base font-normal outline-none ring-forest/30 focus:ring-2"
        />
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
        {isPending ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
