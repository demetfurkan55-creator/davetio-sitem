import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";

/** Shopier ödeme formu POST adresi */
export const SHOPIER_PAY_URL = "https://www.shopier.com/ShowProduct/api_pay4.php";

export type ShopierCurrencyCode = "TRY" | "USD" | "EUR";

const CURRENCY_NUM: Record<ShopierCurrencyCode, number> = {
  TRY: 0,
  USD: 1,
  EUR: 2,
};

export type ShopierBuyerInput = {
  firstName: string;
  lastName: string;
  email: string;
  /** Shopier için uluslararası biçim (ör. 905551234567) */
  phone: string;
};

export type ShopierAddressInput = {
  address: string;
  city: string;
  country: string;
  postcode: string;
};

export type ShopierCheckoutInput = {
  /** Siparişi sizin sistemde takip edeceğiniz benzersiz id */
  platformOrderId: string;
  /** Toplam tutar — Shopier ile aynı string imzada kullanılacak */
  totalOrderValue: string;
  currency: ShopierCurrencyCode;
  productName: string;
  /** 0: fiziksel, 1: dijital/indirilebilir, 2: varsayılan (Shopier sınıflandırması) */
  productType?: 0 | 1 | 2;
  buyer: ShopierBuyerInput;
  billing: ShopierAddressInput;
  shipping?: ShopierAddressInput;
  callbackUrl: string;
  /** 0: Türkçe, 1: diğer */
  currentLanguage?: 0 | 1;
  websiteIndex?: number;
  moduleVersion?: string;
};

export type ShopierCallbackPayload = {
  random_nr?: string;
  order_id?: string;
  platform_order_id?: string;
  hash?: string;
  signature?: string;
};

function requireEnv(name: "SHOPIER_API_KEY" | "SHOPIER_API_SECRET"): string {
  const v = process.env[name];
  if (!v?.trim()) {
    throw new Error(`Missing ${name}`);
  }
  return v.trim();
}

/**
 * Shopier api_pay4 imzası: HMAC-SHA256(random_nr + platform_order_id + total_order_value + currency, api_secret) → base64
 */
export function createShopierPaymentSignature(
  apiSecret: string,
  randomNr: number,
  platformOrderId: string,
  totalOrderValue: string,
  currencyNum: number,
): string {
  const payload = `${randomNr}${platformOrderId}${totalOrderValue}${currencyNum}`;
  const digest = createHmac("sha256", apiSecret).update(payload, "utf8").digest();
  return Buffer.from(digest).toString("base64");
}

function numericBuyerId(platformOrderId: string): string {
  const digits = platformOrderId.replace(/\D/g, "");
  if (digits.length >= 6) return digits.slice(0, 15);
  return String(randomInt(100_000_000, 999_999_999));
}

/**
 * Shopier ödeme formu için tüm alanları (signature dahil) üretir.
 */
export function buildShopierPaymentFormFields(input: ShopierCheckoutInput): Record<string, string> {
  const apiKey = requireEnv("SHOPIER_API_KEY");
  const apiSecret = requireEnv("SHOPIER_API_SECRET");

  const randomNr = randomInt(100_000, 1_000_000);
  const currencyNum = CURRENCY_NUM[input.currency];
  const totalOrderValue = input.totalOrderValue.trim();
  if (!totalOrderValue) {
    throw new Error("totalOrderValue is required");
  }

  const signature = createShopierPaymentSignature(
    apiSecret,
    randomNr,
    input.platformOrderId,
    totalOrderValue,
    currencyNum,
  );

  const shipping = input.shipping ?? input.billing;
  const productType = input.productType ?? 1;

  return {
    API_key: apiKey,
    website_index: String(input.websiteIndex ?? 1),
    platform_order_id: input.platformOrderId,
    product_name: input.productName,
    product_type: String(productType),
    buyer_name: input.buyer.firstName.trim(),
    buyer_surname: input.buyer.lastName.trim(),
    buyer_email: input.buyer.email.trim(),
    buyer_account_age: "0",
    buyer_id_nr: numericBuyerId(input.platformOrderId),
    buyer_phone: input.buyer.phone.replace(/\s/g, ""),
    billing_address: input.billing.address.trim(),
    billing_city: input.billing.city.trim(),
    billing_country: input.billing.country.trim(),
    billing_postcode: input.billing.postcode.trim(),
    shipping_address: shipping.address.trim(),
    shipping_city: shipping.city.trim(),
    shipping_country: shipping.country.trim(),
    shipping_postcode: shipping.postcode.trim(),
    total_order_value: totalOrderValue,
    currency: String(currencyNum),
    platform: "0",
    is_in_frame: "0",
    current_language: String(input.currentLanguage ?? 0),
    modul_version: input.moduleVersion ?? "1.0.4",
    random_nr: String(randomNr),
    signature,
    callback: input.callbackUrl.trim(),
  };
}

export function createPlatformOrderId(prefix = "ORD"): string {
  const now = Date.now().toString(36).toUpperCase();
  const nonce = randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
  return `${prefix}-${now}-${nonce}`;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Shopier’e yönlendiren, otomatik submit edilen HTML sayfası.
 */
export function buildShopierAutoSubmitHtml(fields: Record<string, string>): string {
  const inputs = Object.entries(fields)
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${escapeHtmlAttr(name)}" value="${escapeHtmlAttr(value)}" />`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Ödeme sayfasına yönlendiriliyor…</title>
</head>
<body>
  <p>Shopier ödeme sayfasına yönlendiriliyorsunuz…</p>
  <form id="shopier_payment_form" method="post" action="${escapeHtmlAttr(SHOPIER_PAY_URL)}">
    ${inputs}
  </form>
  <script>document.getElementById("shopier_payment_form").submit();</script>
  <noscript>
    <p>Tarayıcınızda JavaScript kapalıysa aşağıdaki düğmeye basın.</p>
    <button type="submit" form="shopier_payment_form">Shopier ile öde</button>
  </noscript>
</body>
</html>`;
}

/** Shopier ödeme sonrası POST’ta dönen imzayı doğrular (notify ile aynı: random_nr + platform_order_id + total_order_value + currency) */
export function verifyShopierReturnSignature(
  post: Record<string, string>,
  apiSecret?: string,
): boolean {
  const secret = (apiSecret ?? process.env.SHOPIER_API_SECRET)?.trim();
  if (!secret) return false;

  const platformOrderId = post.platform_order_id ?? "";
  const randomNr = post.random_nr ?? "";
  const totalOrderValue = post.total_order_value ?? "";
  const currency = post.currency ?? "";
  const signatureB64 = post.signature ?? "";
  if (!platformOrderId || !randomNr || !totalOrderValue || !currency || !signatureB64) return false;

  const payload = `${randomNr}${platformOrderId}${totalOrderValue}${currency}`;
  const expected = createHmac("sha256", secret).update(payload, "utf8").digest();

  let decoded: Buffer;
  try {
    decoded = Buffer.from(signatureB64, "base64");
  } catch {
    return false;
  }

  if (decoded.length !== expected.length) return false;
  try {
    return timingSafeEqual(decoded, expected);
  } catch {
    return false;
  }
}

/**
 * Shopier callback hash doğrulaması.
 * Beklenen metin: random_nr + order_id (bazı kurulumlarda platform_order_id döner).
 * Hash çoğunlukla base64, nadiren hex gelebilir; ikisini de güvenli şekilde doğrular.
 */
export function verifyShopierCallbackHash(
  post: ShopierCallbackPayload,
  apiSecret?: string,
): boolean {
  const secret = (apiSecret ?? process.env.SHOPIER_API_SECRET)?.trim();
  if (!secret) return false;

  const randomNr = post.random_nr?.trim() ?? "";
  const orderId = post.order_id?.trim() || post.platform_order_id?.trim() || "";
  const receivedHash = post.hash?.trim() || post.signature?.trim() || "";
  if (!randomNr || !orderId || !receivedHash) return false;

  const payload = `${randomNr}${orderId}`;
  const expectedRaw = createHmac("sha256", secret).update(payload, "utf8").digest();

  const expectedBase64 = expectedRaw.toString("base64");
  if (receivedHash === expectedBase64) return true;

  const expectedHex = expectedRaw.toString("hex");
  if (receivedHash.toLowerCase() === expectedHex.toLowerCase()) return true;

  try {
    const decoded = Buffer.from(receivedHash, "base64");
    if (decoded.length !== expectedRaw.length) return false;
    return timingSafeEqual(decoded, expectedRaw);
  } catch {
    return false;
  }
}

/** Bilinen paket id → ürün adı ve TRY tutarı (gösterim fiyatlarıyla uyumlu) */
export const SHOPIER_PACKAGE_CATALOG: Record<
  string,
  { productName: string; amountTry: string }
> = {
  pkg_solo_wedding: { productName: "Davetio — Sadece düğün", amountTry: "999" },
  pkg_wedding_nikah: { productName: "Davetio — Düğün + Nikah", amountTry: "999" },
  pkg_wedding_henna: { productName: "Davetio — Düğün + Kına", amountTry: "999" },
  pkg_solo_engagement: { productName: "Davetio — Sadece nişan", amountTry: "999" },
  pkg_solo_nikah: { productName: "Davetio — Sadece nikah", amountTry: "999" },
  pkg_solo_henna: { productName: "Davetio — Sadece kına", amountTry: "999" },
  solo: { productName: "Davetio — Paket (solo)", amountTry: "999" },
  weddingNikah: { productName: "Davetio — Düğün + Nikah", amountTry: "999" },
  weddingHenna: { productName: "Davetio — Düğün + Kına", amountTry: "999" },
  nikahOnly: { productName: "Davetio — Sadece nikah", amountTry: "999" },
};

export function resolvePackageForShopier(packageId: string): {
  productName: string;
  amountTry: string;
} {
  const row = SHOPIER_PACKAGE_CATALOG[packageId];
  if (row) return row;
  return {
    productName: `Davetio — ${packageId}`,
    amountTry: "999",
  };
}
