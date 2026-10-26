(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  let theme = "dark";
  try { theme = localStorage.getItem("aura-theme-v3") || "dark"; } catch {}
  root.dataset.theme = theme === "light" ? "light" : "dark";
  const renderTheme = () => {
    if (!themeButton) return;
    const light = root.dataset.theme === "light";
    themeButton.querySelector(".theme-icon").textContent = light ? "☾" : "☼";
    themeButton.querySelector(".theme-label").textContent = light ? "Koyu" : "Açık";
    themeButton.setAttribute("aria-label", light ? "Koyu temaya geç" : "Açık temaya geç");
  };
  renderTheme();
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("aura-theme-v3", root.dataset.theme); } catch {}
    renderTheme();
  });

  const nav = document.querySelector(".nav");
  const menu = document.getElementById("menu-toggle");
  const closeMenu = () => { nav?.classList.remove("is-open"); menu?.setAttribute("aria-expanded", "false"); };
  menu?.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  });
  document.querySelectorAll(".nav-links a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const heroSection = document.getElementById("hero");
  if (nav && heroSection && "IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(([entry]) => {
      nav.classList.toggle("is-visible", !entry.isIntersecting);
    }, { threshold: 0 });
    navObserver.observe(heroSection);
  }
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-route]").forEach((link) => {
    if (link.dataset.route === current) link.setAttribute("aria-current", "page");
  });

  document.body.classList.add("js-enabled");
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("in-view"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add("in-view"));

  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);
  let pending = false;
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    pending = false;
  };
  addEventListener("scroll", () => { if (!pending) { pending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
  updateProgress();

  const video = document.getElementById("hero-video");
  const control = document.getElementById("video-control");
  const renderVideoControl = () => {
    if (!video || !control) return;
    const ended = video.ended;
    const playing = !video.paused && !ended;
    control.querySelector(".video-control-icon").textContent = ended ? "↻" : playing ? "Ⅱ" : "▶";
    control.querySelector(".video-control-label").textContent = ended ? "Yeniden oynat" : playing ? "Duraklat" : "Oynat";
    control.setAttribute("aria-label", ended ? "Videoyu yeniden oynat" : playing ? "Videoyu duraklat" : "Videoyu oynat");
  };
  if (video && control && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    video.addEventListener("canplay", () => { control.hidden = false; }, { once: true });
    video.addEventListener("play", renderVideoControl);
    video.addEventListener("pause", renderVideoControl);
    video.addEventListener("ended", renderVideoControl);
    video.addEventListener("error", () => { control.hidden = true; }, { once: true });
    control.addEventListener("click", () => {
      if (video.ended) video.currentTime = 0;
      if (video.paused) video.play().catch(() => {}); else video.pause();
    });
  }
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();