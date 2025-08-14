import React, { useEffect, useRef } from "react";
import { SimulationState } from "./useSimulation";
import { useAudioEngine } from "./hooks/useAudioEngine";
import { drawEngineScene, EngineSceneRefs } from "./drawEngineScene";

type Particle = {
  x: number; y: number; vx: number; vy: number; life: number; hot: number; spark?: boolean;
};

interface Props { sim: SimulationState; }

export const SimulationCanvas: React.FC<Props> = ({ sim }) => {
  const simRef = useRef(sim); // keep stable reference updated manually
  simRef.current = sim as any;

  const simCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const lastRef = useRef(performance.now());

  const paramsRef = useRef({
    pulseHz: sim.pulseHz,
    fuel: sim.fuel,
  });
  const mutedRef = useRef(sim.muted);

  useEffect(()=>{ paramsRef.current.pulseHz = sim.pulseHz; paramsRef.current.fuel = sim.fuel; }, [sim.pulseHz, sim.fuel]);
  useEffect(()=>{ mutedRef.current = sim.muted; }, [sim.muted]);

  const audio = useAudioEngine(paramsRef, mutedRef);

  // Resize
  useEffect(()=>{
    const resize = ()=>{
      const simCanvas = simCanvasRef.current, hud = hudCanvasRef.current;
      if(!simCanvas || !hud) return;
      const w = simCanvas.parentElement?.clientWidth || 800;
      const h = simCanvas.parentElement?.clientHeight || 600;
      simCanvas.width = w; simCanvas.height = h;
      hud.width = w; hud.height = h;
    };
    resize();
    window.addEventListener('resize', resize);
    return ()=> window.removeEventListener('resize', resize);
  },[]);

  // Utilities ported from original
  function hexToRgb(hex: string){ hex = hex.replace('#',''); if(hex.length===3) hex = hex.split('').map((c)=>c+c).join(''); const num = parseInt(hex,16); return `${(num>>16)&255},${(num>>8)&255},${num&255}`; }
  function computeTelemetry(){ const resonance = Math.max(0, 1 - Math.abs(simRef.current.tubeLen - (1.6 - simRef.current.fuel*0.7))); const thrust = (simRef.current.fuel * simRef.current.pulseHz) * (0.8 + resonance*1.8); const temp = (400 + simRef.current.fuel*900) * (0.6 + resonance*0.7); return { thrust, temp, rate: simRef.current.pulseHz }; }
  function drawArrow(ctx: CanvasRenderingContext2D, x1:number,y1:number,x2:number,y2:number,color:string){ ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); let angle = Math.atan2(y2-y1,x2-x1); ctx.beginPath(); ctx.moveTo(x2,y2); ctx.lineTo(x2-8*Math.cos(angle-Math.PI/7),y2-8*Math.sin(angle-Math.PI/7)); ctx.lineTo(x2-8*Math.cos(angle+Math.PI/7),y2-8*Math.sin(angle+Math.PI/7)); ctx.lineTo(x2,y2); ctx.fillStyle = color; ctx.fill(); ctx.restore(); }

  // Particle management
  function spawnParticles(dt:number, chamberRect:any, exhaustX:number){ const rate = 120 * simRef.current.fuel; const n = Math.floor(rate * dt); for(let i=0;i<n;i++){ const inX = chamberRect.x - 80 + Math.random()*30; const inY = chamberRect.y + chamberRect.h*0.5 + (Math.random()-0.5)*chamberRect.h*0.5; const phase = Math.sin(timeRef.current * simRef.current.pulseHz * 2*Math.PI); const exhaust = phase > 0; const vx = exhaust ? (180 + Math.random()*220) : (40 + Math.random()*40); particlesRef.current.push({ x: exhaust ? (chamberRect.x + Math.random()*chamberRect.w*0.2) : inX, y: inY, vx, vy: (Math.random()-0.5)*30, life: 1.2, hot: exhaust ? (0.6 + Math.random()*0.5) : 0.2 }); } }
  function stepParticles(dt:number){ for(let i=particlesRef.current.length-1;i>=0;i--){ const p = particlesRef.current[i]; p.x += p.vx*dt; p.y += p.vy*dt; p.vy += (Math.random()-0.5)*10*dt; p.life -= dt * (0.6 + p.hot*0.7); if(p.life<=0 || p.x > (simCanvasRef.current?.width||0)+100) particlesRef.current.splice(i,1); } }

  // Main loop
  useEffect(()=>{
    let raf = 0;
    const tick = (t:number)=>{
      const dt = Math.min(0.05, (t - lastRef.current)/1000);
      lastRef.current = t;
      if(!simRef.current.paused){
        timeRef.current += dt;
        drawScene(dt);
      }
      audio.update(timeRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(raf);
  },[audio]);

  // Draw scene implementation: delegate to drawEngineScene
  function drawScene(dt:number){
    const simCanvas = simCanvasRef.current, hud = hudCanvasRef.current;
    if(!simCanvas || !hud) return;
    const sctx = simCanvas.getContext('2d');
    const hctx = hud.getContext('2d');
    if(!sctx || !hctx) return;
    const width = simCanvas.width, height = simCanvas.height;
    sctx.clearRect(0,0,width,height);
    drawEngineScene(
      sctx,
      hctx,
      width,
      height,
      { simRef, particlesRef, timeRef },
      dt,
      computeTelemetry,
      drawArrow,
      spawnParticles,
      stepParticles
    );
  }

  // Interactions
  useEffect(()=>{
    const container = simCanvasRef.current?.parentElement;
    if(!container) return;
    const onKey = (e: KeyboardEvent)=>{
      if(e.key.toLowerCase()==='m'){ sim.toggleMute(); }
      if(e.key.toLowerCase()==='f'){ if(!document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); else document.exitFullscreen().catch(()=>{}); }
      if(e.key===' '){ sim.togglePause(); e.preventDefault(); }
      if(e.key.toLowerCase()==='c'){ sim.setCamera((sim.camera+1)%3); }
    };
    container.addEventListener('click', ()=>{ audio.init(); sim.setExhaustColor(sim.exhaustColor); sim.setTubeLen(sim.tubeLen); });
    window.addEventListener('keydown', onKey);
    return ()=>{
      window.removeEventListener('keydown', onKey);
    };
  },[sim, audio]);

  return (
    <div className="relative w-full h-full" >
      <canvas ref={simCanvasRef} className="absolute inset-0" />
      <canvas ref={hudCanvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute bottom-3 right-3 text-xs opacity-75 bg-black/40 px-3 py-2 rounded-lg border border-white/15">
        Click to enable audio • Press <b>F</b> fullscreen • <b>M</b> mute
      </div>
    </div>
  );
};