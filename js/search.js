/* ==========================================================================
   Smart search — matches subject names, resource types and semesters
   against the real resource links in data.js. No backend required.

   Markup contract, wraps any instance of:
     <div class="search-shell">
       <div class="search-box"><input data-search-input></div>
       <div class="search-panel" data-search-panel></div>
     </div>
   ========================================================================== */
(function () {
  const RECENT_KEY = "cu24bca:recent-searches";
  const MAX_RECENT = 5;

  function buildIndex() {
    const { RESOURCE_TYPES, SUBJECTS_BY_SEM, SEM_LABELS } = window.CU24Data;
    const idx = [];
    RESOURCE_TYPES.forEach((rt) => {
      Object.keys(rt.links).forEach((sem) => {
        const link = rt.links[sem];
        const subjects = SUBJECTS_BY_SEM[sem] || [];
        idx.push({
          id: rt.id + "-sem" + sem,
          title: rt.label + " — Semester " + SEM_LABELS[sem],
          sub: link.status === "live" ? "Available now" : "Coming soon",
          icon: rt.icon,
          status: link.status,
          directUrl: link.status === "live" ? link.url : null,
          pageUrl: rt.pageUrl + "#sem" + sem,
          keywords: (rt.label + " " + rt.id + " semester " + sem + " sem " + sem + " " + subjects.join(" ")).toLowerCase(),
        });
      });
    });
    // Subjects & Curriculum reference (one entry per semester)
    Object.keys(SUBJECTS_BY_SEM).forEach((sem) => {
      const subjects = SUBJECTS_BY_SEM[sem];
      idx.push({
        id: "subjects-sem" + sem,
        title: "Subjects — Semester " + SEM_LABELS[sem],
        sub: "Curriculum reference",
        icon: "🗂️",
        status: "live",
        directUrl: null,
        pageUrl: "pageimpordata/Subjects/Subjects.html#sem" + sem,
        keywords: ("subjects curriculum syllabus semester " + sem + " sem " + sem + " " + subjects.join(" ")).toLowerCase(),
      });
    });
    return idx;
  }

  let INDEX = null;
  function getIndex() {
    if (!INDEX) INDEX = buildIndex();
    return INDEX;
  }

  function getRecent() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function pushRecent(term) {
    if (!term.trim()) return;
    let list = getRecent().filter((t) => t.toLowerCase() !== term.toLowerCase());
    list.unshift(term);
    list = list.slice(0, MAX_RECENT);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) {}
  }
  function clearRecent() {
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (e) {}
  }

  function score(entry, query) {
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    if (entry.title.toLowerCase().startsWith(q)) return 100;
    if (entry.title.toLowerCase().includes(q)) return 70;
    if (entry.keywords.includes(q)) return 50;
    // token-level partial match
    const tokens = q.split(/\s+/).filter(Boolean);
    const hits = tokens.filter((t) => entry.keywords.includes(t)).length;
    return hits === tokens.length && tokens.length > 0 ? 30 : 0;
  }

  function search(query) {
    const q = query.trim();
    if (!q) return [];
    return getIndex()
      .map((e) => ({ entry: e, s: score(e, q) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.entry);
  }

  function iconSpan(icon) {
    return '<span class="result-icon">' + icon + "</span>";
  }

  function renderResults(panel, results, query) {
    if (!results.length) {
      panel.innerHTML =
        '<div class="search-empty">No resources found for “' +
        escapeHtml(query) +
        '”.<br>Try a subject name like “DBMS” or “Java”, or a resource type like “PYQ”.</div>';
      return;
    }
    panel.innerHTML =
      '<div class="search-group-label">Results</div>' +
      results
        .map((r, i) => {
          const badge =
            r.status === "soon"
              ? '<span class="badge badge-soon" style="margin-left:6px;">Soon</span>'
              : "";
          const href = r.directUrl || window.cu24Link(r.pageUrl);
          return (
            '<button class="search-result" role="option" data-idx="' +
            i +
            '" data-url="' +
            href +
            '">' +
            iconSpan(r.icon) +
            '<span><span class="result-title">' +
            escapeHtml(r.title) +
            badge +
            '</span><br><span class="result-sub">' +
            escapeHtml(r.sub) +
            "</span></span></button>"
          );
        })
        .join("");
  }

  function renderRecent(panel) {
    const recent = getRecent();
    if (!recent.length) {
      panel.innerHTML =
        '<div class="search-empty">Search subjects like “DBMS”, “Java”, “Data Structures” — or try “PYQ”, “notes”, “assignment”.</div>';
      return;
    }
    panel.innerHTML =
      '<div class="search-recent-row"><span class="search-group-label" style="padding:0;">Recent searches</span>' +
      '<button class="search-clear-recent" data-clear-recent>Clear</button></div>' +
      recent
        .map(
          (t, i) =>
            '<button class="search-result" data-recent-term="' +
            escapeHtml(t) +
            '"><span class="result-icon">🕓</span><span class="result-title">' +
            escapeHtml(t) +
            "</span></button>"
        )
        .join("");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initInstance(shell) {
    const input = shell.querySelector("[data-search-input]");
    const panel = shell.querySelector("[data-search-panel]");
    if (!input || !panel) return;

    let activeIndex = -1;

    function open() {
      panel.classList.add("is-open");
      input.setAttribute("aria-expanded", "true");
    }
    function close() {
      panel.classList.remove("is-open");
      input.setAttribute("aria-expanded", "false");
      activeIndex = -1;
    }
    function showForQuery(q) {
      if (!q.trim()) {
        renderRecent(panel);
      } else {
        renderResults(panel, search(q), q);
      }
      open();
    }

    input.addEventListener("focus", () => showForQuery(input.value));
    input.addEventListener("input", () => showForQuery(input.value));

    input.addEventListener("keydown", (e) => {
      const items = Array.from(panel.querySelectorAll(".search-result"));
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle("is-active", i === activeIndex));
        items[activeIndex] && items[activeIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach((it, i) => it.classList.toggle("is-active", i === activeIndex));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex > -1 && items[activeIndex]) {
          items[activeIndex].click();
        } else if (input.value.trim()) {
          pushRecent(input.value.trim());
          showForQuery(input.value);
        }
      } else if (e.key === "Escape") {
        close();
        input.blur();
      }
    });

    panel.addEventListener("click", (e) => {
      const resultBtn = e.target.closest(".search-result[data-url]");
      const recentBtn = e.target.closest("[data-recent-term]");
      const clearBtn = e.target.closest("[data-clear-recent]");
      if (resultBtn) {
        pushRecent(input.value.trim() || resultBtn.querySelector(".result-title").textContent);
        window.location.href = resultBtn.getAttribute("data-url");
      } else if (recentBtn) {
        input.value = recentBtn.getAttribute("data-recent-term");
        showForQuery(input.value);
      } else if (clearBtn) {
        clearRecent();
        renderRecent(panel);
      }
    });

    document.addEventListener("click", (e) => {
      if (!shell.contains(e.target)) close();
    });
  }

  function init() {
    document.querySelectorAll(".search-shell").forEach(initInstance);
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("cu24:content-injected", init);
  window.CU24Search = { search, init };
})();
