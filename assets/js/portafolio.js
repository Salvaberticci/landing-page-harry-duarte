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
      if (!show) {
        var video = card.querySelector("video");
        if (video) video.pause();
      }
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
    if (counter) counter.textContent = "Mostrando " + visible + " de " + cards.length + " obras";
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
  var lbVideo = document.getElementById("lightboxVideo");
  var lbTitle = document.getElementById("lightboxTitle");
  var lbMeta = document.getElementById("lightboxMeta");

  function openLightbox(src, title, meta, type, poster) {
    if (!lightbox) return;
    if (type === "video" && lbVideo) {
      lbImage.classList.add("hidden");
      lbVideo.classList.remove("hidden");
      lbVideo.poster = poster || "";
      if (lbVideo.getAttribute("src") !== src) lbVideo.src = src;
      lbVideo.currentTime = 0;
      var playPromise = lbVideo.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    } else if (lbImage) {
      if (lbVideo) {
        lbVideo.pause();
        lbVideo.classList.add("hidden");
      }
      lbImage.classList.remove("hidden");
      lbImage.src = src;
      lbImage.alt = title;
    }
    lbTitle.textContent = title;
    lbMeta.textContent = meta || "";
    lightbox.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    if (lbVideo) {
      lbVideo.pause();
      lbVideo.removeAttribute("src");
      lbVideo.load();
      lbVideo.classList.add("hidden");
    }
    if (lbImage) lbImage.classList.remove("hidden");
  }

  document.querySelectorAll("[data-lightbox]").forEach(function (el) {
    el.addEventListener("click", function () {
      openLightbox(el.getAttribute("data-src"), el.getAttribute("data-title"), el.getAttribute("data-meta"), el.getAttribute("data-type"), el.getAttribute("data-poster"));
    });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(el.getAttribute("data-src"), el.getAttribute("data-title"), el.getAttribute("data-meta"), el.getAttribute("data-type"), el.getAttribute("data-poster"));
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
