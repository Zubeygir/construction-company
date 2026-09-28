// Builds seed/tinaz-demo.ndjson: the Tınaz Yapı demo content (docs/ROADMAP.md → Sample content).
// Run: node seed/build-seed.mjs  →  npx sanity dataset import seed/tinaz-demo.ndjson <dataset> --replace
// Images are Unsplash photos (verified URLs); the import CLI downloads and uploads them via `_sanityAsset`.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const unsplash = (id) => `image@https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36).padStart(4, "0")}`;

function image(id, alt, extra = {}) {
  return { _type: "image", _sanityAsset: unsplash(id), alt, ...extra };
}

function galleryImage(id, alt, caption) {
  return { _key: key(), ...image(id, alt, { caption }) };
}

// Plain paragraphs → Portable Text blocks
function blocks(...paragraphs) {
  return paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), marks: [], text }],
  }));
}

const spec = (label, value) => ({ _key: key(), _type: "specRow", label, value });
const unit = (name, grossArea, netArea, totalCount, availableCount) => ({
  _key: key(),
  _type: "unitType",
  name,
  grossArea,
  netArea,
  totalCount,
  availableCount,
});
const navLink = (label, href) => ({ _key: key(), label, href, openInNewTab: false });
const slug = (current) => ({ _type: "slug", current });
const ref = (_ref) => ({ _type: "reference", _ref });

const IMG = {
  kartaltepe: "1617341623760-1919df79274c", // mid-rise apartment block with deep balconies, golden hour
  cevizlik: "1610286986642-057ece0c3656", // apartment block at blue hour, a few windows lit by lamps
  cevizlikDay: "1563833141021-c80d4844cb6a", // white and brown concrete buildings at golden hour
  litWindows: "1575561558025-3f771a20f86b", // two lit windows with lamps behind curtains, dark green facade
  tinaz1981: "1765785165219-d5dd951fbc98", // plain four-storey corner apartment, gray render
  senlikkoy: "1681039580747-569f9cd54858", // rounded corner apartment with green shutters and balconies
  ilgin: "1583377519891-1eea1c2e3947", // corner apartment with awnings, blue sky
  cinar: "1579963824000-7d7b70b2f7a3", // white apartment block with balconies
  yesilkoy: "1780053906696-325413e4cc19", // white building with balconies and climbing plants
  zeytinlik: "1508450859948-4e04fabaa4ea", // concrete building under construction
  sakizagaci: "1759688113124-94bd94c27a5c", // old apartment building with ornate balconies
  door: "1567994466115-2082f18f28e6", // closed blue wooden door
  sofa: "1541194577687-8c63bf9e7ee3",
  livingLarge: "1665249934445-1de680641f50",
  lamp: "1560448076-957f79776e95",
  balcony: "1766229034516-c8d25df127f5",
  livingKartaltepe: "1649429710616-dad56ce9a076",
  kartaltepeAlt: "1564471925181-982d3a6c1a3f",
  frame: "1615461476249-718ef8bc369c",
  site: "1563166423-482a8c14b2d6",
};

const projects = [
  {
    _id: "project-cevizlik-apartmani",
    _type: "project",
    title: "Cevizlik Apartmanı",
    slug: slug("cevizlik-apartmani"),
    status: "tamamlandi",
    location: "Cevizlik, Bakırköy",
    summary: "1968 yapımı iki binanın yerine, köşe parselde 6 katlı ve 18 daireli yeni bir apartman.",
    mainImage: image(IMG.cevizlik, "Cevizlik Apartmanı akşam: balkonlarda ve salonlarda lambalar yanıyor"),
    body: blocks(
      "Parselde 1968'de yapılmış iki bina vardı. Hak sahipleriyle 2021 başında anlaştık, yıkımdan önce zemin etüdünü tamamladık.",
      "Sahil tarafındaki alüvyon zemin nedeniyle radye temeli fore kazıklarla destekledik. Teslimi planladığımızdan iki hafta geç yaptık; tarihleri aşağıda olduğu gibi yazıyoruz."
    ),
    startDate: "2021-09-01",
    plannedDelivery: "2023-06-30",
    actualDelivery: "2023-07-14",
    occupancyPermitDate: "2023-10-05",
    groundClass: "ZC",
    foundationType: "Radye temel, fore kazıklı",
    concreteClass: "C40",
    inspectionFirm: "Marmara Yapı Denetim",
    architect: "Selin Akar",
    landArea: 1240,
    floorCount: 6,
    unitCount: 18,
    extraSpecs: [spec("Zemin etüdü", "14 sondaj, 30 m derinlik"), spec("Deprem yönetmeliği", "TBDY 2018")],
    documents: [],
    unitTypes: [unit("2+1", 105, 88, 8, 0), unit("3+1", 150, 126, 10, 0)],
    amenities: ["Kapalı otopark", "Jeneratör", "Sığınak", "Daire başına depo"],
    gallery: [
      galleryImage(IMG.cevizlikDay, "Cevizlik Apartmanı'nın akşam güneşinde cephesi", "Sokak cephesi, Ekim 2023"),
      galleryImage(IMG.sofa, "Güneş alan salon ve pencere önündeki koltuk", "3+1 dairede salon"),
      galleryImage(IMG.livingLarge, "Geniş pencereli oturma odası", "Köşe dairelerde iki cepheli salon"),
      galleryImage(IMG.lamp, "Pencere önünde yanan masa lambası", "Akşam, 5. kat"),
    ],
  },
  {
    _id: "project-yesilkoy-bahce-evleri",
    _type: "project",
    title: "Yeşilköy Bahçe Evleri",
    slug: slug("yesilkoy-bahce-evleri"),
    status: "tamamlandi",
    location: "Yeşilköy, Bakırköy",
    summary: "Ortak bahçe çevresinde 4 katlı, 8 daireli bir yapı. Her dairenin bahçeye bakan bir cephesi var.",
    mainImage: image(IMG.yesilkoy, "Balkonlarını sarmaşıkların sardığı beyaz cepheli bina"),
    body: blocks(
      "Yeşilköy'ün bahçeli sokak dokusunu korumak için bina oturumunu parselin kuzeyine çektik; güney tarafı ortak bahçe olarak kaldı.",
      "Planladığımız tarihten bir ay önce teslim ettik, iskanı üç ay içinde aldık."
    ),
    startDate: "2021-03-15",
    plannedDelivery: "2022-09-30",
    actualDelivery: "2022-08-26",
    occupancyPermitDate: "2022-11-18",
    groundClass: "ZC",
    foundationType: "Radye temel",
    concreteClass: "C35",
    inspectionFirm: "Marmara Yapı Denetim",
    architect: "Selin Akar",
    landArea: 1480,
    floorCount: 4,
    unitCount: 8,
    extraSpecs: [spec("Otopark", "8 araçlık kapalı otopark"), spec("Isı yalıtımı", "Taş yünü, 8 cm")],
    documents: [],
    unitTypes: [unit("3+1", 165, 140, 4, 0), unit("4+1", 210, 182, 4, 0)],
    amenities: ["Ortak bahçe", "Kapalı otopark", "Bisiklet park yeri", "Daire başına depo"],
    gallery: [galleryImage(IMG.balcony, "Tentesi açık balkon ve ağaç dalları", "Bahçeye bakan balkonlar")],
  },
  {
    _id: "project-zeytinlik-22",
    _type: "project",
    title: "Zeytinlik 22",
    slug: slug("zeytinlik-22"),
    status: "insaatta",
    location: "Zeytinlik, Bakırköy",
    summary: "7 katlı, 24 daireli dönüşüm projesi. Karkas 5. kata ulaştı.",
    mainImage: image(IMG.zeytinlik, "Karkası yükselen betonarme bina"),
    body: blocks(
      "Zeytinlik 22, 1971 yapımı üç binanın bulunduğu parselde yükseliyor. Hak sahiplerinin tamamı projeye katıldı.",
      "Karkas her katta yapı denetim onayı alınarak ilerliyor. Planlanan teslim tarihini değiştirmedik."
    ),
    startDate: "2025-04-01",
    plannedDelivery: "2027-06-30",
    groundClass: "ZB",
    foundationType: "Radye temel",
    concreteClass: "C35",
    inspectionFirm: "Marmara Yapı Denetim",
    architect: "Selin Akar",
    landArea: 1650,
    floorCount: 7,
    unitCount: 24,
    extraSpecs: [spec("Hak sahibi", "21 bağımsız bölüm")],
    documents: [],
    unitTypes: [unit("2+1", 110, 92, 10, 3), unit("3+1", 155, 130, 14, 5)],
    amenities: ["Kapalı otopark", "Çocuk oyun alanı", "Daire başına depo"],
    gallery: [
      galleryImage(IMG.frame, "Kalıpları sökülmüş betonarme katlar", "Karkas, Eylül 2026"),
      galleryImage(IMG.site, "Tamamlanmamış katta çalışan usta", "Döşeme kontrolü"),
    ],
  },
  {
    _id: "project-kartaltepe-evleri",
    _type: "project",
    title: "Kartaltepe Evleri",
    slug: slug("kartaltepe-evleri"),
    status: "satista",
    location: "Kartaltepe, Bakırköy",
    summary: "5 katlı, 12 daireli yeni proje. Çatı katında dubleks daireler ve ortak teras.",
    mainImage: image(IMG.kartaltepe, "Derin balkonlu yeni apartman cephesi, akşam güneşi (görselleştirme)"),
    body: blocks(
      "Kartaltepe Evleri'nde temel kazısı 2026 Mayıs'ında başladı. Satışlar proje üzerinden yapılıyor; kat planlarını satış ofisimizde birlikte inceleyebiliriz.",
      "Görseller mimari görselleştirmedir. Künyedeki bilgiler ruhsat projesiyle aynıdır."
    ),
    startDate: "2026-05-01",
    plannedDelivery: "2028-03-31",
    groundClass: "ZB",
    foundationType: "Radye temel",
    concreteClass: "C35",
    inspectionFirm: "Marmara Yapı Denetim",
    architect: "Selin Akar",
    landArea: 980,
    floorCount: 5,
    unitCount: 12,
    extraSpecs: [spec("Otopark", "12 araçlık kapalı otopark")],
    documents: [],
    unitTypes: [unit("2+1", 100, 84, 4, 3), unit("3+1", 145, 122, 6, 5), unit("4+1 dubleks", 230, 196, 2, 2)],
    amenities: ["Kapalı otopark", "Ortak çatı terası", "Bisiklet park yeri"],
    gallery: [
      galleryImage(IMG.livingKartaltepe, "Geniş pencereli, mobilyalı salon", "3+1 salon (görselleştirme)"),
      galleryImage(IMG.kartaltepeAlt, "Beyaz ve kahverengi cepheli bina", "Sokak cephesi (görselleştirme)"),
    ],
  },
  // Older deliveries: sparse künye on purpose (no inspection firms before 2001, no ground surveys published then)
  {
    _id: "project-cinar-apartmani",
    _type: "project",
    title: "Çınar Apartmanı",
    slug: slug("cinar-apartmani"),
    status: "tamamlandi",
    location: "Yeşilköy, Bakırköy",
    summary: "Bahçesindeki çınarı koruyarak yapılan 5 katlı, 10 daireli apartman.",
    mainImage: image(IMG.cinar, "Balkonlu beyaz apartman cephesi"),
    body: blocks("Bahçedeki yüz yıllık çınarın kökleri için temeli parselin doğusuna kaydırdık. Ağaç hâlâ yerinde."),
    startDate: "2013-10-01",
    plannedDelivery: "2015-06-30",
    actualDelivery: "2015-06-12",
    occupancyPermitDate: "2015-09-24",
    groundClass: "ZC",
    foundationType: "Radye temel",
    concreteClass: "C30",
    inspectionFirm: "Marmara Yapı Denetim",
    floorCount: 5,
    unitCount: 10,
    extraSpecs: [],
    documents: [],
    unitTypes: [],
    amenities: [],
    gallery: [],
  },
  {
    _id: "project-ilgin-apartmani",
    _type: "project",
    title: "Ilgın Apartmanı",
    slug: slug("ilgin-apartmani"),
    status: "tamamlandi",
    location: "Kartaltepe, Bakırköy",
    summary: "Kartaltepe'de köşe parselde 6 katlı, 12 daireli apartman. Elif Tınaz'ın şantiye şefi olduğu ilk bina.",
    mainImage: image(IMG.ilgin, "Tenteli balkonları olan köşe apartman"),
    body: blocks("Elif Tınaz bu binada şantiye şefiydi. Yapı denetim sisteminin ikinci yılında, her katı denetim onayıyla ilerlettik."),
    startDate: "2002-09-01",
    plannedDelivery: "2004-05-31",
    actualDelivery: "2004-07-20",
    occupancyPermitDate: "2004-11-02",
    foundationType: "Radye temel",
    concreteClass: "C25",
    inspectionFirm: "Marmara Yapı Denetim",
    floorCount: 6,
    unitCount: 12,
    extraSpecs: [],
    documents: [],
    unitTypes: [],
    amenities: [],
    gallery: [],
  },
  {
    _id: "project-senlikkoy-apartmani",
    _type: "project",
    title: "Şenlikköy Apartmanı",
    slug: slug("senlikkoy-apartmani"),
    status: "tamamlandi",
    location: "Şenlikköy, Bakırköy",
    summary: "Yuvarlak köşesi ve yeşil panjurlarıyla 5 katlı, 10 daireli apartman.",
    mainImage: image(IMG.senlikkoy, "Yuvarlak köşeli, yeşil panjurlu apartman"),
    body: blocks("Hasan Tınaz'ın köşeyi yuvarlak döndüğü tek bina. Panjurlar bugün de aynı yeşil."),
    plannedDelivery: "1990-09-30",
    actualDelivery: "1990-10-15",
    floorCount: 5,
    unitCount: 10,
    extraSpecs: [],
    documents: [],
    unitTypes: [],
    amenities: [],
    gallery: [],
  },
  {
    _id: "project-tinaz-apartmani",
    _type: "project",
    title: "Tınaz Apartmanı",
    slug: slug("tinaz-apartmani"),
    status: "tamamlandi",
    location: "Osmaniye, Bakırköy",
    summary: "Hasan Tınaz'ın ilk binası: 4 katlı, 8 daireli köşe apartmanı. Kapısında hâlâ adı yazıyor.",
    mainImage: image(IMG.tinaz1981, "Dört katlı, sade cepheli köşe apartmanı"),
    body: blocks("Hasan Tınaz bu binayı kalfalıktan müteahhitliğe geçtiği yıl yaptı ve kapının üstüne adını yazdırdı. Dairelerin üçünde hâlâ ilk sahipleri oturuyor."),
    plannedDelivery: "1981-10-31",
    floorCount: 4,
    unitCount: 8,
    extraSpecs: [],
    documents: [],
    unitTypes: [],
    amenities: [],
    gallery: [],
  },
  {
    // Deliberately half-empty: tests "empty fields are invisible" (docs/PRODUCT.md)
    _id: "project-sakizagaci-apartmani",
    _type: "project",
    title: "Sakızağacı Apartmanı",
    slug: slug("sakizagaci-apartmani"),
    status: "yakinda",
    location: "Sakızağacı, Bakırköy",
    summary: "1972 yapımı binanın kentsel dönüşümü. Zemin etüdü sürüyor; sonuçlar çıkınca künyeyi yayınlayacağız.",
    mainImage: image(IMG.sakizagaci, "Dönüşüme girecek, süslü balkonlu eski apartman"),
    body: blocks("Hak sahipleriyle sözleşmeler imzalandı. Proje, zemin etüdü ve ruhsat sürecinin ardından satışa açılacak."),
    architect: "Selin Akar",
    extraSpecs: [],
    documents: [],
    unitTypes: [],
    amenities: [],
    gallery: [],
  },
];

const siteSettings = {
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Tınaz Yapı",
  siteTagline: "Adımızı kapıya yazıyoruz.",
  copyrightNotice: "Tüm hakları saklıdır.",
  defaultSeo: {
    metaTitle: "Tınaz Yapı | Bakırköy'de konut projeleri",
    metaDescription: "1981'den beri Bakırköy'de konut yapan aile firması. Her projenin zemin etüdünden iskanına kadar künyesini yayınlıyoruz.",
  },
  contactInfo: {
    phone: "0212 000 00 00",
    email: "satis@tinazyapi.example",
    address: "Cevizlik Mahallesi\nBakırköy / İstanbul",
    whatsappNumber: "+905000000000",
    mapIframe:
      '<iframe src="https://www.google.com/maps?q=Cevizlik%2C%20Bak%C4%B1rk%C3%B6y%2C%20%C4%B0stanbul&output=embed" title="Tınaz Yapı satış ofisi haritası" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  },
  salesOffice: {
    contactName: "Deniz Aksoy",
    contactRole: "Satış Ofisi",
    phone: "0212 000 00 00",
    whatsappNumber: "+905000000000",
    workingHours: "Hafta içi 09:00–19:00, Cumartesi 10:00–17:00",
    headline: "Bir daireyi yerinde görmek ister misiniz?",
    bandImage: image(IMG.litWindows, "Akşam, perdelerin ardında lambaları yanan iki pencere"),
    ctaLabel: "Satış ofisini arayın",
    whatsappLabel: "WhatsApp'tan yazın",
    priceNote: "Fiyat bilgisi için satış ofisimizi arayın.",
  },
  socialLinks: [],
};

const navigation = {
  _id: "navigation",
  _type: "navigation",
  headerLinks: [navLink("Projeler", "/projeler"), navLink("Hakkımızda", "/hakkimizda"), navLink("İletişim", "/iletisim")],
  footerLinks: [
    navLink("Ana sayfa", "/"),
    navLink("Projeler", "/projeler"),
    navLink("Hakkımızda", "/hakkimizda"),
    navLink("İletişim", "/iletisim"),
  ],
};

const homePage = {
  _id: "homePage",
  _type: "homePage",
  heroTitle: "Bakırköy'de her kapıda adımız var.",
  heroSubtitle: "Aynı semtte, zemin etüdünden iskana kadar her belgesini yayınladığımız konutlar yapıyoruz.",
  heroImage: image(IMG.cevizlik, "Akşam, Cevizlik Apartmanı'nın balkonlarında lambalar yanıyor", { caption: "Cevizlik Apartmanı, teslimden iki yıl sonra" }),
  heroCtaLabel: "Projeleri inceleyin",
  heroCtaLink: { linkType: "manual", manual: "/projeler" },
  projectsTitle: "Süren projeler",
  projectsSubtitle: "Satıştaki, yapımı süren ve yakında başlayacak projelerimiz.",
  projectsCtaLabel: "Tüm projeler",
  featuredStoryProject: ref("project-cevizlik-apartmani"),
  storyTitle: "Bir binayı baştan sona anlatıyoruz",
  storySubtitle: "Cevizlik Apartmanı'nın zeminden anahtara kadar kayıtları.",
  stageGround: {
    title: "Zemin",
    text: "Kazmadan önce ölçüyoruz. Her parselde sondaj yapılır, zemin etüdünün sonucu projenin künyesinde yayınlanır.",
  },
  stageFoundation: {
    title: "Temel",
    text: "Temel tipi zemine göre seçilir. Beton her dökümde numune alınarak laboratuvarda test edilir.",
  },
  stageFrame: {
    title: "Karkas",
    text: "Taşıyıcı sistemin her katı, bağımsız yapı denetim firmasının kontrolünden geçmeden bir sonrakine geçilmez.",
  },
  stageHandover: {
    title: "Teslim",
    text: "Anahtarı verdiğimiz tarih, söz verdiğimiz tarihle yan yana yazılır.",
  },
  storyCtaLabel: "Projenin tüm künyesi",
  recordTitle: "Teslim kaydımız",
  recordSubtitle: "Tamamladığımız her binanın teslim ve iskan tarihleri.",
  aboutTitle: "Kalfadan mühendise",
  aboutSubtitle: "Hasan Tınaz'ın kurduğu firmayı bugün kızı Elif Tınaz, aynı sokaklarda sürdürüyor.",
  aboutText: blocks(
    "Hasan Tınaz ilk apartmanını 1981'de Bakırköy'de yaptı ve kapısına adını yazdı. Elif Tınaz bugün aynı semtin yaşlanan binalarını, bir mühendisin titizliği ve babasından kalan usta alışkanlıklarıyla yeniden yapıyor."
  ),
  aboutImage: image(IMG.door, "Eski bir apartmanın mavi ahşap giriş kapısı"),
  aboutCtaLabel: "Hikâyemiz",
  aboutCtaLink: "/hakkimizda",
  seo: { noIndex: false },
};

const aboutPage = {
  _id: "aboutPage",
  _type: "aboutPage",
  heroTitle: "Kalfadan mühendise",
  heroSubtitle: "Bakırköy'de ilk apartmanını 1981'de yapan Hasan Tınaz'dan, bugün firmayı yöneten kızı Elif Tınaz'a.",
  pageTitle: "Hikâyemiz",
  body: blocks(
    "Hasan Tınaz, Bakırköy'e 1970'lerin sonunda kalfa olarak geldi. 1981'de kendi ilk binasını, çalıştığı sokakta yaptı ve kapısına adını yazdı. O günden beri her binamızda böyle.",
    "O günden beri semtten ayrılmadık. Yaptığımız binaların çoğu birbirine yürüme mesafesinde; sakinleriyle sokakta karşılaşıyoruz.",
    "Bugün firmayı inşaat mühendisi Elif Tınaz yönetiyor. Semtin 1960'lar ve 70'lerden kalan binalarını kentsel dönüşümle yeniden yapıyoruz. Sahil tarafındaki yumuşak zemin, bizi her projede önce ölçmeye, sonra yazmaya alıştırdı.",
    "Bu yüzden her projenin zemin sınıfını, beton sınıfını, yapı denetim firmasını ve teslim tarihlerini açıkça yayınlıyoruz. Planladığımız tarihte teslim edemediğimizde de yazıyoruz."
  ),
  mainImage: image(IMG.balcony, "Ağaç dallarının gölgelediği tenteli balkon"),
  seo: { noIndex: false },
};

const contactPage = {
  _id: "contactPage",
  _type: "contactPage",
  heroTitle: "Satış ofisimiz",
  heroSubtitle: "Bir daireyi yerinde görmek, künyeyi birlikte okumak ya da yalnızca sormak için.",
  pageTitle: "İletişim",
  pageSubtitle: "Ofisimiz Bakırköy'de. Gelmeden önce aramanız, sizi bekletmememizi sağlar.",
  // SMTP is not configured for the demo, so the form stays off
  showForm: false,
  formTitle: "Mesaj bırakın",
  successMessage: "Mesajınız bize ulaştı. Satış ofisimiz en geç bir iş günü içinde size dönecek.",
  seo: { noIndex: false },
};

const projectsPage = {
  _id: "projectsPage",
  _type: "projectsPage",
  heroTitle: "Projelerimiz",
  heroSubtitle: "Bakırköy'de yaptığımız ve yapmakta olduğumuz binalar, künyeleriyle birlikte.",
  pageTitle: "Projeler",
  specsTitle: "Künye",
  unitsTitle: "Daire tipleri",
  amenitiesTitle: "Sosyal donatılar",
  galleryTitle: "Galeri",
  documentsTitle: "Belgeler",
  seo: { noIndex: false },
};

const documents = [siteSettings, navigation, homePage, aboutPage, contactPage, projectsPage, ...projects];
const outFile = fileURLToPath(new URL("./tinaz-demo.ndjson", import.meta.url));
writeFileSync(outFile, documents.map((doc) => JSON.stringify(doc)).join("\n") + "\n", "utf8");
console.log(`Wrote ${documents.length} documents to ${outFile}`);
