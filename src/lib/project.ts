// Shared by the Sanity schema (Studio) and the site, so it must stay free of framework imports.
export const PROJECT_STATUS_OPTIONS = [
  { title: "Yakında", value: "yakinda" },
  { title: "Satışta", value: "satista" },
  { title: "İnşaat Halinde", value: "insaatta" },
  { title: "Tamamlandı", value: "tamamlandi" },
] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number]["value"];

export function statusLabel(status: ProjectStatus): string {
  return PROJECT_STATUS_OPTIONS.find((option) => option.value === status)?.title ?? status;
}

// Spec-sheet keys mirror the Studio field titles; they label data, they are not editorial copy.
export const SPEC_LABELS = {
  groundClass: "Zemin sınıfı",
  landArea: "Arsa alanı",
  foundationType: "Temel tipi",
  concreteClass: "Beton sınıfı",
  floorCount: "Kat sayısı",
  inspectionFirm: "Yapı denetim",
  architect: "Mimar",
  startDate: "İnşaat başlangıcı",
  plannedDelivery: "Planlanan teslim",
  actualDelivery: "Teslim edildi",
  occupancyPermitDate: "İskan",
  unitCount: "Daire sayısı",
  unitTypes: "Daire tipleri",
} as const;

export const UNIT_LABELS = {
  grossArea: "Brüt",
  netArea: "Net",
  available: "satışta",
  soldOut: "Tümü satıldı",
  floorPlan: "Kat planı",
} as const;

export const CONTACT_LABELS = {
  phone: "Telefon",
  whatsapp: "WhatsApp",
  email: "E-posta",
  address: "Adres",
  hours: "Çalışma saatleri",
} as const;

const monthYear = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric", timeZone: "UTC" });
const integer = new Intl.NumberFormat("tr-TR");

// Sanity dates are plain "YYYY-MM-DD"; pin to UTC so the month never shifts with the server timezone.
export function formatMonthYear(date?: string): string | undefined {
  return date ? monthYear.format(new Date(`${date}T00:00:00Z`)) : undefined;
}

// GROQ returns null for a missing field, so both null and undefined mean "not filled in"
export function formatArea(value?: number): string | undefined {
  return value == null ? undefined : `${integer.format(value)} m²`;
}

export function formatCount(value?: number): string | undefined {
  return value == null ? undefined : integer.format(value);
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function whatsappHref(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}`;
}
