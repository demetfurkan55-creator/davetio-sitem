import Image from "next/image";
import { cn } from "@/lib/utils";

/** Özel mühür görseli: `public/images/branding/davetio-seal.png` */
const SEAL_SRC = "/images/branding/davetio-seal.png";

export type DavetioMarkVariant = "seal" | "romantic";

/**
 * Davetio balmumu mühür amblemi — lacivert & altın mühür görseli.
 * Varyant: `romantic` hafif altın parıltı gölgesi (hero / footer).
 */
export function DavetioMark({
  className,
  size = 40,
  variant = "seal",
  "aria-hidden": ariaHidden = true,
}: {
  className?: string;
  size?: number;
  variant?: DavetioMarkVariant;
  "aria-hidden"?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center [forced-color-adjust:none]",
        variant === "romantic" && "drop-shadow-[0_6px_22px_rgba(198,160,97,0.32)]",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={ariaHidden}
    >
      <Image
        src={SEAL_SRC}
        alt=""
        width={size}
        height={size}
        quality={92}
        sizes={`${size}px`}
        className={cn(
          "h-full w-full object-contain",
          variant === "romantic" && "brightness-[1.03] contrast-[1.04] saturate-[1.05]",
        )}
        priority={size >= 44}
      />
    </span>
  );
}
