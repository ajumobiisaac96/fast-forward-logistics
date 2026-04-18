# Design System Strategy: Fast-Forward Courier & Delivery Services

## 1. Overview & Creative North Star
**Creative North Star: "Kinetic Precision"**

In the logistics industry, "speed" is often mistranslated as "clutter" or "chaos." For Fast-Forward, we are moving beyond the generic "delivery app" look. Our visual language is defined by **Kinetic Precision**: the marriage of high-velocity movement (Red) with absolute operational stability (Neutral Grayscale).

This design system avoids the "standard SaaS template" by utilizing intentional asymmetry—inspired by the forward-leaning slant of the brand's logo—and an editorial approach to whitespace. We don't just "place" elements on a grid; we curate them across a multi-layered environment that feels fast, airy, and premium.

---

## 2. Color & Tonal Architecture
The palette is rooted in the "Primary Red" (#bc001f), but its power is derived from the sophisticated neutral layers surrounding it.

### The "No-Line" Rule
**Explicit Instruction:** Use of 1px solid borders for sectioning is strictly prohibited. 
Visual boundaries must be defined through background color shifts. For example, a tracking module (`surface-container-low`) should sit directly on the global `background` (#f8f9fa). This creates a cleaner, more high-end "editorial" aesthetic that avoids the technical debt of "boxy" UI.

### Surface Hierarchy & Nesting
Treat the interface as a physical workspace of stacked materials:
*   **Level 0 (Base):** `surface` (#f8f9fa) – The foundation.
*   **Level 1 (Sections):** `surface-container-low` (#f3f4f5) – Large content blocks.
*   **Level 2 (Cards):** `surface-container-lowest` (#ffffff) – Individual interactive units.
*   **Level 3 (Pop-overs):** `surface-bright` (#f8f9fa) – Active floating elements.

### The "Glass & Gradient" Rule
To elevate the SaaS feel, use **Glassmorphism** for navigation bars and floating action panels. Use semi-transparent `surface` colors with a `backdrop-blur` (12px–20px). 
*   **Signature Textures:** For high-impact CTAs, do not use flat red. Apply a subtle linear gradient (45-degree angle) from `primary` (#bc001f) to `primary_container` (#e6192e). This provides the "soul" and depth missing from generic implementations.

---

## 3. Typography
We use a dual-font system to balance authority with technical efficiency.

*   **Display & Headlines (Manrope):** Chosen for its modern, geometric structure. Large `display-lg` (3.5rem) settings should use tight letter-spacing (-0.02em) to mimic the "forward" momentum of the logo.
*   **Body & Labels (Inter):** The industry standard for legibility. Used for all functional data (tracking numbers, addresses, timestamps).
*   **Hierarchy as Identity:** Use extreme scale contrast. Pairing a `display-md` headline with a `label-sm` secondary tag creates an editorial, high-fashion layout that communicates "Professional Logistics."

---

## 4. Elevation & Depth
Depth in this system is achieved via **Tonal Layering** rather than structural shadows.

*   **The Layering Principle:** Place a `surface-container-lowest` (#ffffff) card on a `surface-container-low` (#f3f4f5) background. This creates a "soft lift" that feels organic and premium.
*   **Ambient Shadows:** If a shadow is required for a floating state, it must be an "Ambient Shadow." 
    *   *Values:* `0px 12px 32px`
    *   *Color:* Use `on-surface` (#191c1d) at 4% to 6% opacity. It should feel like a soft glow of light, not a dark smudge.
*   **The Ghost Border:** If a component requires a boundary for accessibility (e.g., a search input), use a "Ghost Border": `outline-variant` (#e7bcb9) at **15% opacity**. Never use a 100% opaque border.

---

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `on-primary` text, `xl` (1.5rem) corner radius.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **Tertiary:** Ghost style. `primary` text, no background, background appears at 5% opacity on hover.

### Input Fields
*   **Logic:** Background-fill only (`surface-container-high`). No borders.
*   **Focus State:** A 2px "Ghost Border" of `primary` at 40% opacity.
*   **Typography:** Labels must use `label-md` in `secondary` color, positioned strictly above the field.

### Cards & Lists
*   **The Divider Ban:** Vertical divider lines are prohibited. 
*   **Separation:** Use `body-lg` spacing (1rem) and subtle background shifts (alternating `surface-container-low` and `surface-container-lowest`).
*   **Tracking Cards:** Should feature a "Glass" header to separate the "Status" from the "Details."

### Signature Component: The "Momentum Tracker"
A horizontal progress stepper for deliveries. Use a `primary` red line that tapers into a `secondary` gray line, utilizing `xl` roundedness for the progress indicator to match the brand's aerodynamic feel.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. For example, offset the Hero text to the left while keeping the CTA right-aligned to create "visual speed."
*   **Do** embrace massive whitespace. If a section feels "full," double the padding.
*   **Do** use `xl` (1.5rem) rounding for large containers and `DEFAULT` (0.5rem) for small buttons.

### Don't
*   **Don't** use pure black (#000000) for text. Use `on-background` (#191c1d) to maintain a soft, premium feel.
*   **Don't** use 1px solid borders. This is the fastest way to make the system look "cheap" or "templated."
*   **Don't** use drop shadows on every card. Reserve shadows only for elements that physically "float" over other content (like Modals or Tooltips).
*   **Don't** use standard icons. Use "Thin" or "Light" weight strokes (1px - 1.5px) to match the "Sleek" atmosphere.