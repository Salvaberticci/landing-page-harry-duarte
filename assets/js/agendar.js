(function () {
  "use strict";

  var WHATSAPP_NUMBER = "584120537930";
  var STUDIO_NAME = "Harry Duarte Atelier";
  var form = document.getElementById("appointmentForm");
  if (!form) return;

  var currentStep = 1;
  var maxStep = 1;
  var selectedDate = null;
  var files = [];

  var summaryMap = {
    project_type: "summaryProject",
    placement: "summaryPlacement",
    scale: "summaryScale",
    shift: "summaryShift"
  };

  /* ---------------- Resumen en vivo ---------------- */
  function checkedOf(name) {
    return form.querySelector('input[name="' + name + '"]:checked');
  }

  function syncSummary() {
    Object.keys(summaryMap).forEach(function (name) {
      var input = checkedOf(name);
      var el = document.getElementById(summaryMap[name]);
      if (input && el && input.dataset.label) el.textContent = input.dataset.label;
    });
  }

  form.addEventListener("change", function (e) {
    if (e.target && e.target.name && summaryMap[e.target.name]) syncSummary();
  });

  /* ---------------- Errores ---------------- */
  function setError(field, show) {
    var input = document.getElementById(field);
    var error = document.getElementById("error-" + field);
    if (input) input.classList.toggle("is-invalid", !!show);
    if (error) error.classList.toggle("is-visible", !!show);
  }

  /* ---------------- Pasos ---------------- */
  function showStep(step) {
    for (var i = 1; i <= 4; i++) {
      var pane = document.getElementById("step-" + i);
      if (!pane) continue;
      pane.classList.toggle("hidden", i !== step);
      pane.classList.toggle("flex", i === step);
    }
    document.querySelectorAll("[data-step-indicator]").forEach(function (tab) {
      var n = parseInt(tab.getAttribute("data-step-indicator"), 10);
      var active = n === step;
      var done = n < step;
      tab.classList.toggle("neu-pressed", active);
      tab.classList.toggle("neu-flat", !active);
      tab.classList.toggle("text-white", active);
      tab.classList.toggle("text-muted", !active);
      tab.classList.toggle("hover:text-white", !active);
      tab.setAttribute("aria-current", active ? "step" : "false");
      var label = tab.querySelector("p:first-child");
      if (label) label.style.opacity = done && !active ? "0.75" : (active ? "0.7" : "0.75");
    });
    currentStep = step;
  }

  function validateStep(n) {
    if (n === 2) {
      var concept = document.getElementById("conceptDescription");
      var ok = concept && concept.value.trim().length >= 15;
      if (concept) concept.classList.toggle("is-invalid", !ok);
      var errConcept = document.getElementById("error-concept");
      if (errConcept) errConcept.classList.toggle("is-visible", !ok);
      if (!ok) {
        if (window.showToast) window.showToast("Describe tu idea con al menos 15 caracteres para continuar.");
        if (concept) concept.focus();
        return false;
      }
    }
    if (n === 3) {
      var errDate = document.getElementById("error-date");
      if (!selectedDate) {
        if (errDate) errDate.classList.add("is-visible");
        if (window.showToast) window.showToast("Selecciona una fecha disponible en el calendario.");
        return false;
      }
      if (errDate) errDate.classList.remove("is-visible");
    }
    if (n === 4) {
      var name = document.getElementById("clientName");
      var phone = document.getElementById("clientPhone");
      var policy = document.getElementById("policyAgreement");
      var okName = name && name.value.trim().length >= 3;
      var digits = phone ? (phone.value.replace(/\D/g, "")) : "";
      var okPhone = digits.length >= 7;
      var okPolicy = policy && policy.checked;

      setError("clientName", !okName);
      setError("clientPhone", !okPhone);
      var errPolicy = document.getElementById("error-policy");
      if (errPolicy) errPolicy.classList.toggle("is-visible", !okPolicy);

      if (!okName || !okPhone || !okPolicy) {
        if (window.showToast) window.showToast("Revisa los datos marcados: nombre, WhatsApp y aceptación de políticas.");
        var first = !okName ? name : (!okPhone ? phone : policy);
        if (first) first.focus();
        return false;
      }
    }
    return true;
  }

  function goToStep(step) {
    if (step > currentStep && !validateStep(currentStep)) return;
    if (step > maxStep) maxStep = step;
    showStep(step);
    var track = document.getElementById("progressTrack");
    if (track) track.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () { goToStep(parseInt(btn.getAttribute("data-next"), 10)); });
  });
  document.querySelectorAll("[data-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () { goToStep(parseInt(btn.getAttribute("data-prev"), 10)); });
  });
  document.querySelectorAll("[data-step-indicator]").forEach(function (tab) {
    tab.addEventListener("click", function () { goToStep(parseInt(tab.getAttribute("data-step-indicator"), 10)); });
  });

  /* ---------------- Calendario ---------------- */
  var MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  var DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var view = new Date(today.getFullYear(), today.getMonth(), 1);
  var maxView = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  function statusOf(date) {
    if (date < today) return "past";
    var dow = date.getDay();
    if (dow === 0 || dow === 1) return "closed";
    if ((date.getDate() * 7 + date.getMonth() * 3) % 11 === 0) return "full";
    return "available";
  }

  function formatLong(date) {
    var s = DAY_NAMES[date.getDay()] + " " + date.getDate() + " de " + MONTHS[date.getMonth()].toLowerCase() + " de " + date.getFullYear();
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function selectDate(date) {
    selectedDate = date;
    var display = document.getElementById("selectedDateDisplay");
    var summary = document.getElementById("summaryDate");
    var text = formatLong(date);
    if (display) display.textContent = text;
    if (summary) summary.textContent = text;
    var errDate = document.getElementById("error-date");
    if (errDate) errDate.classList.remove("is-visible");
    renderCalendar();
  }

  function renderCalendar() {
    var grid = document.getElementById("calendarDays");
    var title = document.getElementById("calendarTitle");
    if (!grid) return;
    if (title) title.textContent = MONTHS[view.getMonth()] + " " + view.getFullYear();
    grid.innerHTML = "";

    var offset = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
    for (var i = 0; i < offset; i++) {
      var spacer = document.createElement("div");
      grid.appendChild(spacer);
    }

    var totalDays = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var d = 1; d <= totalDays; d++) {
      var date = new Date(view.getFullYear(), view.getMonth(), d);
      var status = statusOf(date);

      if (status === "available") {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = d < 10 ? "0" + d : String(d);
        var isSel = sameDay(date, selectedDate);
        btn.className = isSel
          ? "p-3 rounded-xl text-center text-sm text-white neu-pressed font-bold border border-white/10 transition-colors"
          : "p-3 rounded-xl text-center text-sm text-white neu-flat hover:border hover:border-white/10 transition-colors";
        btn.setAttribute("aria-label", formatLong(date));
        if (isSel) btn.setAttribute("aria-pressed", "true");
        (function (dt) {
          btn.addEventListener("click", function () { selectDate(dt); });
        })(date);
        grid.appendChild(btn);
      } else {
        var span = document.createElement("div");
        span.textContent = d < 10 ? "0" + d : String(d);
        span.className = "p-3 rounded-xl text-center text-sm neu-inset opacity-40 cursor-not-allowed select-none";
        span.title = status === "past" ? "Fecha pasada" : (status === "closed" ? "Atelier cerrado" : "Sin cupo");
        grid.appendChild(span);
      }
    }

    var prev = document.getElementById("calPrev");
    var next = document.getElementById("calNext");
    if (prev) prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
    if (next) next.disabled = view >= maxView;
  }

  var calPrev = document.getElementById("calPrev");
  var calNext = document.getElementById("calNext");
  if (calPrev) calPrev.addEventListener("click", function () {
    if (view <= new Date(today.getFullYear(), today.getMonth(), 1)) return;
    view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
    renderCalendar();
  });
  if (calNext) calNext.addEventListener("click", function () {
    if (view >= maxView) return;
    view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    renderCalendar();
  });

  function firstAvailable() {
    var probe = new Date(today);
    for (var i = 0; i < 70; i++) {
      if (statusOf(probe) === "available") return new Date(probe);
      probe.setDate(probe.getDate() + 1);
    }
    return null;
  }

  renderCalendar();
  var initialDate = firstAvailable();
  if (initialDate) selectDate(initialDate);

  /* ---------------- Archivos ---------------- */
  var dropzone = document.getElementById("dropzoneBox");
  var fileInput = document.getElementById("fileUploadInput");
  var fileList = document.getElementById("fileUploadList");

  function renderFiles() {
    if (!fileList) return;
    fileList.innerHTML = "";
    files.forEach(function (f, idx) {
      var row = document.createElement("div");
      row.className = "neu-flat rounded-xl p-2 px-3 flex items-center justify-between gap-3 border border-white/[0.03]";
      row.innerHTML =
        '<span class="text-xs text-muted truncate max-w-[60%]"></span>' +
        '<span class="text-[10px] uppercase text-outline shrink-0"></span>' +
        '<button type="button" class="neu-button rounded-full w-7 h-7 grid place-items-center text-muted hover:text-white shrink-0" aria-label="Quitar archivo">' +
        '<span class="material-symbols-outlined text-sm">close</span></button>';
      row.children[0].textContent = f.name;
      row.children[1].textContent = (f.size / 1024 / 1024).toFixed(1) + " MB";
      row.querySelector("button").addEventListener("click", function () {
        files.splice(idx, 1);
        renderFiles();
      });
      fileList.appendChild(row);
    });
  }

  function addFiles(list) {
    var incoming = Array.prototype.slice.call(list || []);
    var rejected = 0;
    incoming.forEach(function (f) {
      if (files.length >= 5) { rejected++; return; }
      if (f.size > 15 * 1024 * 1024) { rejected++; return; }
      files.push(f);
    });
    renderFiles();
    if (rejected && window.showToast) window.showToast("Se omitieron archivos: máximo 5 archivos de 15 MB c/u.");
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", function () { fileInput.click(); });
    fileInput.addEventListener("change", function (e) { addFiles(e.target.files); fileInput.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) {
      dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.add("neu-pressed"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      dropzone.addEventListener(ev, function (e) { e.preventDefault(); dropzone.classList.remove("neu-pressed"); });
    });
    dropzone.addEventListener("drop", function (e) {
      if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
    });
  }

  /* ---------------- Envío ---------------- */
  function valueOf(id) {
    var el = document.getElementById(id);
    if (!el) return "";
    if (typeof el.value === "string") return el.value.trim();
    return (el.textContent || "").trim();
  }

  function buildMessage(folio) {
    var lines = [
      "*Solicitud de cita — " + STUDIO_NAME + "*",
      "Folio: " + folio,
      "",
      "Tipo de obra: " + valueOf("summaryProject"),
      "Ubicación: " + valueOf("summaryPlacement"),
      "Escala: " + valueOf("summaryScale"),
      "Artista: " + valueOf("summaryArtist"),
      "Fecha: " + valueOf("summaryDate"),
      "Turno: " + valueOf("summaryShift"),
      "",
      "Concepto: " + valueOf("conceptDescription"),
      "",
      "Nombre: " + valueOf("clientName"),
      "WhatsApp: " + valueOf("clientPhone")
    ];
    var ig = valueOf("clientInstagram");
    if (ig) lines.push("Instagram: " + ig);
    var med = valueOf("medicalNotes");
    if (med) lines.push("Consideraciones dérmicas: " + med);
    if (files.length) lines.push("Referencias adjuntas: " + files.map(function (f) { return f.name; }).join(", "));
    lines.push("");
    lines.push("Anticipo de reserva: $1,500 MXN");
    lines.push("Políticas del atelier aceptadas.");
    return lines.join("\n");
  }

  function newFolio() {
    var n = Math.floor(1000 + Math.random() * 9000);
    return "HD-" + n;
  }

  function saveLocal(folio, message) {
    try {
      var key = "hd_bookings";
      var all = JSON.parse(localStorage.getItem(key) || "[]");
      all.push({ folio: folio, createdAt: new Date().toISOString(), message: message });
      localStorage.setItem(key, JSON.stringify(all.slice(-20)));
    } catch (err) { /* almacenamiento no disponible */ }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    for (var i = 1; i <= 4; i++) {
      if (!validateStep(i)) {
        goToStep(i);
        return;
      }
    }

    var folio = newFolio();
    var message = buildMessage(folio);
    saveLocal(folio, message);

    var modal = document.getElementById("confirmationModal");
    var folioEl = document.getElementById("folioNumber");
    var summaryEl = document.getElementById("confirmationSummary");
    var waEl = document.getElementById("whatsappSend");

    if (folioEl) folioEl.textContent = "#" + folio;
    if (summaryEl) summaryEl.textContent = message;
    if (waEl) waEl.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
    if (modal) {
      modal.classList.add("is-open");
      document.body.classList.add("no-scroll");
    }
  });

  var closeBtn = document.getElementById("closeConfirmation");
  if (closeBtn) closeBtn.addEventListener("click", function () {
    var modal = document.getElementById("confirmationModal");
    if (modal) modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  });

  var modalEl = document.getElementById("confirmationModal");
  if (modalEl) modalEl.addEventListener("click", function (e) {
    if (e.target === modalEl) {
      modalEl.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  });

  var copyBtn = document.getElementById("copyRequest");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var summary = document.getElementById("confirmationSummary");
    var text = summary ? summary.textContent : "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        if (window.showToast) window.showToast("Solicitud copiada al portapapeles.");
      }, function () {
        if (window.showToast) window.showToast("No se pudo copiar. Selecciona el texto manualmente.");
      });
    } else if (window.showToast) {
      window.showToast("Tu navegador no permite copiar automáticamente.");
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalEl && modalEl.classList.contains("is-open")) {
      modalEl.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
    }
  });

  /* ---------------- Prefill desde otras páginas ---------------- */
  var params = new URLSearchParams(window.location.search);

  var tipo = params.get("tipo");
  if (tipo) {
    var typeInput = form.querySelector('input[name="project_type"][value="' + tipo + '"]');
    if (typeInput) typeInput.checked = true;
  }

  var pieza = params.get("pieza");
  if (pieza) {
    var concept = document.getElementById("conceptDescription");
    if (concept && !concept.value) {
      concept.value = "Proyecto inspirado en: " + pieza + ". Quiero conversar sobre una pieza original.";
    }
  }

  syncSummary();
  showStep(1);
})();
