/* Progressive enhancements: theme toggle + scroll reveal.
   The page is fully functional without this file — the inline head
   script sets the initial theme, and all content is visible by default. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- theme toggle ---------- */
  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    /* Initialize aria-pressed on load to match resolved theme */
    var currentTheme = root.getAttribute("data-theme") || "dark";
    toggle.setAttribute("aria-pressed", String(currentTheme === "light"));

    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        /* storage unavailable (private mode) — theme still applies for the session */
      }
      toggle.setAttribute("aria-pressed", String(next === "light"));
    });
  }

  /* ---------- current year in footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- scroll reveal ---------- */
  var revealItems = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!revealItems.length) {
    return;
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  revealItems.forEach(function (el) { observer.observe(el); });
})();
