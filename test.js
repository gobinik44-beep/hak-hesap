// node test.js — tüm hesap mantığının doğrulama testleri.
// Sitede çalışan hesap.js + veri.js AYNEN test edilir.
"use strict";
const VERI = require("./veri.js");
const H = require("./hesap.js");

let ok = 0, fail = 0;
function esit(ad, gercek, beklenen) {
  const g = JSON.stringify(gercek), b = JSON.stringify(beklenen);
  if (g === b) { ok++; }
  else { fail++; console.log("FAIL: " + ad + "\n  beklenen: " + b + "\n  gercek : " + g); }
}

// ================= KİRA =================
// 20.000 TL, Temmuz 2026 (%32,03): 20.000 × 1,3203 = 26.406,00
let k = H.kiraHesapla(20000, VERI.kiraOranlari["2026-07"]);
esit("kira 20000 Tem26 yeni", k.yeniKira, 26406);
esit("kira 20000 Tem26 artis", k.artis, 6406);

// 17.350 TL, Haziran 2026 (%32,24): 17.350 × 1,3224 = 22.943,64
k = H.kiraHesapla(17350, VERI.kiraOranlari["2026-06"]);
esit("kira 17350 Haz26", k.yeniKira, 22943.64);

// Kuruş yuvarlama: 10.001 × 1,3203 = 13.204,3203 → 13.204,32
k = H.kiraHesapla(10001, 32.03);
esit("kira kurus yuvarlama", k.yeniKira, 13204.32);

// Hatalı girişler
esit("kira 0 hata", !!H.kiraHesapla(0, 32.03).hata, true);
esit("kira tanimsiz oran hata", !!H.kiraHesapla(10000, undefined).hata, true);

// ================= KIDEM SÜRESİ =================
esit("sure tam 6 yil", H.kidemSuresi("2020-07-05", "2026-07-05"), { yil: 6, kalanGun: 0 });
esit("sure 3 yil 10 gun", H.kidemSuresi("2023-03-01", "2026-03-11"), { yil: 3, kalanGun: 10 });
esit("sure 1 yildan az", H.kidemSuresi("2025-01-10", "2025-12-31").yil, 0);
esit("sure ters tarih hata", !!H.kidemSuresi("2026-01-01", "2025-01-01").hata, true);

// ================= KIDEM TAVANI =================
esit("tavan Haz26 son gun", H.kidemTavani("2026-06-30", VERI.kidemTavanlari), 64948.77);
esit("tavan Tem26 ilk gun", H.kidemTavani("2026-07-01", VERI.kidemTavanlari), 73729.87);
esit("tavan 2025 H2", H.kidemTavani("2025-08-15", VERI.kidemTavanlari), 53919.68);
esit("tavan kapsam disi", H.kidemTavani("2024-12-31", VERI.kidemTavanlari), null);

// ================= KIDEM TAZMİNATI =================
// 10 tam yıl, 50.000 brüt (tavan altı), çıkış Tem26:
// brüt 500.000; damga 500.000×0,00759=3.795; net 496.205
let d = H.kidemHesapla("2016-07-10", "2026-07-10", 50000, VERI);
esit("kidem 10y brut", d.brutKidem, 500000);
esit("kidem 10y damga", d.damga, 3795);
esit("kidem 10y net", d.net, 496205);
esit("kidem 10y tavan uygulanmadi", d.tavanUygulandi, false);

// Tavan aşımı: 100.000 brüt > 73.729,87; 5 tam yıl, çıkış Ağu26:
// brüt 5×73.729,87=368.649,35; damga=2.798,05; net=365.851,30
d = H.kidemHesapla("2021-08-01", "2026-08-01", 100000, VERI);
esit("kidem tavanli esas", d.esasUcret, 73729.87);
esit("kidem tavanli brut", d.brutKidem, 368649.35);
esit("kidem tavanli damga", d.damga, 2798.05);
esit("kidem tavanli net", d.net, 365851.3);
esit("kidem tavan uygulandi", d.tavanUygulandi, true);

// Kısmi yıl: 3 yıl 73 gün, 30.000 brüt, çıkış Tem26:
// 90.000 + 30.000×73/365 = 96.000; damga 728,64; net 95.271,36
d = H.kidemHesapla("2023-04-23", "2026-07-05", 30000, VERI);
esit("kidem kismi sure", { y: d.yil, g: d.kalanGun }, { y: 3, g: 73 });
esit("kidem kismi brut", d.brutKidem, 96000);
esit("kidem kismi damga", d.damga, 728.64);
esit("kidem kismi net", d.net, 95271.36);

// 1 yıldan az → hak yok
esit("kidem 1 yildan az hata", !!H.kidemHesapla("2026-01-01", "2026-06-30", 40000, VERI).hata, true);
// Kapsam dışı çıkış tarihi → veri yok hatası
esit("kidem kapsam disi hata", !!H.kidemHesapla("2010-01-01", "2024-06-30", 40000, VERI).hata, true);

// ================= YILLIK İZİN =================
esit("izin 1 yil", H.izinHesapla(1, null, false).gun, 14);
esit("izin 5 yil (5 dahil 14)", H.izinHesapla(5, null, false).gun, 14);
esit("izin 6 yil", H.izinHesapla(6, null, false).gun, 20);
esit("izin 14 yil", H.izinHesapla(14, null, false).gun, 20);
esit("izin 15 yil (15 dahil 26)", H.izinHesapla(15, null, false).gun, 26);
esit("izin 3 yil yas 50", H.izinHesapla(3, 50, false).gun, 20);
esit("izin 3 yil yas 18 (18 dahil)", H.izinHesapla(3, 18, false).gun, 20);
esit("izin 3 yil yas 19 (kural yok)", H.izinHesapla(3, 19, false).gun, 14);
esit("izin 7 yil yas 52 (zaten 20)", H.izinHesapla(7, 52, false).gun, 20);
esit("izin 16 yil yas 55 (26 kalir)", H.izinHesapla(16, 55, false).gun, 26);
esit("izin yeralti 2 yil (+4)", H.izinHesapla(2, null, true).gun, 18);
esit("izin 0 yil hak yok", H.izinHesapla(0, null, false).gun, 0);

// ================= SONUÇ =================
console.log("\n" + ok + " test GECTI, " + fail + " test KALDI.");
process.exit(fail === 0 ? 0 : 1);
