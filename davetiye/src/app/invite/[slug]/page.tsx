import { CinematicInvitationClient } from "@/components/invite/CinematicInvitationClient";
import { getPublicInvitation } from "@/lib/public-invitation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Herkese açık davetiye: tarayıcıda `/{çift-slug}` (örn. `/asli-ve-hakan`) — `proxy.ts` ile buraya rewrite.
 * `src/app/[slug]/page.tsx` kullanılmaz; `[locale]` ile dinamik segment çakışması nedeniyle rota `invite/[slug]`.
 */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = getPublicInvitation(slug);
  if (!data) {
    return { title: "Davetio" };
  }
  return {
    title: `${data.namesDisplay} · Davetio`,
    description: data.tagline,
    openGraph: {
      title: `${data.namesDisplay} · Davetio`,
      description: data.tagline,
    },
  };
}

export default async function PublicInvitationPage({ params }: Props) {
  const { slug } = await params;
  const data = getPublicInvitation(slug);
  if (!data) {
    notFound();
  }
  return <CinematicInvitationClient data={data} />;
}
