/* ==========================================================================
   Homepage logic — hero typewriter, announcements, quick links, and live
   resource counts pulled from data.js (no hardcoded "X resources" claims).
   ========================================================================== */
(function () {
  // ---- Lightweight typewriter (replaces the old typed.js dependency) -----
  function initTypewriter() {
    const el = document.querySelector("[data-typewriter]");
    if (!el) return;
    const words = ["Notes", "Assignments", "PYQ Papers", "Teachers Info", "Lab Files"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = words[wordIndex];
      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        charIndex--;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(tick, deleting ? 40 : 85);
    }
    tick();
  }

  // ---- Notices (Daily Updates) ----------------------------------------------
  function renderNotices() {
    const container = document.querySelector("[data-notices]");
    if (!container || !window.CU24Data) return;
    const items = window.CU24Data.NOTICES;
    if (!items.length) {
      container.innerHTML =
        '<div class="state-block"><span class="state-icon">📭</span><h3>No notices right now</h3><p>Check back soon.</p></div>';
      return;
    }
    container.innerHTML = items
      .map((a) => {
        const date = new Date(a.date);
        const dateStr = date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
        return (
          '<div class="card notice-card reveal">' +
          '<div class="notice-top">' +
          '<span class="notice-icon">' + a.icon + "</span>" +
          '<span class="notice-badge badge-' + a.type + '">' + a.type + "</span>" +
          '<time class="notice-date">' + dateStr + "</time>" +
          "</div>" +
          "<h3>" + a.title + "</h3>" +
          "<p>" + a.body + "</p>" +
          "</div>"
        );
      })
      .join("");
    // newly injected .reveal elements need observing
    document.dispatchEvent(new CustomEvent("cu24:content-injected", { detail: container }));
    container.querySelectorAll(".reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), i * 60);
    });
  }

  // ---- Quick links ------------------------------------------------------------
  function renderQuickLinks() {
    const container = document.querySelector("[data-quicklinks]");
    if (!container || !window.CU24Data) return;
    container.innerHTML = window.CU24Data.QUICK_LINKS.map(
      (q) =>
        '<a class="card card-hover quicklink-card" href="' + q.url + '" target="_blank" rel="noopener">' +
        '<span class="quicklink-icon">' + q.icon + "</span>" +
        "<span>" + q.label + '<br><span style="font-weight:500; color:var(--color-text-muted); font-size:var(--fs-xs);">' + q.description + "</span></span>" +
        '<svg class="ext" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' +
        "</a>"
    ).join("");
  }

  // ---- Live resource counts on dashboard cards --------------------------------
  function renderResourceCounts() {
    if (!window.CU24Data) return;
    window.CU24Data.RESOURCE_TYPES.forEach((rt) => {
      const el = document.querySelector('[data-count-for="' + rt.id + '"]');
      if (!el) return;
      const liveCount = Object.values(rt.links).filter((l) => l.status === "live").length;
      el.textContent = liveCount + (liveCount === 1 ? " semester available" : " semesters available");
    });
  }

  // ---- Recently viewed / continue learning strip -------------------------------
  function renderRecents() {
    const section = document.querySelector("[data-recents-section]");
    const container = document.querySelector("[data-recents]");
    if (!container || !window.CU24Recents) return;
    const items = window.CU24Recents.getAll();
    if (!items.length) {
      if (section) section.style.display = "none";
      return;
    }
    if (section) section.style.display = "";
    container.innerHTML = items
      .slice(0, 6)
      .map(
        (r) =>
          '<a class="card card-hover quicklink-card" href="' + window.cu24Link(r.url) + '" target="_blank" rel="noopener">' +
          '<span class="quicklink-icon">' + r.icon + "</span><span>" + r.title + "</span></a>"
      )
      .join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTypewriter();
    renderNotices();
    renderQuickLinks();
    renderResourceCounts();
    renderRecents();
  });
})();
