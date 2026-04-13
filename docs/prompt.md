
## Python Visualization Prompts — MR Car Onboarding Presentation

---

### 🖼️ Slide 1 — Title (`title_viz.png`)
**Purpose:** Full-bleed background for the title slide.

```
Create a 1920x1080px dark background visualization using matplotlib or Pillow.

Design: An abstract, isometric-style cityscape of connected nodes representing a 
"digital nervous system." Use a near-black background (#0a0a0c). Draw dozens of 
small glowing cyan (#00f2ff) circles connected by thin lines, arranged to subtly 
suggest the silhouette of a car dashboard or steering wheel when viewed as a whole. 
Add a purple (#7000ff) radial gradient glow emanating from the center-right. 
Scatter faint hexagonal grid lines across the canvas at low opacity (0.08). 
Add a few larger, brighter nodes as focal points with soft glow halos. 
The overall mood: premium, tech-forward, dark, cinematic.
Save as title_viz.png at 300dpi.
```

---

### 🖼️ Slide 2 — The UX Deficit (`ux_deficit_viz.png`)
**Purpose:** Side-panel visual showing cognitive overload in car onboarding.

```
Create a 900x500px visualization on a dark background (#16161a).

Design: A "cognitive load meter" diagram. Draw a human head silhouette in the center 
(use a simple path/polygon) filled with a dark surface color. Inside the head, 
draw an overflowing bar chart with 4 bars labeled: "ADAS", "Infotainment", 
"OTA Updates", "Manual Reading" — bars are colored with a gradient from purple 
(#7000ff) to cyan (#00f2ff), and the tallest bars overflow the head's boundary 
with a red (#ff3b3b) overflow indicator. Outside the head on the right, show a 
downward arrow labeled "CONVERSION RATE" in red. Add small warning icons (⚠) 
floating near the overflowing bars. Use Inter font, uppercase labels, muted 
text (#a0a0ab) for secondary labels. Dark, clinical, data-driven aesthetic.
Save as ux_deficit_viz.png.
```

---

### 🖼️ Slide 6 — The Simulator Hurdle (`simulator_hurdle_viz.png`)
**Purpose:** Side-panel visual showing VR simulator failure points.

```
Create a 900x500px dark-theme visualization (#0a0a0c background).

Design: A "broken pipeline" diagram. Draw three connected boxes in a horizontal 
chain labeled: "VR SIMULATOR" → "OTA UPDATE" → "DIGITAL TWIN". Connect them 
with thick arrows. At the arrow between "OTA UPDATE" and "DIGITAL TWIN", draw a 
large red X / broken link symbol with a glow effect. Below each box, add a 
small sub-label in muted text:
  - VR SIMULATOR → "Unreal Engine Build"
  - OTA UPDATE → "Version Mismatch"
  - DIGITAL TWIN → "Liability Risk"

Add a faint red radial glow around the broken link. On the right side of the 
canvas, add a vertical danger meter bar (fully red) labeled "NEGATIVE TRANSFER RISK". 
Use cyan (#00f2ff) for working elements and red (#ff4444) for broken/warning elements.
Clean, diagrammatic, technical aesthetic. Save as simulator_hurdle_viz.png.
```

---

### 🖼️ Slide 7 — The Showroom Pivot (`showroom_pivot_viz.png`)
**Purpose:** Side-panel visual showing the MR solution architecture.

```
Create a 900x500px visualization on dark background (#0a0a0c).

Design: A layered "reality stack" diagram with 3 stacked horizontal slabs:
  - Bottom slab (dark gray): labeled "PHYSICAL CAR — Steering Wheel, Dashboard, Controls"
  - Middle slab (semi-transparent cyan): labeled "MR PASSTHROUGH VISOR — Video Feed"
  - Top slab (glowing purple/cyan gradient): labeled "SPATIAL ANCHORS — Digital Overlays"

Draw connecting vertical dashed lines linking the Physical Car layer up through 
the MR Visor to the Spatial Anchor layer, with small glowing dots at connection points. 
On the right, show a simple spatial anchor icon (a small target reticle with radiating 
lines) placed over a simplified dashboard shape, labeled "CONTEXTUAL OVERLAY".

Use a subtle isometric tilt on the slabs for depth. Add the label "NO SIMULATION 
REQUIRED" in bold cyan at the top-right. Clean, architectural, layered aesthetic.
Save as showroom_pivot_viz.png.
```

---

### 🖼️ Slide 8 — Operational Constraints (no dedicated image, but can add `constraints_viz.png`)
**Purpose:** Full-width supporting visual for the 4-card grid slide.

```
Create a 1400x500px wide banner visualization on dark background (#0a0a0c).

Design: A radar/spider chart with 4 axes labeled: "GLARE INTERFERENCE", 
"BATTERY DRAIN", "SALES FRICTION", "SENSORY CONFLICT". Draw two overlapping 
polygons:
  - Red polygon (filled semi-transparently): current pain levels — all axes near 
    the outer edge (high severity).
  - Cyan polygon (filled semi-transparently): target/managed levels — all axes 
    pulled inward toward center.

Add small icon glyphs near each axis tip (a sun ☀ for glare, a battery 🔋 for 
power, a person for friction, a head for sensory). 
Label the legend: "CURRENT STATE" in red, "MANAGED STATE" in cyan.
Add faint concentric pentagon gridlines. Use Archivo-style bold uppercase labels.
Save as constraints_viz.png.
```

---

### 🖼️ Slide 9 — Conclusion / Future of Automotive Sales (no dedicated image, but can add `conclusion_viz.png`)
**Purpose:** Full-width or background visual reinforcing the confidence ↔ conversion duality.

```
Create a 1600x900px visualization on dark background (#0a0a0c).

Design: A symmetrical split composition divided down the center by a thin 
glowing vertical line. 

LEFT HALF (labeled "CONFIDENCE — FOR USERS"):
  - Draw an upward-trending smooth curve in cyan (#00f2ff) from bottom-left 
    to top-right, representing growing user confidence over time.
  - Scatter small glowing dot milestones along the curve labeled: 
    "First Touch", "Feature Discovery", "MR Session", "Purchase Decision".
  - Add a subtle radial glow in cyan at the top-right of this half.

RIGHT HALF (labeled "CONVERSION — FOR BUSINESS"):
  - Draw a matching upward bar chart in purple (#7000ff) with bars for: 
    Q1, Q2, Q3, Q4 showing increasing conversion rate percentages (40%, 55%, 70%, 88%).
  - Add a glowing target circle at the top of the tallest bar.

Center dividing line: gradient from cyan to purple, labeled "MR INTERVENTION POINT" 
halfway down. Overall mood: premium, hopeful, data-confident.
Save as conclusion_viz.png.
```

---

### 📌 General Python Setup Tips (include this in every prompt)

```
Global settings to apply across all visuals:
- Use matplotlib with a custom dark style: plt.style.use('dark_background')
- Set figure facecolor to #0a0a0c and axes facecolor to #16161a
- Primary color: #00f2ff (cyan), Accent: #7000ff (purple), Warning: #ff4444 (red)
- All fonts: use matplotlib's default or load a sans-serif bold font
- Add soft glow effects by layering the same shape multiple times with 
  decreasing alpha and increasing linewidth (simulate bloom)
- Save all outputs with: plt.savefig('filename.png', dpi=150, bbox_inches='tight', 
  facecolor=fig.get_facecolor())
- Libraries to import: matplotlib, matplotlib.patches, matplotlib.patheffects, 
  numpy, and optionally Pillow for compositing
```

---