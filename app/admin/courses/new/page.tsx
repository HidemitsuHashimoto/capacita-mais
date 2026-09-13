import Link from "next/link";
import { AdminCourseForm } from "@/components/admin-course-form";
import { requireAdminUser } from "@/lib/auth";

export const metadata = {
  title: "Novo curso",
};

export default async function AdminNewCoursePage(): Promise<React.ReactElement> {
  await requireAdminUser();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <p className="text-sm">
        <Link href="/admin" className="font-semibold text-forest hover:text-leaf">
          ← Voltar aos cursos
        </Link>
      </p>
      <h1 className="mt-4 font-display text-4xl">Novo curso</h1>
      <p className="mt-2 text-ink/70">
        Preencha os dados do curso. Depois você poderá cadastrar as aulas.
      </p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <AdminCourseForm
          submitLabel="Criar curso"
          values={{
            slug: "",
            title: "",
            summary: "",
            description: "",
            workloadHours: 1,
            isFree: true,
            priceLabel: "Gratuito",
            isAccessible: true,
            targetAudience: "",
            maxSeats: 40,
            listedSeatsRemaining: 40,
            isDemo: false,
          }}
        />
      </div>
    </div>
  );
}
