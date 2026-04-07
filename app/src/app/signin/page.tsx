import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { SignInCard } from "@/components/SignInCard";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string; error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect(searchParams.callbackUrl ?? "/");

  return (
    <div className="auth-shell">
      <SignInCard
        callbackUrl={searchParams.callbackUrl ?? "/"}
        error={searchParams.error}
      />
    </div>
  );
}
