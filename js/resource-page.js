/* ==========================================================================
   Resource page logic — shared by Notes / PYQs / Assignments / Practicals.
   Renders the semester grid straight from data.js so all four pages stay
   in sync automatically instead of hand-editing four HTML files.
   ========================================================================== */
(function () {
  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function highlight(text, query) {
    if (!query) return escapeHtml(text);
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    return (
      escapeHtml(text.slice(0, idx)) +
      "<mark>" + escapeHtml(text.slice(idx, idx + query.length)) + "</mark>" +
      escapeHtml(text.slice(idx + query.length))
    );
  }

  function bookmarkSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>';
  }

  function renderCard(rt, sem, subjects, query, semLabel) {
    const link = rt.links[sem];
    const isLive = link.status === "live";
    const subjectsHtml = subjects.map((s) => highlight(s, query)).join(" · ");
    const bookmarkId = rt.id + "-sem" + sem;

    const actions = isLive
      ? '<a class="btn btn-primary btn-sm" href="' + link.url + '" target="_blank" rel="noopener" ' +
        'data-track-recent data-recent-id="' + bookmarkId + '" data-recent-title="' + rt.label + ' — Semester ' + semLabel + '" ' +
        'data-recent-sub="' + rt.label + '" data-recent-icon="' + rt.icon + '">Open Folder</a>' +
        '<button class="sem-bookmark" data-bookmark data-bookmark-id="' + bookmarkId + '" ' +
        'data-bookmark-title="' + rt.label + ' — Semester ' + semLabel + '" data-bookmark-sub="' + rt.label + '" ' +
        'data-bookmark-icon="' + rt.icon + '" data-bookmark-url="' + link.url + '" aria-label="Bookmark" aria-pressed="false">' + bookmarkSvg() + "</button>"
      : '<button class="btn btn-secondary btn-sm" disabled>Not uploaded yet</button>';

    return (
      '<div class="card sem-card" data-sem="' + sem + '" data-status="' + link.status + '">' +
      '<div class="sem-card-top"><h3>Semester ' + semLabel + "</h3>" +
      '<span class="badge ' + (isLive ? "badge-new" : "badge-soon") + '">' + (isLive ? "Available" : "Coming soon") + "</span>" +
      "</div>" +
      '<div class="sem-subjects">' + subjectsHtml + "</div>" +
      '<div class="sem-card-actions">' + actions + "</div>" +
      "</div>"
    );
  }

  function render(grid, query) {
    const resourceId = grid.getAttribute("data-resource-type");
    const rt = window.CU24Data.RESOURCE_TYPES.find((r) => r.id === resourceId);
    if (!rt) return;
    const { SUBJECTS_BY_SEM, SEM_LABELS } = window.CU24Data;
    const q = (query || "").trim().toLowerCase();

    const cardsHtml = Object.keys(rt.links)
      .map((sem) => {
        const subjects = SUBJECTS_BY_SEM[sem] || [];
        const matches = !q || subjects.some((s) => s.toLowerCase().includes(q));
        return { sem, html: renderCard(rt, sem, subjects, query, SEM_LABELS[sem]), matches };
      })
      .filter((c) => matches_or_visible(c))
      .map((c) => c.html)
      .join("");

    function matches_or_visible(c) {
      return c.matches;
    }

    grid.innerHTML = cardsHtml ||
      '<div class="state-block" style="grid-column: 1 / -1;">' +
      '<span class="state-icon">🔍</span><h3>No semesters match “' + escapeHtml(query) + '”</h3>' +
      "<p>Try a different subject name, or clear the search to see everything.</p></div>";

    document.dispatchEvent(new CustomEvent("cu24:content-injected", { detail: grid }));
  }

  function applySemFilter(grid, activeSem) {
    grid.querySelectorAll(".sem-card").forEach((card) => {
      const show = activeSem === "all" || card.getAttribute("data-sem") === activeSem;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function init() {
    const grid = document.querySelector("[data-sem-grid]");
    if (!grid) return;
    render(grid, "");

    const filterInput = document.querySelector("[data-subject-filter]");
    const chipRow = document.querySelector("[data-sem-chips]");
    let activeSem = "all";

    if (filterInput) {
      let debounceTimer;
      filterInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          render(grid, filterInput.value);
          applySemFilter(grid, activeSem);
        }, 120);
      });
    }

    if (chipRow) {
      chipRow.addEventListener("click", (e) => {
        const chip = e.target.closest(".chip");
        if (!chip) return;
        chipRow.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        activeSem = chip.getAttribute("data-sem");
        applySemFilter(grid, activeSem);
      });

      // Deep link support: /Notes.html#sem3 highlights just Semester 3
      const hashMatch = window.location.hash.match(/^#sem(\d)$/);
      if (hashMatch) {
        const sem = hashMatch[1];
        const targetChip = chipRow.querySelector('.chip[data-sem="' + sem + '"]');
        if (targetChip) {
          chipRow.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
          targetChip.setAttribute("aria-pressed", "true");
          activeSem = sem;
          applySemFilter(grid, activeSem);
          setTimeout(() => grid.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
        }
      }
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
