import { defineArrayMember, defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";
import { PROJECT_STATUS_OPTIONS, statusLabel, type ProjectStatus } from "../../../lib/project";

export const projectType = defineType({
  name: "project",
  title: "Proje",
  type: "document",
  groups: [
    { name: "genel", title: "Genel", default: true },
    { name: "kunye", title: "Künye" },
    { name: "satis", title: "Satış" },
    { name: "galeri", title: "Galeri" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    // Genel
    defineField({ name: "title", title: "Başlık", type: "string", group: "genel", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "genel",
      options: {
        source: "title",
        slugify: turkishSlugify,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Durum",
      type: "string",
      group: "genel",
      options: { list: [...PROJECT_STATUS_OPTIONS], layout: "radio" },
      initialValue: "satista",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "location", title: "Konum", type: "string", group: "genel", initialValue: "Bakırköy, İstanbul" }),
    defineField({
      name: "mapUrl",
      title: "Harita Linki",
      type: "url",
      group: "genel",
      description: "Google Maps paylaşım linki (opsiyonel).",
    }),
    defineField({
      name: "summary",
      title: "Kısa Özet",
      type: "text",
      rows: 3,
      group: "genel",
      description: "Proje listelerinde ve meta açıklama boşsa arama sonuçlarında görünür.",
      initialValue: "Bakırköy'de, zemin etüdünden iskana kadar belgeleriyle teslim edilen konutlar.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      group: "genel",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      group: "genel",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string" }),
            defineField({
              name: "alignment",
              title: "Hizalama",
              type: "string",
              options: { list: [{ title: "Sol", value: "left" }, { title: "Orta", value: "center" }, { title: "Sağ", value: "right" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Boyut",
              type: "string",
              options: {
                list: [
                  { title: "Çok Küçük (%25)", value: "25" },
                  { title: "Küçük (%33)", value: "33" },
                  { title: "Orta (%50)", value: "50" },
                  { title: "Geniş (%75)", value: "75" },
                  { title: "Tam Genişlik (%100)", value: "100" }
                ]
              },
              initialValue: "100",
            }),
          ],
        },
        { type: "customHtml" },
      ],
    }),

    // Künye
    // Dates deliberately have no initialValue: a fake date on a spec sheet is worse than a missing row.
    defineField({ name: "startDate", title: "İnşaat Başlangıcı", type: "date", group: "kunye" }),
    defineField({ name: "plannedDelivery", title: "Planlanan Teslim", type: "date", group: "kunye" }),
    defineField({
      name: "actualDelivery",
      title: "Gerçekleşen Teslim",
      type: "date",
      group: "kunye",
      description: "Boş bırakılırsa sitede yalnızca planlanan teslim gösterilir.",
    }),
    defineField({ name: "occupancyPermitDate", title: "İskan Tarihi", type: "date", group: "kunye" }),
    defineField({
      name: "groundClass",
      title: "Zemin Sınıfı",
      type: "string",
      group: "kunye",
      description: "TBDY 2018 yerel zemin sınıfı.",
      options: { list: ["ZA", "ZB", "ZC", "ZD", "ZE"] },
      initialValue: "ZB",
    }),
    defineField({ name: "foundationType", title: "Temel Tipi", type: "string", group: "kunye", initialValue: "Radye temel" }),
    defineField({
      name: "concreteClass",
      title: "Beton Sınıfı",
      type: "string",
      group: "kunye",
      options: { list: ["C30", "C35", "C40", "C45", "C50"] },
      initialValue: "C35",
    }),
    defineField({ name: "inspectionFirm", title: "Yapı Denetim Firması", type: "string", group: "kunye", initialValue: "Marmara Yapı Denetim" }),
    defineField({ name: "architect", title: "Mimar", type: "string", group: "kunye", initialValue: "Selin Akar" }),
    defineField({
      name: "landArea",
      title: "Arsa Alanı (m²)",
      type: "number",
      group: "kunye",
      initialValue: 4200,
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: "floorCount",
      title: "Kat Sayısı",
      type: "number",
      group: "kunye",
      initialValue: 3,
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "unitCount",
      title: "Toplam Daire",
      type: "number",
      group: "kunye",
      initialValue: 12,
      validation: (Rule) => Rule.positive().integer(),
    }),
    defineField({
      name: "extraSpecs",
      title: "Ek Bilgiler",
      type: "array",
      group: "kunye",
      description: "Sabit alanların kapsamadığı künye satırları.",
      of: [
        defineArrayMember({
          type: "object",
          name: "specRow",
          fields: [
            defineField({ name: "label", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "value", title: "Değer", type: "string", validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
      initialValue: [],
    }),
    defineField({
      name: "documents",
      title: "Belgeler",
      type: "array",
      group: "kunye",
      description: "Örn: zemin etüdü özeti, iskan belgesi (PDF).",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectDocument",
          fields: [
            defineField({ name: "title", title: "Belge Adı", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "file",
              title: "Dosya",
              type: "file",
              options: { accept: "application/pdf" },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title" } },
        }),
      ],
      initialValue: [],
    }),

    // Satış
    defineField({
      name: "unitTypes",
      title: "Daire Tipleri",
      type: "array",
      group: "satis",
      of: [
        defineArrayMember({
          type: "object",
          name: "unitType",
          fields: [
            defineField({ name: "name", title: "Tip", type: "string", description: "Örn: 3+1", validation: (Rule) => Rule.required() }),
            defineField({ name: "grossArea", title: "Brüt m²", type: "number", validation: (Rule) => Rule.positive() }),
            defineField({
              name: "netArea",
              title: "Net m²",
              type: "number",
              validation: (Rule) =>
                Rule.positive().custom((net, context) => {
                  const gross = (context.parent as { grossArea?: number } | undefined)?.grossArea;
                  if (net === undefined || gross === undefined || net <= gross) return true;
                  return "Net alan brüt alandan büyük olamaz.";
                }),
            }),
            defineField({ name: "totalCount", title: "Toplam Adet", type: "number", validation: (Rule) => Rule.positive().integer() }),
            defineField({
              name: "availableCount",
              title: "Satıştaki Adet",
              type: "number",
              validation: (Rule) =>
                Rule.min(0)
                  .integer()
                  .custom((available, context) => {
                    const total = (context.parent as { totalCount?: number } | undefined)?.totalCount;
                    if (available === undefined || total === undefined || available <= total) return true;
                    return "Satıştaki adet toplam adetten büyük olamaz.";
                  }),
            }),
            defineField({
              name: "floorPlan",
              title: "Kat Planı",
              type: "image",
              fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
            }),
          ],
          preview: {
            select: { title: "name", netArea: "netArea", media: "floorPlan" },
            prepare: ({ title, netArea, media }) => ({
              title,
              subtitle: netArea ? `${netArea} m² net` : undefined,
              media,
            }),
          },
        }),
      ],
      initialValue: [
        { _key: "sample-3-1", _type: "unitType", name: "3+1", grossArea: 165, netArea: 140, totalCount: 6, availableCount: 6 },
      ],
    }),
    defineField({
      name: "amenities",
      title: "Sosyal Donatılar",
      type: "array",
      group: "satis",
      of: [defineArrayMember({ type: "string" })],
      initialValue: [],
    }),

    // Galeri
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      group: "galeri",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string" }),
            defineField({ name: "caption", title: "Açıklama", type: "string" }),
          ],
        }),
      ],
      initialValue: [],
    }),

    // SEO
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: {
    select: { title: "title", status: "status", location: "location", media: "mainImage" },
    prepare: ({ title, status, location, media }) => ({
      title: status ? `${title} · ${statusLabel(status as ProjectStatus)}` : title,
      subtitle: location,
      media,
    }),
  },
});
