import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLessonForm } from "@/components/admin-lesson-form";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Editar aula",
};

type AdminEditLessonPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function AdminEditLessonPage({
  params,
}: AdminEditLessonPageProps): Promise<React.ReactElement> {
  await requireAdminUser();
  const { courseId, lessonId } = await params;
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId },
    include: { course: { select: { id: true, title: true } } },
  });
  if (!lesson) {
    notFound();
  }
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm">
        <Link
          href={`/admin/courses/${lesson.course.id}`}
          className="font-semibold text-forest hover:text-leaf"
        >
          ← Voltar ao curso
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl">Editar aula</h1>
      <p className="mt-2 text-ink/70">{lesson.course.title}</p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <AdminLessonForm
          courseId={lesson.course.id}
          lessonId={lesson.id}
          submitLabel="Salvar aula"
          values={{
            title: lesson.title,
            body: lesson.body,
            videoUrl: lesson.videoUrl ?? "",
            sortOrder: lesson.sortOrder,
            durationMinutes: lesson.durationMinutes,
          }}
        />
      </div>
    </div>
  );
}
