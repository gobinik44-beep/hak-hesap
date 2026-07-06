// Görsel efektler: 3D kart eğimi (fare takipli) + arka plan parçacıkları.
// Saf JS, bağımlılık yok; prefers-reduced-motion'a saygılı.
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // ---- 3D eğim: araç kartları fareyi takip eder ----
  document.querySelectorAll(".arac-kart").forEach(function (k) {
    k.addEventListener("mousemove", function (e) {
      var r = k.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      k.style.transform = "perspective(900px) rotateX(" + (-y * 6).toFixed(2) +
        "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-3px)";
    });
    k.addEventListener("mouseleave", function () { k.style.transform = ""; });
  });

  // ---- Arka plan parçacıkları: yavaş süzülen ışık noktaları ----
  var c = document.createElement("canvas");
  c.style.cssText = "position:fixed;inset:0;z-index:-1;pointer-events:none";
  document.body.appendChild(c);
  var ctx = c.getContext("2d"), N = 46, P = [];

  function boyut() { c.width = innerWidth; c.height = innerHeight; }
  boyut();
  addEventListener("resize", boyut);

  var renk = getComputedStyle(document.documentElement)
    .getPropertyValue("--vurgu").trim() || "#35d49f";

  for (var i = 0; i < N; i++) {
    P.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.8 + 0.5,
      vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
      a: Math.random() * 0.35 + 0.08
    });
  }

  function kare() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = renk;
    P.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = c.width + 10; if (p.x > c.width + 10) p.x = -10;
      if (p.y < -10) p.y = c.height + 10; if (p.y > c.height + 10) p.y = -10;
      ctx.globalAlpha = p.a;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(kare);
  }
  kare();
})();
