Designing for spatial computing inside a physical vehicle requires strict attention to human factors. Since this project bridges usability engineering and XR development, the ergonomic guidelines must address physical, visual, and cognitive safety.

Here are the core ergonomic guidelines for this Mixed Reality automotive onboarding experience:

### 1. Visual Ergonomics (Eye Comfort)
* **Depth of Field & Focal Distance:** To minimize eye strain caused by the Vergence-Accommodation Conflict, place primary digital UI elements at an optimal focal distance. Position interactive panels between 1.0 and 2.0 meters away from the driver's eyes (e.g., hovering just past the steering column).
* **World-Locked UI:** Never lock UI elements directly to the user's field of view (where the UI rigidly follows head movements). This causes immediate nausea. All digital overlays must be "world-locked" (anchored firmly to the physical car dashboard or the road).
* **Contrast and Legibility:** Passthrough video cameras can wash out colors depending on showroom lighting. Use high-contrast UI components (e.g., glowing cyan or stark white against dark, translucent backdrops). Ensure text is large, sans-serif, and accounts for the specific resolution limits of the headset.

### 2. Physical Ergonomics (Body Comfort)
* **Combating "Gorilla Arm":** Extended reaching causes rapid shoulder and arm fatigue. For static interactions while the car is parked, anchor virtual buttons near natural resting zones. Place UI slightly above the steering wheel rim or directly over the center console, allowing elbows to remain supported.
* **The Comfortable Field of Regard:** Keep primary educational content within a 30-degree cone of central vision. Avoid placing tooltips low on the floorboard or high on the roof lining, which forces awkward neck stretching.
* **Sizing Gaze-Based Targets:** If using gaze-and-dwell selection or voice commands, ensure the visual hit targets (the bounding boxes around features) are large enough that minor head micro-tremors do not cause accidental mis-selections.

### 3. Cognitive Ergonomics (Mental Load)
* **Progressive Disclosure:** The human brain cannot process the entire dashboard at once. Reveal digital signifiers sequentially. For example, highlight the climate control affordances only after the infotainment lesson is fully completed and dismissed.
* **The 3-Second Motion Rule:** When the car is moving (e.g., during the ADAS demonstration), cognitive load is entirely dominated by the act of driving safely. Digital overlays must be instantly scannable without requiring the user to read text. Use pure spatial semiotics (shapes, lines, colors) and ensure they fade out entirely within 3 seconds.
* **Multimodal Feedback:** When a virtual interface is interacted with, provide immediate visual (color change) and auditory (a sharp, pleasant click) feedback to compensate for the lack of physical haptics in thin air.

### 4. Hardware Ergonomics (Session Management)
* **Timeboxing the Experience:** Current MR headsets have noticeable weight and generate thermal heat. Cap the immersive onboarding flow at a maximum of 10 to 15 minutes. Beyond this duration, physical discomfort on the face and neck will begin to outweigh the educational benefits.
* **Passthrough Latency Awareness:** Video passthrough has inherent latency. Fast head movements can cause the digital anchors to visibly jitter or drift from the physical car buttons. Design the audio cues and narrative flow to encourage slow, deliberate exploration of the cabin.

***

That is an excellent choice for a Mixed Reality automotive environment. By choosing **ray-casting pinch** (far-field interaction) instead of direct-touch (near-field interaction), you completely eliminate the "gorilla arm" fatigue that comes from constantly reaching out to touch floating panels. Pairing it with **voice** provides a robust fallback for when the user's hands are occupied.

Since you are relying on these two specific modalities, your spatial UI needs to be designed around the physics of distant targeting and acoustic commands. 

Here is how to optimize your UX for a ray-cast and voice system:

### 1. Optimizing the Ray-Cast (Visual & Physical)
When a user points a ray from their hand or head, tiny micro-tremors in their physical body are amplified over distance. A slight hand shake translates to a massive cursor jump a few feet away.
* **Oversized Hitboxes:** The invisible interactive area (hitbox) around a virtual button must be at least 20-30% larger than the visible button itself. This prevents the user from accidentally slipping off the target while attempting the pinch gesture.
* **Magnetic Snapping (Gravity Wells):** When the ray gets close to an interactive element, the cursor should subtly "snap" to the center of the target. This drastically reduces the precision required from the user, making the interaction feel magical and effortless.
* **The "Laser" Aesthetic:** Do not use a solid, bright laser beam coming from the hand—it clutters the beautiful car interior. Instead, use a subtle, fading dotted line, or entirely remove the beam and just show a soft, glowing cursor that appears on the surfaces the user points at.
* **Distinct Hover States:** The exact millisecond the ray intersects a target, the target must react. It should glow brighter, scale up slightly (about 5-10%), and emit a very soft audio cue (like a low-pitch hum) so the user knows they are locked on *before* they pinch.

### 2. Synergizing Ray-Casting with Voice
The real power of your system is combining these two inputs so they cover each other's weaknesses.
* **Point-and-Speak (Multimodal Interaction):** Allow the user to point the ray at an object and simply use voice to execute the action. For example, pointing the ray at the physical passenger screen and saying, *"Tell me about this"* or *"Next."* This means they don't even have to execute the physical pinch if their hands are resting.
* **Voice as the Universal Escape Hatch:** Ray-casting requires line of sight. If the user is looking out the window, they shouldn't have to turn their head, find the UI, point, and pinch just to skip a step. Voice commands like *"Alexa, skip"* or *"Close tutorial"* must be globally available at all times.

### 3. The "In-Motion" Safety Lockout
Since you are designing for a car, this is the most critical constraint for your specific interaction model:
* **Disable the Pinch in Drive:** When the car is moving (during the ADAS demonstration), taking a hand off the steering wheel to execute a ray-cast pinch is physically dangerous. 
* **The Handoff:** As soon as the car goes into Drive, the MR system should display a brief toast notification: *"Manual interactions disabled for safety. Use Voice Commands."* During the drive, the ray-casting system should completely shut off, and the user must rely entirely on voice (or gaze-and-dwell, if your headset supports it) to progress through any remaining UI.