import { cn } from "@/lib/utils";

/**
 * Bölüm veya tam ekran arkasına düşük opaklıkta fotoğraf + karışım katmanı.
 * Üst içerik `relative z-10` ile verilmelidir.
 */
export function AmbientPhotoBackdrop({
  src,
  overlayClassName,
  imageClassName,
  position = "absolute",
  className,
}: {
  src: string;
  overlayClassName: string;
  imageClassName?: string;
  position?: "absolute" | "fixed";
  /** Örn. z-[5] — sabit panel arka planı için */
  className?: string;
}) {
  const pos = position === "fixed" ? "fixed inset-0" : "absolute inset-0";

  return (
    <div className={cn("pointer-events-none", pos, className)} aria-hidden>
      <div
        className={cn(
          "davetio-ambient-photo-bg absolute inset-0 bg-cover bg-center opacity-[0.072] sm:opacity-[0.085]",
          imageClassName,
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
      <div className={cn("absolute inset-0", overlayClassName)} />
    </div>
  );
}
