# /a — Motion Linktree & Identity Hub

A single-screen, zero-scroll portfolio and linktree landing page engineered for **Modther Abdalhag** (Software Developer). Built entirely with pure web standards (HTML5, Vanilla CSS, and modern JavaScript) and anchored in the **AXIS** 60° geometric motion design system.

---

## Philosophy: "Motion is Punctuation"

The interface operates under a strict design rule: motion occurs once on entrance or deliberate user interaction, then gracefully settles into a stable, legible state. There are no disorienting ambient loops, mouse-chasing effects, or UI distractions.

Every angle, clip path, translation, and button transition aligns mathematically to the **60° brand axis** ($\tan(30^\circ) = 0.57735$, unit vectors $[0.5, -0.866]$), running from bottom-left to top-right.

---

## Features

- **Single-Screen Architecture**: Engineered to occupy exactly `100svh` with zero page scroll across desktop, tablet, and mobile viewports.
- **AXIS Motion System**:
  - **Draw**: SVG perimeter path animation using normalized `pathLength="1"`.
  - **Trace**: Outline drawing followed by a smooth transition to solid geometry.
  - **Ride**: Physical displacement along the 60° vector with deceleration easing.
  - **Cut**: Angled blade reveal using dynamic CSS `clip-path` masks.
  - **Fold**: Interactive forward slash (`/`) that straightens to vertical (`|`) on press and settles into a backslash (`\`) on hover or active state.
- **Circuit Track & Runner**: Ambient background tracks overlaid with animated light pulses tracing the brand geometry.
- **Brand Typography**: Exclusively powered by the **Commissioner** variable font family across all display, body, and technical elements.
- **Brand Text Selection**: Highlighted selections use the signature electric blue (`#0045d5`) and pure white.
- **Client-Side Tamper Resistance**:
  - Global `window.Axis` instance frozen via `Object.freeze()` to prevent console manipulation.
  - Disabled context menu and inspection keyboard shortcuts (`F12`, `Ctrl+Shift+I`, `Ctrl+U`, `Ctrl+S`).
- **Accessibility by Design**: Full support for `prefers-reduced-motion: reduce`, instantaneously presenting static states and subtle linear transitions.

---

## Brand Palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--navy` | `#00041c` | Primary dark canvas background (Midnight Navy) |
| `--royal` | `#001b7f` | Deep royal blue background gradient step |
| `--electric` | `#0045d5` | Vibrant electric blue for active elements and focus |
| `--sky` | `#349dff` | Skyline blue for secondary text, accents, and glows |
| `--ice` | `#9dd5fa` | Ice blue for interactive blades, borders, and highlights |
| `--paper` | `#f5f5f5` | Solid mark fill and light elements |

---

## Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automated GitHub Pages CI/CD workflow
├── brand/
│   ├── lockup-white.svg      # Horizontal logo lockup
│   ├── mark-white.svg        # Standalone vector mark
│   └── ...                   # Additional vector assets
├── index.html                # Semantic single-screen markup
├── script.js                 # AXIS motion runtime & interaction controllers
├── style.css                 # Design tokens, keyframes, and layout system
└── README.md                 # Project documentation
```

---

## Deployment

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) configured for automated deployment to **GitHub Pages**:

1. Pushes to the `main` branch automatically trigger the deployment pipeline.
2. The root files (`index.html`, `style.css`, `script.js`, and `brand/`) are bundled and published without build-step dependencies.

---

## Author

**Modther Abdalhag**  
- GitHub: [@moibhub](https://github.com/moibhub)  
- Portfolio & Code: [github.com/moibhub](https://github.com/moibhub)
