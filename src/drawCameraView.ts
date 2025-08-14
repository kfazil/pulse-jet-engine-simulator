import { EngineSceneRefs } from "./drawEngineScene";
import {
    drawV1Bomb,
    drawBuzzBombDrone,
    drawPulseJetMotorcycle,
    drawPulseJetGoKart,
    drawModelAircraft
} from './engineDesigns';

export function drawCameraView(
    sctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    refs: EngineSceneRefs,
    dt: number,
    drawArrow: (...args: any[]) => void,
    spawnParticles: (...args: any[]) => void,
    stepParticles: (...args: any[]) => void
) {
    const { simRef, particlesRef, timeRef } = refs;
        if (simRef.current.camera === 0) {
            // Side view main engine drawing
            const cx = width * 0.18; const cy = height * 0.55;
            const tubePix = 500 * simRef.current.tubeLen; const ch = 80;
            const chamber = { x: cx, y: cy - ch / 2, w: tubePix * 0.45, h: ch };
            const nozzleX = chamber.x + chamber.w;
            const flameLen = 120 + 260 * simRef.current.fuel * (0.4 + Math.max(0, Math.sin(timeRef.current * simRef.current.pulseHz * 2 * Math.PI)) * 0.9);

            // Modular sci-fi engine design selection
            const params = { chamber, nozzleX, cy, ch, flameLen, timeRef, simRef };
            switch (simRef.current.engineDesign) {
                case 'V-1 flying bomb':
                    drawV1Bomb(sctx, params); break;
                case 'Buzz Bomb drone':
                    drawBuzzBombDrone(sctx, params); break;
                case 'Pulse jet motorcycle':
                    drawPulseJetMotorcycle(sctx, params); break;
                case 'Pulse jet go-kart':
                    drawPulseJetGoKart(sctx, params); break;
                case 'Model aircraft':
                    drawModelAircraft(sctx, params); break;
                default:
                    drawV1Bomb(sctx, params); break;
            }
            // ...existing code for exhaust, particles, overlays...


        // Improved exhaust with shock diamonds
        sctx.save();
        sctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 8; i++) {
            const phase = Math.sin(timeRef.current * simRef.current.pulseHz * 2 * Math.PI + i * 0.5);
            const ripple = Math.sin(timeRef.current * 2 + i * 1.2) * 8;
            // Dynamic color
            const fuel = simRef.current.fuel;
            const pulseHz = simRef.current.pulseHz;
            let r = 80 + Math.round(fuel * 175);
            let g = 180 + Math.round(fuel * 40) - Math.round(pulseHz * 2);
            let b = 255 - Math.round(fuel * 120) - Math.round(pulseHz * 2);
            r = Math.max(0, Math.min(255, r));
            g = Math.max(0, Math.min(255, g));
            b = Math.max(0, Math.min(255, b));
            const dynamicColor = `rgba(${r},${g},${b},${0.18 + fuel * 0.3})`;
            sctx.beginPath();
            sctx.moveTo(nozzleX + 38, cy - ch * 0.18 + ripple);
            sctx.quadraticCurveTo(nozzleX + flameLen * 0.4, cy - ch * 0.42 + ripple * 0.5, nozzleX + flameLen, cy + phase * 12);
            sctx.quadraticCurveTo(nozzleX + flameLen * 0.4, cy + ch * 0.42 + ripple * 0.5, nozzleX + 38, cy + ch * 0.18 + ripple);
            sctx.closePath();
            sctx.fillStyle = dynamicColor;
            sctx.shadowColor = dynamicColor;
            sctx.shadowBlur = 32;
            sctx.fill();
            // Shock diamonds
            for (let d = 1; d < 4; d++) {
                let dx = nozzleX + 38 + (flameLen - 38) * (d / 4);
                let dy = cy + Math.sin(timeRef.current * 2 + d) * 8;
                sctx.save();
                sctx.globalAlpha = 0.18 + fuel * 0.18;
                sctx.beginPath();
                sctx.ellipse(dx, dy, 12, 4, 0, 0, Math.PI * 2);
                sctx.fillStyle = `rgba(${r},${g},${b},0.22)`;
                sctx.shadowColor = dynamicColor;
                sctx.shadowBlur = 12;
                sctx.fill();
                sctx.restore();
            }
        }
        sctx.restore();

        // ...existing code for particles, overlays...
    } else if (simRef.current.camera === 1) {
        // simplified cutaway: draw central cross-section
        const cx = width * 0.5; const cy = height * 0.55;
        const tubeLen = 420 * simRef.current.tubeLen; const ch = 90;
        const chamber = { x: cx - tubeLen * 0.45, y: cy - ch / 2, w: tubeLen * 0.45, h: ch };
        const nozzleX = chamber.x + chamber.w;
        const exhaustX = nozzleX + tubeLen * 0.55;

        sctx.save(); sctx.globalAlpha = 0.13; for (let gx = 0; gx < width; gx += 36) { sctx.beginPath(); sctx.moveTo(gx, 0); sctx.lineTo(gx, height); sctx.strokeStyle = '#68e0ff'; sctx.lineWidth = 1.1; sctx.stroke(); } for (let gy = 0; gy < height; gy += 36) { sctx.beginPath(); sctx.moveTo(0, gy); sctx.lineTo(width, gy); sctx.strokeStyle = '#ff7df2'; sctx.lineWidth = 1.1; sctx.stroke(); } sctx.restore();

        sctx.save(); sctx.shadowColor = '#ff7df2'; sctx.shadowBlur = 18; sctx.fillStyle = 'rgba(255,125,242,0.22)'; sctx.fillRect(chamber.x, chamber.y, chamber.w, chamber.h); sctx.restore();
        sctx.save(); sctx.globalAlpha = 0.18; sctx.fillStyle = 'rgba(104,224,255,0.18)'; sctx.fillRect(chamber.x + chamber.w, chamber.y + ch * 0.22, tubeLen * 0.55, ch * 0.56); sctx.restore();
        sctx.save(); sctx.globalAlpha = 0.22; sctx.beginPath(); sctx.moveTo(exhaustX, cy - ch * 0.28); sctx.lineTo(exhaustX + 38, cy); sctx.lineTo(exhaustX, cy + ch * 0.28); sctx.closePath();
        sctx.fillStyle = simRef.current.exhaustColor; sctx.shadowColor = simRef.current.exhaustColor; sctx.shadowBlur = 18; sctx.fill(); sctx.restore();
    } else {
        // chamber view (index 2+)
        const cx = width * 0.5; const cy = height * 0.5; const radius = 90 + simRef.current.tubeLen * 60;
        sctx.save(); sctx.globalAlpha = 0.22; for (let i = 0; i < 18; i++) { let ang = (i / 18) * Math.PI * 2 + timeRef.current * 0.7; let r = radius * 0.92 + Math.sin(timeRef.current * 2 + i) * 8; sctx.beginPath(); sctx.arc(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 8 + Math.sin(timeRef.current * 2 + i) * 3, 0, Math.PI * 2); sctx.fillStyle = 'rgba(104,224,255,' + (0.18 + Math.abs(Math.sin(timeRef.current + i)) * 0.18) + ')'; sctx.shadowColor = '#68e0ff'; sctx.shadowBlur = 18; sctx.fill(); } sctx.restore();
    }
}
