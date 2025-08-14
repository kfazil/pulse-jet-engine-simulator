import React from "react";
import { SimulationCanvas } from "./SimulationCanvas";
import { ControlPanel } from "./ControlPanel";
import { useSimulation } from "./useSimulation";

export default function App() {
  const sim = useSimulation();

  return (
    <div className="w-screen h-screen bg-[#060811] text-[#eef3ff] font-sans overflow-hidden relative">
      <div className="fixed inset-0 pointer-events-none mix-blend-screen animate-nebula" />
      <div className="grid grid-cols-[1fr_420px] h-full">
        <SimulationCanvas sim={sim} />
        <ControlPanel sim={sim} />
      </div>
    </div>
  );
}