"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { Mail, MapPin, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const MAP_QUERY = encodeURIComponent(
  "Çırağan Sarayı, Beşiktaş, İstanbul",
);

function useRevealPanel<T extends HTMLElement>(
  opts: { amount?: number } = {},
) {
  const sectionRef = useRef<T>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: opts.amount ?? 0.45,
    margin: "0px 0px -12% 0px",
  });
  return [sectionRef, isInView] as const;
}

export default function DemoInvitationPage() {
  const [coverOpen, setCoverOpen] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startMusicFromUserGesture = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.loop = true;
    el.volume = 0.35;
    el.muted = false;
    void el.play().catch(() => {
      /* bazı ortamlarda sessiz başlatıp sonra açılabilir */
    });
  }, []);

  const handleOpenInvite = () => {
    startMusicFromUserGesture();
    setCoverOpen(true);
  };

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = musicMuted;
  }, [musicMuted]);

  const [panel1Ref, panel1InView] = useRevealPanel<HTMLElement>({
    amount: 0.2,
  });
  const [panel2Ref, panel2InView] = useRevealPanel<HTMLElement>();
  const [panel3Ref, panel3InView] = useRevealPanel<HTMLElement>();

  return (
    <div className="relative min-h-[100dvh] bg-[#f4efe6] text-[#2c2b28]">
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />

      <div className="mx-auto min-h-[100dvh] max-w-md shadow-[0_0_0_1px_rgba(44,43,40,0.06)]">
        <AnimatePresence>
          {!coverOpen && (
            <motion.div
              key="cover"
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#1a1917] px-6"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,169,98,0.18),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(183,110,121,0.12),transparent_45%)]"
              />

              <div className="relative z-10 flex max-w-sm flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-10 flex size-24 items-center justify-center rounded-3xl border border-[#c9a962]/35 bg-[#252422]/80 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-sm"
                >
                  <Mail
                    className="size-11 text-[#e8d5a8]"
                    strokeWidth={1.25}
                  />
                </motion.div>

                <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-[#b8a88c]/90">
                  Özel günümüz
                </p>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-[#f0e6d4]">
                  Dijital davetiye
                </h1>

                <motion.button
                  type="button"
                  onClick={handleOpenInvite}
                  className="mt-12 rounded-full border border-[#c9a962]/50 bg-gradient-to-b from-[#3d3a35] to-[#2a2826] px-10 py-4 text-sm font-semibold tracking-wide text-[#f4e8c8] shadow-[0_0_0_0_rgba(201,169,98,0.45)]"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(201, 169, 98, 0.5)",
                      "0 0 0 14px rgba(201, 169, 98, 0)",
                      "0 0 0 0 rgba(201, 169, 98, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  Davetiyeyi aç
                </motion.button>

                <p className="mt-6 max-w-[240px] text-xs leading-relaxed text-[#8a8275]">
                  Müzik ve içerik, dokunuşunuzla başlayacak.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {coverOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="fixed right-4 top-4 z-40 flex size-11 items-center justify-center rounded-full border border-[#c9a962]/35 bg-[#f4efe6]/90 text-[#3d3a35] shadow-md backdrop-blur-md"
            onClick={() => setMusicMuted((m) => !m)}
            aria-label={musicMuted ? "Müziği aç" : "Müziği kapat"}
          >
            {musicMuted ? (
              <VolumeX className="size-5" strokeWidth={1.75} />
            ) : (
              <Volume2 className="size-5" strokeWidth={1.75} />
            )}
          </motion.button>
        )}

        {coverOpen && (
          <main className="relative overflow-x-hidden pb-16 pt-6">
            <section
              ref={panel1Ref}
              className="flex min-h-[100dvh] flex-col justify-end px-6 pb-16 pt-24"
            >
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={
                  panel1InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 80 }
                }
                transition={{
                  duration: 1.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-center"
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-[#7a7268]">
                  Birlikte
                </p>
                <h2 className="font-display text-[clamp(2.25rem,9vw,3rem)] font-semibold leading-[1.08] tracking-tight text-[#252422]">
                  Elif
                  <span className="mx-2 inline-block align-middle text-[0.55em] font-normal text-[#c9a962]">
                    &
                  </span>
                  Can
                </h2>
                <p className="mt-5 font-display text-xl font-medium text-[#5c574e]">
                  Evleniyoruz
                </p>
                <div className="mx-auto mt-10 h-px w-16 bg-gradient-to-r from-transparent via-[#c9a962]/70 to-transparent" />
              </motion.div>
            </section>

            <section
              ref={panel2Ref}
              className="flex min-h-[100dvh] flex-col justify-center gap-5 px-6 py-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={
                  panel2InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                }
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <p className="text-center text-xs font-medium uppercase tracking-[0.28em] text-[#7a7268]">
                  Tarih & mekân
                </p>

                <div className="rounded-2xl border border-white/50 bg-white/35 p-5 shadow-sm backdrop-blur-md">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#8a8275]">
                    Tarih
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-[#252422]">
                    14 Haziran 2026
                  </p>
                </div>

                <div className="rounded-2xl border border-white/50 bg-white/35 p-5 shadow-sm backdrop-blur-md">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#8a8275]">
                    Saat
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-[#252422]">
                    18:30
                  </p>
                </div>

                <div className="rounded-2xl border border-white/50 bg-white/35 p-5 shadow-sm backdrop-blur-md">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#8a8275]">
                    Mekân
                  </p>
                  <p className="mt-1 text-base font-medium leading-snug text-[#2c2b28]">
                    Çırağan Sarayı
                    <span className="mt-1 block text-sm font-normal text-[#5c574e]">
                      Beşiktaş, İstanbul
                    </span>
                  </p>
                </div>
              </motion.div>
            </section>

            <section
              ref={panel3Ref}
              className="flex min-h-[100dvh] flex-col justify-center px-6 py-12"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={
                  panel3InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 40 }
                }
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <p className="text-center text-xs font-medium uppercase tracking-[0.28em] text-[#7a7268]">
                  Konum & katılım
                </p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[#c9a962]/40 bg-[#2c2b28] px-5 py-4 text-sm font-semibold text-[#f4efe6] shadow-md transition hover:bg-[#383633]"
                >
                  <MapPin className="size-4 text-[#e8d5a8]" />
                  Haritada aç
                </a>

                <form
                  className="rounded-2xl border border-[#dcd4c8] bg-[#faf7f2]/90 p-6 shadow-sm backdrop-blur-sm"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const payload = Object.fromEntries(fd.entries());
                    // Demo: gerçek backend yok
                    console.info("LCV (demo)", payload);
                    alert("Teşekkürler! Bu sayfa bir demo; yanıtınız kaydedilmedi.");
                  }}
                >
                  <h3 className="font-display text-lg font-semibold text-[#252422]">
                    Katılım durumu (LCV)
                  </h3>
                  <p className="mt-1 text-sm text-[#5c574e]">
                    Lütfen kısa bilgilerinizi bırakın.
                  </p>

                  <label className="mt-5 block text-sm font-medium text-[#3d3a35]">
                    Ad soyad
                    <input
                      name="fullName"
                      required
                      className="mt-1.5 w-full rounded-xl border border-[#dcd4c8] bg-white/80 px-3 py-2.5 text-[#2c2b28] outline-none ring-[#c9a962]/30 focus:ring-2"
                      placeholder="Adınız Soyadınız"
                      autoComplete="name"
                    />
                  </label>

                  <fieldset className="mt-4">
                    <legend className="text-sm font-medium text-[#3d3a35]">
                      Katılım
                    </legend>
                    <div className="mt-2 flex gap-3">
                      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#dcd4c8] bg-white/60 px-3 py-2.5 has-[:checked]:border-[#c9a962] has-[:checked]:bg-[#fffdf8]">
                        <input
                          type="radio"
                          name="rsvp"
                          value="yes"
                          defaultChecked
                          className="accent-[#c9a962]"
                        />
                        <span className="text-sm">Geleceğim</span>
                      </label>
                      <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-[#dcd4c8] bg-white/60 px-3 py-2.5 has-[:checked]:border-[#c9a962] has-[:checked]:bg-[#fffdf8]">
                        <input
                          type="radio"
                          name="rsvp"
                          value="no"
                          className="accent-[#c9a962]"
                        />
                        <span className="text-sm">Gelemeyeceğim</span>
                      </label>
                    </div>
                  </fieldset>

                  <label className="mt-4 block text-sm font-medium text-[#3d3a35]">
                    Kişi sayısı
                    <select
                      name="guestCount"
                      className="mt-1.5 w-full rounded-xl border border-[#dcd4c8] bg-white/80 px-3 py-2.5 text-[#2c2b28] outline-none ring-[#c9a962]/30 focus:ring-2"
                      defaultValue="1"
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4+</option>
                    </select>
                  </label>

                  <label className="mt-4 block text-sm font-medium text-[#3d3a35]">
                    Not (isteğe bağlı)
                    <textarea
                      name="note"
                      rows={3}
                      className="mt-1.5 w-full resize-none rounded-xl border border-[#dcd4c8] bg-white/80 px-3 py-2.5 text-[#2c2b28] outline-none ring-[#c9a962]/30 focus:ring-2"
                      placeholder="Alerji, çocuk koltuğu vb."
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-6 w-full rounded-xl bg-[#2c2b28] py-3 text-sm font-semibold text-[#f4efe6] transition hover:bg-[#383633]"
                  >
                    Gönder
                  </button>
                </form>
              </motion.div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
