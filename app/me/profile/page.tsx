import { FlashBanner } from "@/components/flash-banner";
import { ProfileForm } from "@/components/profile-form";
import { requireSessionUser } from "@/lib/auth";

export const metadata = {
  title: "Perfil",
};

type ProfilePageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function ProfilePage({
  searchParams,
}: ProfilePageProps): Promise<React.ReactElement> {
  const user = await requireSessionUser();
  const params = await searchParams;
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="font-display text-4xl">Perfil</h1>
      <p className="mt-2 text-ink/70">
        Atualize seus dados. O e-mail é usado para entrar e não pode ser
        alterado neste MVP.
      </p>
      {params.saved === "1" ? (
        <div className="mt-5">
          <FlashBanner message="Perfil salvo com sucesso." />
        </div>
      ) : null}
      <div className="mt-6 rounded-3xl border border-ink/10 bg-card p-6">
        <ProfileForm
          name={user.name}
          email={user.email}
          phone={user.phone ?? ""}
          isPwd={user.isPwd}
        />
      </div>
    </div>
  );
}
