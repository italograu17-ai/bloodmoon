const sections = [...document.querySelectorAll("main section[id]")];
const navigationLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (!visibleSection) return;

    navigationLinks.forEach((link) => {
      if (link.hash === `#${visibleSection.target.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, { rootMargin: "-15% 0px -65% 0px", threshold: [0, 0.25, 0.5] });

  sections.forEach((section) => sectionObserver.observe(section));
}