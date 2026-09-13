import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { requireAdminUser } from "@/lib/auth";

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): Promise<ReactElement> {
  await requireAdminUser();
  return (
    <div>
      <div className="border-b border-ink/10 bg-mist/70">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <p className="text-sm font-semibold text-forest">
            Área administrativa
          </p>
          <nav aria-label="Administração" className="flex flex-wrap gap-4 text-sm font-medium">
            <Link href="/admin" className="text-ink/80 hover:text-forest">
              Cursos
            </Link>
            <Link
              href="/admin/courses/new"
              className="text-ink/80 hover:text-forest"
            >
              Novo curso
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
