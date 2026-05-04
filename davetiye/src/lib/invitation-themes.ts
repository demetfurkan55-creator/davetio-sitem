/**
 * Davetiye kategorisine göre renk, tipografi ve kazı-kazan görünümü.
 * filterId: wedding | henna | engagement | nikah
 */

export type InvitationThemeId = "wedding" | "henna" | "engagement" | "nikah";

export type InvitationScratchTokens = {
  revealText: string;
  gradientHigh: string;
  gradientMid: string;
  gradientDeep: string;
  gradientEdge: string;
  /** Parlak üst highlight (3D) */
  specular: string;
  strokeHighlight: string;
  numberOnSeal: string;
  canvasShadow: string;
  /** Kına için daha güçlü metalik his */
  hennaMetallic: boolean;
};

export type InvitationThemeTokens = {
  id: InvitationThemeId;
  pageBg: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentSoft: string;
  borderSubtle: string;
  cardBg: string;
  cardBorder: string;
  countdownBg: string;
  countdownBorder: string;
  countdownLabel: string;
  countdownNumber: string;
  btnPrimary: string;
  btnPrimaryHover: string;
  btnRing: string;
  dotActive: string;
  dotInactive: string;
  chevron: string;
  gateStroke: string;
  gateAccent: string;
  storyKicker: string;
  bodyText: string;
  musicFabClass: string;
  scratch: InvitationScratchTokens;
  /** Tailwind-friendly backdrop hint */
  backdrop: "ivory" | "henna" | "engagement" | "nikah";
};

const SCRATCH_WEDDING: InvitationScratchTokens = {
  revealText: "#6b1d2e",
  gradientHigh: "#fff8e7",
  gradientMid: "#e8c76b",
  gradientDeep: "#b8860b",
  gradientEdge: "#6b4c0a",
  specular: "rgba(255,255,255,0.55)",
  strokeHighlight: "rgba(255,255,255,0.4)",
  numberOnSeal: "rgba(80,40,20,0.5)",
  canvasShadow: "0 14px 36px rgba(60,30,15,0.28), inset 0 2px 8px rgba(255,255,255,0.35)",
  hennaMetallic: false,
};

const SCRATCH_HENNA: InvitationScratchTokens = {
  revealText: "#D4AF37",
  gradientHigh: "#fffef5",
  gradientMid: "#f0d060",
  gradientDeep: "#D4AF37",
  gradientEdge: "#8b6914",
  specular: "rgba(255,252,220,0.85)",
  strokeHighlight: "rgba(255,235,160,0.9)",
  numberOnSeal: "rgba(60,10,10,0.55)",
  canvasShadow:
    "0 18px 44px rgba(0,0,0,0.45), inset 0 -6px 14px rgba(139,105,20,0.35), inset 0 3px 10px rgba(255,250,220,0.65)",
  hennaMetallic: true,
};

const SCRATCH_ENGAGEMENT: InvitationScratchTokens = {
  revealText: "#4a5c48",
  gradientHigh: "#fdf6f8",
  gradientMid: "#d4c4a8",
  gradientDeep: "#9caf88",
  gradientEdge: "#5d6b52",
  specular: "rgba(255,255,255,0.5)",
  strokeHighlight: "rgba(255,255,255,0.35)",
  numberOnSeal: "rgba(74,92,72,0.45)",
  canvasShadow: "0 12px 32px rgba(80,60,70,0.15), inset 0 2px 6px rgba(255,255,255,0.5)",
  hennaMetallic: false,
};

const SCRATCH_NIKAH: InvitationScratchTokens = {
  revealText: "#2d3748",
  gradientHigh: "#ffffff",
  gradientMid: "#e2e8f0",
  gradientDeep: "#94a3b8",
  gradientEdge: "#475569",
  specular: "rgba(255,255,255,0.9)",
  strokeHighlight: "rgba(255,255,255,0.65)",
  numberOnSeal: "rgba(45,55,72,0.45)",
  canvasShadow: "0 10px 28px rgba(30,40,55,0.12), inset 0 1px 4px rgba(255,255,255,0.9)",
  hennaMetallic: false,
};

export const INVITATION_THEMES: Record<InvitationThemeId, InvitationThemeTokens> = {
  wedding: {
    id: "wedding",
    pageBg: "#faf6f0",
    textPrimary: "#6b1d2e",
    textSecondary: "#5a1622",
    textMuted: "#5e5658",
    accent: "#c9a44a",
    accentSoft: "#dfc896",
    borderSubtle: "rgba(107,29,46,0.1)",
    cardBg: "rgba(255,255,255,0.95)",
    cardBorder: "rgba(107,29,46,0.08)",
    countdownBg: "rgba(255,255,255,0.95)",
    countdownBorder: "rgba(255,255,255,0.9)",
    countdownLabel: "#5e5658",
    countdownNumber: "#6b1d2e",
    btnPrimary: "#6b1d2e",
    btnPrimaryHover: "#551825",
    btnRing: "rgba(201,164,74,0.35)",
    dotActive: "#c9a44a",
    dotInactive: "rgba(28,20,22,0.15)",
    chevron: "#c9a44a",
    gateStroke: "#6b1d2e",
    gateAccent: "#c9a44a",
    storyKicker: "#c9a44a",
    bodyText: "#3d3538",
    musicFabClass: "",
    scratch: SCRATCH_WEDDING,
    backdrop: "ivory",
  },
  henna: {
    id: "henna",
    pageBg: "#5C0910",
    textPrimary: "#D4AF37",
    textSecondary: "#e8c76b",
    textMuted: "rgba(212,175,55,0.72)",
    accent: "#D4AF37",
    accentSoft: "#f0d060",
    borderSubtle: "rgba(212,175,55,0.25)",
    cardBg: "rgba(36,6,8,0.55)",
    cardBorder: "rgba(212,175,55,0.28)",
    countdownBg: "rgba(44,8,12,0.75)",
    countdownBorder: "rgba(212,175,55,0.35)",
    countdownLabel: "rgba(212,175,55,0.75)",
    countdownNumber: "#D4AF37",
    btnPrimary: "#D4AF37",
    btnPrimaryHover: "#e8c76b",
    btnRing: "rgba(212,175,55,0.45)",
    dotActive: "#D4AF37",
    dotInactive: "rgba(212,175,55,0.2)",
    chevron: "#D4AF37",
    gateStroke: "#D4AF37",
    gateAccent: "#f0d060",
    storyKicker: "#D4AF37",
    bodyText: "rgba(245,230,200,0.92)",
    musicFabClass: "ring-[#D4AF37]/40 border-[#D4AF37]/55",
    scratch: SCRATCH_HENNA,
    backdrop: "henna",
  },
  engagement: {
    id: "engagement",
    pageBg: "#eef4ec",
    textPrimary: "#4a5c48",
    textSecondary: "#5d6d5a",
    textMuted: "#6b7569",
    accent: "#c9a8b8",
    accentSoft: "#9caf88",
    borderSubtle: "rgba(74,92,72,0.12)",
    cardBg: "rgba(255,253,252,0.92)",
    cardBorder: "rgba(201,168,184,0.35)",
    countdownBg: "rgba(255,255,255,0.9)",
    countdownBorder: "rgba(156,175,136,0.35)",
    countdownLabel: "#6b7569",
    countdownNumber: "#4a5c48",
    btnPrimary: "#5d7368",
    btnPrimaryHover: "#4a5c48",
    btnRing: "rgba(156,175,136,0.45)",
    dotActive: "#9caf88",
    dotInactive: "rgba(74,92,72,0.15)",
    chevron: "#9caf88",
    gateStroke: "#7a8f78",
    gateAccent: "#c9a8b8",
    storyKicker: "#9caf88",
    bodyText: "#4a4546",
    musicFabClass: "",
    scratch: SCRATCH_ENGAGEMENT,
    backdrop: "engagement",
  },
  nikah: {
    id: "nikah",
    pageBg: "#f8fafc",
    textPrimary: "#1e293b",
    textSecondary: "#334155",
    textMuted: "#64748b",
    accent: "#94a3b8",
    accentSoft: "#cbd5e1",
    borderSubtle: "rgba(148,163,184,0.35)",
    cardBg: "rgba(255,255,255,0.95)",
    cardBorder: "rgba(203,213,225,0.8)",
    countdownBg: "rgba(255,255,255,0.98)",
    countdownBorder: "rgba(226,232,240,0.85)",
    countdownLabel: "#64748b",
    countdownNumber: "#1e293b",
    btnPrimary: "#1e293b",
    btnPrimaryHover: "#0f172a",
    btnRing: "rgba(148,163,184,0.5)",
    dotActive: "#94a3b8",
    dotInactive: "rgba(30,41,59,0.12)",
    chevron: "#64748b",
    gateStroke: "#94a3b8",
    gateAccent: "#cbd5e1",
    storyKicker: "#64748b",
    bodyText: "#475569",
    musicFabClass: "border-slate-400/40",
    scratch: SCRATCH_NIKAH,
    backdrop: "nikah",
  },
};

export function resolveInvitationTheme(id?: string | null): InvitationThemeId {
  const k = (id ?? "wedding").toLowerCase().trim();
  if (k === "henna") return "henna";
  if (k === "engagement") return "engagement";
  if (k === "nikah") return "nikah";
  if (k === "wedding") return "wedding";
  return "wedding";
}

export function getInvitationThemeTokens(theme: InvitationThemeId): InvitationThemeTokens {
  return INVITATION_THEMES[theme] ?? INVITATION_THEMES.wedding;
}
