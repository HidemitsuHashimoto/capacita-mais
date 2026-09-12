import Link from "next/link";

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="no-print mt-auto border-t border-ink/10 bg-ink text-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-lg">
          Capacíta+ · formação inclusiva para o trabalho digno
        </p>
        <p className="text-sm text-paper/70">
          Alinhado ao{" "}
          <Link href="/catalog" className="underline decoration-sun/70">
            ODS 8
          </Link>{" "}
          — trabalho decente e crescimento econômico.
        </p>
      </div>
    </footer>
  );
}
