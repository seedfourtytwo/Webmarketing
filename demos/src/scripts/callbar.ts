// The phone call bar stays tucked away while the hero's own call/email buttons are on screen,
// so the first screen never shows two "Appeler" buttons. Without JS the bar simply stays visible.
const bar = document.querySelector<HTMLElement>('[data-callbar]');
const heroCta = document.querySelector('[data-hero-cta]');

if (bar && heroCta) {
  new IntersectionObserver(([entry]) => {
    const heroVisible = entry?.isIntersecting ?? false;
    bar.toggleAttribute('data-tucked', heroVisible);
    bar.inert = heroVisible;
  }).observe(heroCta);
}
