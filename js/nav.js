/* ==========================================================================
   Navigation shell — injects the shared header/footer partials (so we
   don't hand-maintain nav markup in 6 different HTML files), wires the
   mobile menu, active-link highlighting, and a small generic overlay
   system used by search / bookmarks / quick tools panels.
   ========================================================================== */
(function () {
  function injectPartials() {
    const headerMount = document.querySelector("#site-header-mount");
    const footerMount = document.querySelector("#site-footer-mount");
    if (headerMount && window.CU24Partials) {
      headerMount.innerHTML = window.CU24Partials.headerHTML();
      document.dispatchEvent(new CustomEvent("cu24:content-injected", { detail: headerMount }));
    }
    if (footerMount && window.CU24Partials) {
      footerMount.innerHTML = window.CU24Partials.footerHTML();
      const yearEl = footerMount.querySelector("[data-current-year]");
      if (yearEl) yearEl.textContent = new Date().getFullYear();
      document.dispatchEvent(new CustomEvent("cu24:content-injected", { detail: footerMount }));
    }
  }

  // Maps the current page's path to the nav item it belongs to, since
  // links are now relative (and so vary per page) rather than a fixed
  // absolute string we could match directly.
  function currentNavId() {
    const path = window.location.pathname;
    if (path.indexOf("/pageimpordata/") === -1) return "home";
    if (path.indexOf("/Notes/") !== -1) return "notes";
    if (path.indexOf("/Pyqpaper/") !== -1) return "pyq";
    if (path.indexOf("/Assignment/") !== -1) return "assignment";
    if (path.indexOf("/Experiments/") !== -1) return "experiments";
    if (path.indexOf("/Subjects/") !== -1) return "subjects";
    if (path.indexOf("/Teachers/") !== -1) return "teachers";
    return null;
  }

  function setActiveLink() {
    const id = currentNavId();
    if (!id) return;
    const link = document.querySelector('.nav-links a[data-nav-id="' + id + '"]');
    if (link) link.setAttribute("aria-current", "page");
  }

  function wireMobileMenu() {
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("primaryNav");
    if (!toggle || !links) return;
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      })
    );
  }

  function wireStickyShadow() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 6);
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Generic overlay system (search / bookmarks / quick tools) ---------
  function wireOverlays() {
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-open-overlay]");
      if (opener) {
        const name = opener.getAttribute("data-open-overlay");
        const overlay = document.querySelector('[data-overlay="' + name + '"]');
        if (overlay) {
          overlay.classList.add("is-open");
          document.dispatchEvent(new CustomEvent("cu24:overlay-open", { detail: name }));
          const focusTarget = overlay.querySelector("input, [data-autofocus]");
          if (focusTarget) setTimeout(() => focusTarget.focus(), 30);
        }
        return;
      }
      if (e.target.closest("[data-close-overlay]")) {
        e.target.closest(".overlay")?.classList.remove("is-open");
        return;
      }
      if (e.target.classList.contains("overlay")) {
        e.target.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".overlay.is-open").forEach((o) => o.classList.remove("is-open"));
      }
    });
  }

  function updateBookmarkDot() {
    const dot = document.querySelector("[data-bookmark-dot]");
    if (!dot || !window.CU24Bookmarks) return;
    const has = window.CU24Bookmarks.getAll().length > 0;
    dot.classList.toggle("show", has);
  }

  function wireRevealOnScroll() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
  }

  function init() {
    injectPartials();
    setActiveLink();
    wireMobileMenu();
    wireStickyShadow();
    wireOverlays();
    updateBookmarkDot();
    document.addEventListener("cu24:bookmarks-changed", updateBookmarkDot);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      const input = document.querySelector(".header-search-desktop [data-search-input]");
      if (input) {
        e.preventDefault();
        input.focus();
      }
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    init();
    wireRevealOnScroll();
  });
})();
