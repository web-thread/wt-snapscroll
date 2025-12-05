window.addEventListener('load', (event) => {


  /* ===================================================
  SECTION 1: The "Snap Zone" (Toggling .snapscroll on <html>)
  =================================================== */

  // 1. Select elements
  const html = document.documentElement;
  const snapSections = document.querySelectorAll('.wt-snapscroll-item');

  // 2. Safety check: If no elements are found, stop here.
  if (snapSections.length === 0) {
    console.warn('Snap Scroll: No elements with class "wt-snapscroll-item" were found.');
    return;
  }

  // 3. Identify the first and last elements
  const firstSection = snapSections[0];
  const lastSection = snapSections[snapSections.length - 1];

  // 4. Create the function that checks scroll position
  function checkSnapScroll() {
    // Get the viewport (screen) height
    const viewportHeight = window.innerHeight;

    // Get the position of our boundary elements
    const firstTop = firstSection.getBoundingClientRect().top;
    const lastBottom = lastSection.getBoundingClientRect().bottom;

    // 5. Define the "snap zone"
    // We are "in the zone" if:
    //    - The top of the first element is at or above the top of the screen (top <= 0)
    //    - AND The bottom of the last element is at or below the bottom of the screen (bottom >= viewportHeight)
    const isInSnapZone = (firstTop <= 0) && (lastBottom >= viewportHeight);

    // 6. Toggle the class on the <html> based on our condition
    //    - If isInSnapZone is true, it ADDs the class.
    //    - If isInSnapZone is false, it REMOVEs the class.
    html.classList.toggle('wt-snapscroll-zone', isInSnapZone);
  }

  // 7. Listen for scroll events to run our check
  window.addEventListener('scroll', checkSnapScroll);

  // 8. Run the check once on page load
  // This handles cases where the page loads already inside the snap zone
  checkSnapScroll();


  /* ===================================================
   SECTION 2: The "Active" Section (Toggling .wt-snapscroll-active on sections)
   =================================================== */

  /**
   * Checks a list of elements and adds/removes a class based on whether
   * they overlap the horizontal middle of the viewport.
   *
   * @param {NodeList} elements - The elements to check (e.g., from document.querySelectorAll).
   * @param {string} activeClass - The class name to toggle (e.g., 'wt-snapscroll-active').
   */
  function updateActiveOnMidline(elements, activeClass) {
    // Find the horizontal midline
    const viewportMidY = window.innerHeight / 2;

    elements.forEach(element => {
      const rect = element.getBoundingClientRect();

      // Check if the element spans the midline
      if (rect.top <= viewportMidY && rect.bottom >= viewportMidY) {
        element.classList.add(activeClass);
      } else {
        element.classList.remove(activeClass);
      }
    });
  }

  const ACTIVE_CLASS_NAME = 'wt-snapscroll-active';

  // 2. A handler function to call
  function handlePageUpdate() {
    updateActiveOnMidline(snapSections, ACTIVE_CLASS_NAME);
  }

  // 3. Run the function when the page loads
  window.addEventListener('load', handlePageUpdate);

  // 4. Run the function on scroll
  window.addEventListener('scroll', handlePageUpdate);

  // 5. Run the function if the window is resized
  window.addEventListener('resize', handlePageUpdate);

  /* end snap scroll */


  /* ===================================================
     SECTION 3: Snap Jumping Feature
     =================================================== */
  
  // --- Configuration ---
  // Cooldown (ms) to wait after a jump before allowing another.
  // This should be close to your smooth-scroll duration.
  const SCROLL_COOLDOWN = 800;
  // The 60px swipe threshold you requested.
  const SWIPE_THRESHOLD = 60;
  
  // --- State Variables ---
  // Flag to prevent multiple jumps while one is in progress.
  let isJumping = false;
  // Used to track the start of a touch/swipe.
  let touchStartY = 0;
  
  /**
   * The core "jumper" function.
   * Scrolls to the next or previous .wt-snapscroll-item section.
   *
   * @param {string} direction - 'up' or 'down'
   */
  function jumpToSection(direction) {
    // 1. Check if we're already jumping. If so, do nothing.
    if (isJumping) {
      return;
    }
  
    // 2. Find the index of the *currently* active section.
    let currentIndex = -1;
    snapSections.forEach((section, index) => {
      if (section.classList.contains('wt-snapscroll-active')) {
        currentIndex = index;
      }
    });
  
    // 3. Safety check: If no section is active, we can't jump.
    if (currentIndex === -1) {
      return;
    }
  
    // 4. We're starting a jump! Set the flag.
    isJumping = true;
  
    // 5. Determine the index of the *target* section.
    let targetIndex = (direction === 'down')
      ? currentIndex + 1
      : currentIndex - 1;
  
    // 6. Check boundaries: Don't jump if we're at the first or last section.
    if (targetIndex < 0 || targetIndex >= snapSections.length) {
      isJumping = false; // Reset the flag and do nothing.
      return;
    }
  
    // 7. Get the target element and scroll to it.
    const targetSection = snapSections[targetIndex];
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
    // 8. Reset the 'isJumping' flag after the cooldown.
    // We use a timeout because 'scrollIntoView' doesn't have a
    // "finished" callback.
    setTimeout(() => {
      isJumping = false;
    }, SCROLL_COOLDOWN);
  }
  
  // --- Event Handlers ---
  
  /**
   * Handles mouse wheel events.
   */
  function handleWheel(e) {
    // 1. Check if we are NOT in the snap zone.
    if (!html.classList.contains('wt-snapscroll-zone')) {
      return; // Do nothing, let the browser scroll normally.
    }
  
    // 2. If we're already jumping, prevent scroll and exit.
    if (isJumping) {
      e.preventDefault();
      return;
    }
    
    // 3. Find the current active section *before* deciding to jump.
    let currentIndex = -1;
    snapSections.forEach((section, index) => {
      if (section.classList.contains('wt-snapscroll-active')) {
        currentIndex = index;
      }
    });
  
    // If no section is active, let the browser scroll.
    if (currentIndex === -1) {
      return;
    }
  
    // 4. Check our boundaries!
    const isScrollingDown = e.deltaY > 0;
    const isAtFirst = (currentIndex === 0);
    const isAtLast = (currentIndex === snapSections.length - 1);
  
    // 5. THE FIX: Check if we are trying to scroll *out* of the zone.
    if (isScrollingDown && isAtLast) {
      // At the last item and scrolling down: DO NOTHING.
      // Let the browser scroll normally (exiting the zone).
      return;
    }
    if (!isScrollingDown && isAtFirst) {
      // At the first item and scrolling up: DO NOTHING.
      // Let the browser scroll normally (exiting the zone).
      return;
    }
  
    // 6. If we're here, we are *not* at a boundary.
    // We MUST be jumping, so *now* we prevent default.
    e.preventDefault();
    jumpToSection(isScrollingDown ? 'down' : 'up');
  }
  
  /**
   * Handles the start of a touch.
   */
  function handleTouchStart(e) {
    // Only record touch start if we're in the snap zone.
    if (html.classList.contains('wt-snapscroll-zone')) {
      touchStartY = e.touches[0].clientY;
    }
  }
  
  /**
   * Handles the "move" part of a swipe.
   */
  function handleTouchMove(e) {
    // Exit if not in snap zone, or already jumping, or touch hasn't started.
    if (!html.classList.contains('wt-snapscroll-zone') || isJumping || !touchStartY) {
      return;
    }
  
    const touchCurrentY = e.touches[0].clientY;
    const deltaY = touchStartY - touchCurrentY; // Positive = swipe up (scroll down)
  
    // 1. Check if we've crossed the 60px threshold.
    if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
      
      // 2. Find the current active section.
      let currentIndex = -1;
      snapSections.forEach((section, index) => {
        if (section.classList.contains('wt-snapscroll-active')) {
          currentIndex = index;
        }
      });
  
      if (currentIndex === -1) {
        touchStartY = 0; // Reset touch
        return; // Let browser scroll
      }
  
      // 3. Check boundaries.
      const isJumpingDown = deltaY > 0; // Swipe up = jump down
      const isAtFirst = (currentIndex === 0);
      const isAtLast = (currentIndex === snapSections.length - 1);
  
      // 4. THE FIX: Check if trying to swipe *out* of the zone.
      if (isJumpingDown && isAtLast) {
        return; // At last item, swiping "down": DO NOTHING.
      }
      if (!isJumpingDown && isAtFirst) {
        return; // At first item, swiping "up": DO NOTHING.
      }
  
      // 5. If we're here, we ARE jumping. Prevent default drag.
      e.preventDefault();
      jumpToSection(isJumpingDown ? 'down' : 'up');
      
      // 6. Reset touchStartY to prevent this from firing
      // again until the *next* swipe.
      touchStartY = 0;
    }
  }
  
  /**
   * Handles the end of a touch.
   */
  function handleTouchEnd() {
    // Reset the touch-start position when the finger is lifted.
    touchStartY = 0;
  }
  
  // --- Attach Listeners ---
  // We must use { passive: false } to be able to call e.preventDefault().
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: false });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd);


}); //  end window.addEventListener 'load'
