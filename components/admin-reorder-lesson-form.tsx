import { reorderLessonAction } from "@/actions/admin-actions";

type AdminReorderLessonFormProps = {
  courseId: string;
  lessonId: string;
  direction: "up" | "down";
  isDisabled: boolean;
};

export function AdminReorderLessonForm({
  courseId,
  lessonId,
  direction,
  isDisabled,
}: AdminReorderLessonFormProps): React.ReactElement {
  const label = direction === "up" ? "Subir" : "Descer";
  return (
    <form action={reorderLessonAction}>
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="lessonId" value={lessonId} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={isDisabled}
        aria-label={label}
        className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink hover:border-forest disabled:cursor-not-allowed disabled:opacity-40"
      >
        {label}
      </button>
    </form>
  );
}
