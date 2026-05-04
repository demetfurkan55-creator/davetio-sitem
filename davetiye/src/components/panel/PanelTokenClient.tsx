"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles,
  Users,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AmbientPhotoBackdrop } from "@/components/ui/AmbientPhotoBackdrop";
import { SITE_AMBIENT } from "@/lib/site-ambient";
import { cn } from "@/lib/utils";
import type { RsvpGuestRow, SavedInvitationDraft } from "@/lib/davetio-invitation-storage";

const statusIcon = {
  yes: CheckCircle2,
  maybe: HelpCircle,
  no: XCircle,
} as const;

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length < 4) return "—";
  return `${"•".repeat(Math.max(0, d.length - 4))}${d.slice(-4)}`;
}

type Props = { token: string };

export function PanelTokenClient({ token }: Props) {
  const t = useTranslations("Panel");
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [draft, setDraft] = useState<SavedInvitationDraft | null>(null);
  const [rows, setRows] = useState<RsvpGuestRow[]>([]);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const fetchPanel = useCallback(async () => {
    setLoadErr(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setLoadErr(t("loadError"));
        setDraft(null);
        setRows([]);
        return;
      }
      const data = (await res.json()) as {
        draft: SavedInvitationDraft;
        rsvpGuests: RsvpGuestRow[];
      };
      setDraft(data.draft);
      setRows(data.rsvpGuests ?? []);
    } catch {
      setLoadErr(t("loadError"));
      setDraft(null);
    } finally {
      setLoading(false);
    }
  }, [token, t]);

  useEffect(() => {
    void fetchPanel();
  }, [fetchPanel]);

  const confirmed = rows.filter((r) => r.status === "yes").length;
  const pending = rows.filter((r) => r.status === "maybe").length;
  const declined = rows.filter((r) => r.status === "no").length;
  const guests = rows.reduce((acc, r) => acc + (Number.parseInt(r.party, 10) || 0), 0);

  const stats = [
    { label: t("statConfirmed"), value: confirmed, icon: CheckCircle2, tone: "text-emerald-600" },
    { label: t("statPending"), value: pending, icon: Clock, tone: "text-amber-600" },
    { label: t("statDeclined"), value: declined, icon: XCircle, tone: "text-rose-600" },
    { label: t("statGuests"), value: guests, icon: Users, tone: "text-brand" },
    { label: t("statResponses"), value: rows.length, icon: Sparkles, tone: "text-ink/70" },
  ] as const;

  async function saveEdit() {
    if (!draft) return;
    setSaveErr(null);
    setSaving(true);
    setSavedFlash(false);
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draft: {
            ...draft,
            savedAt: new Date().toISOString(),
          },
          rsvpGuests: rows,
        }),
      });
      if (!res.ok) {
        setSaveErr(t("saveError"));
        return;
      }
      const data = (await res.json()) as { draft: SavedInvitationDraft };
      setDraft(data.draft);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2500);
    } catch {
      setSaveErr(t("saveError"));
    } finally {
      setSaving(false);
    }
  }

  function updateDraft<K extends keyof SavedInvitationDraft>(key: K, value: SavedInvitationDraft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : null));
  }

  return (
    <div className="min-h-full w-full max-w-[100vw] min-w-0 overflow-x-hidden bg-canvas">
      <AmbientPhotoBackdrop
        position="fixed"
        className="z-[5]"
        src={SITE_AMBIENT.venueWarm}
        overlayClassName="bg-gradient-to-b from-canvas/88 via-canvas/76 to-canvas/92"
      />
      <div
        className="davetio-hero-mesh davetio-grain pointer-events-none fixed inset-0 z-[6] opacity-40"
        aria-hidden
      />
      <div className="relative z-10 mx-auto min-w-0 max-w-6xl px-4 pb-16 pt-10 sm:px-8 sm:pt-14">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-muted px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand">
              {t("cloudBadge")}
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-xl text-muted">{t("subtitleCloud")}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-ink/12 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-brand/30 hover:text-brand"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t("ctaHome")}
            </Link>
            <Link
              href="/olustur"
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 text-sm font-semibold text-canvas shadow-md transition-transform hover:-translate-y-0.5"
            >
              {t("ctaCreate")}
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted">{t("loading")}</p>
        ) : loadErr ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {loadErr}
          </p>
        ) : draft ? (
          <>
            <section className="mb-10 rounded-[1.35rem] border border-ink/[0.07] bg-white/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8">
              <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">{t("editTitle")}</h2>
              <p className="mt-1 text-sm text-muted">{t("editHint")}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-ink">
                  {t("fieldBride")} *
                  <input
                    value={draft.bride}
                    onChange={(e) => updateDraft("bride", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  {t("fieldGroom")} *
                  <input
                    value={draft.groom}
                    onChange={(e) => updateDraft("groom", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm text-ink">
                  {t("fieldBrideMother")}
                  <input
                    value={draft.brideMother}
                    onChange={(e) => updateDraft("brideMother", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm text-ink">
                  {t("fieldBrideFather")}
                  <input
                    value={draft.brideFather}
                    onChange={(e) => updateDraft("brideFather", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm text-ink">
                  {t("fieldGroomMother")}
                  <input
                    value={draft.groomMother}
                    onChange={(e) => updateDraft("groomMother", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm text-ink">
                  {t("fieldGroomFather")}
                  <input
                    value={draft.groomFather}
                    onChange={(e) => updateDraft("groomFather", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  {t("fieldDate")} *
                  <input
                    type="date"
                    value={draft.eventDate}
                    onChange={(e) => updateDraft("eventDate", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink">
                  {t("fieldTime")} *
                  <input
                    type="time"
                    value={draft.eventTime}
                    onChange={(e) => updateDraft("eventTime", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink sm:col-span-2">
                  {t("fieldVenueName")} *
                  <input
                    value={draft.venueName}
                    onChange={(e) => updateDraft("venueName", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink sm:col-span-2">
                  {t("fieldVenueAddress")} *
                  <textarea
                    value={draft.venueAddress}
                    onChange={(e) => updateDraft("venueAddress", e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm text-ink sm:col-span-2">
                  {t("fieldMaps")}
                  <input
                    value={draft.mapsLink}
                    onChange={(e) => updateDraft("mapsLink", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
                <label className="text-sm font-semibold text-ink sm:col-span-2">
                  {t("fieldPhone")} *
                  <input
                    value={draft.phone}
                    onChange={(e) => updateDraft("phone", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-ink/10 bg-canvas px-3 py-2.5 text-base outline-none ring-wine/20 focus:ring-2"
                  />
                </label>
              </div>
              <p className="mt-4 text-sm text-muted">
                {t("fieldMusic")}: <span className="font-medium text-ink">{draft.musicTrackTitle || "—"}</span>
              </p>
              {saveErr ? (
                <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
                  {saveErr}
                </p>
              ) : null}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void saveEdit()}
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-brand-hover disabled:opacity-60"
                >
                  {saving ? t("saving") : t("save")}
                </button>
                {savedFlash ? (
                  <span className="text-sm font-medium text-emerald-700">{t("saved")}</span>
                ) : null}
              </div>
            </section>

            <section className="mb-10 rounded-[1.35rem] border border-ink/[0.07] bg-white/95 p-6 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-8">
              <h2 className="font-display text-lg font-semibold text-ink sm:text-xl">{t("draftTitle")}</h2>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftCouple")}</dt>
                  <dd className="mt-1 font-medium text-ink">
                    {draft.bride} & {draft.groom}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftWhen")}</dt>
                  <dd className="mt-1 text-ink">
                    {draft.eventDate} {draft.eventTime}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftVenue")}</dt>
                  <dd className="mt-1 font-medium text-ink">{draft.venueName}</dd>
                  <dd className="mt-1 whitespace-pre-line text-muted">{draft.venueAddress}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftPhone")}</dt>
                  <dd className="mt-1 tabular-nums text-ink">{maskPhone(draft.phone)}</dd>
                </div>
                <div>
                  <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftMusic")}</dt>
                  <dd className="mt-1 text-ink">{draft.musicTrackTitle || "—"}</dd>
                </div>
                {(draft.templateSlug || draft.pkg) && (
                  <div className="sm:col-span-2">
                    <dt className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">{t("draftTemplate")}</dt>
                    <dd className="mt-1 font-mono text-xs text-ink/80">
                      {[draft.templateSlug, draft.pkg].filter(Boolean).join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map(({ label, value, icon: Icon, tone }, i) => (
                <div
                  key={`stat-${i}`}
                  className="rounded-2xl border border-ink/[0.07] bg-white/90 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">{label}</p>
                    <Icon className={cn("size-5 shrink-0 opacity-90", tone)} aria-hidden />
                  </div>
                  <p className="mt-3 font-display text-3xl font-semibold tabular-nums text-ink">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-ink/[0.07] bg-white shadow-[var(--shadow-card)]">
              <div className="border-b border-ink/[0.06] bg-gradient-to-r from-brand-muted/60 to-canvas px-5 py-4 sm:px-6">
                <h2 className="font-display text-lg font-semibold text-ink">{t("sectionGuests")}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink/[0.06] bg-canvas-muted/80 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">
                      <th className="px-5 py-3 sm:px-6">{t("colGuest")}</th>
                      <th className="px-5 py-3 sm:px-6">{t("colStatus")}</th>
                      <th className="px-5 py-3 sm:px-6">{t("colParty")}</th>
                      <th className="px-5 py-3 sm:px-6">{t("colWhen")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-sm leading-relaxed text-muted sm:px-6">
                          {t("emptyGuestList")}
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, idx) => {
                        const Icon = statusIcon[row.status];
                        const label =
                          row.status === "yes"
                            ? t("statusYes")
                            : row.status === "maybe"
                              ? t("statusMaybe")
                              : t("statusNo");
                        return (
                          <tr
                            key={`${row.name}-${idx}`}
                            className="border-b border-ink/[0.04] transition-colors last:border-0 hover:bg-brand-muted/25"
                          >
                            <td className="px-5 py-3.5 font-medium text-ink sm:px-6">{row.name}</td>
                            <td className="px-5 py-3.5 sm:px-6">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-canvas-muted px-2.5 py-1 text-xs font-semibold text-ink/85">
                                <Icon className="size-3.5 shrink-0 text-brand" aria-hidden />
                                {label}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 tabular-nums text-muted sm:px-6">{row.party}</td>
                            <td className="px-5 py-3.5 text-muted sm:px-6">{row.when}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{t("footerNoteCloud")}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}
