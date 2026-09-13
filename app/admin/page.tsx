import Link from "next/link";
import { AdminDeleteCourseForm } from "@/components/admin-delete-course-form";
import { FlashBanner } from "@/components/flash-banner";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin · Cursos",
};

type AdminPageProps = {
  searchParams: Promise<{ deleted?: string }>;
};

export default async function AdminCoursesPage({
  searchParams,
}: AdminPageProps): Promise<React.ReactElement> {
  await requireAdminUser();
  const params = await searchParams;
  const courses = await prisma.course.findMany({
    orderBy: [{ title: "asc" }],
    include: {
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl">Cursos</h1>
          <p className="mt-2 max-w-2xl text-ink/70">
            Cadastre, edite e organize cursos e aulas. Cursos com inscrições não
            podem ser excluídos.
          </p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf"
        >
          Novo curso
        </Link>
      </div>
      {params.deleted === "1" ? (
        <div className="mt-6">
          <FlashBanner message="Curso excluído." />
        </div>
      ) : null}
      {courses.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-card p-6">
          <p>Nenhum curso cadastrado ainda.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-3xl border border-ink/10 bg-card">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-ink/10 text-ink/60">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Aulas</th>
                <th className="px-4 py-3 font-medium">Inscrições</th>
                <th className="px-4 py-3 font-medium">Vagas</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-t border-ink/8 align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium">{course.title}</p>
                    <p className="mt-1 text-xs text-ink/50">
                      {course.isFree ? "Gratuito" : course.priceLabel}
                      {course.isDemo ? " · Demonstração" : ""}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-ink/70">
                    {course.slug}
                  </td>
                  <td className="px-4 py-4">{course._count.lessons}</td>
                  <td className="px-4 py-4">{course._count.enrollments}</td>
                  <td className="px-4 py-4">
                    {course.listedSeatsRemaining}/{course.maxSeats}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="font-semibold text-forest hover:text-leaf"
                      >
                        Editar
                      </Link>
                      <AdminDeleteCourseForm
                        courseId={course.id}
                        title={course.title}
                        enrollmentCount={course._count.enrollments}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
