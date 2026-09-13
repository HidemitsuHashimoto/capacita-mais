import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLessonForm } from "@/components/admin-lesson-form";
import { requireAdminUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Nova aula",
};

type AdminNewLessonPageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function AdminNewLessonPage({
  params,
}: AdminNewLessonPageProps): Promise<React.ReactElement> {
  await requireAdminUser();
  const { courseId } = await params;
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        select: { sortOrder: true },
        orderBy: { sortOrder: "desc" },
        take: 1,
      },
    },
  });
  if (!course) {
    notFound();
  }
  const nextSortOrder = (course.lessons[0]?.sortOrder ?? 0) + 1;
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm">
        <Link
          href={`/admin/courses/${course.id}`}
          className="font-semibold text-forest hover:text-leaf"
        >
          ← Voltar ao curso
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl">Nova aula</h1>
      <p className="mt-2 text-ink/70">{course.title}</p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <AdminLessonForm
          courseId={course.id}
          submitLabel="Criar aula"
          values={{
            title: "",
            body: "",
            videoUrl: "",
            sortOrder: nextSortOrder,
            durationMinutes: 30,
          }}
        />
      </div>
    </div>
  );
}
