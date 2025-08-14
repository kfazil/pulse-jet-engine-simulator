
import { drawGrid } from "./drawGrid";
import { drawStarfield } from "./drawStarfield";
import { drawCameraView } from "./drawCameraView";
import { drawHUD } from "./drawHUD";
import { SimulationState } from "./useSimulation";

export type EngineSceneRefs = {
    simRef: React.RefObject<SimulationState>;
    particlesRef: React.RefObject<any[]>;
    timeRef: React.RefObject<number>;
};


export function drawEngineScene(
    sctx: CanvasRenderingContext2D,
    hctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    refs: EngineSceneRefs,
    dt: number,
    computeTelemetry: () => { thrust: number; temp: number; rate: number },
    drawArrow: (...args: any[]) => void,
    spawnParticles: (...args: any[]) => void,
    stepParticles: (...args: any[]) => void
) {
    const { timeRef } = refs;
    drawGrid(sctx, width, height);
    drawStarfield(sctx, width, height, timeRef.current);
    drawCameraView(sctx, width, height, refs, dt, drawArrow, spawnParticles, stepParticles);
    drawHUD(hctx, width, height, computeTelemetry);
}
