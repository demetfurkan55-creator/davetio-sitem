import type { TemplateSlug } from "@/data/templates";
import { TEMPLATE_SLUGS } from "@/data/templates";
import { INVITE_MAP_EMBED_DE, INVITE_MAP_EMBED_TR } from "@/lib/invite-assets";

export type TemplatePreviewDemoBase = {
  previewNames: string;
  previewDate: string;
  previewEyebrow: string;
  previewTagline: string;
  previewVenue: string;
  previewMapsCta: string;
  mapsOpenUrl: string;
};

export type TemplatePreviewDemo = TemplatePreviewDemoBase & {
  mapEmbedUrl: string;
};

function isSlug(s: string): s is TemplateSlug {
  return (TEMPLATE_SLUGS as readonly string[]).includes(s);
}

/** Vitrin önizlemesi — şablona göre örnek çift, tarih ve harita linki (TR / DE). */
export function getTemplatePreviewDemo(slug: string, locale: string): TemplatePreviewDemo {
  const de = locale === "de";

  if (de) {
    const bySlugDe: Partial<Record<TemplateSlug, TemplatePreviewDemoBase>> = {
      "serenade-hall": {
        previewNames: "Selda & Furkan",
        previewDate: "20. September 2026 · 18:30",
        previewEyebrow: "Zur Hochzeit",
        previewTagline: "Wir freuen uns, diesen Tag mit euch zu feiern.",
        previewVenue: "Festsaal am Wasser · Berlin-Mitte",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.520008,13.404954",
      },
      "meadow-vows": {
        previewNames: "Eva & Tom",
        previewDate: "22. August 2026 · 17:00",
        previewEyebrow: "Feier im Grünen",
        previewTagline: "Wir freuen uns auf euch!",
        previewVenue: "Gartenhaus · Potsdam",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.393214,13.063399",
      },
      "rose-script": {
        previewNames: "Sophie & Jan",
        previewDate: "12. September 2026 · 19:00",
        previewEyebrow: "Zur Abendfeier",
        previewTagline: "Mit euch wird dieser Abend unvergesslich.",
        previewVenue: "Uferloft · Hamburg",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=53.551086,9.993682",
      },
      "civic-bloom": {
        previewNames: "Leyla & Emir",
        previewDate: "5. Oktober 2026 · 14:30",
        previewEyebrow: "Zur Trauung",
        previewTagline: "Wir heiraten — ihr seid herzlich eingeladen.",
        previewVenue: "Standesamt Mitte · Berlin",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.530644,13.383068",
      },
      "ivory-union": {
        previewNames: "Nora & Felix",
        previewDate: "18. Mai 2026 · 11:00",
        previewEyebrow: "Standesamt",
        previewTagline: "Ein schlichter, schöner Moment — mit euch.",
        previewVenue: "Rathaus Charlottenburg",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.508742,13.301060",
      },
      "marble-vow": {
        previewNames: "Anna & Marc",
        previewDate: "15. März 2026 · 10:30",
        previewEyebrow: "Zur Zeremonie",
        previewTagline: "Wir geben uns das Ja-Wort.",
        previewVenue: "Standesamt Schöneberg",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.4862,13.3530",
      },
      "pearl-mist": {
        previewNames: "Nina & David",
        previewDate: "3. November 2026 · 19:00",
        previewEyebrow: "Zur Verlobung",
        previewTagline: "Wir wollen den nächsten Schritt mit euch teilen.",
        previewVenue: "Restaurant Skyline · Frankfurt",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=50.110922,8.682127",
      },
      "golden-hour": {
        previewNames: "Elif & Burak",
        previewDate: "8. Juli 2026 · 20:00",
        previewEyebrow: "Zur Henna-Nacht",
        previewTagline: "Farben, Musik und gute Gesellschaft.",
        previewVenue: "Familiensaal · Kreuzberg",
        previewMapsCta: "Karte öffnen · Route",
        mapsOpenUrl:
          "https://www.google.com/maps/search/?api=1&query=52.499379,13.425031",
      },
    };

    const key = isSlug(slug) ? slug : "serenade-hall";
    const row = bySlugDe[key] ?? bySlugDe["serenade-hall"]!;
    return { ...row, mapEmbedUrl: INVITE_MAP_EMBED_DE };
  }

  const bySlugTr: Partial<Record<TemplateSlug, TemplatePreviewDemoBase>> = {
    "serenade-hall": {
      previewNames: "Selda & Furkan",
      previewDate: "20 Eylül 2026 · 18:30",
      previewEyebrow: "Düğünümüze",
      previewTagline: "Mutluluğumuza davetlisiniz",
      previewVenue:
        "Grand Davet Salonu · Vişnezade Mah. Acısu Sok. No:19, Beşiktaş / İstanbul",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.0427,29.0083",
    },
    "meadow-vows": {
      previewNames: "Selin & Can",
      previewDate: "22 Ağustos 2026 · 17:00",
      previewEyebrow: "Bahçede kutlamaya",
      previewTagline: "Doğanın ortasında birlikte kutlamaya bekleriz.",
      previewVenue: "Boğaz kenarı köşk · Beykoz / İstanbul",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.1256,29.1087",
    },
    "rose-script": {
      previewNames: "Leyla & Arda",
      previewDate: "12 Eylül 2026 · 19:30",
      previewEyebrow: "Gece törenimize",
      previewTagline: "Işıltılı bir akşamda yanınızda olmak isteriz.",
      previewVenue: "Grand Hyatt İstanbul · Taşlık Mah., Şişli",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.0481,28.9944",
    },
    "civic-bloom": {
      previewNames: "Ayşe & Kerem",
      previewDate: "5 Ekim 2026 · 14:00",
      previewEyebrow: "Nikah törenimize",
      previewTagline: "Resmî törenimize şahit olmaya davetlisiniz.",
      previewVenue: "Beşiktaş Belediye Nikah Salonu",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.0422,29.0081",
    },
    "ivory-union": {
      previewNames: "Zeynep & Mert",
      previewDate: "18 Mayıs 2026 · 11:30",
      previewEyebrow: "Sadelikle davet",
      previewTagline: "Yeni hayatımızın ilk adımında yanınızda olalım.",
      previewVenue: "Kadıköy Evlendirme Dairesi · Rasimpaşa",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=40.9903,29.0255",
    },
    "marble-vow": {
      previewNames: "Elif & Onur",
      previewDate: "15 Mart 2026 · 10:00",
      previewEyebrow: "Resmî törenimize",
      previewTagline: "Şahitliğiniz bizim için çok kıymetli.",
      previewVenue: "Üsküdar Evlendirme Dairesi",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.0227,29.0147",
    },
    "pearl-mist": {
      previewNames: "Burcu & Emir",
      previewDate: "3 Kasım 2026 · 19:00",
      previewEyebrow: "Nişanımıza",
      previewTagline: "Yüzüklerimizi taşırken yanınızda olmak isteriz.",
      previewVenue: "İskele Restaurant · Moda / Kadıköy",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=40.9847,29.0264",
    },
    "golden-hour": {
      previewNames: "Hande & Kaan",
      previewDate: "8 Temmuz 2026 · 20:00",
      previewEyebrow: "Kına gecesine",
      previewTagline: "Geleneksel bir geceye eğlencenizle renk katın.",
      previewVenue: "Özel konak · Üsküdar / İstanbul",
      previewMapsCta: "Haritada konumu aç",
      mapsOpenUrl:
        "https://www.google.com/maps/search/?api=1&query=41.0225,29.0142",
    },
  };

  const key = isSlug(slug) ? slug : "serenade-hall";
  const row = bySlugTr[key] ?? bySlugTr["serenade-hall"]!;
  return { ...row, mapEmbedUrl: INVITE_MAP_EMBED_TR };
}
