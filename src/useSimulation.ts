import { useCallback, useState } from "react";

export interface SimulationState {
  tubeLen: number;
  pulseHz: number;
  fuel: number;
  exhaustColor: string;
  paused: boolean;
  muted: boolean;
  camera: number;
  showArrows: boolean;
  showHeat: boolean;
  showWaves: boolean;
  engineDesign: string;
  setEngineDesign?: (design: string) => void;
  setTubeLen: (v: number) => void;
  setPulseHz: (v: number) => void;
  setFuel: (v: number) => void;
  setExhaustColor: (c: string) => void;
  togglePause: () => void;
  toggleMute: () => void;
  cycleCamera: () => void;
  setCamera: (i: number) => void;
  setShowArrows: (b: boolean) => void;
  setShowHeat: (b: boolean) => void;
  setShowWaves: (b: boolean) => void;
}

export const useSimulation = (): SimulationState => {
  const [tubeLen, setTubeLen] = useState(1.4);
  const [pulseHz, setPulseHz] = useState(15);
  const [fuel, setFuel] = useState(0.7);
  const [exhaustColor, setExhaustColor] = useState("#68e0ff");
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [camera, setCamera] = useState(0);
  const [showArrows, setShowArrows] = useState(true);
  const [showHeat, setShowHeat] = useState(true);
  const [showWaves, setShowWaves] = useState(true);
  const [engineDesign, setEngineDesign] = useState('V-1 flying bomb');

  // Famous pulse jet engine designs
  const engineDesigns = [
    'V-1 flying bomb',
    'Buzz Bomb drone',
    'Pulse jet motorcycle',
    'Pulse jet go-kart',
    'Model aircraft',
  ];

  const togglePause = useCallback(() => setPaused((p) => !p), []);
  const toggleMute = useCallback(() => setMuted((m) => !m), []);
  const cycleCamera = useCallback(() => setCamera((c) => (c + 1) % 3), []);

  return { 
    tubeLen, 
    pulseHz, 
    fuel, 
    exhaustColor, 
    paused, 
    muted, 
    camera, 
    showArrows, 
    showHeat, 
    showWaves, 
    engineDesign, 
    setEngineDesign, 
    setTubeLen, 
    setPulseHz, 
    setFuel, 
    setExhaustColor, 
    togglePause, 
    toggleMute, 
    cycleCamera, 
    setCamera, 
    setShowArrows, 
    setShowHeat, 
    setShowWaves, 
    engineDesigns 
  };
};