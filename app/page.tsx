import Link from "next/link";
import { CourseCard } from "@/components/course-card";
import { listCatalogCourses } from "@/lib/catalog-query";

export const metadata = {
  title: "Início",
};

export default async function HomePage(): Promise<React.ReactElement> {
  const courses = await listCatalogCourses({});
  const featured = courses.slice(0, 3);
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(47,143,102,0.18),_transparent_42%),radial-gradient(circle_at_left,_rgba(227,160,14,0.16),_transparent_28%)]" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">
              ODS 8 · trabalho digno
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-6xl">
              Formação profissional e empreendedora para todas as pessoas.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/75">
              O Capacíta+ é um portal inclusivo para descobrir cursos, estudar no
              seu ritmo e emitir um certificado simples ao concluir. Comece pelo
              catálogo — sem fila, sem jargão.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full bg-forest px-6 py-3 font-semibold text-white hover:bg-leaf"
              >
                Ver catálogo de cursos
              </Link>
              <Link
                href="/register"
                className="rounded-full border border-ink/15 bg-card px-6 py-3 font-semibold text-ink hover:border-forest"
              >
                Criar conta gratuita
              </Link>
            </div>
          </div>
          <aside className="rounded-[2rem] border border-ink/10 bg-card p-6 shadow-[0_20px_50px_-28px_rgba(28,42,34,0.55)]">
            <p className="font-display text-2xl">Como funciona</p>
            <ol className="mt-4 space-y-4 text-sm leading-relaxed">
              <li>
                <strong className="text-forest">1. Escolha um curso</strong>
                <br />
                Veja carga horária, acessibilidade e vagas.
              </li>
              <li>
                <strong className="text-forest">2. Estude as aulas</strong>
                <br />
                Conteúdo em texto claro, com marcação de progresso.
              </li>
              <li>
                <strong className="text-forest">3. Emita o certificado</strong>
                <br />
                Disponível somente com 100% das aulas concluídas.
              </li>
            </ol>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl">Cursos em destaque</h2>
            <p className="mt-1 text-ink/70">
              Comece pelo curso demonstração ou explore o catálogo completo.
            </p>
          </div>
          <Link href="/catalog" className="text-sm font-semibold text-forest">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
