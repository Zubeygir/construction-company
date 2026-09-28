import { defineField, defineType } from "sanity";

export const projectsPageType = defineType({
  name: "projectsPage",
  title: "Projeler Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Sayfa Girişi" },
    { name: "content", title: "Sayfa İçeriği" },
    { name: "detail", title: "Proje Detay Başlıkları" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // Page Hero Group
    defineField({
      name: "heroTitle",
      title: "Sayfa Başlığı (H1)",
      type: "string",
      group: "hero",
      description: "Boş bırakılırsa Sayfa Başlığı kullanılır.",
      initialValue: "Projelerimiz",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Bakırköy'de yaptığımız ve yapmakta olduğumuz binalar, künyeleriyle birlikte.",
    }),
    defineField({
      name: "heroImage",
      title: "Giriş Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
      description: "Opsiyonel. Başlığın altında tam genişlikte görünür.",
    }),
    // Content Group
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", group: "content", description: "Breadcrumb ve meta başlıkta kullanılır.", initialValue: "Projeler", validation: (Rule) => Rule.required() }),
    defineField({ name: "pageSubtitle", title: "Alt Başlık / Kısa Yazı", type: "text", rows: 3, group: "content" }),
    // Project detail section headings (shared by every project page)
    defineField({ name: "specsTitle", title: "Künye Başlığı", type: "string", group: "detail", initialValue: "Künye" }),
    defineField({ name: "unitsTitle", title: "Daire Tipleri Başlığı", type: "string", group: "detail", initialValue: "Daire tipleri" }),
    defineField({ name: "amenitiesTitle", title: "Sosyal Donatılar Başlığı", type: "string", group: "detail", initialValue: "Sosyal donatılar" }),
    defineField({ name: "galleryTitle", title: "Galeri Başlığı", type: "string", group: "detail", initialValue: "Galeri" }),
    defineField({ name: "documentsTitle", title: "Belgeler Başlığı", type: "string", group: "detail", initialValue: "Belgeler" }),
    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
