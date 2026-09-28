import { defineField, defineType } from "sanity";

// The 3D choreography expects exactly four stages, so they are fixed objects, not an array.
function storyStage(name: string, title: string, initialTitle: string, initialText: string) {
  return defineField({
    name,
    title,
    type: "object",
    group: "story",
    fields: [
      defineField({ name: "title", title: "Başlık", type: "string", initialValue: initialTitle }),
      defineField({ name: "text", title: "Metin", type: "text", rows: 3, initialValue: initialText }),
    ],
  });
}

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Bölümü" },
    { name: "projects", title: "Projeler Önizleme" },
    { name: "story", title: "İnşaat Hikâyesi" },
    { name: "record", title: "Teslim Kaydı" },
    { name: "about", title: "Hakkımızda Önizleme" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // Hero Group
    defineField({
      name: "heroTitle",
      title: "Hero Başlık",
      type: "string",
      group: "hero",
      initialValue: "Bakırköy'de her kapıda adımız var.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Alt Başlık",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue: "Aynı semtte, zemin etüdünden iskana kadar her belgesini yayınladığımız konutlar yapıyoruz.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "caption", title: "Açıklama", type: "string", description: "Görselin köşesinde görünür. Örn: Cevizlik Apartmanı, Bakırköy" }),
      ],
    }),
    defineField({ name: "heroCtaLabel", title: "Hero İkincil Buton Metni", type: "string", group: "hero", description: "Ana buton her zaman satış ofisini arar (Site Ayarları → Satış Ofisi).", initialValue: "Projeleri inceleyin" }),
    defineField({
      name: "heroCtaLink",
      title: "Hero İkincil Buton Linki",
      type: "object",
      group: "hero",
      initialValue: { linkType: "manual", manual: "/projeler" },
      fields: [
        defineField({
          name: "linkType",
          title: "Link Tipi",
          type: "string",
          options: {
            list: [
              { title: "İç Sayfa (Önerilen)", value: "internal" },
              { title: "Manuel Link", value: "manual" },
            ],
            layout: "radio",
          },
          initialValue: "internal",
        }),
        defineField({
          name: "internal",
          title: "İç Sayfa Seç",
          type: "reference",
          to: [
            { type: "project" },
            { type: "aboutPage" },
            { type: "contactPage" },
          ],
          hidden: ({ parent }) => parent?.linkType !== "internal",
        }),
        defineField({
          name: "manual",
          title: "Manuel Link",
          type: "string",
          description: "Örn: /projeler, /iletisim veya https://google.com (Link başındaki / işaretini unutmayın)",
          hidden: ({ parent }) => parent?.linkType !== "manual",
        }),
      ],
    }),

    // About Preview Group
    defineField({ name: "aboutTitle", title: "Hakkımızda Bölüm Başlığı", type: "string", group: "about", initialValue: "Kalfadan mühendise" }),
    defineField({
      name: "aboutSubtitle",
      title: "Hakkımızda Bölüm Alt Başlığı",
      type: "text",
      rows: 2,
      group: "about",
      initialValue: "Hasan Tınaz'ın kurduğu firmayı bugün kızı Elif Tınaz, aynı sokaklarda sürdürüyor.",
    }),
    defineField({ name: "aboutText", title: "Hakkımızda Kısa Yazı", type: "array", of: [{ type: "block" }], group: "about" }),
    defineField({
      name: "aboutImage",
      title: "Hakkımızda Görseli",
      type: "image",
      group: "about",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),
    defineField({ name: "aboutCtaLabel", title: "Daha Fazla Buton Metni", type: "string", group: "about", initialValue: "Hikâyemiz" }),
    defineField({ name: "aboutCtaLink", title: "Buton Linki", type: "string", group: "about", initialValue: "/hakkimizda" }),

    // Projects Preview Group
    defineField({ name: "projectsTitle", title: "Projeler Bölüm Başlığı", type: "string", group: "projects", initialValue: "Süren projeler" }),
    defineField({
      name: "projectsSubtitle",
      title: "Projeler Bölüm Alt Başlığı",
      type: "text",
      rows: 2,
      group: "projects",
      initialValue: "Satıştaki, yapımı süren ve yakında başlayacak projelerimiz.",
    }),
    defineField({
      name: "featuredProjects",
      title: "Öne Çıkan Projeler",
      description: "Boş bırakılırsa tamamlanmamış projeler durum sırasına göre gösterilir. İlk proje büyük görünür.",
      type: "array",
      group: "projects",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({ name: "projectsCtaLabel", title: "Tüm Projeler Link Metni", type: "string", group: "projects", initialValue: "Tüm projeler" }),

    // Construction Story Group
    defineField({
      name: "featuredStoryProject",
      title: "Hikâyesi Anlatılan Proje",
      description: "Tamamlanmış bir proje seçin. Aşamalardaki veriler bu projenin künyesinden gelir. Boşsa bölüm görünmez.",
      type: "reference",
      group: "story",
      to: [{ type: "project" }],
      options: { filter: 'status == "tamamlandi"' },
    }),
    defineField({ name: "storyTitle", title: "Bölüm Başlığı", type: "string", group: "story", initialValue: "Bir binayı baştan sona anlatıyoruz" }),
    defineField({
      name: "storySubtitle",
      title: "Bölüm Alt Başlığı",
      type: "text",
      rows: 2,
      group: "story",
      initialValue: "Tamamladığımız bir projenin zeminden anahtara kadar kayıtları.",
    }),
    storyStage("stageGround", "1. Aşama: Zemin", "Zemin", "Kazmadan önce ölçüyoruz. Her parselde sondaj yapılır, zemin etüdünün sonucu projenin künyesinde yayınlanır."),
    storyStage("stageFoundation", "2. Aşama: Temel", "Temel", "Temel tipi zemine göre seçilir. Beton her dökümde numune alınarak laboratuvarda test edilir."),
    storyStage("stageFrame", "3. Aşama: Karkas", "Karkas", "Taşıyıcı sistemin her katı, bağımsız yapı denetim firmasının kontrolünden geçmeden bir sonrakine geçilmez."),
    storyStage("stageHandover", "4. Aşama: Teslim", "Teslim", "Anahtarı verdiğimiz tarih, söz verdiğimiz tarihle yan yana yazılır."),
    defineField({ name: "storyCtaLabel", title: "Proje Link Metni", type: "string", group: "story", initialValue: "Projenin tüm künyesi" }),

    // Delivery Record Group
    defineField({ name: "recordTitle", title: "Bölüm Başlığı", type: "string", group: "record", initialValue: "Teslim kaydımız" }),
    defineField({
      name: "recordSubtitle",
      title: "Bölüm Alt Başlığı",
      type: "text",
      rows: 2,
      group: "record",
      description: "Tamamlanan projeler otomatik listelenir.",
      initialValue: "Tamamladığımız her binanın teslim ve iskan tarihleri.",
    }),

    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
