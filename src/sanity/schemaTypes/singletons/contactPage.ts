import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "İletişim Sayfası",
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
      initialValue: "Satış ofisimiz",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 2,
      group: "hero",
      initialValue: "Bir daireyi yerinde görmek, künyeyi birlikte okumak ya da yalnızca sormak için.",
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
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", group: "content", initialValue: "İletişim", validation: (Rule) => Rule.required() }),
    defineField({
      name: "pageSubtitle",
      title: "Giriş Metni",
      type: "text",
      rows: 3,
      group: "content",
      description: "İletişim bilgilerinin üstünde görünür.",
      initialValue: "Ofisimiz Bakırköy'de. Gelmeden önce aramanız, sizi bekletmememizi sağlar.",
    }),
    defineField({
      name: "showForm",
      title: "İletişim Formunu Göster",
      type: "boolean",
      group: "content",
      initialValue: false,
      description: "Açılırsa sayfada e-posta formu gösterilir. SMTP ayarları yapılmadan açmayın.",
    }),
    defineField({ name: "formTitle", title: "Form Başlığı", type: "string", group: "content", initialValue: "Mesaj bırakın" }),
    defineField({
      name: "successMessage",
      title: "Form Başarı Mesajı",
      type: "text",
      rows: 2,
      group: "content",
      initialValue: "Mesajınız bize ulaştı. Satış ofisimiz en geç bir iş günü içinde size dönecek.",
    }),
    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
