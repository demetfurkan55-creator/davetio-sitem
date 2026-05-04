import { Crown, Gem, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BasariliPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top,_#5e0f23_0%,_#2a0912_46%,_#12040b_100%)] px-6 py-16 text-[#f8e9c4] sm:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:radial-gradient(circle_at_20%_20%,rgba(255,214,120,0.28),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(255,214,120,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(255,214,120,0.12),transparent_35%)]" />
      <section className="relative mx-auto max-w-3xl rounded-[2rem] border border-[#f1ca78]/35 bg-[#2d0a14]/75 p-8 text-center shadow-[0_30px_80px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#f1ca78]/60 bg-[#f1ca78]/15">
          <Crown className="size-10 text-[#f3d58d]" aria-hidden />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#f4db9f]/90">
          Davetio Premium
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[#fff4da] sm:text-4xl">
          Odemeniz Basariyla Alindi, Davetiyeniz Yayinda!
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#f0ddaf]/85 sm:text-base">
          Siparisiniz onaylandi. Davetiyeniz aktif edildi ve paylasima hazir. Dilerseniz hemen panelinize
          gecip baglantinizi kopyalayabilir, QR kodunuzu indirebilir ve misafirlerinizi davet etmeye
          baslayabilirsiniz.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-[#f1ca78]/30 bg-[#f1ca78]/10 p-4">
            <Gem className="mb-2 size-5 text-[#f3d58d]" aria-hidden />
            <p className="text-sm font-semibold text-[#fff0cc]">Aninda Aktivasyon</p>
          </div>
          <div className="rounded-2xl border border-[#f1ca78]/30 bg-[#f1ca78]/10 p-4">
            <Sparkles className="mb-2 size-5 text-[#f3d58d]" aria-hidden />
            <p className="text-sm font-semibold text-[#fff0cc]">Premium Tema Deneyimi</p>
          </div>
          <div className="rounded-2xl border border-[#f1ca78]/30 bg-[#f1ca78]/10 p-4">
            <Crown className="mb-2 size-5 text-[#f3d58d]" aria-hidden />
            <p className="text-sm font-semibold text-[#fff0cc]">Sinirsiz Paylasim</p>
          </div>
        </div>

        <div className="mt-9">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-[#f1ca78] to-[#dfb15a] px-8 py-3 text-sm font-bold text-[#3a0f1b] shadow-[0_18px_40px_-18px_rgba(241,202,120,0.85)] transition hover:brightness-105"
          >
            Ana Sayfaya Don
          </Link>
        </div>
      </section>
    </main>
  );
}
