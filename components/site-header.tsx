import Link from "next/link";
import { logoutAction } from "@/actions/auth-actions";
import { readSessionUser } from "@/lib/auth";

export async function SiteHeader(): Promise<React.ReactElement> {
  const user = await readSessionUser();
  return (
    <header className="no-print border-b border-ink/10 bg-card/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest text-lg font-semibold text-white">
            +
          </span>
          <span className="font-display text-xl tracking-tight">
            Capacíta<span className="text-leaf">+</span>
          </span>
        </Link>
        <nav
          aria-label="Principal"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium"
        >
          <Link href="/catalog" className="text-ink/80 hover:text-forest">
            Catálogo
          </Link>
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin" className="text-ink/80 hover:text-forest">
                  Admin
                </Link>
              ) : null}
              <Link href="/me/courses" className="text-ink/80 hover:text-forest">
                Meus cursos
              </Link>
              <Link href="/me/profile" className="text-ink/80 hover:text-forest">
                Perfil
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-ink/80 hover:text-forest"
                >
                  Sair
                </button>
              </form>
              <span className="hidden text-ink/50 sm:inline">
                Olá, {user.name.split(" ")[0]}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink/80 hover:text-forest">
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-forest px-4 py-2 text-white hover:bg-leaf"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
