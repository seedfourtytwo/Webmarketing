// Highlights the menu link of the section on screen. Native CSS (`scroll-target-group` + `:target-current`)
// where supported; IntersectionObserver fallback elsewhere, which sets the `.:target-current` class instead.
// Either way, aria-current mirrors the visual state for screen readers.
const nav = document.querySelector<HTMLElement>('[data-spy]');

if (nav) {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const setCurrent = (active: Element | null) => {
    for (const link of links) {
      if (link === active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
  };

  if (CSS.supports('scroll-target-group: auto')) {
    const sync = () => setCurrent(nav.querySelector('a:target-current'));
    // :target-current is only resolved after the first layout.
    requestAnimationFrame(() => requestAnimationFrame(sync));
    document.addEventListener('scrollend', sync);
  } else {
    const byId = new Map(links.map((link) => [link.hash.slice(1), link]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const active = byId.get(entry.target.id) ?? null;
          for (const link of links) link.classList.toggle(':target-current', link === active);
          setCurrent(active);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    for (const id of byId.keys()) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
  }
}
