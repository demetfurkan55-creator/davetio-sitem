import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import {
  isSavedInvitationDraft,
  parseRsvpGuests,
} from "@/lib/davetio-panel-server";
import { buildWhatsAppUrl, normalizeTrPhoneDigits } from "@/lib/phone-whatsapp";
import { getPublicSiteUrl } from "@/lib/site-url";
import type { SavedInvitationDraft } from "@/lib/davetio-invitation-storage";

function getServiceClient() {
  try {
    return createSupabaseServiceRoleClient();
  } catch {
    return null;
  }
}

function buildPanelWhatsAppMessage(panelUrl: string, names: string, locale: string): string {
  if (locale === "de") {
    return `Davetio — Ihr RSVP-Panel ist bereit.\n\nPaar: ${names}\n\nEinladung bearbeiten:\n${panelUrl}`;
  }
  return `Davetio — LCV paneliniz hazır.\n\nÇift: ${names}\n\nDavetiyeyi (isim, tarih, mekân vb.) buradan güncelleyebilirsiniz:\n${panelUrl}`;
}

export async function POST(req: Request) {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "supabase_not_configured", message: "SUPABASE_SERVICE_ROLE_KEY eksik." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const locale =
    o.locale === "de" || o.locale === "tr" ? o.locale : "tr";
  const draftRaw = o.draft;
  if (!isSavedInvitationDraft(draftRaw)) {
    return NextResponse.json({ error: "invalid_draft" }, { status: 400 });
  }

  const draft: SavedInvitationDraft = {
    ...draftRaw,
    savedAt: new Date().toISOString(),
  };
  const rsvpGuests = parseRsvpGuests(o.rsvpGuests);

  const token = randomBytes(20).toString("hex");

  const { error } = await supabase.from("davetio_panels").insert({
    token,
    draft,
    rsvp_guests: rsvpGuests,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[panel create]", error.message);
    return NextResponse.json({ error: "db_insert_failed" }, { status: 500 });
  }

  const site = getPublicSiteUrl();
  const panelUrl = `${site}/${locale}/panel/${token}`;
  const names = `${draft.bride} & ${draft.groom}`;
  const waDigits = normalizeTrPhoneDigits(draft.phone);
  const whatsappUrl =
    waDigits !== null
      ? buildWhatsAppUrl(waDigits, buildPanelWhatsAppMessage(panelUrl, names, locale))
      : null;

  return NextResponse.json({
    token,
    locale,
    panelUrl,
    whatsappUrl,
  });
}
