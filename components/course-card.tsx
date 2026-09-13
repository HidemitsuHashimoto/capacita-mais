import Link from "next/link";
import type { CatalogCourse } from "@/lib/catalog-query";
import { formatSeatsLabel, formatWorkload } from "@/lib/format";

type CourseCardProps = {
  course: CatalogCourse;
};

export function CourseCard({ course }: CourseCardProps): React.ReactElement {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-ink/8 bg-card p-5 shadow-[0_10px_30px_-18px_rgba(28,42,34,0.45)]">
      <div className="mb-4 flex flex-wrap gap-2">
        {course.isDemo ? (
          <span className="rounded-full bg-sun/20 px-2.5 py-1 text-xs font-semibold text-ink">
            Demonstração
          </span>
        ) : null}
        <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-forest">
          {course.isFree ? "Gratuito" : course.priceLabel}
        </span>
        {course.isAccessible ? (
          <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-forest">
            Acessível
          </span>
        ) : null}
      </div>
      <h2 className="font-display text-2xl leading-tight text-ink">
        <Link href={`/courses/${course.slug}`} className="hover:text-forest">
          {course.title}
        </Link>
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
        {course.summary}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-ink/50">Carga horária</dt>
          <dd className="font-medium">{formatWorkload(course.workloadHours)}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Vagas</dt>
          <dd className="font-medium">
            {formatSeatsLabel(course.remainingSeats)}
          </dd>
        </div>
      </dl>
      <Link
        href={`/courses/${course.slug}`}
        className="mt-5 inline-flex items-center justify-center rounded-full bg-forest px-4 py-2.5 text-sm font-semibold text-white hover:bg-leaf"
      >
        Ver curso
      </Link>
    </article>
  );
}
