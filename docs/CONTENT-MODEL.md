# Content Model

Schema spec for the residential-developer demo. Decided with the user; not yet implemented. Strategy behind these fields lives in `docs/PRODUCT.md` (see "Content policy"). Follow the boilerplate rules in `CLAUDE.md` when implementing (Turkish titles, `turkishSlugify`, `${imageFields}`, types in `src/types/index.ts`, `initialValue` on every field).

## 1. `project` (document, extend existing `src/sanity/schemaTypes/documents/project.ts`)

Split into Studio field groups so editors don't get lost: `genel` (Genel, default), `kunye` (Künye), `satis` (Satış), `galeri` (Galeri), `seo` (SEO).

### Genel
| Field | Title | Type | initialValue | Notes |
|---|---|---|---|---|
| `title` | Başlık | string | (existing) | required |
| `slug` | Slug | slug | (existing) | required, `turkishSlugify` |
| `status` | Durum | string, radio: `yakinda` Yakında · `satista` Satışta · `insaatta` İnşaat Halinde · `tamamlandi` Tamamlandı | `satista` | required. Drives the Lamp "Satışta" tag. |
| `location` | Konum | string | `Urla, İzmir` | district/neighbourhood label |
| `mapUrl` | Harita Linki | url | none | optional Google Maps link |
| `summary` | Kısa Özet | text (rows 3) | a sample sentence | max 160 chars; used in lists and meta fallback |
| `mainImage` | Ana Görsel | image | (existing) | required |
| `body` | İçerik | portable text | (existing) | unchanged |

### Künye
| Field | Title | Type | initialValue | Notes |
|---|---|---|---|---|
| `startDate` | İnşaat Başlangıcı | date | **none** | A fake date is worse than an empty one; documented exception to the initialValue rule. |
| `plannedDelivery` | Planlanan Teslim | date | **none** | |
| `actualDelivery` | Gerçekleşen Teslim | date | **none** | Optional. Description: "Boş bırakılırsa sitede yalnızca planlanan teslim gösterilir." Compare UI renders only when both dates exist. |
| `occupancyPermitDate` | İskan Tarihi | date | **none** | |
| `groundClass` | Zemin Sınıfı | string, list `ZA`–`ZE` (TBDY 2018) | `ZB` | |
| `foundationType` | Temel Tipi | string | `Radye temel` | |
| `concreteClass` | Beton Sınıfı | string, list `C30` `C35` `C40` `C45` `C50` | `C35` | |
| `inspectionFirm` | Yapı Denetim Firması | string | sample firm name | |
| `architect` | Mimar | string | sample name | |
| `landArea` | Arsa Alanı (m²) | number | sample | positive |
| `floorCount` | Kat Sayısı | number | sample | positive integer |
| `unitCount` | Toplam Daire | number | sample | positive integer |
| `extraSpecs` | Ek Bilgiler | array of object `{ label: string, value: string }` | `[]` | free rows for anything the fixed fields don't cover |
| `documents` | Belgeler | array of object `{ title: string, file: file (accept `application/pdf`) }` | `[]` | e.g. ground survey summary, occupancy permit |

### Satış
| Field | Title | Type | initialValue | Notes |
|---|---|---|---|---|
| `unitTypes` | Daire Tipleri | array of object (below) | one sample `3+1` | |
| `amenities` | Sosyal Donatılar | array of string | `[]` | |

`unitTypes[]` object: `name` Tip (string, e.g. `3+1`, required) · `grossArea` Brüt m² (number) · `netArea` Net m² (number, must be ≤ grossArea) · `totalCount` Toplam Adet (number) · `availableCount` Satıştaki Adet (number, must be ≤ totalCount) · `floorPlan` Kat Planı (image with `alt`). Preview: `name` + `netArea m²`.

No price fields, by policy.

### Galeri
`gallery` Galeri: array of image, each with `alt` (Alt Metni) and `caption` (Açıklama), `options.hotspot: true`. initialValue `[]`.

### SEO
Unchanged (`seo` object).

### Studio preview
Title + `status` label + `location` as subtitle, `mainImage` as media.

## 2. `siteSettings.salesOffice` (new object field on existing singleton)

| Field | Title | Type | initialValue |
|---|---|---|---|
| `contactName` | Yetkili Adı | string | `Deniz Aksoy` |
| `contactRole` | Unvan | string | `Satış Ofisi` |
| `photo` | Fotoğraf | image with `alt` | none |
| `phone` | Telefon | string | sample |
| `whatsappNumber` | WhatsApp | string (`+90…` format, same description as `contactInfo.whatsappNumber`) | sample |
| `workingHours` | Çalışma Saatleri | string | `Hafta içi 09:00–19:00, Cumartesi 10:00–17:00` |
| `ctaLabel` | Buton Metni | string | `Satış ofisini arayın` |
| `priceNote` | Fiyat Notu | string | `Fiyat bilgisi için satış ofisimizi arayın.` |

Added to `layoutQuery` (fetched once per page), with `photo ${imageFields}`.

Also set initialValues on the existing identity fields: `siteName` → `Tınaz Yapı`, `siteTagline` → `Adımızı kapıya yazıyoruz.` (identity source: `docs/PRODUCT.md` → Brand Identity).

## 3. Home: construction story (proposal, finalize in the home shape brief)

The mid-page Construction Story (see `docs/DESIGN.md` → Components) pulls its data from one real project.

- `homePage.featuredStoryProject`: reference → `project`.
- `homePage.storyTitle` / `storySubtitle`: strings with initialValues.
- Four fixed stage objects (fixed, not an array, because the 3D choreography expects exactly four): `stageGround`, `stageFoundation`, `stageFrame`, `stageHandover`, each `{ title: string, text: text }` with initialValues.

Stage ↔ data mapping (data from the referenced project; rows with empty values are not rendered):
| Stage | Data shown |
|---|---|
| Zemin | `groundClass`, `landArea` |
| Temel | `foundationType`, `concreteClass` |
| Karkas | `floorCount`, `inspectionFirm`, `architect` |
| Teslim | `plannedDelivery`, `actualDelivery` (if set), `occupancyPermitDate`, `unitCount` |

## 4. Queries (`src/sanity/lib/queries.ts`)

- `projectListQuery` / `projectFallbackQuery` / `homePageQuery.featuredProjects`: keep light. Add only `status`, `location`, `summary`. Never fetch `unitTypes`, `gallery`, or `documents` in lists.
- `projectBySlugQuery`: add all fields. Images (`gallery[]`, `unitTypes[].floorPlan`) through `${imageFields}`; `documents[] { title, "url": file.asset->url }`.
- List order: replace `order(_createdAt asc)` with status priority then delivery: `order(select(status == "satista" => 0, status == "insaatta" => 1, status == "yakinda" => 2, 3) asc, plannedDelivery desc)`.

## 5. Types (`src/types/index.ts`)

Add `ProjectStatus = "yakinda" | "satista" | "insaatta" | "tamamlandi"`, `UnitType`, `ProjectDocument`, `SpecRow { label; value }`, `GalleryImage extends SanityImage { caption? }`, `SalesOffice`; extend `Project` and `SiteSettings`. All new project fields optional in the type except `status` (the schema requires it).

## 6. Registration checklist

No new document types, so `schemaTypes/index.ts`, `structure.ts`, `SINGLETONS`, the revalidate route, and the README webhook list need **no changes** (`project`, `siteSettings`, `homePage` are already mapped in `src/app/api/revalidate/route.ts`). Re-verify this if a separate `salesPerson` document is ever introduced instead of the settings object.
