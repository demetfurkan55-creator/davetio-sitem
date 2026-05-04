import { setRequestLocale } from "next-intl/server";
import { CreateInvitationWizard } from "@/components/davetio/CreateInvitationWizard";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";

export default async function OlusturPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ template?: string; pkg?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  setRequestLocale(locale);

  return (
    <div className="relative min-h-full overflow-hidden bg-canvas">
      <AmbientPhotoBackdrop
        src={SITE_AMBIENT.linenPaper}
        overlayClassName="bg-gradient-to-b from-canvas/90 via-canvas/76 to-canvas/94"
      />
      <div className="relative z-10">
        <CreateInvitationWizard templateSlug={sp.template} pkg={sp.pkg} />
      </div>
    </div>
  );
}
