"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { Link } from "@/i18n/navigation";
import type { MarketTemplate } from "@/components/davetio/CategoryMarket";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

function splitDisplayName(name: string): { kicker: string; title: string } {
  const m = name.match(/^(.+?)\s[—–-]\s(.+)$/);
  if (m) return { kicker: m[1], title: m[2] };
  return { kicker: "", title: name };
}

export function HeroCoverflowCarousel({ slides }: { slides: MarketTemplate[] }) {
  const t = useTranslations("Landing.heroSlider");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!slides.length) return null;

  return (
    <div className="relative z-[2] mx-auto w-full max-w-7xl overflow-x-clip px-0 pt-4 sm:pt-6">
      <p className="mb-3 px-3 text-center text-[0.6rem] font-semibold uppercase leading-snug tracking-[0.2em] text-ink/45 sm:mb-4 sm:px-0 sm:text-[0.65rem] sm:tracking-[0.28em]">
        {t("collectionLine")}
      </p>

      <div className="relative px-3 sm:px-10 md:px-14 lg:px-16">
        <button
          ref={prevRef}
          type="button"
          className="hero-coverflow-nav hero-coverflow-nav--prev"
          aria-label={t("prevAria")}
        >
          <ChevronLeft className="size-5" strokeWidth={1.75} aria-hidden />
        </button>
        <button
          ref={nextRef}
          type="button"
          className="hero-coverflow-nav hero-coverflow-nav--next"
          aria-label={t("nextAria")}
        >
          <ChevronRight className="size-5" strokeWidth={1.75} aria-hidden />
        </button>

        <Swiper
          className="hero-coverflow-swiper !overflow-visible pb-8 sm:pb-10"
          modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop={slides.length >= 3}
          slidesPerView="auto"
          speed={700}
          autoplay={
            reduceMotion
              ? false
              : {
                  delay: 4800,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
          }
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          onBeforeInit={(swiper) => {
            const nav = swiper.params.navigation;
            if (nav && typeof nav !== "boolean") {
              nav.prevEl = prevRef.current;
              nav.nextEl = nextRef.current;
            }
          }}
          coverflowEffect={{
            rotate: 14,
            stretch: 0,
            depth: 160,
            modifier: 1,
            slideShadows: false,
          }}
          breakpoints={{
            640: {
              coverflowEffect: {
                rotate: 22,
                stretch: 0,
                depth: 320,
                modifier: 1,
                slideShadows: true,
              },
            },
          }}
        >
          {slides.map((item) => {
            const { kicker, title } = splitDisplayName(item.name);
            return (
              <SwiperSlide key={item.slug} className="!h-auto max-w-[min(88vw,580px)] sm:max-w-[min(92vw,580px)]">
                <article className="hero-coverflow-card group mx-auto flex min-h-[min(58vw,340px)] w-full max-w-[min(88vw,580px)] flex-col overflow-hidden rounded-[1.35rem] border border-ink/[0.07] bg-gradient-to-br from-[#fdfbf7] via-[#faf6ef] to-[#f3ece2] shadow-[0_28px_80px_-24px_rgba(22,24,20,0.22)] ring-1 ring-white/80 sm:max-w-[min(92vw,580px)] sm:min-h-[400px] sm:rounded-[1.75rem] sm:flex-row">
                  <div className="relative flex flex-1 flex-col justify-center p-5 sm:p-9 sm:pr-5">
                    <div
                      className="pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-seal-gold/10 blur-3xl"
                      aria-hidden
                    />
                    <p className="relative text-[0.62rem] font-bold uppercase tracking-[0.22em] text-seal-gold">
                      {item.tag}
                    </p>
                    {kicker ? (
                      <p className="relative mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted">
                        {kicker}
                      </p>
                    ) : null}
                    <h3 className="relative mt-2 font-display text-[clamp(1.2rem,4.5vw+0.35rem,1.65rem)] font-semibold leading-[1.12] tracking-tight text-ink sm:mt-3 sm:text-[2rem]">
                      {title}
                    </h3>
                    <p className="font-accent relative mt-2 text-lg text-seal-navy/90 sm:mt-3 sm:text-2xl">
                      {item.cardCouple}
                    </p>
                    <p className="relative mt-1.5 text-sm text-muted">{item.cardDate}</p>
                    <div className="relative mt-6 sm:mt-8">
                      <Link
                        href={`/templates/${item.slug}`}
                        className="inline-flex w-full items-center justify-center rounded-full bg-seal-navy px-6 py-2.5 text-sm font-semibold text-white shadow-[0_14px_36px_-10px_rgba(20,31,56,0.45)] ring-1 ring-seal-gold/35 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 sm:inline-flex sm:w-auto sm:px-8 sm:py-3"
                      >
                        {t("exploreCta")}
                      </Link>
                    </div>
                  </div>

                  <div className="relative h-44 w-full shrink-0 sm:h-auto sm:w-[42%] sm:min-h-[280px]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#f3ece2] via-transparent to-transparent sm:bg-gradient-to-l" />
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 640px) 240px, (max-width: 639px) 88vw, 100vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      priority={item.slug === slides[0]?.slug}
                    />
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
