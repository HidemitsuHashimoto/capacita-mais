import Link from "next/link";
import { ProgressBar } from "@/components/progress-bar";
import { requireSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeProgressPercent } from "@/lib/progress";

export const metadata = {
  title: "Meus cursos",
};

export default async function MyCoursesPage(): Promise<React.ReactElement> {
  const user = await requireSessionUser();
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: { lessons: { orderBy: { sortOrder: "asc" } } },
      },
      lessonProgress: true,
      certificate: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Meus cursos</h1>
      <p className="mt-2 text-ink/70">
        Acompanhe o progresso e continue de onde parou.
      </p>
      {enrollments.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-card p-6">
          <p>Você ainda não se inscreveu em nenhum curso.</p>
          <Link
            href="/catalog"
            className="mt-4 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf"
          >
            Ir para o catálogo
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {enrollments.map((enrollment) => {
            const firstLesson = enrollment.course.lessons[0];
            const percent = computeProgressPercent(
              enrollment.lessonProgress.length,
              enrollment.course.lessons.length,
            );
            return (
              <li
                key={enrollment.id}
                className="rounded-3xl border border-ink/10 bg-card p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <h2 className="font-display text-2xl">
                      {enrollment.course.title}
                    </h2>
                    <div className="mt-3 max-w-lg">
                      <ProgressBar
                        percent={percent}
                        label="Progresso do curso"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {firstLesson ? (
                      <Link
                        href={`/learn/${enrollment.courseId}/${firstLesson.id}`}
                        className="rounded-full bg-forest px-4 py-2 text-sm font-semibold text-white hover:bg-leaf"
                      >
                        {percent === 0 ? "Começar" : "Continuar"}
                      </Link>
                    ) : null}
                    {enrollment.certificate ? (
                      <Link
                        href={`/certificates/${enrollment.id}`}
                        className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:border-forest"
                      >
                        Ver certificado
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
