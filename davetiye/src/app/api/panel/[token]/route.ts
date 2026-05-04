import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase";
import {
  isSavedInvitationDraft,
  parseRsvpGuests,
} from "@/lib/davetio-panel-server";
import type { SavedInvitationDraft } from "@/lib/davetio-invitation-storage";

function getServiceClient() {
  try {
    return createSupabaseServiceRoleClient();
  } catch {
    return null;
  }
}

type Row = {
  token: string;
  draft: unknown;
  rsvp_guests: unknown;
  updated_at: string;
};

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const { token } = await ctx.params;
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("davetio_panels")
    .select("token, draft, rsvp_guests, updated_at")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[panel get]", error.message);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const row = data as Row;
  if (!isSavedInvitationDraft(row.draft)) {
    return NextResponse.json({ error: "corrupt_draft" }, { status: 500 });
  }

  return NextResponse.json({
    draft: row.draft,
    rsvpGuests: parseRsvpGuests(row.rsvp_guests),
    updatedAt: row.updated_at,
  });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ token: string }> },
) {
  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase_not_configured" }, { status: 503 });
  }

  const { token } = await ctx.params;
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
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
  const draftRaw = o.draft;
  if (!isSavedInvitationDraft(draftRaw)) {
    return NextResponse.json({ error: "invalid_draft" }, { status: 400 });
  }

  const draft: SavedInvitationDraft = {
    ...draftRaw,
    savedAt: new Date().toISOString(),
  };
  const rsvpGuests = parseRsvpGuests(o.rsvpGuests);

  const { data: existing, error: fetchErr } = await supabase
    .from("davetio_panels")
    .select("token")
    .eq("token", token)
    .maybeSingle();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("davetio_panels")
    .update({
      draft,
      rsvp_guests: rsvpGuests,
      updated_at: new Date().toISOString(),
    })
    .eq("token", token);

  if (error) {
    console.error("[panel put]", error.message);
    return NextResponse.json({ error: "db_update_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, draft, rsvpGuests });
}
