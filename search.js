// ===== Site Search widget =====
// Edit SEARCH_DATA any time you add a new page/section.
// "url" values here are relative to index.html at the repo root.

const SEARCH_DATA = [
  { title: "PYQ Papers", desc: "Previous year question papers, subject-wise", icon: "fa-file-lines", url: "./pageimpordata/Pyqpaper/Pyqp.html" },
  { title: "Notes", desc: "Semester notes for all BCA subjects", icon: "fa-book", url: "./pageimpordata/Notes/Notes.html" },
  { title: "Experiments", desc: "Lab experiments and practicals", icon: "fa-flask", url: "./pageimpordata/Experiments/Experiments.html" },
  { title: "Assignments", desc: "Assignment questions and submissions", icon: "fa-pen-to-square", url: "./pageimpordata/Assignment/Assignment.html" },
  { title: "SGPA / CGPA Calculator", desc: "Calculate your semester and cumulative GPA", icon: "fa-calculator", url: "./pageimpordata/Calculator/Calculator.html" },
  { title: "About", desc: "About this site and who built it", icon: "fa-circle-info", url: "./pageimpordata/About/About.html" },
  { title: "Community", desc: "Join the 24-BCA WhatsApp community", icon: "fa-people-group", url: "./index.html#community" },
  { title: "Coders Community", desc: "WhatsApp group for coders across colleges", icon: "fa-code", url: "./index.html#community" },
  { title: "Feedback", desc: "Send feedback to the site admin", icon: "fa-comment-dots", url: "./index.html#FEEDBACK" },
  { title: "Teachers Info", desc: "Faculty contact and details", icon: "fa-chalkboard-user", url: "./error.html" },
  { title: "Courses", desc: "Course structure and details", icon: "fa-graduation-cap", url: "./error.html" },
];

(function () {
  const overlay = document.getElementById("siteSearchOverlay");
  const input = document.getElementById("siteSearchInput");
  const resultsEl = document.getElementById("siteSearchResults");
  const openBtn = document.getElementById("siteSearchBtn");
  const closeBtn = document.getElementById("siteSearchClose");

  if (!overlay || !input || !resultsEl || !openBtn) return;

  let activeIndex = -1;
  let currentResults = [];

  function render(list) {
    currentResults = list;
    activeIndex = -1;
    if (list.length === 0) {
      resultsEl.innerHTML = `<div id="siteSearchEmpty">No matches. Try "notes", "pyq", "sgpa"...</div>`;
      return;
    }
    resultsEl.innerHTML = list
      .map(
        (item, i) => `
        <a class="siteSearchItem" data-index="${i}" href="${item.url}">
          <i class="fa-solid ${item.icon}"></i>
          <div>
            <div class="ssTitle">${item.title}</div>
            <div class="ssDesc">${item.desc}</div>
          </div>
        </a>`
      )
      .join("");
  }

  function filter(query) {
    const q = query.trim().toLowerCase();
    if (!q) return render(SEARCH_DATA);
    const filtered = SEARCH_DATA.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
    );
    render(filtered);
  }

  function openSearch() {
    overlay.classList.add("open");
    input.value = "";
    render(SEARCH_DATA);
    setTimeout(() => input.focus(), 50);
  }

  function closeSearch() {
    overlay.classList.remove("open");
  }

  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    openSearch();
  });
  closeBtn.addEventListener("click", closeSearch);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeSearch();
  });

  input.addEventListener("input", (e) => filter(e.target.value));

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    }
    if (!overlay.classList.contains("open")) return;

    if (e.key === "Escape") closeSearch();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentResults.length - 1);
      highlight();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      highlight();
    }
    if (e.key === "Enter" && activeIndex >= 0 && currentResults[activeIndex]) {
      window.location.href = currentResults[activeIndex].url;
    }
  });

  function highlight() {
    document.querySelectorAll(".siteSearchItem").forEach((el, i) => {
      el.classList.toggle("active", i === activeIndex);
    });
  }
})();
