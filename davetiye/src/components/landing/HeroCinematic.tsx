"use client";

import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export type HeroCinematicProps = {
  poster: string;
  videoSrc: string;
  caption: string;
  playLabel: string;
  pauseLabel: string;
  fallback: string;
};

export function HeroCinematic({
  poster,
  videoSrc,
  caption,
  playLabel,
  pauseLabel,
  fallback,
}: HeroCinematicProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [failed, setFailed] = useState(false);

  const syncPlaying = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setPlaying(!v.paused);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || failed) return;
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    const p = v.play();
    if (p) p.catch(() => setPlaying(false));
  }, [failed, videoSrc]);

  async function toggle() {
    const v = videoRef.current;
    if (!v || failed) return;
    if (v.paused) {
      try {
        await v.play();
        setPlaying(true);
      } catch {
        setFailed(true);
      }
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <figure className="relative w-full overflow-hidden rounded-[1.75rem] border border-ink/[0.08] bg-ink shadow-[0_28px_80px_-24px_rgba(45,35,30,0.45)] ring-1 ring-white/20">
      {!failed ? (
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          poster={poster}
          src={videoSrc}
          muted
          playsInline
          loop
          onPlay={syncPlaying}
          onPause={syncPlaying}
          onEnded={syncPlaying}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="relative aspect-video w-full">
          <img src={poster} alt="" className="h-full w-full object-cover" />
          <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-5 pb-5 pt-12 text-center text-sm text-white/95">
            {fallback}
          </p>
        </div>
      )}

      {!failed ? (
        <button
          type="button"
          onClick={toggle}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-2xl border border-white/35 bg-ink/55 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-md transition-all hover:bg-ink/70"
          aria-pressed={playing}
        >
          {playing ? (
            <Pause className="size-4 shrink-0" aria-hidden />
          ) : (
            <Play className="size-4 shrink-0" aria-hidden />
          )}
          {playing ? pauseLabel : playLabel}
        </button>
      ) : null}

      <figcaption className="border-t border-white/10 bg-ink/40 px-4 py-3 text-center text-[0.7rem] font-medium leading-snug text-white/90 backdrop-blur-md sm:text-xs">
        {caption}
      </figcaption>
    </figure>
  );
}
