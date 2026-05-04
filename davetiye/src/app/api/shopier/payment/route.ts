import { NextResponse, type NextRequest } from "next/server";
import {
  buildShopierAutoSubmitHtml,
  buildShopierPaymentFormFields,
  createPlatformOrderId,
  resolvePackageForShopier,
  type ShopierAddressInput,
  type ShopierBuyerInput,
} from "@/lib/shopier";

export const runtime = "nodejs";

type PaymentPostBody = {
  packageId: string;
  platformOrderId?: string;
  productName?: string;
  totalOrderValue?: string;
  currency?: "TRY" | "USD" | "EUR";
  locale?: string;
  buyer: ShopierBuyerInput;
  billing: ShopierAddressInput;
  shipping?: ShopierAddressInput;
};

function appOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!raw) {
    throw new Error("NEXT_PUBLIC_APP_URL is required for Shopier callback URL");
  }
  return raw.replace(/\/$/, "");
}

function isNonEmpty(s: unknown): s is string {
  return typeof s === "string" && s.trim().length > 0;
}

export async function POST(req: NextRequest) {
  let body: PaymentPostBody;
  try {
    body = (await req.json()) as PaymentPostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isNonEmpty(body.packageId)) {
    return NextResponse.json({ error: "packageId is required" }, { status: 400 });
  }
  if (!body.buyer || !body.billing) {
    return NextResponse.json({ error: "buyer and billing are required" }, { status: 400 });
  }

  const b = body.buyer;
  if (
    !isNonEmpty(b.firstName) ||
    !isNonEmpty(b.lastName) ||
    !isNonEmpty(b.email) ||
    !isNonEmpty(b.phone)
  ) {
    return NextResponse.json(
      { error: "buyer.firstName, buyer.lastName, buyer.email, buyer.phone are required" },
      { status: 400 },
    );
  }

  const addr = body.billing;
  if (
    !isNonEmpty(addr.address) ||
    !isNonEmpty(addr.city) ||
    !isNonEmpty(addr.country) ||
    !isNonEmpty(addr.postcode)
  ) {
    return NextResponse.json(
      { error: "billing.address, city, country, postcode are required" },
      { status: 400 },
    );
  }

  const pkg = resolvePackageForShopier(body.packageId.trim());
  const totalOrderValue = isNonEmpty(body.totalOrderValue)
    ? body.totalOrderValue.trim()
    : pkg.amountTry;
  const productName = isNonEmpty(body.productName) ? body.productName.trim() : pkg.productName;
  const currency = body.currency ?? "TRY";

  const platformOrderId = isNonEmpty(body.platformOrderId)
    ? body.platformOrderId.trim()
    : createPlatformOrderId("DVT");

  const callbackUrl = `${appOrigin()}/api/shopier/callback`;

  const currentLanguage =
    body.locale && !body.locale.toLowerCase().startsWith("tr") ? (1 as const) : (0 as const);

  try {
    const fields = buildShopierPaymentFormFields({
      platformOrderId,
      totalOrderValue,
      currency,
      productName,
      buyer: body.buyer,
      billing: body.billing,
      shipping: body.shipping,
      callbackUrl,
      currentLanguage,
    });

    const html = buildShopierAutoSubmitHtml(fields);
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Shopier checkout failed";
    const missingCreds =
      message.includes("SHOPIER_API_KEY") || message.includes("SHOPIER_API_SECRET");
    return NextResponse.json(
      { error: message },
      { status: missingCreds ? 503 : 500 },
    );
  }
}
