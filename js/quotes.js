/* ==========================================================================
   Quote of the day — previously this fetched from api-ninjas.com using an
   API key hardcoded directly in the client-side script (visible to anyone
   via view-source, and stealable/exhaustible). Replaced with a small local
   rotation so there's zero external dependency, zero exposed credentials,
   and it never fails to load.
   ========================================================================== */
(function () {
  const QUOTES = [
    { text: "None can destroy iron, but its own rust can. Likewise, none can destroy a person, but their own mindset can.", author: "Ratan Tata" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  ];

  function render() {
    const textEl = document.getElementById("quote");
    const authorEl = document.getElementById("Nquote");
    if (!textEl) return;
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    textEl.textContent = q.text;
    if (authorEl) authorEl.textContent = "— " + q.author;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
