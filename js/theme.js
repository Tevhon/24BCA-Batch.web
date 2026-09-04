/* ==========================================================================
   Theme (light/dark) — persisted in localStorage, applied before paint
   to avoid a flash of the wrong theme.
   ========================================================================== */
(function () {
  const STORAGE_KEY = "cu24bca:theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme === "dark" || theme === "light") {
      document.documentElement.setAttribute("data-theme", theme);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document
      .querySelectorAll("[data-theme-toggle]")
      .forEach((btn) => {
        const current = theme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        btn.setAttribute("aria-pressed", String(current === "dark"));
        btn.setAttribute(
          "aria-label",
          current === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
      });
  }

  // Apply immediately (this script is loaded early / synchronously in <head>)
  applyTheme(getStoredTheme());

  window.CU24Theme = {
    toggle() {
      const current =
        document.documentElement.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* storage unavailable — theme just won't persist, still applies */
      }
      applyTheme(next);
    },
    apply: applyTheme,
  };

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (btn) window.CU24Theme.toggle();
  });
})();
