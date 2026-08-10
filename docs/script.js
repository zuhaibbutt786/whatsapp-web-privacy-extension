// Simple interactions for the landing page

document.addEventListener("DOMContentLoaded", () => {
  // Reveal blurred mock messages on hover of the chat panel
  const panel = document.querySelector("#chat-mock");
  if (panel) {
    panel.addEventListener("mouseenter", () => {
      panel.querySelectorAll(".blur-demo").forEach((el) => el.classList.add("revealed"));
    });
    panel.addEventListener("mouseleave", () => {
      panel.querySelectorAll(".blur-demo").forEach((el) => el.classList.remove("revealed"));
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});
