/* ============================================================
   Stefan Crnobrnja — stefanc.website
   Vanilla JS only. No frameworks, no trackers, no requests.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- language toggle (EN / SV) ---------- */
  var LANG_KEY = "lang";

  function setLang(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "sv" ? "sv" : "en");
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* private mode */ }
    document.querySelectorAll("[data-setlang]").forEach(function (btn) {
      var active = btn.getAttribute("data-setlang") === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  var stored = null;
  try { stored = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  var browserSv = (navigator.language || "").toLowerCase().indexOf("sv") === 0;
  setLang(stored === "sv" || stored === "en" ? stored : (browserSv ? "sv" : "en"));

  document.querySelectorAll("[data-setlang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-setlang"));
    });
  });

  /* ---------- email links ----------
     The address is never written out in the HTML (it reads "contact [at] ...")
     and is only assembled here, which keeps simple address scrapers away. */
  document.querySelectorAll("[data-email-user]").forEach(function (el) {
    var addr = el.getAttribute("data-email-user") + "@" + el.getAttribute("data-email-domain");
    el.textContent = addr;
    el.setAttribute("href", "mailto:" + addr);
  });

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- print / save as PDF (CV page) ---------- */
  var printBtn = document.getElementById("print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () { window.print(); });
  }
})();
