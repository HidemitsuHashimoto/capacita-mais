import Link from "next/link";

export default function NotFoundPage(): React.ReactElement {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 text-center">
      <h1 className="font-display text-4xl">Página não encontrada</h1>
      <p className="mt-3 text-ink/70">
        Esse endereço não existe ou o conteúdo não está disponível para a sua
        conta.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
