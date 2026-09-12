import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth-forms";
import { readSessionUser } from "@/lib/auth";
import { readSafePath } from "@/lib/format";

export const metadata = {
  title: "Entrar",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps): Promise<React.ReactElement> {
  const user = await readSessionUser();
  if (user) {
    redirect("/me/courses");
  }
  const params = await searchParams;
  const nextPath = readSafePath(params.next, "/me/courses");
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="font-display text-4xl">Entrar</h1>
      <p className="mt-2 text-ink/70">
        Use sua conta para inscrever-se, acompanhar o progresso e emitir
        certificados.
      </p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <LoginForm nextPath={nextPath} />
      </div>
      <p className="mt-4 text-sm text-ink/70">
        Ainda não tem conta?{" "}
        <Link href="/register" className="font-semibold text-forest">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
