/**
 * TR cep telefonunu wa.me için ulusal kodlu rakamlara çevirir (örn. 905551234567).
 */
export function normalizeTrPhoneDigits(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.length < 10) return null;
  let n = d;
  if (n.startsWith("0")) n = n.slice(1);
  if (n.length === 10 && !n.startsWith("90")) n = `90${n}`;
  if (n.startsWith("90") && n.length >= 12) return n;
  return null;
}

export function buildWhatsAppUrl(phoneDigits: string, message: string): string {
  const base = `https://wa.me/${phoneDigits}`;
  const q = new URLSearchParams();
  q.set("text", message);
  return `${base}?${q.toString()}`;
}
