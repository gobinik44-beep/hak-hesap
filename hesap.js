// ============================================================
// HESAP MOTORU — saf fonksiyonlar. UI içermez.
// Bu dosya hem tarayıcıda hem Node testlerinde (test.js) çalışır;
// sitede çalışan kod ile test edilen kod AYNIDIR.
// ============================================================

var HESAP = (function () {
  "use strict";

  function kurus(x) { return Math.round(x * 100) / 100; }

  // ---------- KİRA ARTIŞI (TBK m.344) ----------
  // mevcutKira: TL, oranYuzde: ör. 32.03
  function kiraHesapla(mevcutKira, oranYuzde) {
    if (!(mevcutKira > 0)) return { hata: "Geçerli bir kira tutarı girin." };
    if (typeof oranYuzde !== "number" || !isFinite(oranYuzde)) {
      return { hata: "Bu ay için oran verisi henüz tanımlı değil." };
    }
    var yeni = kurus(mevcutKira * (1 + oranYuzde / 100));
    return {
      oran: oranYuzde,
      yeniKira: yeni,
      artis: kurus(yeni - mevcutKira)
    };
  }

  // ---------- KIDEM SÜRESİ ----------
  // Takvim yılı esaslı: tam yıl = giriş tarihinin yıldönümü,
  // kalan gün = son yıldönümünden çıkışa kadar geçen gün.
  function kidemSuresi(girisISO, cikisISO) {
    var giris = new Date(girisISO + "T00:00:00");
    var cikis = new Date(cikisISO + "T00:00:00");
    if (isNaN(giris) || isNaN(cikis)) return { hata: "Geçersiz tarih." };
    if (cikis <= giris) return { hata: "Çıkış tarihi giriş tarihinden sonra olmalı." };

    var yil = cikis.getFullYear() - giris.getFullYear();
    var donum = new Date(giris); donum.setFullYear(giris.getFullYear() + yil);
    if (donum > cikis) {
      yil--;
      donum = new Date(giris); donum.setFullYear(giris.getFullYear() + yil);
    }
    var kalanGun = Math.round((cikis - donum) / 86400000);
    return { yil: yil, kalanGun: kalanGun };
  }

  // ---------- KIDEM TAVANI ----------
  function kidemTavani(cikisISO, tavanlar) {
    for (var i = 0; i < tavanlar.length; i++) {
      if (cikisISO >= tavanlar[i].bas && cikisISO <= tavanlar[i].bit) {
        return tavanlar[i].tutar;
      }
    }
    return null;
  }

  // ---------- KIDEM TAZMİNATI (1475 s.K. m.14) ----------
  // brutUcret: son aylık GİYDİRİLMİŞ brüt ücret (yol, yemek, düzenli
  // ikramiye vb. dahil). Tavan aşımında tavana sabitlenir.
  function kidemHesapla(girisISO, cikisISO, brutUcret, veri) {
    if (!(brutUcret > 0)) return { hata: "Geçerli bir brüt ücret girin." };

    var sure = kidemSuresi(girisISO, cikisISO);
    if (sure.hata) return sure;
    if (sure.yil < 1) {
      return { hata: "Kıdem tazminatına hak kazanmak için en az 1 tam yıl çalışmış olmak gerekir. Girilen süre: " + sure.kalanGun + " gün." };
    }

    var tavan = kidemTavani(cikisISO, veri.kidemTavanlari);
    if (tavan === null) {
      return { hata: "Bu çıkış tarihi için tavan verisi tanımlı değil (tanımlı aralık: " + veri.kidemTavanlari[0].bas + " – " + veri.kidemTavanlari[veri.kidemTavanlari.length - 1].bit + ")." };
    }

    var tavanUygulandi = brutUcret > tavan;
    var esasUcret = tavanUygulandi ? tavan : brutUcret;

    var brutKidem = kurus(esasUcret * sure.yil + esasUcret * sure.kalanGun / 365);
    var damga = kurus(brutKidem * veri.damgaVergisiOrani);
    var net = kurus(brutKidem - damga);

    return {
      yil: sure.yil,
      kalanGun: sure.kalanGun,
      tavan: tavan,
      tavanUygulandi: tavanUygulandi,
      esasUcret: esasUcret,
      brutKidem: brutKidem,
      damga: damga,
      net: net
    };
  }

  // ---------- YILLIK ÜCRETLİ İZİN (4857 s.K. m.53) ----------
  // tamYil: tamamlanan hizmet yılı.
  //   1-5 yıl (5 dahil): 14 gün | 5'ten fazla, 15'ten az: 20 gün | 15+ (dahil): 26 gün
  // Yaş kuralı: 18 ve daha küçük YA DA 50 ve daha yukarı yaş → en az 20 gün.
  // Yer altı işleri: +4 gün. Bunlar yasal ASGARİ sürelerdir.
  function izinHesapla(tamYil, yas, yeralti) {
    if (!(tamYil >= 0) || tamYil !== Math.floor(tamYil)) {
      return { hata: "Tamamlanan hizmet yılını tam sayı olarak girin." };
    }
    if (tamYil < 1) {
      return { gun: 0, not: "Yıllık ücretli izne hak kazanmak için en az 1 tam yıl çalışmış olmak gerekir (m.54)." };
    }
    var gun = tamYil <= 5 ? 14 : (tamYil < 15 ? 20 : 26);
    var yasKurali = false;
    if (yas !== null && yas !== undefined && yas !== "" && (Number(yas) <= 18 || Number(yas) >= 50)) {
      if (gun < 20) { gun = 20; yasKurali = true; }
    }
    if (yeralti) gun += 4;
    return { gun: gun, yasKurali: yasKurali };
  }

  // ---------- Para biçimlendirme ----------
  function tl(x) {
    return x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL";
  }

  return {
    kiraHesapla: kiraHesapla,
    kidemSuresi: kidemSuresi,
    kidemTavani: kidemTavani,
    kidemHesapla: kidemHesapla,
    izinHesapla: izinHesapla,
    tl: tl
  };
})();

if (typeof module !== "undefined" && module.exports) module.exports = HESAP;
