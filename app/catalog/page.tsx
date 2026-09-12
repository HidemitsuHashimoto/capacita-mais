import { CatalogFilters } from "@/components/catalog-filters";
import { CourseCard } from "@/components/course-card";
import { listCatalogCourses } from "@/lib/catalog-query";

export const metadata = {
  title: "Catálogo",
};

type CatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    free?: string;
  }>;
};

export default async function CatalogPage({
  searchParams,
}: CatalogPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  const searchTerm = params.q ?? "";
  const isFreeOnly = params.free === "1";
  const courses = await listCatalogCourses({
    searchTerm,
    isFreeOnly,
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl">Catálogo de cursos</h1>
      <p className="mt-2 max-w-2xl text-ink/70">
        Formações curtas de informática, MEI, finanças, comunicação e
        empreendedorismo. Visitantes podem explorar; a inscrição pede uma conta.
      </p>
      <div className="mt-6">
        <CatalogFilters searchTerm={searchTerm} isFreeOnly={isFreeOnly} />
      </div>
      <p className="mt-6 text-sm text-ink/60">{courses.length} cursos</p>
      <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
