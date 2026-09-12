import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CompleteLessonButton } from "@/components/complete-lesson-button";
import { MarkdownContent } from "@/components/markdown-content";
import { ProgressBar } from "@/components/progress-bar";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeProgressPercent } from "@/lib/progress";

type LearnPageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export async function generateMetadata({
  params,
}: LearnPageProps): Promise<{ title: string }> {
  const { lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  return { title: lesson?.title ?? "Aula" };
}

export default async function LearnPage({
  params,
}: LearnPageProps): Promise<React.ReactElement> {
  const user = await requireSessionUser();
  const { courseId, lessonId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { lessons: { orderBy: { sortOrder: "asc" } } },
  });
  if (!course) {
    notFound();
  }
  const lesson = course.lessons.find((item) => item.id === lessonId);
  if (!lesson) {
    notFound();
  }
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: user.id, courseId },
    },
    include: {
      lessonProgress: true,
      certificate: true,
    },
  });
  if (!enrollment) {
    redirect(`/courses/${course.slug}`);
  }
  const completedLessonIds = new Set(
    enrollment.lessonProgress.map((item) => item.lessonId),
  );
  const isComplete = completedLessonIds.has(lesson.id);
  const percent = computeProgressPercent(
    enrollment.lessonProgress.length,
    course.lessons.length,
  );
  const currentIndex = course.lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = course.lessons[currentIndex - 1];
  const nextLesson = course.lessons[currentIndex + 1];
  const nextPath = nextLesson
    ? `/learn/${course.id}/${nextLesson.id}`
    : `/learn/${course.id}/${lesson.id}`;
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[0.7fr_1.3fr]">
      <aside className="h-fit rounded-3xl border border-ink/10 bg-card p-5">
        <p className="text-sm text-ink/60">{course.title}</p>
        <div className="mt-3">
          <ProgressBar percent={percent} label="Progresso" />
        </div>
        <ol className="mt-5 space-y-2">
          {course.lessons.map((item) => {
            const done = completedLessonIds.has(item.id);
            const isCurrent = item.id === lesson.id;
            return (
              <li key={item.id}>
                <Link
                  href={`/learn/${course.id}/${item.id}`}
                  className={`block rounded-2xl px-3 py-2 text-sm ${
                    isCurrent
                      ? "bg-forest text-white"
                      : "text-ink hover:bg-mist"
                  }`}
                >
                  {item.sortOrder}. {item.title}
                  {done ? " · concluída" : ""}
                </Link>
              </li>
            );
          })}
        </ol>
        {enrollment.certificate ? (
          <Link
            href={`/certificates/${enrollment.id}`}
            className="mt-5 inline-flex text-sm font-semibold text-forest"
          >
            Ver certificado
          </Link>
        ) : null}
      </aside>
      <article className="rounded-3xl border border-ink/10 bg-card p-6">
        <p className="text-sm text-ink/50">
          Aula {lesson.sortOrder} de {course.lessons.length} ·{" "}
          {lesson.durationMinutes} min
        </p>
        <h1 className="mt-2 font-display text-3xl">{lesson.title}</h1>
        {lesson.videoUrl ? (
          <p className="mt-4 text-sm">
            <a
              href={lesson.videoUrl}
              className="font-semibold text-forest underline"
              target="_blank"
              rel="noreferrer"
            >
              Abrir vídeo de apoio
            </a>
          </p>
        ) : null}
        <div className="mt-6">
          <MarkdownContent source={lesson.body} />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {previousLesson ? (
            <Link
              href={`/learn/${course.id}/${previousLesson.id}`}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
            >
              Aula anterior
            </Link>
          ) : null}
          {nextLesson ? (
            <Link
              href={`/learn/${course.id}/${nextLesson.id}`}
              className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold"
            >
              Próxima aula
            </Link>
          ) : null}
        </div>
        <div className="mt-6">
          {isComplete ? (
            <p className="text-sm font-medium text-forest">
              Esta aula já está concluída.
            </p>
          ) : (
            <CompleteLessonButton
              courseId={course.id}
              lessonId={lesson.id}
              nextPath={nextPath}
            />
          )}
        </div>
      </article>
    </div>
  );
}
