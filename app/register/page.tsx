import Link from "next/link";
import { RegisterForm } from "@/components/auth-forms";
import { readSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Cadastro",
};

export default async function RegisterPage(): Promise<React.ReactElement> {
  const user = await readSessionUser();
  if (user) {
    redirect("/me/courses");
  }
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="font-display text-4xl">Criar conta</h1>
      <p className="mt-2 text-ink/70">
        Informe nome, e-mail e senha para começar a se inscrever nos cursos.
      </p>
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <RegisterForm />
      </div>
      <p className="mt-4 text-sm text-ink/70">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-forest">
          Entrar
        </Link>
      </p>
    </div>
  );
}
