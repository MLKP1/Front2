document.addEventListener('DOMContentLoaded', function () {
  const footer = document.querySelector('footer');
  if (!footer) return;

  // initial state: hidden
  footer.classList.add('footer-hidden');

  // Helper to detect bottom of page
  function isAtBottom(threshold = 40) {
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const fullHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.documentElement.clientHeight);
    return (viewportHeight + scrollY) >= (fullHeight - threshold);
  }

  function setExpandedHeight() {
    // compute footer internal content height
    const content = footer.querySelector('.footer-content');
    const bottom = footer.querySelector('.footer-bottom');
    let total = 0;
    if (content) total += content.scrollHeight;
    if (bottom) total += bottom.scrollHeight;
    // add small padding buffer
    total += 24;
    // limit to viewport fraction
    const maxAllowed = Math.round(window.innerHeight * 0.9);
    const expanded = Math.min(total, maxAllowed);
    footer.style.setProperty('--footer-expanded', `${expanded}px`);
    // set on root so layouts (body/main padding) adapt to expanded height
    document.documentElement.style.setProperty('--footer-expanded', `${expanded}px`);
  }

  function onScrollOrResize() {
    if (isAtBottom(40)) {
      setExpandedHeight();
      footer.classList.add('footer-visible');
      footer.classList.remove('footer-hidden');
    } else {
      footer.classList.remove('footer-visible');
      footer.classList.add('footer-hidden');
      // remove the root expanded override so stylesheet fallback works
      document.documentElement.style.removeProperty('--footer-expanded');
      footer.style.removeProperty('--footer-expanded');
    }
  }

  // Listen to scroll/resize and init
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);

  // Also watch when the page loads additional content
  // Attempt to show/hide on load after a short delay
  setTimeout(onScrollOrResize, 80);

  // Expose toggle for programmatic use (if needed elsewhere)
  window.FooterToggle = onScrollOrResize;
});
