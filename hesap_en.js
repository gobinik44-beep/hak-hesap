// EN calculator logic — pure functions, tested in test.js alongside TR logic.
var HESAP_EN = (function () {
  "use strict";
  function c2(x) { return Math.round(x * 100) / 100; }

  // SSA retirement earnings test. mode: "under" | "fraYear" | "after"
  // Values (limits) come from veri.js usa2026 — single data source.
  function earningsTest(annualEarnings, mode, usa) {
    if (!(annualEarnings >= 0) || !isFinite(annualEarnings)) {
      return { hata: "Enter a valid annual earnings amount." };
    }
    if (mode === "after") return { withheld: 0, limit: null, over: 0 };
    var limit = mode === "fraYear" ? usa.earningsLimitFRAYear : usa.earningsLimitUnderFRA;
    var divisor = mode === "fraYear" ? 3 : 2;
    var over = c2(Math.max(0, annualEarnings - limit));
    return { withheld: c2(over / divisor), limit: limit, over: over, divisor: divisor };
  }

  function usd(x) {
    return "$" + x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return { earningsTest: earningsTest, usd: usd };
})();
if (typeof module !== "undefined" && module.exports) module.exports = HESAP_EN;
