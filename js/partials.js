/* ==========================================================================
   Shared header + footer markup, as JS templates instead of fetched HTML
   partials. This avoids fetch()/CORS entirely, which is what breaks when
   the site is opened directly from disk (file://) instead of through a
   server. Requires js/base.js to run first (uses window.CU24_BASE).
   ========================================================================== */
window.CU24Partials = (function () {
  function headerHTML() {
    const b = window.CU24_BASE || "";
    return `
<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="site-header">
  <div class="container navbar">
    <a href="${b}index.html" class="brand" aria-label="CU24BCA — home">
      <img src="${b}Pictures/webLogo.webp" alt="" />
      <span>CU24BCA<small>BCA Student Hub</small></span>
    </a>

   

    <div class="nav-actions">
      <div class="search-shell header-search-desktop">
        <div class="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="search" data-search-input placeholder="Search subjects, PYQs, notes…" aria-label="Search resources" role="combobox" aria-expanded="false" autocomplete="off" />
          <span class="search-kbd">/</span>
        </div>
        <div class="search-panel" data-search-panel role="listbox" aria-label="Search suggestions"></div>
      </div>

      <button class="icon-btn header-search-mobile" data-open-overlay="search" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      </button>

      <button class="icon-btn" data-open-overlay="tools" aria-label="Quick tools — CGPA calculator" title="Quick tools">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="14" x2="8" y2="18" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="16" y1="14" x2="16" y2="18" /><line x1="8" y1="10" x2="16" y2="10" /></svg>
      </button>

      <button class="icon-btn" data-open-overlay="bookmarks" aria-label="Your bookmarks" title="Bookmarks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" /></svg>
        <span class="dot" data-bookmark-dot></span>
      </button>

      <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode" title="Toggle theme">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="4" y1="12" x2="2" y2="12" /><line x1="22" y1="12" x2="20" y2="12" /><line x1="19.07" y1="4.93" x2="17.66" y2="6.34" /><line x1="6.34" y1="17.66" x2="4.93" y2="19.07" /><line x1="19.07" y1="19.07" x2="17.66" y2="17.66" /><line x1="6.34" y1="6.34" x2="4.93" y2="4.93" /></svg>
      </button>

    </div>
  </div>
</header>

<div class="overlay" data-overlay="search">
  <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Search">
    <button class="icon-btn modal-close" data-close-overlay aria-label="Close search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
    <h3 style="margin-bottom: var(--space-4);">Search resources</h3>
    <div class="search-shell">
      <div class="search-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="search" data-search-input placeholder="Try “DBMS”, “Java”, “PYQ”…" aria-label="Search resources" autocomplete="off" />
      </div>
      <div class="search-panel is-open" data-search-panel role="listbox" style="position: static; box-shadow: none; border: none; margin-top: var(--space-3); padding: 0;"></div>
    </div>
  </div>
</div>

<div class="overlay" data-overlay="bookmarks">
  <div class="modal-panel" role="dialog" aria-modal="true" aria-label="Your bookmarks">
    <button class="icon-btn modal-close" data-close-overlay aria-label="Close bookmarks">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
    <h3 style="margin-bottom: var(--space-4);">Your bookmarks</h3>
    <div data-bookmarks-list></div>
  </div>
</div>

<div class="overlay" data-overlay="tools">
  <div class="modal-panel" role="dialog" aria-modal="true" aria-label="CGPA calculator">
    <button class="icon-btn modal-close" data-close-overlay aria-label="Close calculator">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
    </button>
    <h3>CGPA Calculator</h3>
    <p class="field-hint" style="margin-bottom: var(--space-4);">Enter the credits and grade points for each subject exactly as shown on your official CU grade card.</p>
    <div data-cgpa-rows></div>
    <button class="btn btn-secondary btn-sm" type="button" data-cgpa-add style="margin-top: var(--space-2);">+ Add subject</button>
    <div style="display:flex; align-items:center; justify-content:space-between; margin-top: var(--space-5); padding-top: var(--space-4); border-top: 1px solid var(--color-border);">
      <span style="font-weight:700;">Your CGPA</span>
      <span id="cgpaResult" style="font-size: var(--fs-2xl); font-weight:800; color: var(--color-primary);">—</span>
    </div>
  </div>
</div>`;
  }

  function footerHTML() {
    const b = window.CU24_BASE || "";
    return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-brand">
          <img src="${b}Pictures/Chandigarh-University-Logo-400x400-Photoroom.png" alt="" />
          <strong>CU24BCA</strong>
        </div>
        <p class="footer-tagline">Built for students, by students. Notes, PYQs, assignments and lab files for the Chandigarh University 24-Batch BCA students, all in one place.</p>
      </div>

      <div class="footer-col">
        <h4>Explore</h4>
        <ul>
          <li><a href="${b}index.html">Home</a></li>
          <li><a href="${b}pageimpordata/About/About.html">About</a></li>
          <li><a href="${b}pageimpordata/Notes/Notes.html">Notes</a></li>
          <li><a href="${b}pageimpordata/Pyqpaper/Pyqp.html">PYQ Papers</a></li>
          <li><a href="${b}pageimpordata/Assignment/Assignment.html">Assignments</a></li>
          <li><a href="${b}pageimpordata/Experiments/Experiments.html">Practicals</a></li>
          <li><a href="${b}pageimpordata/Subjects/Subjects.html">Subjects</a></li>
          <li><a href="${b}pageimpordata/Teachers/Teachers.html">Teachers</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>University</h4>
        <ul>
          <li><a href="https://uims.cuchd.in/" target="_blank" rel="noopener">CUIMS</a></li>
          <li><a href="https://students.cuchd.in/" target="_blank" rel="noopener">Student Login</a></li>
          <li><a href="https://lms.cuchd.in/login/index.php" target="_blank" rel="noopener">LMS Login</a></li>
          <li><a href="https://www.cuchd.in/student-services/libraries.php" target="_blank" rel="noopener">Library</a></li>
          <li><a href="https://www.cuchd.in/academics/academic-calendar.php" target="_blank" rel="noopener">Academic Calendar</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Built &amp; maintained by</h4>
        <div style="display:flex; align-items:center; gap: var(--space-3); margin-bottom: var(--space-3);">
          <img src="${b}Pictures/devjikaranwall.jpg" alt="" style="width:44px;height:44px;border-radius:50%;object-fit:cover;" />
          <div>
            <strong style="display:block; color:var(--color-text-inverse, #fff);">Deevanshu</strong>
            <span style="font-size:var(--fs-xs); color:#8a93ad;">Web Developer</span>
          </div>
        </div>
        <div class="footer-social">
          <a href="https://www.instagram.com/devji_karanwal/" target="_blank" rel="noopener" aria-label="Personal Instagram"><img src="${b}iconsvg/insta.svg" alt="" /></a>
          <a href="https://x.com/devji_karanwal" target="_blank" rel="noopener" aria-label="X (Twitter)"><img src="${b}iconsvg/X.svg" alt="" /></a>
          <a href="https://www.linkedin.com/in/dev-karanwal/" target="_blank" rel="noopener" aria-label="LinkedIn"><img src="${b}iconsvg/linkedin.svg" alt="" /></a>
          <a href="https://codepen.io/Dev-karanwal" target="_blank" rel="noopener" aria-label="CodePen"><img src="${b}iconsvg/codepen.svg" alt="" /></a>
          <a href="https://github.com/Tevhon" target="_blank" rel="noopener" aria-label="GitHub"><img src="${b}iconsvg/github.svg" alt="" /></a>
        </div>
        <p style="font-size: var(--fs-xs); color:#8a93ad; margin-top: var(--space-4);">S.A.S Nagar, Mohali, Punjab — 160062</p>
      </div>
    </div>

    <div class="footer-bottom">
      <span>© <span data-current-year></span> CU24BCA — Built for students, by students.</span>
      <a href="https://cu24bca.vercel.app/" target="_blank" rel="noopener">cu24bca.vercel.app</a>
    </div>
  </div>
</footer>`;
  }

  return { headerHTML, footerHTML };
})();
