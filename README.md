# R.S. Constructions — 3D Residential Architectural Website

An interactive, 3D WebGL architectural showcase and single-page experience for **R.S. Constructions**, master builders specializing in **Independent Houses, Luxury Duplex Villas, and Multi-Storey Residential Apartments**. 

Inspired by the spatial design and cinematic scroll architecture of [MengTo's KAGE](https://github.com/MengTo/kage.git).

---

## 🏛️ Project Highlights

- **Live 3D WebGL World:** Built with a vendored Three.js runtime with zero external build step dependencies.
- **Architectural Scope:**
  - **Independent Contemporary Duplex Villa:** Cantilevered master suites, panoramic glowing windows, teak-wood louvers, terrace sun pergola, and reflecting pool.
  - **Multi-Storey Residential Apartments:** G+5 residential tower with stilt parking columns, cantilevered glass balconies, and vertical concrete architectural fins (*brise-soleil*).
  - **Structural X-Ray Mode:** Toggleable transparent blueprint glass revealing reinforced concrete columns, bored foundation footings, and glowing Fe550D TMT rebar grids.
- **Interactive Controls:**
  - **3D Orbit Inspection:** Drag with mouse or touch-swipe on mobile to rotate the 3D estate freely.
  - **View Presets:** Quick HUD switches between Masterplan Overview, Duplex Villa, Apartments, and Structural X-Ray.
  - **Day / Night Lighting:** Switch between Night Architectural Illumination and Twilight Golden-Hour sunlight.
  - **Side Chapter Rail:** KAGE-style vertical rail tracking scroll progress across 6 architectural chapters.
- **Interactive Cost Estimator:** Real-time indicative budget calculations in Lakhs/Crores, estimated schedules in months, and required steel in metric tons.
- **Client-Side Validated Contact Form:** Directly routes consultation requests to the ownership team.

---

## 👷 Leadership & Direct Contact

- **Business Name:** R.S. Constructions
- **Yata Ramchander (Owner & Managing Director):** [+91 94408 65895](tel:9440865895)
- **Ale Sudeesh (Owner & Executive Director):** [+91 95500 33661](tel:9550033661)

---

## 🚀 Running Locally

This is a clean, dependency-free static website. Simply open `index.html` in any modern web browser, or serve it using Python:

```bash
python3 -m http.server 8088
```

Then visit [http://localhost:8088/](http://localhost:8088/).

---

## 📁 Repository Structure

```text
RS-Website/
├── index.html       # Single-page layout with 3D canvas, HUD, chapter rail, and content
├── styles.css       # Obsidian & Amber KAGE design language, glassmorphism, responsive
├── app.js           # Three.js 3D engine, CatmullRom camera spline, estimator, form logic
├── three.min.js     # Vendored Three.js r149 engine (offline reliable)
└── README.md        # Project documentation
```
