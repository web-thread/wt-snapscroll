# Web-Thread Snapscroll

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/web-thread/wt-snapscroll)

A lightweight, simple and responsive solution for creating smooth, full-screen snap-scrolling effects to specific part of your page, not the whole document.

## 🚀 Live Demo

See **Web-Thread Snapscroll** in action at our **[Live Demo Page](https://web-thread.com/apps/wt-snapscroll/index.html)**.
See **Web-Thread Snapscroll Fixed** in action at our **[Live Demo Page](https://web-thread.com/apps/wt-snapscroll/index-fixed.html)**.

## ✨ Features

* **Zero Dependencies:** Written in pure Vanilla JavaScript. No jQuery required.
* **Smart Boundaries:** The script detects when you are at the top or bottom of the snap zone and releases control, allowing standard scrolling to resume naturally.
* **Touch Supported:** Includes custom swipe detection (with a 60px threshold) for mobile devices.
* **Active State Detection:** Automatically adds classes to the visible block for easy styling or CSS animations.
* **Two Visual Modes:** Supports standard stacking (slide) or fixed positioning (curtain reveal/pinned).

## Installation

Download the files and include them in your project directory.

1.  `wt-snapscroll.js` (Core Logic)
2.  `wt-snapscroll.css` (Standard Style)
3.  `wt-snapscroll-fixed.css` (Alternative "Fixed" Style)

## Usage

### 1. Link the Files
Add the CSS in your `<head>` and the script at the end of your `<body>`. 

**Important:** Choose **one** CSS file depending on the visual style you want.

```html
<link rel="stylesheet" href="wt-snapscroll.css">

<link rel="stylesheet" href="wt-snapscroll-fixed.css">

<script src="wt-snapscroll.js"></script>
````

### 2\. Structure Your HTML

The script works by detecting specific classes.

**For Standard Style (`wt-snapscroll.css`):**
You only need the item class.

```html
<div class="wt-snapscroll-item">
    <h1>Section One</h1>
</div>
<div class="wt-snapscroll-item">
    <h1>Section Two</h1>
</div>
```

**For Fixed Style (`wt-snapscroll-fixed.css`):**
You must use a wrapper inside the item. The script pins the *wrapper* while the container scrolls.

```html
<div class="wt-snapscroll-item">
    <div class="wt-snapscroll-wrap">
        <h1>Section One (Pinned)</h1>
    </div>
</div>
```

-----

## Styling & Animations

### The Active Class

The script automatically checks which section is in the middle of the viewport and adds the `wt-snapscroll-active` class to it. You can use this to trigger CSS transitions.

```css
/* Example: Fade in text when the section becomes active */
.wt-snapscroll-item h1 {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
}

.wt-snapscroll-item.wt-snapscroll-active h1 {
    opacity: 1;
    transform: translateY(0);
}
```

### The Snap Zone

When the user scrolls into the snap-scroll area, the script adds the class `wt-snapscroll-zone` to the `<body>`. This is useful if you want to hide global elements (like a fixed navigation bar) specifically while the user is snapping through these sections.

```css
body.wt-snapscroll-zone .my-fixed-navbar {
    display: none;
}
```

-----

## Configuration (Advanced)

The settings for scroll sensitivity are located at the top of the `wt-snapscroll.js` file within **Section 3**. You may edit these constants directly if you need to tweak the feel of the scroll.

```javascript
// Cooldown (ms) to wait after a jump before allowing another.
const SCROLL_COOLDOWN = 800;

// The pixel distance a user must swipe on touch screens to trigger a snap.
const SWIPE_THRESHOLD = 60;
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge) that support `addEventListener` and `classList`.

-----

### A Note on your JavaScript
I noticed in your JS code specifically in the `handleWheel` function, you have this logic:

```javascript
// 5. THE FIX: Check if we are trying to scroll *out* of the zone.
if (isScrollingDown && isAtLast) { return; }
if (!isScrollingDown && isAtFirst) { return; }
````

This is **excellent logic**. Many snap-scroll libraries "trap" the user and make it impossible to scroll past the snap section to the footer or header. Your code correctly handles the "exit," so I highlighted this as a "Smart Boundary" feature in the README.


## 📜 License

This project is licensed under the MIT License. See the [LICENSE.md](LICENSE.md) file for details.
(We recommend you add a file named `LICENSE.md` with the MIT license text.)

## 🧑‍💻 Author

Brought to you by Alexandros Pertsinidis member of the team at **[web-thread](https://web-thread.com/)**.
