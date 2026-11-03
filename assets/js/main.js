(function () {
  "use strict";

  var toggle = document.getElementById("menuToggle");
  var menu = document.getElementById("mobileMenu");
  var panel = document.getElementById("mobilePanel");
  var backdrop = menu ? menu.querySelector("[data-menu-backdrop]") : null;

  function openMenu() {
    if (!menu) return;
    menu.classList.remove("hidden");
    document.body.classList.add("no-scroll");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      if (backdrop) backdrop.style.opacity = "1";
      if (panel) panel.style.transform = "translateX(0)";
    });
  }

  function closeMenu() {
    if (!menu) return;
    if (backdrop) backdrop.style.opacity = "0";
    if (panel) panel.style.transform = "translateX(100%)";
    document.body.classList.remove("no-scroll");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    setTimeout(function () { menu.classList.add("hidden"); }, 300);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      if (menu && menu.classList.contains("hidden")) openMenu();
      else closeMenu();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  document.querySelectorAll("[data-menu-close]").forEach(function (el) {
    el.addEventListener("click", closeMenu);
  });
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeMenu); });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll(".js-year").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  var spy = document.querySelectorAll("[data-spy]");
  if (spy.length && "IntersectionObserver" in window) {
    var links = document.querySelectorAll("[data-spy-link]");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          var active = link.getAttribute("href") === "#" + id;
          link.classList.toggle("is-active", active);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    spy.forEach(function (s) { observer.observe(s); });
  }

  document.querySelectorAll("video").forEach(function (video) {
    var btn = video.parentElement.querySelector("button[aria-label*='Reproducir'], button[aria-label*='Play']");
    if (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (video.paused) {
          video.play();
          btn.innerHTML = '<span class="material-symbols-outlined text-lg" aria-hidden="true">pause_circle</span>';
        } else {
          video.pause();
          btn.innerHTML = '<span class="material-symbols-outlined text-lg" aria-hidden="true">play_circle</span>';
        }
      });
      video.addEventListener("click", function () {
        if (video.paused) {
          video.play();
          if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-lg" aria-hidden="true">pause_circle</span>';
        } else {
          video.pause();
          if (btn) btn.innerHTML = '<span class="material-symbols-outlined text-lg" aria-hidden="true">play_circle</span>';
        }
      });
    }
  });

  /* Reproducción diferida: solo los videos visibles consumen datos. */
  var lazyVideos = document.querySelectorAll("video[data-autoplay-on-view]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lazyVideos.length && "IntersectionObserver" in window && !reduceMotion) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          var playPromise = video.play();
          if (playPromise && playPromise.catch) playPromise.catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.35 });
    lazyVideos.forEach(function (video) { videoObserver.observe(video); });
  }

  window.showToast = function (message) {
    var toast = document.getElementById("toast");
    if (!toast) { window.alert(message); return; }
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 4200);
  };
})();
