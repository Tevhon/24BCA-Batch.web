/* ==========================================================================
   Toast notifications — window.CU24Toast.show("message", { type, icon })
   ========================================================================== */
(function () {
  function ensureRegion() {
    let region = document.querySelector(".toast-region");
    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "true");
      document.body.appendChild(region);
    }
    return region;
  }

  const ICONS = {
    success: "✓",
    info: "ℹ",
    error: "!",
  };

  function show(message, opts) {
    opts = opts || {};
    const type = opts.type || "success";
    const region = ensureRegion();

    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.setAttribute("role", "status");
    toast.innerHTML =
      '<span class="toast-icon">' + (opts.icon || ICONS[type] || ICONS.success) + "</span>" +
      "<span>" + message + "</span>";

    region.appendChild(toast);

    const timeout = setTimeout(() => remove(toast), opts.duration || 3200);
    toast.addEventListener("click", () => {
      clearTimeout(timeout);
      remove(toast);
    });
  }

  function remove(toast) {
    toast.classList.add("leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }

  window.CU24Toast = { show };
})();
