window.addEventListener('load', () => {

  /* ===================================================
     SECTION 1: The "Snap Zone" Logic
  =================================================== */

  const html = document.documentElement;
  const snapItems = document.querySelectorAll('.wt-snapscroll-item');

  if (snapItems.length === 0) return;

  const firstSection = snapItems[0];
  const lastSection = snapItems[snapItems.length - 1]; 

  function checkSnapScroll() {
    const viewportHeight = window.innerHeight;

    // We use a buffer (+50/-50) so the snap doesn't disengage 
    // too early while the user is still finishing a swipe.
    const firstTop = firstSection.getBoundingClientRect().top + 50;
    const lastBottom = lastSection.getBoundingClientRect().bottom - 50;

    // Logic:
    // 1. Have we scrolled down past the top of the first item? (firstTop <= 0)
    // 2. Have we NOT yet scrolled past the bottom of the last item? (lastBottom >= viewportHeight)
    const isInSnapZone = (firstTop <= 0) && (lastBottom >= viewportHeight);

    // Toggle the class. 
    // The second argument (boolean) ensures we don't add/remove unnecessarily.
    html.classList.toggle('wt-snapscroll-zone', isInSnapZone);
  }

  // OPTIMIZATION: Use { passive: true } for better mobile scrolling performance
  window.addEventListener('scroll', checkSnapScroll, { passive: true });
  
  // Check once on load
  checkSnapScroll();


  /* ===================================================
     SECTION 2: Active Class Observer
  =================================================== */
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              // Optional: You could use a more specific selector here if needed
              // but your current loop is fine for small numbers of items.
              snapItems.forEach(item => item.classList.remove('wt-snapscroll-active'));
              entry.target.classList.add('wt-snapscroll-active');
          }
      });
  }, {
      threshold: 0.5 
  });

  snapItems.forEach(item => observer.observe(item));

});