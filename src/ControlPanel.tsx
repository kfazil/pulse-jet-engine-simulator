import React from "react";
import { SimulationState } from "./useSimulation";

interface Props {
  sim: SimulationState;
}

export const ControlPanel: React.FC<Props> = ({ sim }) => {
  const camNames = ['Side','Cutaway','Chamber'];

  // Scenario presets
  const scenarios = [
    { name: 'Min', tubeLen: 0.6, pulseHz: 5, fuel: 0.2 },
    { name: 'Idle', tubeLen: 1.2, pulseHz: 10, fuel: 0.25 },
    { name: 'Cruise', tubeLen: 1.4, pulseHz: 30, fuel: 0.5 },
    { name: 'Boost', tubeLen: 1.6, pulseHz: 80, fuel: 0.8 },
    { name: 'Max', tubeLen: 2.2, pulseHz: 250, fuel: 1.0 }
  ];

  // Famous pulse jet engine designs
  const engineDesigns = [
    'V-1 flying bomb',
    'Buzz Bomb drone',
    'Pulse jet motorcycle',
    'Pulse jet go-kart',
    'Model aircraft',
  ];

  function handleDesignChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (sim.setEngineDesign) {
      sim.setEngineDesign(e.target.value);
    }
  }

  const setScenario = (s: typeof scenarios[0]) => {
    sim.setTubeLen(s.tubeLen);
    sim.setPulseHz(s.pulseHz);
    sim.setFuel(s.fuel);
  };

  return (
    <aside className="backdrop-blur-lg bg-white/5 border-l border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.45)] flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase opacity-90">
        <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white to-cyan-300 shadow-[0_0_16px_#68e0ff]" />
        PULSE JET INTERFACE
      </div>
      {/* Scenario Presets */}
      <div className="flex flex-wrap gap-2 my-2">
        {scenarios.map(s => (
          <button
            key={s.name}
            className="px-3 py-1 rounded-lg bg-cyan-900/30 text-cyan-200 text-xs font-bold tracking-wide border border-cyan-400/30 hover:bg-cyan-400/20 transition"
            onClick={() => setScenario(s)}
          >
            {s.name}
          </button>
        ))}
      </div>
      <div className="text-lg font-extrabold tracking-wide">VX-Δ “Aether” Simulator</div>
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2" />

      <ControlSlider label="Tube Length" min={0.6} max={2.2} step={0.01} value={sim.tubeLen} onChange={sim.setTubeLen} unit="m" />
      <ControlSlider label="Pulse Frequency" min={5} max={250} step={0.1} value={sim.pulseHz} onChange={sim.setPulseHz} unit="Hz" />
      <ControlSlider label="Fuel Flow" min={0.2} max={1} step={0.01} value={sim.fuel} onChange={sim.setFuel} unit="ϕ" />

      <div className="bg-white/5 border border-white/20 rounded-xl p-3">
        <h3 className="text-xs uppercase opacity-80 tracking-widest mb-2">Exhaust Color</h3>
        <div className="flex items-center gap-3">
      {/* Engine Design Selector */}
      <div className="mb-2">
        <label htmlFor="engine-design" className="font-bold mr-2">Engine Design:</label>
        <select
          id="engine-design"
          value={sim.engineDesign}
          onChange={handleDesignChange}
          className="px-2 py-1 rounded bg-cyan-900/30 text-cyan-200 border border-cyan-400/30"
        >
          {engineDesigns.map(design => (
            <option key={design} value={design}>{design}</option>
          ))}
        </select>
      </div>
          <input type="color" value={sim.exhaustColor} onChange={(e)=>sim.setExhaustColor(e.target.value)} />
          <div className="text-sm opacity-90">{sim.exhaustColor}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 border border-white/20 rounded-xl p-3 text-center">
          <h4 className="text-xs uppercase opacity-80 tracking-widest">Thrust</h4>
          <div className="text-2xl font-extrabold">{(sim.fuel*sim.pulseHz*(0.8+1)).toFixed(1)} N</div>
        </div>
        <div className="bg-white/5 border border-white/20 rounded-xl p-3 text-center">
          <h4 className="text-xs uppercase opacity-80 tracking-widest">Pulse Rate</h4>
          <div className="text-2xl font-extrabold">{sim.pulseHz.toFixed(1)} Hz</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/20 rounded-xl p-3 flex items-center gap-3">
        <label className="flex items-center gap-2"><input type="checkbox" checked={sim.showArrows} onChange={(e)=>sim.setShowArrows(e.target.checked)} /> Arrows</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={sim.showHeat} onChange={(e)=>sim.setShowHeat(e.target.checked)} /> Heat Map</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={sim.showWaves} onChange={(e)=>sim.setShowWaves(e.target.checked)} /> Pressure Waves</label>
      </div>

      <div className="bg-white/5 border border-white/20 rounded-xl p-3 flex items-center justify-between">
        <div>Camera</div>
        <div className="font-bold">{camNames[sim.camera]}</div>
      </div>

      <div className="text-xs opacity-80 mt-auto">Controls: <code className="bg-black/40 px-1 rounded">F</code> fullscreen, <code className="bg-black/40 px-1 rounded">M</code> mute, <code className="bg-black/40 px-1 rounded">Space</code> pause</div>
    </aside>
  );
};

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v:number) => void;
  unit?: string;
}

const ControlSlider: React.FC<SliderProps> = ({ label, min, max, step, value, onChange, unit }) => {
  return (
    <div className="bg-white/5 border border-white/20 rounded-xl p-3 shadow-md">
      <h3 className="text-xs uppercase opacity-80 tracking-widest mb-2">{label}</h3>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e)=>onChange(parseFloat(e.target.value))} className="w-full accent-cyan-400" />
        <div className="text-sm opacity-90 min-w-[50px] text-right">{value.toFixed(step<1?2:1)} {unit}</div>
      </div>
    </div>
  );
};