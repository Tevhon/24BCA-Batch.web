/* ==========================================================================
   Recently viewed — tracks the last resources a student opened, so
   "Continue where you left off" can show something useful.
   Call CU24Recents.record({id,title,sub,icon,url}) when a resource link
   is opened. Automatically wired to any element with [data-track-recent].
   ========================================================================== */
(function () {
  const KEY = "cu24bca:recents";
  const MAX_ITEMS = 8;

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function record(item) {
    if (!item || !item.id) return;
    let list = getAll().filter((r) => r.id !== item.id);
    list.unshift(Object.assign({ viewedAt: Date.now() }, item));
    list = list.slice(0, MAX_ITEMS);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore */
    }
  }

  function clear() {
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      /* ignore */
    }
  }

  window.CU24Recents = { getAll, record, clear };

  function initLinks(scope) {
    (scope || document).querySelectorAll("[data-track-recent]").forEach((el) => {
      if (el.dataset.recentBound) return;
      el.dataset.recentBound = "true";
      el.addEventListener("click", () => {
        record({
          id: el.getAttribute("data-recent-id"),
          title: el.getAttribute("data-recent-title") || "",
          sub: el.getAttribute("data-recent-sub") || "",
          icon: el.getAttribute("data-recent-icon") || "📌",
          url: el.getAttribute("href") || el.getAttribute("data-recent-url") || "#",
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => initLinks(document));
  document.addEventListener("cu24:content-injected", (e) => initLinks(e.detail));
  window.CU24Recents.initLinks = initLinks;
})();
