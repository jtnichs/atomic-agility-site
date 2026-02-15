(() => {
  const header = document.querySelector("header");
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("#mobileMenu");

  if (!toggle || !menu) return;

  const openMenu = () => {
    menu.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Close when clicking a link in the menu
  menu.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A") closeMenu();
  });

  // Close if resized up to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  // Optional: add a "scrolled" class for header background control
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll);
  onScroll();
})();
