import { NextResponse, type NextRequest } from "next/server";
import { verifyShopierReturnSignature } from "@/lib/shopier";

export const runtime = "nodejs";

function formDataToRecord(fd: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of fd.entries()) {
    if (typeof v === "string") out[k] = v;
  }
  return out;
}

/**
 * Shopier ödeme tamamlandığında (başarılı / başarısız) POST ile çağırır.
 * İmzayı doğrular; siparişi onaylama / veritabanı güncelleme işini burada genişletebilirsiniz.
 */
export async function POST(req: NextRequest) {
  let data: Record<string, string>;
  try {
    const fd = await req.formData();
    data = formDataToRecord(fd);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  if (!verifyShopierReturnSignature(data)) {
    return new NextResponse("Invalid signature", { status: 403 });
  }

  const status = data.status ?? "";
  const orderId = data.platform_order_id ?? "";

  if (status === "success") {
    return NextResponse.json(
      { ok: true, platform_order_id: orderId, payment_id: data.payment_id ?? null },
      { status: 200 },
    );
  }

  return NextResponse.json(
    { ok: false, platform_order_id: orderId, status: status || "unknown" },
    { status: 200 },
  );
}
