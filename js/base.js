/* ==========================================================================
   Base path detector — must load before every other script.

   The site has exactly two folder depths: root (index.html, error.html)
   and pageimpordata/<Type>/<Page>.html (two levels deep). This computes
   the relative prefix needed to get back to the project root from
   wherever the current page lives, so shared JS (header/footer, search,
   bookmarks, recents) can build correct relative links no matter which
   page they're running on — without needing a server, and without
   breaking when the site is opened straight from the filesystem (file://).
   ========================================================================== */
window.CU24_BASE = window.location.pathname.indexOf("/pageimpordata/") !== -1 ? "../../" : "";

// Turns a root-relative-style path (e.g. "pageimpordata/Notes/Notes.html")
// into a correct link from the current page. Leaves external (http/https)
// URLs untouched.
window.cu24Link = function (path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith("#")) return path;
  return window.CU24_BASE + path;
};
