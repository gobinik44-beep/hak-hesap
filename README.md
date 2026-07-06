# Hak & Hesap — Doğrulanmış Hesaplama Sitesi

Statik site, derleme gerektirmez. `index.html`'i tarayıcıda açmak yeterli.

## Dosyalar
- `veri.js` — TÜM güncel/dönemsel değerler (tek yer). Kod değil, veri.
- `hesap.js` — saf hesap fonksiyonları (sitede ve testte AYNI dosya).
- `test.js` — `node test.js` ile 41 doğrulama testi. Veri/kod değişince mutlaka çalıştır.
- `index.html`, `kira-artisi.html`, `kidem-tazminati.html`, `yillik-izin.html`, `stil.css`

## Veri güncelleme takvimi (KRİTİK — sitenin tek bakım işi)

### Her ay (ayın 3'ü civarı, TÜİK bülteni sonrası): kira oranı
1. TÜİK'in yeni TÜFE bülteninden **"on iki aylık ortalamalara göre değişim"** oranını al
   (yıllık enflasyonla KARIŞTIRMA). Bu oran, **bir sonraki ayın** yenilemelerine uygulanır:
   Ağustos verisi (Eylül başında açıklanır) → Eylül yenilemeleri.
2. `veri.js` → `kiraOranlari` ve `kiraAyAdlari`'na yeni ayı ekle.
3. `sonGuncelleme`'yi güncelle, `node test.js` çalıştır.
4. En az 2 bağımsız kaynakla çapraz kontrol et (ör. hukuk bürosu siteleri + hesaplama siteleri).

### Yılda 2 kez (Ocak ve Temmuz başı): kıdem tavanı
1. Hazine ve Maliye Bakanlığı'nın "Mali ve Sosyal Haklar" genelgesindeki yeni tavanı al.
2. `veri.js` → `kidemTavanlari`'na yeni dönemi ekle.
3. DİKKAT: Basın genellikle eski tavanı zam oranıyla çarpıp YANLIŞ kuruş yazar
   (Temmuz 2026'da 73.729,84 / 73.723,35 gibi hatalı rakamlar dolaştı; genelgeye dayalı
   uzman kaynaklar 73.729,87 verdi). Genelgeyi kaynak alan uzman siteleri tercih et,
   tek gazete haberine güvenme.

### Statik (değişmez): yıllık izin
İş Kanunu m.53 cetveli kanun değişikliği olmadıkça sabittir.

## Mevcut verilerin kaynakları (5 Temmuz 2026)
- Kira oranları (Oca–Tem 2026): TÜİK bültenleri; 3 kaynakla çapraz doğrulandı:
  [ayboga.av.tr](https://ayboga.av.tr/kira-artis-orani/),
  [hesaplama.net](https://kira-artis-orani.hesaplama.net/),
  [hesapkurdu.com](https://www.hesapkurdu.com/konut-kredisi/h/kira-artisi-hesaplama)
- Kıdem tavanı Tem–Ara 2026 (73.729,87 TL): HMB 03.07.2026 tarihli 5 Sıra No.lu Genelge;
  doğrulama: [prozon.net (Mahmut Akman sirküleri)](https://prozon.net/sirkuler/is-ve-sosyal-guvenlik-danismani-mahmut-akman-bildiriyor-hazine-ve-maliye-bakanligi-5-nolu-genelgesi-ile-1-temmuz-2026dan-itibaren-yeni-kidem-tazminati-tavani-73-72987-tl-oldu/),
  [demiraydinhukuk.com](https://www.demiraydinhukuk.com/post/2026-temmuz-aralik-kidem-tazminati-tavani)
- Damga vergisi binde 7,59: muhasebetr.com

## Yayınlama (GitHub Pages, ücretsiz)
1. Kullanıcı bir kez: `gh auth login -w` (tarayıcıyla GitHub girişi).
2. Sonrası otomatik yapılabilir: repo oluştur + push + Pages aç.
3. Gerçek adres belli olunca: `.\alan-adi.ps1 https://KULLANICI.github.io/hak-hesap`
   → canonical/OG/sitemap/robots/video açıklamaları tek komutta güncellenir; push tekrarlanır.
4. Google Search Console + Bing Webmaster'a siteyi ekle, sitemap.xml gönder (kullanıcı,
   Google/Microsoft hesabıyla). Aramada görünmenin ön şartı budur.

## SEO mimarisi (yapıldı)
- Her sayfa: hedef kelimeli title/description, canonical, Open Graph, JSON-LD
  (hesaplayıcılarda WebApplication + FAQPage; Google SSS'leri zengin sonuç olarak gösterebilir).
- Görünür SSS bölümleri = uzun kuyruk sorgular ("istifa eden kıdem alır mı",
  "kullanılmayan izin yanar mı", "ev sahibi fazla zam isteyebilir mi").
- kira-artis-oranlari.html: ay-ay tablo → "ağustos 2026 kira artış oranı" tipi
  her ay yeniden doğan taze sorguların sayfası.
- sitemap.xml + robots.txt.

## Aylık SEO görevleri (veri güncellemesiyle birlikte, ~10 dk)
1. `veri.js`: yeni ayın kira oranını ekle (çift kaynak kuralı) + `yillikTufe`
   (yıllık TÜFE — maaş erimesi aracı bunu kullanır) + `sonGuncelleme`.
2. `kira-artisi.html`: title / meta description / SSS içindeki AY ve ORAN değerlerini yenile
   (şu an "Temmuz 2026, %32,03 / yıllık %32,11" yazan yerler).
3. `sitemap.xml`: değişen sayfaların `lastmod` tarihini güncelle.
4. `node test.js` → push. (Arşiv tablosu ve hesaplayıcı veri.js'ten otomatik güncellenir.)
Bu listeyi bana "aylık güncelleme yap" diyerek tek seferde yaptırabilirsin.
