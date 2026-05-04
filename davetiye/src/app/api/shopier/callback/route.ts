import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { verifyShopierCallbackHash } from "@/lib/shopier";

export const runtime = "nodejs";

function formDataToRecord(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/**
 * Shopier ödeme tamamlandığında POST ile çağırır.
 * random_nr + order_id hash doğrulanır; sonra ödeme durumuna göre kullanıcı yönlendirilir.
 */
export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    const fd = await req.formData();
    data = formDataToRecord(fd);
  } catch {
    redirect("/hata");
  }

  if (!verifyShopierCallbackHash(data)) {
    redirect("/hata");
  }

  const status = (data.status ?? "").toLowerCase();
  const orderId = data.order_id ?? data.platform_order_id ?? "";

  if (status === "success") {
    console.info("[shopier] Ödeme başarılı", {
      order_id: orderId,
      payment_id: data.payment_id ?? null,
      total_order_value: data.total_order_value ?? null,
    });
    redirect("/basarili");
  }

  console.warn("[shopier] Ödeme tamamlanmadı", {
    order_id: orderId,
    status: data.status ?? "unknown",
  });

  redirect("/hata");
}
