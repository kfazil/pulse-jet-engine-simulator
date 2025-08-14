# Pulse Jet Engine Simulator

This project is a web-based simulator for various pulse jet engine designs, built with React and TypeScript. It features interactive controls, realistic engine visualizations, and dynamic blast effects.

## Features
- Multiple engine designs (V-1 bomb, Buzz Bomb drone, motorcycle, go-kart, model aircraft)
- Realistic chamber, airflow, and combustion overlays
- Adjustable parameters: fuel flow, pulse frequency, exhaust color, tube length, etc.
- Blast effect when parameters exceed safe limits
- Consistent engine visuals in normal and blast states
- Scenario presets and HUD progress bars

## Getting Started

### Prerequisites
- Node.js (v16 or newer recommended)
- npm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kfazil/pulse-jet-engine-simulator.git
   cd pulse-jet-engine-simulator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000`

## Usage
- Use the control panel to adjust engine parameters and switch between designs.
- Observe real-time changes in engine behavior and visual effects.
- If parameters exceed safe limits, a blast effect will be triggered.

## Project Structure
- `src/` - Main source code
  - `App.tsx` - Main React app
  - `ControlPanel.tsx` - UI controls
  - `engineDesigns.ts` - Engine drawing logic
  - `drawCameraView.ts` - Main visualization
  - `drawHUD.ts`, `drawGrid.ts`, `drawStarfield.ts` - Visual overlays
- `public/` - Static assets
- `index.html` - Main HTML file

## Contributing
Pull requests and suggestions are welcome! Please open an issue or submit a PR.

## License
MIT
