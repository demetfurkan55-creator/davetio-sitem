"use client";

import { useEffect, useState } from "react";
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
import {
  loadInvitationDraft,
  loadRsvpGuests,
  type RsvpGuestRow,
  type SavedInvitationDraft,
} from "@/lib/davetio-invitation-storage";

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

export function PanelClient() {
  const t = useTranslations("Panel");
  const [draft, setDraft] = useState<SavedInvitationDraft | null>(null);
  const [rows, setRows] = useState<RsvpGuestRow[]>([]);

  useEffect(() => {
    setDraft(loadInvitationDraft());
    setRows(loadRsvpGuests());
  }, []);

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
            {draft ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-muted px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-brand">
                {t("draftBadge")}
              </span>
            ) : null}
            <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-xl text-muted">{t("subtitle")}</p>
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

        {draft ? (
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
        ) : null}

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

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">{t("footerNote")}</p>
      </div>
    </div>
  );
}
