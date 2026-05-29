# SYNAPSE: A Literary Journal of the AI Era

Welcome to **SYNAPSE**, an immersive, interactive, and scroll-reactive web application that explores the boundary between machine intelligence, human consciousness, and computational storytelling.

The centerpiece of this journal is **"The Gathering Storm: Winter of 2022"**, a scroll-driven multimedia interactive essay that traces the geopolitical and economic bottlenecks of late 2022 leading up to the historic release of ChatGPT, and charts the explosive evolution of artificial intelligence through the agentic frontier of 2026.

---

## 🌟 Key Features

### 1. Scroll-Reactive Ambient Audio Engine (`js/audio.js`)
Powered by the native **Web Audio API**, Synapse synthesizes rich, real-time auditory atmospheres that react to user scroll depth and navigation states.
* **Low-Frequency Drone:** Dual detuned oscillators (Sawtooth and Triangle at C2/65.41 Hz) create a heavy, atmospheric base tone.
* **Tension Modulator:** A high-pitched metallic ring (Sawtooth at 220 Hz) that increases in frequency, resonance, and gain as you scroll through the tense political climate of 2022.
* **Synthesized Wind Noise:** Generates custom white noise buffers in real-time to simulate a cold, biting winter wind.
* **Interactive Arpeggiator & Sequencer:** Automatically shifts scales, tempos, and drum kicks to mirror key historic milestones:
  * **2022 (ChatGPT Release):** Gentle C minor arpeggios (350ms tempo).
  * **2023 (Multimodal Wars):** G minor arpeggios (280ms tempo).
  * **2024 (Agency Dawn):** D minor arpeggios (200ms tempo).
  * **2025 (DeepSeek Inflection):** A minor arpeggios (140ms tempo).
  * **2026 (Agentic Frontier):** Bright, optimistic C Major Pentatonic arpeggios (90ms tempo) synced with a steady, low-frequency synthetic kick drum (45 Hz).
* **Smart Audio States:** Instantly fades audio elements and routes sound configurations depending on whether you are on the Home Page, the Manifesto, or the Board.

### 2. Dynamic Canvas Particle System (`js/particles.js`)
An interactive, high-performance HTML5 `<canvas>` particle simulation renders complex, fluid neural networks and environmental visuals behind the text.
* **Interactive Node Synapses:** Nodes dynamically search for neighbors within proximity and draw connections (synaptic pathways).
* **Electrical Pulse Propagation:** Triggered randomly or via user interaction, glowing electrical signals travel along connection paths.
* **Cursor Magnetics & Physics:**
  * In the **Winter** phase, particles drift downwards and repel gently around the cursor.
  * In the **War & Inflation** phases, particles turn red/gold and are scattered aggressively by mouse movements.
  * In the **ChatGPT** phase, particles switch to a bright teal grid and are magnetically pulled toward the cursor.
  * During the **DeepSeek** timeline transition, a radial physics shockwave is triggered, scattering pink/magenta nodes across the screen.
* **Responsive Dimensions:** Re-renders and adapts particle coordinates instantly during window resize events.

### 3. SPA Routing & UI Architecture (`js/router.js` & `app.js`)
A single-page application structure designed for smooth, high-fidelity narrative flow.
* **CSS View Transitions:** Integrates the modern browser `document.startViewTransition` API for seamless page swaps.
* **Interactive Dot Navigation:** A vertical dot index generated dynamically mapping chapters to themes, allowing users to jump directly to specific years/events.
* **Side Reading Drawer:** A slide-out glassmorphism drawer that loads article metadata and details dynamically (e.g., *Loss Function Sonata*, *The Ghost in the Context Window*).
* **Interactive Terminal Simulator (`js/terminal.js`):** A custom simulated terminal in Chapter 9 allowing users to interact with a model trained to reflect on the conditions of its November 22, 2022 release.
* **Mock Submissions Handling:** Fully styled, responsive submission forms with loader loops and feedback states for user pitches.

---

## 🎨 Design System (`css/`)
Synapse is built with **Vanilla CSS** utilizing modern visual principles:
* **Typography:** Interweaves the clean, tech-focused **Outfit** font for UI controls and the classic, literary **Playfair Display** font for prose.
* **Harmonious Color Tokens:**
  * Cold Blue (`#38bdf8`): Baseline interactive theme.
  * Geopolitical Red (`#f43f5e`): Tensions and systemic friction.
  * ChatGPT Teal (`#0df2c9`): The generative AI spark.
  * Strained Optimism Gold (`#fbbf24`): Temporary market and diplomatic reprieves.
* **Glassmorphism:** Leverages fine border-radius properties, backdrop filters, and low-opacity colors to build depth.
* **Accessibility:** Integrated `@media (prefers-reduced-motion)` overrides that deactivate the canvas rendering loop, visual visualizer animations, and heavy transition shifts to maintain safety and comfort for all users.

---

## 📂 File Directory

```
├── css/
│   ├── base.css           # Typography, global root variables, custom headers, buttons, and sound overlays
│   ├── journal.css        # Layouts for Home, Manifesto (Mission), Editorial Board, and forms
│   └── story.css          # Chapter cards, interactive terminal styling, drawers, dot nav, and timelines
├── js/
│   ├── audio.js           # Synth loops, Web Audio context, arpeggiators, filters, and mute toggles
│   ├── particles.js       # HTML5 Canvas rendering loop, physics, mouse magnetism, and shockwaves
│   ├── router.js          # SPA navigation, reading drawer data, submission form handlers, and transitions
│   ├── state.js           # Central application state and UI DOM element caching
│   └── terminal.js        # Logic for the interactive Chapter 9 ChatGPT terminal simulator
├── assets/                # Visual assets for the editorial board members
├── app.js                 # Global coordinator, dot-nav generator, and scroll listener
├── index.html             # Core semantic layout of the application
└── README.md              # Project documentation
```

---

## 🚀 Running the Project Locally

Since the application is built using modern ES6 Javascript Modules (`import`/`export`), opening `index.html` directly from your local filesystem (`file://`) will trigger CORS browser security blocks. 

To run the project, please use a local development server.

### Option A: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Click the **Go Live** button in the bottom right status bar.

### Option B: Using Node.js / npm
If you have Node.js installed, you can use any static server library. For example:
```bash
# Install and run a simple live server
npx http-server .
```
Or, if you have `python` installed:
```bash
# Python 3
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:8080` (or `http://localhost:8000`).

---

## 🛠️ Technological Stack

* **Structure:** HTML5 Semantic elements (`<header>`, `<main>`, `<article>`, `<canvas>`)
* **Logic:** Vanilla ES6 Javascript (Modular structure)
* **Styling:** Vanilla CSS3 (Custom properties, grid, flexbox, glassmorphic design)
* **Audio Synthesis:** Native Web Audio API
* **Graphics:** HTML5 2D Canvas API