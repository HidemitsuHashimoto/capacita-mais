import Link from "next/link";
import { notFound } from "next/navigation";
import { EnrollButton } from "@/components/enroll-button";
import { FlashBanner } from "@/components/flash-banner";
import { ReviewForm } from "@/components/review-form";
import { readSessionUser } from "@/lib/auth";
import {
  countRemainingSeats,
  findEnrollmentForUser,
} from "@/lib/enrollment";
import { formatSeatsLabel, formatWorkload } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { computeProgressPercent } from "@/lib/progress";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviewed?: string }>;
};

export async function generateMetadata({
  params,
}: Pick<CourseDetailPageProps, "params">): Promise<{ title: string }> {
  const { slug } = await params;
  const course = await prisma.course.findUnique({ where: { slug } });
  return { title: course?.title ?? "Curso" };
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: CourseDetailPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const query = await searchParams;
  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { sortOrder: "asc" } },
      reviews: true,
    },
  });
  if (!course) {
    notFound();
  }
  const user = await readSessionUser();
  const remainingSeats = await countRemainingSeats(course.id);
  const enrollment = user
    ? await findEnrollmentForUser({ userId: user.id, courseId: course.id })
    : null;
  const completedCount = enrollment
    ? await prisma.lessonProgress.count({
        where: { enrollmentId: enrollment.id },
      })
    : 0;
  const percent = computeProgressPercent(completedCount, course.lessons.length);
  const firstLesson = course.lessons[0];
  const canReview = Boolean(enrollment && percent === 100);
  const existingReview = user
    ? course.reviews.find((review) => review.userId === user.id)
    : null;
  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr]">
      <article>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-leaf">
          {course.isFree ? "Curso gratuito" : course.priceLabel}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight">
          {course.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink/75">
          {course.description}
        </p>
        {query.reviewed === "1" ? (
          <div className="mt-6">
            <FlashBanner message="Avaliação enviada. Obrigado pelo retorno!" />
          </div>
        ) : null}
        <section className="mt-8">
          <h2 className="font-display text-2xl">Aulas</h2>
          <ol className="mt-3 space-y-3">
            {course.lessons.map((lesson) => (
              <li
                key={lesson.id}
                className="rounded-2xl border border-ink/10 bg-card px-4 py-3"
              >
                <p className="font-medium">
                  {lesson.sortOrder}. {lesson.title}
                </p>
                <p className="text-sm text-ink/60">
                  {lesson.durationMinutes} min
                </p>
              </li>
            ))}
          </ol>
        </section>
        {canReview ? (
          <section className="mt-8 rounded-3xl border border-ink/10 bg-card p-5">
            <h2 className="font-display text-2xl">Avalie este curso</h2>
            <p className="mt-1 text-sm text-ink/70">
              Você concluiu 100% das aulas. Conte como foi a experiência.
            </p>
            {existingReview ? (
              <p className="mt-4 text-sm text-forest">
                Você já avaliou este curso com {existingReview.rating} estrelas.
              </p>
            ) : null}
            <div className="mt-4">
              <ReviewForm
                slug={course.slug}
                savedRating={existingReview?.rating}
              />
            </div>
          </section>
        ) : null}
      </article>
      <aside className="h-fit space-y-4 rounded-3xl border border-ink/10 bg-card p-5">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-ink/50">Carga horária</dt>
            <dd className="text-base font-medium">
              {formatWorkload(course.workloadHours)}
            </dd>
          </div>
          <div>
            <dt className="text-ink/50">Público</dt>
            <dd>{course.targetAudience}</dd>
          </div>
          <div>
            <dt className="text-ink/50">Vagas restantes</dt>
            <dd className="text-base font-medium">
              {formatSeatsLabel(remainingSeats)}
            </dd>
          </div>
          {course.isAccessible ? (
            <div>
              <dt className="text-ink/50">Acessibilidade</dt>
              <dd>Conteúdo pensado para leitura assistida e linguagem clara.</dd>
            </div>
          ) : null}
        </dl>
        {enrollment && firstLesson ? (
          <div className="space-y-3">
            <p className="text-sm text-forest">
              Você já está inscrito. Progresso: {percent}%.
            </p>
            <Link
              href={`/learn/${course.id}/${firstLesson.id}`}
              className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf"
            >
              Continuar aulas
            </Link>
          </div>
        ) : null}
        {!enrollment && user && remainingSeats > 0 ? (
          <EnrollButton courseId={course.id} />
        ) : null}
        {!enrollment && user && remainingSeats === 0 ? (
          <p className="text-sm text-clay">As vagas deste curso acabaram.</p>
        ) : null}
        {!user ? (
          <Link
            href={`/login?next=/courses/${course.slug}`}
            className="inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-leaf"
          >
            Entre para se inscrever
          </Link>
        ) : null}
      </aside>
    </div>
  );
}
