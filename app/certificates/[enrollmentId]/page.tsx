import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { requireSessionUser } from "@/lib/auth";
import { issueCertificateIfComplete } from "@/lib/certificate";
import { formatDatePtBr, formatWorkload } from "@/lib/format";
import { prisma } from "@/lib/prisma";

type CertificatePageProps = {
  params: Promise<{ enrollmentId: string }>;
};

export const metadata = {
  title: "Certificado",
};

export default async function CertificatePage({
  params,
}: CertificatePageProps): Promise<React.ReactElement> {
  const user = await requireSessionUser();
  const { enrollmentId } = await params;
  const enrollment = await prisma.enrollment.findUnique({
    where: { id: enrollmentId },
    include: {
      course: true,
      certificate: true,
    },
  });
  if (!enrollment || enrollment.userId !== user.id) {
    notFound();
  }
  const certificate =
    enrollment.certificate ??
    (await issueCertificateIfComplete(enrollment.id));
  if (!certificate) {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <h1 className="font-display text-3xl">Certificado indisponível</h1>
        <p className="mt-3 text-ink/70">
          O certificado só é emitido quando 100% das aulas estão concluídas.
        </p>
        <Link
          href="/me/courses"
          className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white"
        >
          Voltar aos meus cursos
        </Link>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/me/courses" className="text-sm font-semibold text-forest">
          Voltar aos meus cursos
        </Link>
        <PrintButton />
      </div>
      <section className="certificate-sheet rounded-[2rem] border-[6px] border-forest bg-card px-8 py-12 text-center shadow-[0_20px_40px_-24px_rgba(28,42,34,0.5)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf">
          Capacíta+
        </p>
        <h1 className="mt-3 font-display text-4xl">Certificado de conclusão</h1>
        <p className="mt-8 text-ink/70">Certificamos que</p>
        <p className="mt-2 font-display text-3xl text-forest">
          {certificate.issuedName}
        </p>
        <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-ink/80">
          concluiu o curso <strong>{enrollment.course.title}</strong>, com carga
          horária de {formatWorkload(enrollment.course.workloadHours)}, em{" "}
          {formatDatePtBr(certificate.issuedAt)}.
        </p>
        <p className="mt-10 text-sm text-ink/60">
          Código de autenticação: <strong>{certificate.code}</strong>
        </p>
      </section>
    </div>
  );
}
