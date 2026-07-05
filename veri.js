// ============================================================
// VERİ DOSYASI — tüm güncel/dönemsel değerler SADECE burada.
// Son kontrol: 5 Temmuz 2026
// Güncelleme talimatı: README.md
// ============================================================

var VERI = {
  sonGuncelleme: "5 Temmuz 2026",

  // Site adresi — yayın sonrası alan-adi.ps1 ile tek komutta değişir.
  // Canonical/OG etiketleri, sitemap ve video açıklamaları buradan beslenir.
  siteAdresi: "https://gobinik44-beep.github.io/hak-hesap",

  // YouTube kanal ID'si (UC... ile başlar). Kanal açılınca doldur;
  // videolar.html son videoları otomatik gösterir.
  youtubeKanalId: "",

  // --- KİRA ARTIŞI ---
  // TBK m.344: konut ve çatılı işyeri kiralarında artış üst sınırı,
  // bir önceki kira yılına ait TÜFE "oniki aylık ortalamalara göre
  // değişim oranı"nı geçemez.
  // Anahtar = SÖZLEŞMENİN YENİLENDİĞİ AY (o aydan bir önceki ayın
  // TÜİK verisi esas alınır; oranlar bu eşleşmeyle girilmiştir).
  // Kaynak: TÜİK TÜFE bültenleri (3 bağımsız kaynakla çapraz doğrulandı).
  kiraOranlari: {
    "2026-01": 34.88,
    "2026-02": 33.98,
    "2026-03": 33.39,
    "2026-04": 32.82,
    "2026-05": 32.43,
    "2026-06": 32.24,
    "2026-07": 32.03
  },
  kiraAyAdlari: {
    "2026-01": "Ocak 2026", "2026-02": "Şubat 2026", "2026-03": "Mart 2026",
    "2026-04": "Nisan 2026", "2026-05": "Mayıs 2026", "2026-06": "Haziran 2026",
    "2026-07": "Temmuz 2026"
  },

  // --- KIDEM TAZMİNATI TAVANI ---
  // 1475 sayılı İş Kanunu m.14: tavan = en yüksek devlet memuruna bir
  // hizmet yılı için ödenen azami emeklilik ikramiyesi.
  // Son dönem kaynağı: Hazine ve Maliye Bakanlığı 03.07.2026 tarihli
  // 5 Sıra No.lu Genelge (iki bağımsız uzman kaynakla doğrulandı).
  kidemTavanlari: [
    { bas: "2025-01-01", bit: "2025-06-30", tutar: 46655.43 },
    { bas: "2025-07-01", bit: "2025-12-31", tutar: 53919.68 },
    { bas: "2026-01-01", bit: "2026-06-30", tutar: 64948.77 },
    { bas: "2026-07-01", bit: "2026-12-31", tutar: 73729.87 }
  ],

  // Kıdem tazminatı kesintisi: yalnız damga vergisi (binde 7,59).
  damgaVergisiOrani: 0.00759
};

// Node.js test ortamı için:
if (typeof module !== "undefined" && module.exports) module.exports = VERI;
