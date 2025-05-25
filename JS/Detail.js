const btn = document.getElementById("back-to-top");

window.onscroll = () => {
  btn.style.display = window.scrollY > 300 ? "block" : "none";

  document.querySelectorAll(".fade-in").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
};

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleDetail(id) {
    const el = document.getElementById(id);
    const entry = el.closest(".timeline-entry");
    if (el && entry) {
      const willShow = !el.classList.contains("show");
      el.classList.toggle("show");
      entry.classList.toggle("active", willShow);
  
      if (willShow) {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const middle = rect.top + window.scrollY - (window.innerHeight / 2) + (el.scrollHeight / 2);
          window.scrollTo({ top: middle, behavior: "smooth" });
        }, 600); // 動畫長度一致（你 CSS 動畫時間是 0.6s）
      }
    }
  }