import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminCourseForm } from "@/components/admin-course-form";
import { AdminDeleteCourseForm } from "@/components/admin-delete-course-form";
import { AdminDeleteLessonForm } from "@/components/admin-delete-lesson-form";
import { AdminReorderLessonForm } from "@/components/admin-reorder-lesson-form";
import { FlashBanner } from "@/components/flash-banner";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Editar curso",
};

type AdminCoursePageProps = {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{
    created?: string;
    saved?: string;
    lessonCreated?: string;
    lessonSaved?: string;
    lessonDeleted?: string;
  }>;
};

function readFlashMessage(query: {
  created?: string;
  saved?: string;
  lessonCreated?: string;
  lessonSaved?: string;
  lessonDeleted?: string;
}): string | null {
  if (query.created === "1") {
    return "Curso criado. Agora você pode cadastrar as aulas.";
  }
  if (query.saved === "1") {
    return "Curso salvo.";
  }
  if (query.lessonCreated === "1") {
    return "Aula criada.";
  }
  if (query.lessonSaved === "1") {
    return "Aula salva.";
  }
  if (query.lessonDeleted === "1") {
    return "Aula excluída.";
  }
  return null;
}

export default async function AdminCoursePage({
  params,
  searchParams,
}: AdminCoursePageProps): Promise<React.ReactElement> {
  await requireAdminUser();
  const { courseId } = await params;
  const query = await searchParams;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: [{ sortOrder: "asc" }, { title: "asc" }] },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) {
    notFound();
  }
  const flash = readFlashMessage(query);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <p className="text-sm">
        <Link href="/admin" className="font-semibold text-forest hover:text-leaf">
          ← Voltar aos cursos
        </Link>
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl">Editar curso</h1>
          <p className="mt-2 text-ink/70">{course.title}</p>
        </div>
        <Link
          href={`/courses/${course.slug}`}
          className="text-sm font-semibold text-forest hover:text-leaf"
        >
          Ver no catálogo
        </Link>
      </div>
      {flash ? (
        <div className="mt-6">
          <FlashBanner message={flash} />
        </div>
      ) : null}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-ink/10 bg-card p-6">
          <h2 className="font-display text-2xl">Dados do curso</h2>
          <div className="mt-4">
            <AdminCourseForm
              courseId={course.id}
              submitLabel="Salvar curso"
              values={{
                slug: course.slug,
                title: course.title,
                summary: course.summary,
                description: course.description,
                workloadHours: course.workloadHours,
                isFree: course.isFree,
                priceLabel: course.priceLabel,
                isAccessible: course.isAccessible,
                targetAudience: course.targetAudience,
                maxSeats: course.maxSeats,
                listedSeatsRemaining: course.listedSeatsRemaining,
                isDemo: course.isDemo,
              }}
            />
          </div>
          <div className="mt-8 border-t border-ink/10 pt-5">
            <h3 className="text-sm font-semibold text-ink">Excluir curso</h3>
            <p className="mt-1 mb-3 text-sm text-ink/65">
              A exclusão remove também as aulas. Se houver inscrições, a ação
              fica bloqueada.
            </p>
            <AdminDeleteCourseForm
              courseId={course.id}
              title={course.title}
              enrollmentCount={course._count.enrollments}
            />
          </div>
        </section>
        <section className="rounded-3xl border border-ink/10 bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl">Aulas</h2>
            <Link
              href={`/admin/courses/${course.id}/lessons/new`}
              className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-leaf"
            >
              Nova aula
            </Link>
          </div>
          {course.lessons.length === 0 ? (
            <p className="mt-4 text-sm text-ink/70">
              Nenhuma aula cadastrada neste curso.
            </p>
          ) : (
            <ol className="mt-4 space-y-3">
              {course.lessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  className="rounded-2xl border border-ink/10 bg-paper/70 px-4 py-3"
                >
                  <p className="font-medium">
                    {lesson.sortOrder}. {lesson.title}
                  </p>
                  <p className="text-sm text-ink/60">
                    {lesson.durationMinutes} min
                    {lesson.videoUrl ? " · com vídeo" : ""}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <AdminReorderLessonForm
                      courseId={course.id}
                      lessonId={lesson.id}
                      direction="up"
                      isDisabled={index === 0}
                    />
                    <AdminReorderLessonForm
                      courseId={course.id}
                      lessonId={lesson.id}
                      direction="down"
                      isDisabled={index === course.lessons.length - 1}
                    />
                    <Link
                      href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                      className="rounded-full border border-ink/15 px-3 py-1.5 text-sm font-semibold text-ink hover:border-forest"
                    >
                      Editar
                    </Link>
                    <AdminDeleteLessonForm
                      courseId={course.id}
                      lessonId={lesson.id}
                      title={lesson.title}
                    />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}
