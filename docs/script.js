// Simple interactions for the landing page

document.addEventListener("DOMContentLoaded", () => {
  // Reveal blurred mock messages on hover of the chat panel
  const panel = document.querySelector(".mock-chat-panel");
  if (panel) {
    panel.addEventListener("mouseenter", () => {
      panel.querySelectorAll(".blurred").forEach((el) => {
        el.style.filter = "none";
        el.style.transition = "filter 0.25s ease";
      });
    });
    panel.addEventListener("mouseleave", () => {
      panel.querySelectorAll(".blurred").forEach((el) => {
        el.style.filter = "";
      });
    });
  }

  // Also reveal sidebar blurred items when hovering the whole mock
  const mock = document.querySelector(".mock-window");
  if (mock) {
    mock.addEventListener("mouseenter", () => {
      mock.querySelectorAll(".mock-sidebar .blurred").forEach((el) => {
        el.style.filter = "none";
        el.style.transition = "filter 0.25s ease";
      });
    });
    mock.addEventListener("mouseleave", () => {
      mock.querySelectorAll(".mock-sidebar .blurred").forEach((el) => {
        el.style.filter = "";
      });
    });
  }
});
