# KAVIO Edu — English Smart Learning Portal

Interactive, visual English learning application designed with modern UI standards, fluid micro-interactions, and choreographed kinetic transitions.

## ✨ Features

- **Interactive Grammar & Helper Verb Lessons**:
  - `Helper Have` (Present Perfect & Participial morphing)
  - `Helper Did` (Past Simple transitions)
  - `Helper Modal Will` (Future modal structures)
  - `Helper Be` & Continuous Aspects
  - `Present Tense` & `Negative State` lessons
- **Kinetic Stem & Word-Level Morphing**:
  - Choreographed multi-phase transitions (stem-locking, spatial separation, odometer vertical rolling).
  - Bidirectional 2-phase mount & unmount with zero-coordinate jump guarantee (0.000mm snapping prevention).
  - Dynamic responsive 1-line sentence token scaling.
  - High-performance kinetic needle-peak easing curve (`[0.85, 0, 0.15, 1]`).
- **Interactive Grammar Playground**:
  - Real-time sentence structure builder and rule visualizer.
- **Audio & Pronunciation Guidance**:
  - Native browser Web Speech synthesis with rate and pitch controls.
- **Profile & Authentication**:
  - Built-in Appwrite integration and local profile persistence.

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite 6
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion 12 (`framer-motion`)
- **Icons**: Lucide React
- **Smooth Scrolling**: Lenis
- **Package Manager**: Bun / npm

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)

### Installation

```bash
# Clone the repository
git clone git@github.com:imanecdoche/KAVIOEDU.git
cd KAVIOEDU

# Install dependencies
bun install
# or
npm install
```

### Running Locally

```bash
# Start development server
bun run dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
bun run build
# or
npm run build
```
