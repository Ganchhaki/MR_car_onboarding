Here is the updated `GEMINI.md` file reflecting the latest changes to the presentation structure, specifically the removal of the "Reality Handoff" slide and the updated total slide count (25).

```markdown
# Project Overview: Mahindra XEV 9e MR Onboarding

This project is a design prototype and sales enablement tool for the **Mahindra XEV 9e** electric vehicle. It addresses the "UX Deficit" and "Sales Impact" associated with complex modern vehicle features (ADAS, infotainment, OTA updates) by proposing a **Mixed Reality (MR) Onboarding Experience**.

The core innovation is an **MR Pivot**: instead of a fully virtual simulator (which faces version control and software silo hurdles), the solution uses MR passthrough to overlay digital signifiers and contextual tooltips directly onto the **physical car's interior** during a showroom visit or strictly stationary test drive.

---

## Directory Structure & Key Files

- **`docs/`**: Strategic documentation and technical analysis.
  - `detail.md`: In-depth problem scope, user journey (storyboarding), and the rationale for the MR pivot.
  - `mahindra_xev_9e_features.md`: Comprehensive breakdown of the car's high-tech features (Triple screens, Level 2+ ADAS, SonicSuite, etc.).
  - `prompt.md`: Specifications for generating the project's technical visualizations.
- **`interactive_website/`**: A web-based prototype of the MR experience.
  - `index.html`: Main entry point for the interactive viewer. **(PRIMARY PRESENTATION FILE — see full spec below)**
  - `mr_experience.html`: The core MR simulation interface.
  - `interior360.mp4`: Source footage for the interior panorama.
- **`scripts/`**: Python automation for asset generation.
  - `generate_visuals.py`: Procedurally generates tech-focused diagrams using the `Pillow` library.
  - `compile_prototype_pdf.py`: Script to assemble presentation slides into a PDF.
- **`assets/`**: All visual resources, organized into subdirectories:
  - `assets/car/`: Car photos (`mahindra_car.png`), cognitive overload/manual failure PNGs, showroom viz, and scene storyboard frames.
  - `assets/car/scenes/`: AS-IS journey storyboard images (`scene 1.png`, `scene 3.png`, `scene 6.png`) and TO-BE journey images (`A.png`, `B.png`, `C.png`).
  - `assets/images/`: Supporting concept images (`the buyer.png`, `the dealership.png`, `ota updates.png`, `os logic.png`, `physical mismatch.png`, `spatial anchors.png`, `horizontal fov.png`, `vertical fov.png`, `raycasting.png`, `confused_customer.png`).
  - `assets/prototype/`: Figma-exported frames (`Slide 16_9 - N.png`) and specific feature visualizations (`adaptive cruise control.png`) used as slide images.
  - `assets/ui/`: Component screenshots (`interaction_zones.png`).
  - `assets/MRPanel.png`: Root-level MR UI panel image.
  - `assets/mahindra_xev9e_mr_onboarding_user_flow.svg`: Root-level user flow SVG diagram.
- **`temp/`**: Temporary components and testing files:
  - `temp/UIcomponents/`: UI library screenshots used in the cycle card on Slide 24.

---

## Tech Stack & Design Language

- **Web Prototyping**: HTML5, CSS3, Vanilla JavaScript. 
- **Animation & Scrolling**: **GSAP (ScrollTrigger, SplitText)** handles complex timeline animations, while **Lenis** provides synchronized smooth scrolling.
- **Design System** (defined in `:root` CSS variables):
  | Variable | Value | Usage |
  |---|---|---|
  | `--bg` | `#001219` | Page background |
  | `--surface` | `rgba(0, 15, 25, 0.98)` | Cards, glass panels |
  | `--primary` | `#0A9396` | Teal — headings, accents |
  | `--primary-dark` | `#005F73` | List item borders |
  | `--accent` | `#EE9B00` | Amber — section labels |
  | `--accent-dark` | `#CA6702` | Hover states |
  | `--accent-light` | `#E9D8A6` | Bold list text |
  | `--danger` | `#AE2012` | Problem/failure states |
  | `--danger-dark` | `#9B2226` | (reserved) |
  | `--warning` | `#BB3E03` | (reserved) |
  | `--text-main` | `#f0f0f5` | Primary body copy |
  | `--text-muted` | `#94D2BD` | Paragraph text, slide indicator |
  | `--glass-border` | `rgba(148, 210, 189, 0.45)` | Card borders |
  | `--glow-primary` | `rgba(10, 147, 150, 0.4)` | Glow effects |
  | `--slide-transition` | `1s cubic-bezier(0.85, 0, 0.15, 1)` | Slide scroll animation |
- **Typography**: Archivo (headings — weight 900, uppercase) / Inter (body — weight 300/400/600). Loaded from Google Fonts.
- **Python Visualization**: `Pillow` (PIL), `matplotlib`. Clinical, data-driven diagram aesthetic.
- **MR Concepts**: Spatial anchoring, digital overlays, passthrough MR, UX research (VRSQ, GEQ).

---

## `index.html` — Full Presentation Specification

### File Architecture
The presentation is split into three files:
- `index.html` — slide structure and content
- `styles.css` — all CSS (linked via `<link rel="stylesheet" href="styles.css">`)
- `script.js` — all animation, GSAP timelines, and Lenis scrolling logic (linked via `<script src="script.js">`)

### Navigation & Animation Chrome
- **Slide mechanism**: Vertical card-stacking reveal driven by **GSAP ScrollTrigger**. Slides are stacked absolutely (`position: absolute`). As the user scrolls, the `.slides-wrapper` is pinned, and `masterTl` scrubs through transitions, pushing outgoing slides back and bringing incoming slides up from `yPercent: 100`.
- **Custom Transitions**: 
  - **Slide 2 -> Slide 3**: Features a bespoke timeline override where an image card slides left and physically splits into two separate stacked images, while the text block pops in from the bottom-right.
  - **Slide 7 -> Slide 8**: Bespoke "swap" transition. Slide 7 text and images exit laterally while Slide 8 enters with a synchronized upward slide for text and a lateral reveal for the cycle items.
  - **Slide 8 -> Slide 9**: Bespoke "swap" transition. Slide 8's cycle-card (right) slides left, while Slide 9's cycle-card (left) slides in from the right.
  - **Slide 9 -> Slide 10**: Bespoke "swap" transition. Slide 9's cycle-card (left) slides right, while Slide 10's image-stack (right) slides in from the left.
  - **Slide 10 -> Slide 16 (System Flows)**: Bespoke lateral "swap" animations with alternating directions (L->R and R->L) to mirror the 2-card alternating layouts.
- **Controls**: Native mouse wheel / trackpad scrolling managed by Lenis.
- **Slide indicator**: Fixed bottom-left counter (`#slideIndicator`, dynamically updated by GSAP progress). Clicking it opens a `prompt()` for jumping to a specific slide using `lenis.scrollTo()`.
- **Progress bar**: Fixed top, 4px, gradient from `--primary-dark` to `--accent`. ID: `#progressBar`. Scrubbed to timeline progress.
- **Lightbox**: Clicking any `.image-container img` or `.storyboard-item img` opens a fullscreen overlay (`#lightbox`). Lenis scrolling is paused while active. Close via `×` button (`#closeLightbox`), clicking outside the image, or `Escape` key.

### Layout Classes
| Class | Description |
|---|---|
| `.content-grid` | Two-column grid (`1.1fr 0.9fr`), max 1400px, max-height 82vh. Used on most slides. |
| `.full-content` | Single centered column, max 1200px, max-height 82vh, flex column. Used for statement/storyboard slides. |
| `.card-grid` | Half-screen grid variant (`1fr 1fr`) ensuring cards stretch to fill height. |
| `.slide-card` | Glassmorphism panel with blur, border, padding, and drop shadow. |
| `.img-card` | Modifier for `.slide-card` that removes padding to allow images to span edge-to-edge (or containing large fitted images). |
| `.text-block` | Left-column text area with `.list-item` rows and `<p>` paragraphs. |
| `.image-container` | Right/left image panel: `border-radius 24px`, glassmorphism border, `backdrop-filter blur(12px)`. |
| `.image-stack-grid` | Grid of stacked image containers. Variants: `-2` (2 rows), `-3` (3 rows), `-6` (2×3 grid). |
| `.storyboard-grid` | 3 or 4-column grid for storyboard/card slides (gap 2rem). |
| `.storyboard-item` | Card with image (`aspect-ratio 16/10`) + h3 + p inside `.storyboard-grid`. |
| `.challenge-card` | Glassmorphism card with `border-radius 20px`, used for methodology and constraints. |
| `.list-item` | Row with left `4px` border (`--primary-dark`). Bold label in `--accent-light` + body text. |
| `.slide-bg` | Absolute-positioned dual radial-gradient background layer (`z-index: -1`). |
| `.title-slide` | Background image (`assets/images/slide 1.png`) with gradient overlay. Title uses gradient text clip. |
| `.cycle-card` | Specialized card container for internal cycling content (used in Slides 8 and 9). |

### Section Labels (Colored `<p>` above `<h2>`)
Every slide starts with a small uppercase colored label, styled as:
```html
<p style="color: var(--accent); font-weight: 900; font-size: 0.9rem; margin-bottom: 0.5rem;">LABEL TEXT</p>
```
Label colors used:
- `var(--accent)` / `#EE9B00` (identical) — most slides
- `var(--danger)` (#AE2012) — problem/pivot slides (slides 5, 10)
- `var(--primary)` (#0A9396) — title slide supertitle only

---

### Complete Slide Inventory

| # | Section Label | `<h2>` Title | Layout | Key Content |
|---|---|---|---|---|
| 1 | *(Mahindra Automotive)* | MR Car Onboarding | `.full-content` `.title-slide` | Title + tagline. BG: `assets/images/slide 1.png` |
| 2 | THE INDUSTRY | Automotive Evolution | `.content-grid` `.card-grid` | SDV shift. 3 list-items. Elements: `.text-block.slide-card`, `.slide-card.img-card` |
| 3 | THE CHALLENGE | Complexity vs. Confidence | `.content-grid` `.card-grid` | UX Deficit framing. 2 list-items. Features the custom GSAP card-split transition. |
| 4 | OUR APPROACH | Design Methodology | `.full-content` `.storyboard-grid` | 4 challenge-cards: 01 Research, 02 Storyboarding, 03 Pivot, 04 Prototype |
| 5 | Problem statement | *(HMW quote as h2)* | `.full-content` | "How might we convert technological complexity into **customer confidence**…" |
| 6 | The solution | *(one-liner as h2)* | `.full-content` | "Mixed Reality passthrough overlays contextual intelligence **directly onto the physical vehicle cockpit.**" |
| 7 | STAKEHOLDERS | Target Personas | `.content-grid` `.card-grid` | 3 list-items. Images (stack-2): `the buyer.png`, `the dealership.png` |
| 8 | AS-IS JOURNEY | Showroom Friction | `.content-grid` `.card-grid` | 3 storyboard items cycling in the right panel (`cycle-card`). |
| 9 | TO-BE RESOLUTION | The MR Intervention | `.content-grid` `.card-grid` | 3 storyboard items cycling in the left panel (`cycle-card`). Text on right. |
| 10 | THE PIVOT | The Simulator Hurdle | `.content-grid` `.card-grid` | 3 list-items. Image stack (3) on right. `object-fit: contain` fitting. |
| 11 | SYSTEM DESIGN: FLOW 01 | Digital Twin Alignment | `.content-grid` `.card-grid` | Spatial scan sync. Image (Right): `scanning_car.png` (fitted). |
| 12 | SYSTEM DESIGN: FLOW 02 | Exterior Discovery | `.content-grid` `.card-grid` | Flush door handle anchor. Image (Left): `Slide 16_9 - 1.png` (fitted). |
| 13 | SYSTEM DESIGN: FLOW 03 | Interior Setup | `.content-grid` `.card-grid` | Seat sliding + profile sync. Text (Left), Image stack-2 (Right). |
| 14 | SYSTEM DESIGN: FLOW 04 | Audio System Branching | `.content-grid` `.card-grid` | Experience vs. Skip fork. Image stack-2 (Left), Text (Right). |
| 15 | SYSTEM DESIGN: FLOW 05 | Parallel Tech Stack | `.content-grid` `.card-grid` | AI Camera, Valet Mode, Ambient Lighting. Text (Left), Image stack-3 (Right). |
| 16 | SYSTEM DESIGN: FLOW 06 | ADAS & Adaptive Cruise | `.content-grid` `.card-grid` | Sensor cones visualization. Image stack-2 (Left), Text (Right). |
| 17 | LOGIC ARCHITECTURE | System Logic Flow | `.content-grid` (`0.8fr 1.2fr`) | 2 list-items: Triggers, Navigation. SVG: `assets/mahindra_xev9e_mr_onboarding_user_flow.svg` |
| 18 | SPATIAL DESIGN | Designing for the Eye | `.content-grid` `.card-grid` | Focal-optimized UI. 2 list-items. Images (stack-3 left): `interaction_zones.png`, `horizontal fov.png`, `vertical fov.png` |
| 19 | OPERATIONAL LOGIC | 10 Minutes. Then Rest. | `.content-grid` `.card-grid` | Stationary constraint logic, comfort and battery focus. 2 list-items. |
| 20 | INTERACTION MODALITY | Point. Don't Reach. | `.content-grid` `.card-grid` | Ray-cast, magnetic snapping, visual feedback. 2 list-items. Image: `assets/images/raycasting.png` |
| 21 | SPATIAL ANCHORING | Spatial Anchoring | `.content-grid` `.card-grid` | World-locked overlays for stationary stability. 3 list-items. Image: `assets/images/spatial anchors.png` |
| 22 | SAFETY PROTOCOL | The Safe Handoff | `.full-content` `.storyboard-grid` | 3 phases before the drive starts. 3 challenge-cards: SHOWROOM, COCKPIT, HANDOFF. |
| 23 | SUMMARY | Safe by Design | `.full-content` | Stationary scope, Anchoring, Hard boundary handoff. (No image) |
| 24 | DESIGN SYSTEM | UI Library | `.content-grid` `.card-grid` | 8 storyboard items cycling in the right panel (`cycle-card`) showing UI components. |
| 25 | FEASIBILITY | Constraints | `.full-content` | 2 stacked challenge-cards: Stationary-Only Scope, Hardware and Thermal Limits. |

> **Total slides: 25** (Indicator initialized at 24, logic calculates true count dynamically).

---

## Asset Reference Map

### `assets/prototype/` (Figma exports & UI features)
| File | Used in Slide(s) |
|---|---|
| `Slide 16_9 - 0.png` | Operational Logic (19) |
| `scanning_car.png` | Flow 01 (11) |
| `Slide 16_9 - 1.png` | Flow 02 (12) |
| `Slide 16_9 - 3.png` | Flow 03 (13) |
| `Slide 16_9 - 4.png` | Flow 03 (13) |
| `Slide 16_9 - 5.png` | Flow 04 (14) |
| `Slide 16_9 - 5.2.png` | Flow 04 (14) |
| `Slide 16_9 - 6.png` | Flow 05 (15) |
| `Slide 16_9 - 7.png` | Flow 05 (15) |
| `Slide 16_9 - 8.png` | Flow 05 (15) |
| `Slide 16_9 - 9.png` | Flow 06 (16) |
| `adaptive cruise control.png` | Flow 06 (16) |
| `Slide 16_9 - 10.png` | *(Currently Unused / Removed from flow)* |

### `temp/UIcomponents/` (component screenshots)
| File | Used in Slide |
|---|---|
| `Screenshot 2026-04-13 133620.png` | UI Library (24) |
| `Screenshot 2026-04-13 133551.png` | UI Library (24) |
| `Screenshot 2026-04-13 133629.png` | UI Library (24) |
| `Screenshot 2026-04-13 133636.png` | UI Library (24) |
| `Screenshot 2026-04-13 133643.png` | UI Library (24) |
| `Screenshot 2026-04-13 133650.png` | UI Library (24) |
| `Screenshot 2026-04-13 133658.png` | UI Library (24) |
| `Screenshot 2026-04-13 133703.png` | UI Library (24) |

### `assets/ui/` (component screenshots)
| File | Used in Slide |
|---|---|
| `interaction_zones.png` | Designing for the Eye (18) |

### `assets/car/`
| File | Used in Slide |
|---|---|
| `mahindra_car.png` | Automotive Evolution (2) |
| `cognitive overload.png` | Complexity vs. Confidence (3) |
| `failure of traditional manuels.png` | Complexity vs. Confidence (3) |
| `scenes/scene 1.png` | AS-IS Journey (8) |
| `scenes/scene 3.png` | AS-IS Journey (8) |
| `scenes/scene 6.png` | AS-IS Journey (8) |
| `scenes/A.png` | TO-BE Journey (9) |
| `scenes/B.png` | TO-BE Journey (9) |
| `scenes/C.png` | TO-BE Journey (9) |

### `assets/images/`
| File | Used in Slide |
|---|---|
| `the buyer.png` | Target Personas (7) |
| `the dealership.png` | Target Personas (7) |
| `confused_customer.png` | AS-IS Journey (8) |
| `ota updates.png` | Simulator Hurdle (10) |
| `os logic.png` | Simulator Hurdle (10) |
| `physical mismatch.png` | Simulator Hurdle (10) |
| `horizontal fov.png` | Designing for the Eye (18) |
| `vertical fov.png` | Designing for the Eye (18) |
| `raycasting.png` | Interaction Modality (20) |
| `spatial anchors.png` | Spatial Anchoring (21) |

### Root-level assets
| File | Used in Slide |
|---|---|
| `assets/mahindra_xev9e_mr_onboarding_user_flow.svg` | System Logic Flow (17) |

---

## Common Edit Patterns

### Changing slide text content
Each slide follows this repeating structure. Edit the `<p>`, `<h2>`, or `.list-item` contents directly:
```html
<section class="slide">
    <div class="slide-bg"></div>
    <div class="content-grid">
        <div class="text-block">
            <p style="color: var(--accent); font-weight: 900; font-size: 0.9rem; margin-bottom: 0.5rem;">SECTION LABEL</p>
            <h2>Slide Title</h2>
            <p>Paragraph body text.</p>
            <div class="list-item"><strong>Label:</strong> Description text.</div>
        </div>
        <div class="image-container"><img src="path/to/image.png" alt="..."></div>
    </div>
</section>
```

### Swapping an image
Find the `<img src="...">` tag inside the relevant `<div class="image-container">` or `.slide-card img` and replace the `src` attribute.

### Changing a section label color
The inline `color:` style on the `<p>` above `<h2>` controls it. Use:
- `var(--accent)` for amber (standard)
- `var(--danger)` for red (problem framing)
- `var(--primary)` for teal (resolution/summary)
- `#EE9B00` is numerically identical to `--accent` and can be used interchangeably.

### Adding a new slide
Insert a new `<section class="slide">` block at the desired position in `#slidesWrapper`. The JS auto-detects total slide count via `document.querySelectorAll('.slide')` and updates the ScrollTrigger timeline dynamically.

### Reordering slides
Cut and paste `<section class="slide">...</section>` blocks within `#slidesWrapper`. The slide count and progress bar update automatically. **Note:** If you move slides 2 or 3, you will need to update the custom timeline override in `script.js` (currently keyed to `i === 1`).

### Changing the grid split ratio
The default `content-grid` is `1.1fr 0.9fr`. To flip (image left, text right) or adjust proportions, add an inline style override:
```html
<div class="content-grid" style="grid-template-columns: 0.8fr 1.2fr;">
```

### Modifying the design system globally
Edit the `:root` block in `styles.css`. All CSS variables propagate across the entire presentation instantly.

---

## Known Issues / Bugs in Current Code

- **`assets/car/failure of traditional manuels.png`**: Filename has a typo ("manuels" vs. "manuals"). Kept consistent with the actual filename on disk to prevent broken paths.
- **Hardcoded Slide Counter Element**: The static element `<div class="slide-indicator" id="slideIndicator">01 / 24</div>` initializes with a max of 24 but is immediately overwritten by JS depending on true DOM count.

---

## Usage & Development

### Viewing the Prototype
```
Open index.html directly in a browser (Chrome recommended for backdrop-filter support).
Navigate by scrolling down with your mouse wheel or trackpad.
Click the slide counter (bottom-left) to jump to any slide number.
Click any image to open the fullscreen lightbox. Press Escape or click outside to close.
```

---

## Implementation Notes
- **Stationary Only Scope**: The entire MR session is restricted to parked vehicles or showroom floors to completely eliminate motion sickness and sensory conflict risks. 
- **Spatial Anchors**: MR concept relies on mapping digital tooltips to physical dashboard buttons, stabilized through real-world anchoring decoupled from dynamic chassis movement.
- **B2B Strategy**: Targeted at dealerships to move inventory by increasing customer confidence.
- **Operational Constraints**: Accounts for showroom glare, battery drain in stationary vehicles, and salesperson onboarding friction.
- **Hardware Target**: Meta Quest-class MR headset with passthrough. Session design accounts for 10–15 min thermal/comfort limits.
- **Figma Reference**: [Design Reference Page](https://www.figma.com/design/eO3PU3W9jAAeMt1T6dm72u/car-onboarding?node-id=0-1&t=84LMOOKKxKRa1yty-1)
```