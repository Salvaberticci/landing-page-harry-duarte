(function () {
  "use strict";

  var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-btn"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".gallery-card"));
  var counter = document.getElementById("galleryCount");

  function applyFilter(value) {
    var visible = 0;
    cards.forEach(function (card) {
      var cats = (card.getAttribute("data-category") || "").split(/\s+/);
      var show = value === "all" || cats.indexOf(value) !== -1;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });
    buttons.forEach(function (btn) {
      var active = btn.getAttribute("data-filter") === value;
      btn.classList.toggle("neu-pressed", active);
      btn.classList.toggle("neu-button", !active);
      btn.classList.toggle("text-white", active);
      btn.classList.toggle("text-muted", !active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (counter) counter.textContent = "Mostrando " + visible + " de " + cards.length + " piezas";
    var empty = document.getElementById("galleryEmpty");
    if (empty) empty.classList.toggle("hidden", visible !== 0);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyFilter(btn.getAttribute("data-filter"));
    });
  });

  var params = new URLSearchParams(window.location.search);
  var initial = params.get("filtro");
  var valid = buttons.some(function (b) { return b.getAttribute("data-filter") === initial; });
  applyFilter(valid ? initial : "all");

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById("lightbox");
  var lbImage = document.getElementById("lightboxImage");
  var lbTitle = document.getElementById("lightboxTitle");
  var lbMeta = document.getElementById("lightboxMeta");

  function openLightbox(src, title, meta) {
    if (!lightbox) return;
    lbImage.src = src;
    lbImage.alt = title;
    lbTitle.textContent = title;
    lbMeta.textContent = meta || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () {
      openLightbox(el.getAttribute("data-src"), el.getAttribute("data-title"), el.getAttribute("data-meta"));
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(el.getAttribute("data-src"), el.getAttribute("data-title"), el.getAttribute("data-meta"));
      }
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.hasAttribute("data-lightbox-close")) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
