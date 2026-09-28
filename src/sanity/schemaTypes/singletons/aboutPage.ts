import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  groups: [
    { name: "hero", title: "Sayfa Girişi" },
    { name: "content", title: "Sayfa İçeriği" },
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
      initialValue: "Kalfadan mühendise",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Bakırköy'de ilk apartmanını 1981'de yapan Hasan Tınaz'dan, bugün firmayı yöneten kızı Elif Tınaz'a.",
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
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", group: "content", initialValue: "Hikâyemiz", validation: (Rule) => Rule.required() }),
    defineField({ name: "pageSubtitle", title: "Giriş Alt Başlığı", type: "text", rows: 2, group: "content" }),
    defineField({
      name: "body",
      title: "Detaylı İçerik",
      type: "array",
      of: [{ type: "block" }],
      group: "content",
      initialValue: [
        {
          _type: "block",
          _key: "about-intro-1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "about-intro-1-span",
              marks: [],
              text: "Hasan Tınaz, ilk binasını 1981'de Bakırköy'de, kalfa olarak çalıştığı sokakta yaptı. Kapısına da adını yazdı; o günden beri her binamızda böyle.",
            },
          ],
        },
        {
          _type: "block",
          _key: "about-intro-2",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "about-intro-2-span",
              marks: [],
              text: "Bugün firmayı inşaat mühendisi kızı Elif Tınaz yönetiyor. Semtin yaşlanan binalarını kentsel dönüşümle yeniden yapıyoruz ve her projenin zemin etüdünden iskanına kadar belgelerini yayınlıyoruz.",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel (Yandaki Resim)",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
