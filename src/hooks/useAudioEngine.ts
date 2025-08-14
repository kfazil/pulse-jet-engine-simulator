import { useEffect, useRef } from 'react';

export function useAudioEngine(paramsRef: React.MutableRefObject<any>, mutedRef: React.MutableRefObject<boolean>){
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const modOscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const modGainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const noiseGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const init = () => {
    if(audioCtxRef.current) return;
    const C = window.AudioContext || (window as any).webkitAudioContext;
    if(!C) return;
    const audioCtx = new C();
    audioCtxRef.current = audioCtx;

    // Main oscillator (sawtooth for engine tone)
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.value = 45; // V-1 base pulse rate

    // Modulation oscillator (square for pulsing)
    const modOsc = audioCtx.createOscillator();
    modOsc.type = 'square';
    modOsc.frequency.value = paramsRef.current.pulseHz;

    // Gain nodes
    const gain = audioCtx.createGain();
    gain.gain.value = 0.0;
    const modGain = audioCtx.createGain();
    modGain.gain.value = 0.45;

    // Noise source for raspy effect
    const bufferSize = 2 * audioCtx.sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.value = 0.08;

    // Bandpass filter to shape the sound
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value = 1.2;

    // Connect graph: noise + osc -> filter -> gain -> destination
    osc.connect(filter);
    noise.connect(filter);
    filter.connect(gain);
    modOsc.connect(modGain).connect(gain.gain);
    noiseGain.connect(filter);
    gain.connect(audioCtx.destination);

    osc.start();
    modOsc.start();
    noise.start();

    oscRef.current = osc;
    modOscRef.current = modOsc;
    gainRef.current = gain;
    modGainRef.current = modGain;
    noiseRef.current = noise;
    noiseGainRef.current = noiseGain;
    filterRef.current = filter;
  };

  const update = (time: number) => {
    if(!audioCtxRef.current || !oscRef.current || !modOscRef.current || !gainRef.current || !noiseGainRef.current || !filterRef.current) return;
    // Modulate pulse rate and noise for realism
    modOscRef.current.frequency.value = paramsRef.current.pulseHz;
    filterRef.current.frequency.value = 600 + paramsRef.current.pulseHz * 6;
    filterRef.current.Q.value = 1.2 + paramsRef.current.fuel * 1.5;
    noiseGainRef.current.gain.value = 0.06 + paramsRef.current.fuel * 0.08;

    // Robust mute: disconnect gain from destination when muted, reconnect when unmuted
    if (mutedRef.current) {
      gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
      try {
        gainRef.current.disconnect(audioCtxRef.current.destination);
      } catch(e) {}
    } else {
      const base = Math.min(0.25, paramsRef.current.fuel * 0.25);
      gainRef.current.gain.setValueAtTime(base, audioCtxRef.current.currentTime);
      try {
        gainRef.current.connect(audioCtxRef.current.destination);
      } catch(e) {}
    }
    // V-1 engine tone: base freq + pulse modulation
    oscRef.current.frequency.value = 45 + paramsRef.current.pulseHz * 0.8 + Math.sin(time*paramsRef.current.pulseHz)*8;
  };

  useEffect(()=>{
    return ()=>{
      try{
        if(audioCtxRef.current){ audioCtxRef.current.close(); }
      }catch(e){}
    };
  },[]);

  return { init, update };
}