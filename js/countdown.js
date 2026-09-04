/* ==========================================================================
   Exam countdown — purely client-side, no backend needed.

   IMPORTANT: We intentionally do NOT ship a hardcoded exam date, because
   we don't want the site to display a fabricated/guessed official date.
   Once the university releases the date-sheet, set EXAM_NAME and
   EXAM_DATE below and the widget on the homepage will start counting
   down automatically. Until then it shows a friendly "not announced yet"
   state instead of a blank or broken widget.

   EXAM_DATE format: "YYYY-MM-DDTHH:mm:00"  (24-hour time, local time)
   ========================================================================== */
(function () {
  const EXAM_NAME = null; // e.g. "End Semester Examinations"
  const EXAM_DATE = null; // e.g. "2026-12-01T09:00:00"

  function render() {
    const el = document.querySelector("[data-exam-countdown]");
    if (!el) return;

    if (!EXAM_DATE) {
      el.innerHTML =
        '<div class="state-block" style="padding: var(--space-6) var(--space-4);">' +
        '<span class="state-icon">🗓️</span>' +
        "<h3>No exam date announced yet</h3>" +
        "<p>Once the official date-sheet is out, it'll show up here with a live countdown.</p>" +
        "</div>";
      return;
    }

    const target = new Date(EXAM_DATE).getTime();

    function tick() {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) {
        el.innerHTML =
          '<div class="state-block"><span class="state-icon">✅</span>' +
          "<h3>" + (EXAM_NAME || "Exams") + " have started</h3>" +
          "<p>All the best!</p></div>";
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      el.innerHTML =
        '<div class="countdown-label">' + (EXAM_NAME || "Next exam") + "</div>" +
        '<div class="countdown-grid">' +
        unit(d, "Days") + unit(h, "Hrs") + unit(m, "Min") + unit(s, "Sec") +
        "</div>";
    }

    function unit(value, label) {
      return (
        '<div class="countdown-unit"><span class="countdown-num">' +
        String(value).padStart(2, "0") +
        '</span><span class="countdown-unit-label">' +
        label +
        "</span></div>"
      );
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", render);
})();
