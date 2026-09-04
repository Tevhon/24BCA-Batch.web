/* ==========================================================================
   CGPA calculator — generic credit-weighted calculator. We deliberately
   don't hardcode Chandigarh University's letter-grade-to-point mapping
   here (grade scales can change/vary), so students enter the grade point
   exactly as printed on their own official grade card. Fully client-side,
   nothing is stored or sent anywhere.
   ========================================================================== */
(function () {
  let rowCount = 0;

  function addRow(container) {
    rowCount++;
    const row = document.createElement("div");
    row.className = "cgpa-row";
    row.style.cssText = "display:flex; gap: var(--space-2); align-items:center; margin-bottom: var(--space-2);";
    row.innerHTML =
      '<input type="text" placeholder="Subject ' + rowCount + '" class="cgpa-subject" style="flex:1.4; min-width:0; background:var(--color-surface-2); border:1.5px solid var(--color-border); border-radius: var(--radius-md); padding:0.55rem 0.7rem; font-size: var(--fs-sm);" />' +
      '<input type="number" min="0" placeholder="Credits" class="cgpa-credits" style="flex:1; min-width:0; background:var(--color-surface-2); border:1.5px solid var(--color-border); border-radius: var(--radius-md); padding:0.55rem 0.7rem; font-size: var(--fs-sm);" />' +
      '<input type="number" min="0" max="10" step="0.1" placeholder="Grade pt" class="cgpa-grade" style="flex:1; min-width:0; background:var(--color-surface-2); border:1.5px solid var(--color-border); border-radius: var(--radius-md); padding:0.55rem 0.7rem; font-size: var(--fs-sm);" />' +
      '<button type="button" class="icon-btn btn-sm" data-remove-row aria-label="Remove subject" style="width:32px;height:32px;flex-shrink:0;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>';
    container.appendChild(row);
  }

  function compute(container, resultEl) {
    let creditSum = 0;
    let weightedSum = 0;
    container.querySelectorAll(".cgpa-row").forEach((row) => {
      const credits = parseFloat(row.querySelector(".cgpa-credits").value);
      const grade = parseFloat(row.querySelector(".cgpa-grade").value);
      if (!isNaN(credits) && !isNaN(grade) && credits > 0) {
        creditSum += credits;
        weightedSum += credits * grade;
      }
    });
    resultEl.textContent = creditSum > 0 ? (weightedSum / creditSum).toFixed(2) : "—";
  }

  function init() {
    const container = document.querySelector("[data-cgpa-rows]");
    const addBtn = document.querySelector("[data-cgpa-add]");
    const resultEl = document.getElementById("cgpaResult");
    if (!container || !addBtn || !resultEl || container.dataset.bound) return;
    container.dataset.bound = "true";

    for (let i = 0; i < 3; i++) addRow(container);

    addBtn.addEventListener("click", () => addRow(container));
    container.addEventListener("input", () => compute(container, resultEl));
    container.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove-row]");
      if (removeBtn) {
        removeBtn.closest(".cgpa-row").remove();
        compute(container, resultEl);
      }
    });
  }

  document.addEventListener("cu24:overlay-open", (e) => {
    if (e.detail === "tools") init();
  });
})();
