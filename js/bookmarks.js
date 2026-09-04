/* ==========================================================================
   Bookmarks — save resources for quick access later. Stored in
   localStorage so it works without any backend.
   Any button can opt in with:
     <button data-bookmark
             data-bookmark-id="notes-sem1"
             data-bookmark-title="Notes — Semester 1st"
             data-bookmark-sub="Notes"
             data-bookmark-icon="📚"
             data-bookmark-url="https://...">
   ========================================================================== */
(function () {
  const KEY = "cu24bca:bookmarks";

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch (e) {
      /* storage unavailable (private mode / quota) — fail silently */
    }
    document.dispatchEvent(new CustomEvent("cu24:bookmarks-changed", { detail: list }));
  }

  function isBookmarked(id) {
    return getAll().some((b) => b.id === id);
  }

  function toggle(item) {
    const list = getAll();
    const idx = list.findIndex((b) => b.id === item.id);
    let added;
    if (idx > -1) {
      list.splice(idx, 1);
      added = false;
    } else {
      list.unshift(Object.assign({ addedAt: Date.now() }, item));
      added = true;
    }
    save(list);
    return added;
  }

  function remove(id) {
    save(getAll().filter((b) => b.id !== id));
  }

  function clear() {
    save([]);
  }

  window.CU24Bookmarks = { getAll, isBookmarked, toggle, remove, clear };

  function syncButtonState(btn) {
    const id = btn.getAttribute("data-bookmark-id");
    btn.setAttribute("aria-pressed", String(isBookmarked(id)));
  }

  function initButtons(scope) {
    (scope || document).querySelectorAll("[data-bookmark]").forEach((btn) => {
      syncButtonState(btn);
      if (btn.dataset.bookmarkBound) return;
      btn.dataset.bookmarkBound = "true";
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const item = {
          id: btn.getAttribute("data-bookmark-id"),
          title: btn.getAttribute("data-bookmark-title") || "",
          sub: btn.getAttribute("data-bookmark-sub") || "",
          icon: btn.getAttribute("data-bookmark-icon") || "📌",
          url: btn.getAttribute("data-bookmark-url") || "#",
        };
        const added = toggle(item);
        syncButtonState(btn);
        btn.classList.remove("pop");
        void btn.offsetWidth;
        btn.classList.add("pop");
        if (window.CU24Toast) {
          window.CU24Toast.show(
            added ? "Saved to bookmarks" : "Removed from bookmarks",
            { type: added ? "success" : "info" }
          );
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => initButtons(document));
  document.addEventListener("cu24:content-injected", (e) => initButtons(e.detail));
  window.CU24Bookmarks.initButtons = initButtons;

  // ---- Renders the list inside the bookmarks overlay ---------------------
  function renderList() {
    const container = document.querySelector("[data-bookmarks-list]");
    if (!container) return;
    const items = getAll();
    if (!items.length) {
      container.innerHTML =
        '<div class="state-block" style="padding: var(--space-6) var(--space-2);">' +
        '<span class="state-icon">🔖</span>' +
        "<h3>You haven't bookmarked anything yet</h3>" +
        "<p>Tap the bookmark icon on any resource card to save it here for quick access.</p>" +
        "</div>";
      return;
    }
    container.innerHTML = items
      .map(
        (b) =>
          '<div class="search-result" style="cursor:default;">' +
          '<a href="' + window.cu24Link(b.url) + '" target="_blank" rel="noopener" style="display:flex; align-items:center; gap: var(--space-3); flex-grow:1; min-width:0;">' +
          '<span class="result-icon">' + b.icon + "</span>" +
          '<span style="min-width:0;"><span class="result-title">' + b.title + '</span><br><span class="result-sub">' + b.sub + "</span></span>" +
          "</a>" +
          '<button class="icon-btn btn-sm" data-remove-bookmark="' + b.id + '" aria-label="Remove bookmark" style="width:30px;height:30px;flex-shrink:0;">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
          "</button></div>"
      )
      .join("");
  }

  document.addEventListener("cu24:overlay-open", (e) => {
    if (e.detail === "bookmarks") renderList();
  });
  document.addEventListener("cu24:bookmarks-changed", renderList);
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-bookmark]");
    if (btn) remove(btn.getAttribute("data-remove-bookmark"));
  });
})();
