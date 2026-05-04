"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

const CHECKOUT_PACKAGE_ID = "solo";

type Props = {
  locale: string;
};

export function LandingShopierPricing({ locale }: Props) {
  const t = useTranslations("Landing.shopier");
  const tPricing = useTranslations("Landing.pricingTeaser");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("TR");
  const [postcode, setPostcode] = useState("");

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open) {
      d.showModal();
    } else {
      d.close();
    }
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  const submitCheckout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/shopier/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/html, application/json" },
        body: JSON.stringify({
          packageId: CHECKOUT_PACKAGE_ID,
          locale,
          buyer: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.replace(/\s/g, ""),
          },
          billing: {
            address: address.trim(),
            city: city.trim(),
            country: country.trim(),
            postcode: postcode.trim(),
          },
        }),
      });

      const bodyText = await res.text();

      if (!res.ok) {
        try {
          const j = JSON.parse(bodyText) as { error?: string };
          setError(j.error ?? t("error"));
        } catch {
          setError(t("error"));
        }
        setLoading(false);
        return;
      }

      document.open();
      document.write(bodyText);
      document.close();
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  }, [address, city, country, email, firstName, lastName, locale, phone, postcode, t]);

  return (
    <>
      <section
        className="border-y border-[#6b1d2e]/10 bg-white/[0.45] px-5 py-14 backdrop-blur-[2px] sm:px-10 sm:py-16"
        aria-labelledby="landing-pricing-heading"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#6b1d2e]/70">
            {t("planLabel")}
          </p>
          <h2
            id="landing-pricing-heading"
            className="mt-3 font-display text-[clamp(1.5rem,3.5vw,2rem)] font-semibold text-[#4a1420]"
          >
            {tPricing("title")}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#5e5658]">{tPricing("body")}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6b1d2e] px-8 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-14px_rgba(107,29,46,0.45)] ring-1 ring-white/20 transition hover:bg-[#551825]"
          >
            <CreditCard className="size-4 opacity-90" aria-hidden />
            {t("buyCta")}
          </button>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        onClose={close}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        className="w-full max-w-md rounded-2xl border border-[#6b1d2e]/15 bg-[#fdf9f9] p-0 text-[#4a1420] shadow-[0_24px_60px_-24px_rgba(60,20,30,0.35)] backdrop:bg-black/40"
      >
        <form
          className="flex max-h-[85dvh] flex-col gap-4 overflow-y-auto p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void submitCheckout();
          }}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[#6b1d2e]/10 pb-3">
            <h3 className="font-display text-lg font-semibold">{t("formTitle")}</h3>
            <button
              type="button"
              onClick={close}
              className="shrink-0 rounded-lg px-2 py-1 text-sm text-[#6b1d2e]/80 hover:bg-[#6b1d2e]/10"
            >
              {t("cancel")}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
              {t("firstName")}
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
                autoComplete="given-name"
              />
            </label>
            <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
              {t("lastName")}
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
            {t("email")}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
            {t("phone")}
            <input
              required
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
              autoComplete="tel"
            />
          </label>

          <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
            {t("address")}
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
              autoComplete="street-address"
            />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
              {t("city")}
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
                autoComplete="address-level2"
              />
            </label>
            <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
              {t("postcode")}
              <input
                required
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
                autoComplete="postal-code"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-left text-xs font-medium text-[#5e5658]">
            {t("country")}
            <input
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-xl border border-[#6b1d2e]/15 bg-white px-3 py-2 text-base text-[#4a1420]"
              autoComplete="country-name"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800 ring-1 ring-red-200/80">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#6b1d2e] px-4 py-3 text-sm font-bold text-white shadow-[0_12px_32px_-12px_rgba(107,29,46,0.5)] transition hover:bg-[#551825] disabled:opacity-60"
          >
            {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {loading ? t("loading") : t("submit")}
          </button>
        </form>
      </dialog>
    </>
  );
}
