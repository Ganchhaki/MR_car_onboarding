# Objective
Refactor my existing horizontal, button-navigated web presentation into a cinematic, vertical scroll-driven experience. The target animation style is a "Sticky Column Stacking Layout" using GSAP, ScrollTrigger, SplitText, and Lenis smooth scrolling.

# Current Architecture
* **HTML:** The layout uses a `.presentation-container` with a `.slides-wrapper` holding multiple `<section class="slide">` elements. Most slides use a `.content-grid` split between a `.text-block` (left) and `.image-container` (right).
* **CSS:** Slides are 100vw/100vh, arranged horizontally using Flexbox. Transitions are handled via a `--slide-transition` CSS variable.
* **JS:** Navigation is currently handled by listening for button clicks (`#nextBtn`, `#prevBtn`) and keyboard arrows to update a `currentSlide` index and apply a `translateX` style to the wrapper.

# Required Transformations

Please rewrite `index.html`, `styles.css`, and `script.js` to achieve the following:

## 1. Asset & Library Loading (HTML)
* Remove the existing `#prevBtn` and `#nextBtn` controls from the HTML.
* Include the CDN links for `GSAP Core`, `ScrollTrigger`, `SplitText` (CodePen safe trial version is fine for now), and `Lenis` just before my `script.js` tag.

## 2. Layout Restructuring (HTML & CSS)
* **The Pinning Wrapper:** Ensure the `.presentation-container` acts as the main viewport. Change `.slides-wrapper` to act as the pinned container during scroll.
* **Absolute Stacking:** Remove the horizontal flex row setup in CSS. Update `.slide` so that all slides are stacked on top of each other using `position: absolute; top: 0; left: 0; width: 100%; height: 100%;`. 
* **Starting Positions:** Using CSS `transform`, leave the first slide (`.slide:nth-child(1)`) in the center. Push all subsequent slides down (`translateY(100%)`) so they are hidden below the screen initially.
* **Maintain Design System:** Keep all existing `:root` variables, glassmorphism effects (`backdrop-filter`), and typography (`Archivo`, `Inter`) exactly as they are.

## 3. Smooth Scrolling (JS)
* Initialize **Lenis** with a smooth `lerp` value (e.g., `0.1`).
* Hook Lenis into the GSAP ticker (`gsap.ticker.add`) and bind it to `ScrollTrigger.update`.
* Disable `gsap.ticker.lagSmoothing` to prevent jumping.

## 4. Text Preparation (JS & GSAP)
* Target all `h2` and `p` elements inside the `.text-block` of every slide.
* Use GSAP's `SplitText` to break them down into `type: "lines"`. 
* Wrap the content of each resulting line inside a `<span>` element to allow for masked, upward sliding text reveals.

## 5. Master Timeline & ScrollTrigger Loop (JS)
* Remove the old button click and `translateX` logic.
* Create a `gsap.timeline` attached to a `ScrollTrigger`.
* **Trigger Setup:** Pin the `.slides-wrapper` starting at `"top top"`. Set the `end` value dynamically based on the number of slides (e.g., `"+=" + (slides.length * 100) + "%"`). Enable `scrub: true`.
* **Dynamic Slide Loop:** Instead of hardcoding 26 steps, write a `forEach` loop that iterates through all `.slide` elements (except the last one) to build the timeline dynamically.
* **For each transition from Slide [i] to Slide [i+1]:**
    1.  **Old Slide Out:** Scale down (`scale: 0.8`) and fade out (`opacity: 0`) the current slide's `.image-container`. Animate the current slide's text lines upward (`y: "-100%"`) and fade them out.
    2.  **New Slide In:** Bring Slide [i+1] up into view (`y: "0%"`). 
    3.  **Cinematic Reveals:** Once the new slide is in place, animate its `SplitText` lines in from the bottom (`y: "100%" -> "0%"` with a slight stagger). 
    4.  **Image Clip-Path:** If Slide [i+1] has an `.image-container`, reveal it using a `clip-path: inset(100% 0 0 0)` to `inset(0% 0% 0% 0%)` animation, while slightly scaling the image down to `scale: 1` from `scale: 1.2` for a parallax zoom effect.

## 6. Progress Bar Update (JS)
* Hook the existing `.progress-bar` width and `.slide-indicator` text updates into the `ScrollTrigger`'s `onUpdate` callback so they reflect the user's scroll progress through the pinned timeline instead of relying on discrete button clicks. Keep the lightbox logic exactly as it is.

Please output the complete, refactored code for `index.html`, `styles.css`, and `script.js`.