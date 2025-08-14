// Modular sci-fi themed pulse jet engine designs
// Each function draws a unique engine design

export function drawV1Bomb(sctx: CanvasRenderingContext2D, params: any) {
    // Realistic V-1 flying bomb
    const { chamber, nozzleX, cy, ch } = params;
    // Main tube (classic solid fill)
    sctx.save();
    sctx.globalAlpha = 1.0;
    sctx.fillStyle = '#b0b0b0';
    sctx.fillRect(chamber.x, chamber.y, chamber.w, chamber.h);
    sctx.restore();
    // Rounded nose
    sctx.save();
        // Blast effect thresholds
        const FUEL_BLAST_THRESHOLD = 0.95;
        const PULSE_BLAST_THRESHOLD = 240;
        const fuel = params.simRef.current.fuel;
        const pulseHz = params.simRef.current.pulseHz;
        if (fuel > FUEL_BLAST_THRESHOLD || pulseHz > PULSE_BLAST_THRESHOLD) {
            // Draw blast effect
            sctx.save();
            sctx.globalAlpha = 0.9;
            // Flash
            sctx.fillStyle = 'rgba(255,0,0,1)';
            sctx.beginPath();
            sctx.arc(params.chamber.x + params.chamber.w * 0.5, params.cy, params.chamber.h * 0.7, 0, Math.PI * 2);
            sctx.fill();
            // Debris
            for (let i = 0; i < 12; i++) {
                let angle = (Math.PI * 2 / 12) * i;
                let dx = Math.cos(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
                let dy = Math.sin(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
                sctx.beginPath();
                sctx.arc(
                    params.chamber.x + params.chamber.w * 0.5 + dx,
                    params.cy + dy,
                    8 + Math.random() * 8,
                    0,
                    Math.PI * 2
                );
                // High flames color: random between yellow, orange, white
                const flameColors = [
                    'rgba(255,220,80,0.85)', // yellow
                    'rgba(255,140,40,0.85)', // orange
                    'rgba(255,255,255,0.85)' // white
                ];
                sctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
                sctx.fill();
            }
            // Smoke
            for (let i = 0; i < 8; i++) {
                let angle = (Math.PI * 2 / 8) * i;
                let dx = Math.cos(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
                let dy = Math.sin(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
                sctx.beginPath();
                sctx.arc(params.chamber.x + params.chamber.w * 0.5 + dx, params.cy + dy, 18 + Math.random() * 12, 0, Math.PI * 2);
                sctx.fillStyle = 'rgba(80,80,80,0.3)';
                sctx.fill();
            }
            // Draw engine nose so it remains visible during blast
            sctx.beginPath();
            sctx.arc(params.chamber.x, params.cy, params.chamber.h * 0.5, Math.PI * 0.5, Math.PI * 1.5);
            sctx.closePath();
            sctx.fillStyle = '#b0b0b0';
            sctx.fill();
            sctx.restore();
            // Optionally, reset simulation (handled in main logic)
            return;
        }
    sctx.beginPath();
    sctx.arc(chamber.x, cy, ch * 0.5, Math.PI * 0.5, Math.PI * 1.5);
    sctx.closePath();
    sctx.fillStyle = '#b0b0b0';
    sctx.fill();
    sctx.restore();
    // Tail wings
    sctx.save();
    sctx.beginPath();
    sctx.moveTo(nozzleX, cy - ch * 0.5);
    sctx.lineTo(nozzleX + ch * 0.7, cy - ch * 0.8);
    sctx.lineTo(nozzleX + ch * 0.7, cy - ch * 0.3);
    sctx.closePath();
    sctx.fillStyle = '#888';
    sctx.fill();
    sctx.beginPath();
    sctx.moveTo(nozzleX, cy + ch * 0.5);
    sctx.lineTo(nozzleX + ch * 0.7, cy + ch * 0.8);
    sctx.lineTo(nozzleX + ch * 0.7, cy + ch * 0.3);
    sctx.closePath();
    sctx.fillStyle = '#888';
    sctx.fill();
    sctx.restore();
    // Realistic side intake (cylindrical, attached)
    const intakeX = chamber.x + chamber.w * 0.18;
    const intakeY = cy - ch * 0.55;
    const intakeW = ch * 0.32;
    const intakeH = ch * 0.18;
    // Draw intake tube
    sctx.save();
    sctx.beginPath();
    sctx.ellipse(intakeX + intakeW / 2, intakeY + intakeH / 2, intakeW / 2, intakeH / 2, 0, 0, Math.PI * 2);
    sctx.fillStyle = '#b0b0b0';
    sctx.fill();
    // Draw attachment
    sctx.beginPath();
    sctx.moveTo(intakeX + intakeW * 0.1, intakeY + intakeH * 0.5);
    sctx.lineTo(chamber.x + chamber.w * 0.22, cy - ch * 0.15);
    sctx.lineTo(chamber.x + chamber.w * 0.28, cy - ch * 0.15);
    sctx.lineTo(intakeX + intakeW * 0.9, intakeY + intakeH * 0.5);
    sctx.closePath();
    sctx.fillStyle = '#b0b0b0';
    sctx.globalAlpha = 0.8;
    sctx.fill();
    // Intake opening (dark)
    sctx.beginPath();
    sctx.ellipse(intakeX + intakeW / 2, intakeY + intakeH / 2, intakeW * 0.32, intakeH * 0.32, 0, 0, Math.PI * 2);
    sctx.fillStyle = '#222';
    sctx.globalAlpha = 0.7;
    sctx.fill();
    sctx.restore();

    // Internal chamber (cutaway look, dynamic glow and size)
    sctx.save();
    // fuel already declared above
    const chamberGlow = Math.min(0.32 + fuel * 0.5, 0.85);
    const chamberHeight = chamber.h * (0.64 + fuel * 0.12);
    sctx.globalAlpha = chamberGlow;
    sctx.fillStyle = '#ffd080';
    sctx.fillRect(chamber.x + chamber.w * 0.08, chamber.y + chamber.h * 0.18, chamber.w * 0.7, chamberHeight);
    sctx.restore();

    // Combustion glow (animated, dynamic with fuel)
    sctx.save();
    const glowX = chamber.x + chamber.w * 0.25;
    const glowY = cy;
    const glowR = chamber.h * (0.18 + params.simRef.current.fuel * 0.18);
    const pulse = 0.5 + 0.5 * Math.abs(Math.sin(params.timeRef.current * params.simRef.current.pulseHz * 2 * Math.PI));
    const grad = sctx.createRadialGradient(glowX, glowY, glowR * 0.2, glowX, glowY, glowR);
    grad.addColorStop(0, `rgba(255,220,120,${0.35 + pulse * 0.3 + params.simRef.current.fuel * 0.5})`);
    grad.addColorStop(1, 'rgba(255,120,60,0.05)');
    sctx.globalAlpha = 0.7;
    sctx.fillStyle = grad;
    sctx.beginPath();
    sctx.arc(glowX, glowY, glowR, 0, Math.PI * 2);
    sctx.fill();
    sctx.restore();

    // Animated airflow sine waves (dynamic with pulseHz, clipped to chamber)
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2 + params.simRef.current.pulseHz * 0.5;
    // Clip to chamber area
    sctx.beginPath();
    sctx.rect(chamber.x + chamber.w * 0.08, chamber.y + chamber.h * 0.18, chamber.w * 0.7, chamber.h * 0.64);
    sctx.clip();
    sctx.beginPath();
    for (let x = chamber.x + chamber.w * 0.08; x < chamber.x + chamber.w * 0.78; x += 6) {
        let rel = (x - chamber.x) / chamber.w;
        let y = cy + Math.sin(rel * 2 * Math.PI * (2 + params.simRef.current.pulseHz * 0.5) + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        if (x === chamber.x + chamber.w * 0.08) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.restore();

    // Air particles (dynamic with pulseHz)
    sctx.save();
    for (let i = 0; i < 12 + Math.floor(params.simRef.current.pulseHz * 2); i++) {
        let px = chamber.x + chamber.w * (0.08 + i * 0.06 + ((params.timeRef.current * (0.3 + params.simRef.current.pulseHz * 0.1) + i * 0.2) % 1) * 0.7);
        let py = cy + Math.sin((px - chamber.x) / chamber.w * 2 * Math.PI * (2 + params.simRef.current.pulseHz * 0.5) + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        sctx.beginPath();
        sctx.arc(px, py, 2.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(80,200,255,0.7)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fill();
    }
    sctx.restore();

    // Flow arrows (air/fuel)
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
        let ax = chamber.x + chamber.w * (0.08 + i * 0.18);
        let ay = cy - chamber.h * 0.18;
        sctx.beginPath();
        sctx.moveTo(ax, ay);
        sctx.lineTo(ax + chamber.w * 0.12, ay);
        sctx.stroke();
        // Arrow head
        sctx.beginPath();
        sctx.moveTo(ax + chamber.w * 0.12, ay);
        sctx.lineTo(ax + chamber.w * 0.10, ay - 6);
        sctx.lineTo(ax + chamber.w * 0.10, ay + 6);
        sctx.closePath();
        sctx.fillStyle = '#68e0ff';
        sctx.fill();
    }
    sctx.restore();
}

export function drawBuzzBombDrone(sctx: CanvasRenderingContext2D, params: any) {
    // Draw engine nose (same as normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x, params.cy, params.ch * 0.45, Math.PI * 0.5, Math.PI * 1.5);
    sctx.closePath();
    sctx.fillStyle = '#e0e0e0';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
    // ...existing blast effect code...
        // Draw engine body (main tube) during blast
        sctx.save();
        sctx.globalAlpha = 1.0;
        sctx.fillStyle = '#b0b0b0';
        sctx.fillRect(params.chamber.x, params.chamber.y, params.chamber.w, params.chamber.h);
        sctx.restore();
    // Blast effect thresholds
    const FUEL_BLAST_THRESHOLD = 0.95;
    const PULSE_BLAST_THRESHOLD = 240;
    const fuel = params.simRef.current.fuel;
    const pulseHz = params.simRef.current.pulseHz;
    if (fuel > FUEL_BLAST_THRESHOLD || pulseHz > PULSE_BLAST_THRESHOLD) {
        // Draw blast effect
        sctx.save();
        sctx.globalAlpha = 0.9;
        // Flash
        sctx.fillStyle = 'rgba(255,0,0,1)';
        sctx.beginPath();
        sctx.arc(params.chamber.x + params.chamber.w * 0.5, params.cy, params.chamber.h * 0.7, 0, Math.PI * 2);
        sctx.fill();
        // Debris
        for (let i = 0; i < 12; i++) {
            let angle = (Math.PI * 2 / 12) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            let dy = Math.sin(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            sctx.beginPath();
            sctx.arc(
                params.chamber.x + params.chamber.w * 0.5 + dx,
                params.cy + dy,
                8 + Math.random() * 8,
                0,
                Math.PI * 2
            );
            // High flames color: random between yellow, orange, white
            const flameColors = [
                'rgba(255,220,80,0.85)', // yellow
                'rgba(255,140,40,0.85)', // orange
                'rgba(255,255,255,0.85)' // white
            ];
            sctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
            sctx.fill();
        }
        // Smoke
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 / 8) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            let dy = Math.sin(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            sctx.beginPath();
            sctx.arc(params.chamber.x + params.chamber.w * 0.5 + dx, params.cy + dy, 18 + Math.random() * 12, 0, Math.PI * 2);
            sctx.fillStyle = 'rgba(80,80,80,0.3)';
            sctx.fill();
        }
    // Draw engine nose (match normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x, params.cy, params.ch * 0.45, Math.PI * 0.5, Math.PI * 1.5);
    sctx.closePath();
    sctx.fillStyle = '#e0e0e0';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
        sctx.restore();
        return;
    }
    // Realistic Buzz Bomb drone (variant of V-1, with drone details)
    const { chamber, nozzleX, cy, ch } = params;
    // Main tube (classic solid fill)
    sctx.save();
    sctx.globalAlpha = 1.0;
    sctx.fillStyle = '#b0b0b0';
    sctx.fillRect(chamber.x, chamber.y, chamber.w, chamber.h);
    sctx.restore();
    // Rounded nose
    sctx.save();
    sctx.beginPath();
    sctx.arc(chamber.x, cy, ch * 0.45, Math.PI * 0.5, Math.PI * 1.5);
    sctx.closePath();
    sctx.fillStyle = '#e0e0e0';
    sctx.fill();
    sctx.restore();
    // Drone wings
    sctx.save();
    sctx.beginPath();
    sctx.moveTo(chamber.x + chamber.w * 0.5, cy - ch * 0.5);
    sctx.lineTo(chamber.x + chamber.w * 0.8, cy - ch * 1.0);
    sctx.lineTo(chamber.x + chamber.w * 0.9, cy - ch * 0.5);
    sctx.closePath();
    sctx.fillStyle = '#bbb';
    sctx.fill();
    sctx.beginPath();
    sctx.moveTo(chamber.x + chamber.w * 0.5, cy + ch * 0.5);
    sctx.lineTo(chamber.x + chamber.w * 0.8, cy + ch * 1.0);
    sctx.lineTo(chamber.x + chamber.w * 0.9, cy + ch * 0.5);
    sctx.closePath();
    sctx.fillStyle = '#bbb';
    sctx.fill();
    sctx.restore();
    // Intake
    sctx.save();
    sctx.beginPath();
    sctx.ellipse(chamber.x + chamber.w * 0.2, cy - ch * 0.6, ch * 0.14, ch * 0.10, 0, 0, Math.PI * 2);
    sctx.fillStyle = '#ffb080';
    sctx.fill();
    sctx.restore();

    // Internal airflow sine waves
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2;
    sctx.beginPath();
    for (let x = chamber.x + chamber.w * 0.08; x < chamber.x + chamber.w * 0.78; x += 6) {
        let rel = (x - chamber.x) / chamber.w;
        let y = cy + Math.sin(rel * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        if (x === chamber.x + chamber.w * 0.08) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.restore();

    // Air particles
    sctx.save();
    for (let i = 0; i < 12; i++) {
        let px = chamber.x + chamber.w * (0.08 + i * 0.06 + ((params.timeRef.current * 0.3 + i * 0.2) % 1) * 0.7);
        let py = cy + Math.sin((px - chamber.x) / chamber.w * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        sctx.beginPath();
        sctx.arc(px, py, 2.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(80,200,255,0.7)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fill();
    }
    sctx.restore();
}

export function drawPulseJetMotorcycle(sctx: CanvasRenderingContext2D, params: any) {
    // Draw engine nose (same as normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x - 10, params.cy, params.ch * 0.18, 0, Math.PI * 2);
    sctx.fillStyle = '#c0c0ff';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
    // ...existing blast effect code...
        // Draw engine body (main tube) during blast
        sctx.save();
        sctx.globalAlpha = 1.0;
        sctx.fillStyle = '#b0b0b0';
        sctx.fillRect(params.chamber.x, params.chamber.y, params.chamber.w, params.chamber.h * 0.7);
        sctx.restore();
    // Blast effect thresholds
    const FUEL_BLAST_THRESHOLD = 0.95;
    const PULSE_BLAST_THRESHOLD = 240;
    const fuel = params.simRef.current.fuel;
    const pulseHz = params.simRef.current.pulseHz;
    if (fuel > FUEL_BLAST_THRESHOLD || pulseHz > PULSE_BLAST_THRESHOLD) {
        // Draw blast effect
        sctx.save();
        sctx.globalAlpha = 0.9;
        // Flash
        sctx.fillStyle = 'rgba(255,0,0,1)';
        sctx.beginPath();
        sctx.arc(params.chamber.x + params.chamber.w * 0.5, params.cy, params.chamber.h * 0.7, 0, Math.PI * 2);
        sctx.fill();
        // Debris
        for (let i = 0; i < 12; i++) {
            let angle = (Math.PI * 2 / 12) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            let dy = Math.sin(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            sctx.beginPath();
            sctx.arc(
                params.chamber.x + params.chamber.w * 0.5 + dx,
                params.cy + dy,
                8 + Math.random() * 8,
                0,
                Math.PI * 2
            );
            // High flames color: random between yellow, orange, white
            const flameColors = [
                'rgba(255,220,80,0.85)', // yellow
                'rgba(255,140,40,0.85)', // orange
                'rgba(255,255,255,0.85)' // white
            ];
            sctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
            sctx.fill();
        }
        // Smoke
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 / 8) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            let dy = Math.sin(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            sctx.beginPath();
            sctx.arc(params.chamber.x + params.chamber.w * 0.5 + dx, params.cy + dy, 18 + Math.random() * 12, 0, Math.PI * 2);
            sctx.fillStyle = 'rgba(80,80,80,0.3)';
            sctx.fill();
        }
    // Draw engine nose (match normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x - 10, params.cy, params.ch * 0.18, 0, Math.PI * 2);
    sctx.fillStyle = '#c0c0ff';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
        sctx.restore();
        return;
    }
    // Realistic pulse jet motorcycle
    const { chamber, nozzleX, cy, ch } = params;
    // Main tube (classic solid fill)
    sctx.save();
    sctx.globalAlpha = 1.0;
    sctx.fillStyle = '#b0b0b0';
    sctx.fillRect(chamber.x, chamber.y, chamber.w, chamber.h * 0.7);
    sctx.restore();
    // Intake
    sctx.save();
    sctx.beginPath();
    sctx.arc(chamber.x - 10, cy, ch * 0.18, 0, Math.PI * 2);
    sctx.fillStyle = '#c0c0ff';
    sctx.fill();
    sctx.restore();
    // Handlebar silhouette
    sctx.save();
    sctx.beginPath();
    sctx.moveTo(chamber.x + chamber.w * 0.1, cy - ch * 0.4);
    sctx.lineTo(chamber.x + chamber.w * 0.2, cy - ch * 0.7);
    sctx.lineTo(chamber.x + chamber.w * 0.3, cy - ch * 0.4);
    sctx.strokeStyle = '#222';
    sctx.lineWidth = 3;
    sctx.stroke();
    sctx.restore();
    // Wheels
    sctx.save();
    sctx.beginPath();
    sctx.arc(chamber.x + chamber.w * 0.2, cy + ch * 0.5, ch * 0.18, 0, Math.PI * 2);
    sctx.arc(nozzleX, cy + ch * 0.5, ch * 0.18, 0, Math.PI * 2);
    sctx.fillStyle = '#222';
    sctx.fill();
    sctx.restore();

    // Internal airflow sine waves
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2;
    sctx.beginPath();
    for (let x = chamber.x + chamber.w * 0.08; x < chamber.x + chamber.w * 0.78; x += 6) {
        let rel = (x - chamber.x) / chamber.w;
        let y = cy + Math.sin(rel * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        if (x === chamber.x + chamber.w * 0.08) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.restore();

    // Air particles
    sctx.save();
    for (let i = 0; i < 12; i++) {
        let px = chamber.x + chamber.w * (0.08 + i * 0.06 + ((params.timeRef.current * 0.3 + i * 0.2) % 1) * 0.7);
        let py = cy + Math.sin((px - chamber.x) / chamber.w * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        sctx.beginPath();
        sctx.arc(px, py, 2.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(80,200,255,0.7)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fill();
    }
    sctx.restore();
}

export function drawPulseJetGoKart(sctx: CanvasRenderingContext2D, params: any) {
    // Draw engine nose (same as normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x + params.chamber.w * 0.1, params.cy + params.ch * 0.7, params.ch * 0.13, 0, Math.PI * 2);
    sctx.fillStyle = '#222';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
    // ...existing blast effect code...
        // Draw engine body (main tube) during blast
        sctx.save();
        sctx.globalAlpha = 1.0;
        sctx.fillStyle = '#b0b0b0';
        sctx.fillRect(params.chamber.x, params.chamber.y + params.ch, params.chamber.w * 0.7, params.ch * 0.5);
        sctx.restore();
    // Blast effect thresholds
    const FUEL_BLAST_THRESHOLD = 0.95;
    const PULSE_BLAST_THRESHOLD = 240;
    const fuel = params.simRef.current.fuel;
    const pulseHz = params.simRef.current.pulseHz;
    if (fuel > FUEL_BLAST_THRESHOLD || pulseHz > PULSE_BLAST_THRESHOLD) {
        // Draw blast effect
        sctx.save();
        sctx.globalAlpha = 0.9;
        // Flash
        sctx.fillStyle = 'rgba(255,0,0,1)';
        sctx.beginPath();
        sctx.arc(params.chamber.x + params.chamber.w * 0.5, params.cy, params.chamber.h * 0.7, 0, Math.PI * 2);
        sctx.fill();
        // Debris
        for (let i = 0; i < 12; i++) {
            let angle = (Math.PI * 2 / 12) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            let dy = Math.sin(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            sctx.beginPath();
            sctx.arc(
                params.chamber.x + params.chamber.w * 0.5 + dx,
                params.cy + dy,
                8 + Math.random() * 8,
                0,
                Math.PI * 2
            );
            // High flames color: random between yellow, orange, white
            const flameColors = [
                'rgba(255,220,80,0.85)', // yellow
                'rgba(255,140,40,0.85)', // orange
                'rgba(255,255,255,0.85)' // white
            ];
            sctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
            sctx.fill();
        }
        // Smoke
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 / 8) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            let dy = Math.sin(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            sctx.beginPath();
            sctx.arc(params.chamber.x + params.chamber.w * 0.5 + dx, params.cy + dy, 18 + Math.random() * 12, 0, Math.PI * 2);
            sctx.fillStyle = 'rgba(80,80,80,0.3)';
            sctx.fill();
        }
    // Draw engine nose (match normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.chamber.x + params.chamber.w * 0.1, params.cy + params.ch * 0.7, params.ch * 0.13, 0, Math.PI * 2);
    sctx.fillStyle = '#222';
    sctx.globalAlpha = 1.0;
    sctx.fill();
    sctx.restore();
        sctx.restore();
        return;
    }
    // Realistic pulse jet go-kart
    const { chamber, nozzleX, cy, ch } = params;
    // Short tube (classic solid fill)
    sctx.save();
    sctx.globalAlpha = 1.0;
    sctx.fillStyle = '#b0b0b0';
    sctx.fillRect(chamber.x, chamber.y + ch * 0.2, chamber.w * 0.7, ch * 0.5);
    sctx.restore();
    // Frame
    sctx.save();
    sctx.beginPath();
    sctx.moveTo(chamber.x, cy + ch * 0.5);
    sctx.lineTo(nozzleX, cy + ch * 0.5);
    sctx.lineTo(nozzleX, cy + ch * 0.7);
    sctx.lineTo(chamber.x, cy + ch * 0.7);
    sctx.closePath();
    sctx.strokeStyle = '#222';
    sctx.lineWidth = 4;
    sctx.stroke();
    sctx.restore();
    // Wheels
    sctx.save();
    sctx.beginPath();
    sctx.arc(chamber.x + chamber.w * 0.1, cy + ch * 0.7, ch * 0.13, 0, Math.PI * 2);
    sctx.arc(nozzleX - chamber.w * 0.1, cy + ch * 0.7, ch * 0.13, 0, Math.PI * 2);
    sctx.fillStyle = '#222';
    sctx.fill();
    sctx.restore();

    // Internal airflow sine waves
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2;
    sctx.beginPath();
    for (let x = chamber.x + chamber.w * 0.08; x < chamber.x + chamber.w * 0.78; x += 6) {
        let rel = (x - chamber.x) / chamber.w;
        let y = cy + Math.sin(rel * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        if (x === chamber.x + chamber.w * 0.08) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.restore();

    // Air particles
    sctx.save();
    for (let i = 0; i < 12; i++) {
        let px = chamber.x + chamber.w * (0.08 + i * 0.06 + ((params.timeRef.current * 0.3 + i * 0.2) % 1) * 0.7);
        let py = cy + Math.sin((px - chamber.x) / chamber.w * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        sctx.beginPath();
        sctx.arc(px, py, 2.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(80,200,255,0.7)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fill();
    }
    sctx.restore();
}

export function drawModelAircraft(sctx: CanvasRenderingContext2D, params: any) {
    // Draw engine nose (same as normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.nozzleX + 10, params.cy, params.ch * 0.08, 0, Math.PI * 2);
    sctx.fillStyle = '#fff';
    sctx.globalAlpha = 0.5;
    sctx.fill();
    sctx.globalAlpha = 1.0;
    sctx.restore();
    // ...existing blast effect code...
        // Draw engine body (main tube) during blast
        sctx.save();
        sctx.globalAlpha = 1.0;
        sctx.fillStyle = '#b0b0b0';
        sctx.fillRect(params.chamber.x, params.chamber.y + params.ch * 0.3, params.chamber.w * 0.8, params.ch * 0.3);
        sctx.restore();
    // Blast effect thresholds
    const FUEL_BLAST_THRESHOLD = 0.95;
    const PULSE_BLAST_THRESHOLD = 240;
    const fuel = params.simRef.current.fuel;
    const pulseHz = params.simRef.current.pulseHz;
    if (fuel > FUEL_BLAST_THRESHOLD || pulseHz > PULSE_BLAST_THRESHOLD) {
        // Draw blast effect
        sctx.save();
        sctx.globalAlpha = 0.9;
        // Flash
        sctx.fillStyle = 'rgba(255,0,0,1)';
        sctx.beginPath();
        sctx.arc(params.chamber.x + params.chamber.w * 0.5, params.cy, params.chamber.h * 0.7, 0, Math.PI * 2);
        sctx.fill();
        // Debris
        for (let i = 0; i < 12; i++) {
            let angle = (Math.PI * 2 / 12) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            let dy = Math.sin(angle) * params.chamber.h * (0.7 + Math.random() * 0.3);
            sctx.beginPath();
            sctx.arc(
                params.chamber.x + params.chamber.w * 0.5 + dx,
                params.cy + dy,
                8 + Math.random() * 8,
                0,
                Math.PI * 2
            );
            // High flames color: random between yellow, orange, white
            const flameColors = [
                'rgba(255,220,80,0.85)', // yellow
                'rgba(255,140,40,0.85)', // orange
                'rgba(255,255,255,0.85)' // white
            ];
            sctx.fillStyle = flameColors[Math.floor(Math.random() * flameColors.length)];
            sctx.fill();
        }
        // Smoke
        for (let i = 0; i < 8; i++) {
            let angle = (Math.PI * 2 / 8) * i;
            let dx = Math.cos(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            let dy = Math.sin(angle) * params.chamber.h * (0.9 + Math.random() * 0.5);
            sctx.beginPath();
            sctx.arc(params.chamber.x + params.chamber.w * 0.5 + dx, params.cy + dy, 18 + Math.random() * 12, 0, Math.PI * 2);
            sctx.fillStyle = 'rgba(80,80,80,0.3)';
            sctx.fill();
        }
    // Draw engine nose (match normal state)
    sctx.save();
    sctx.beginPath();
    sctx.arc(params.nozzleX + 10, params.cy, params.ch * 0.08, 0, Math.PI * 2);
    sctx.fillStyle = '#fff';
    sctx.globalAlpha = 0.5;
    sctx.fill();
    sctx.globalAlpha = 1.0;
    sctx.restore();
        sctx.restore();
        return;
    }
    // Realistic model aircraft pulse jet
    const { chamber, nozzleX, cy, ch } = params;
    // Slim tube (classic solid fill)
    sctx.save();
    sctx.globalAlpha = 1.0;
    sctx.fillStyle = '#b0b0b0';
    sctx.fillRect(chamber.x, chamber.y + ch * 0.3, chamber.w * 0.8, ch * 0.3);
    sctx.restore();
    // Small wings
    sctx.save();
    sctx.beginPath();
    sctx.moveTo(chamber.x + chamber.w * 0.2, cy - ch * 0.1);
    sctx.lineTo(chamber.x + chamber.w * 0.5, cy - ch * 0.5);
    sctx.lineTo(chamber.x + chamber.w * 0.8, cy - ch * 0.1);
    sctx.closePath();
    sctx.fillStyle = '#b0ffb0';
    sctx.globalAlpha = 0.7;
    sctx.fill();
    sctx.beginPath();
    sctx.moveTo(chamber.x + chamber.w * 0.2, cy + ch * 0.1);
    sctx.lineTo(chamber.x + chamber.w * 0.5, cy + ch * 0.5);
    sctx.lineTo(chamber.x + chamber.w * 0.8, cy + ch * 0.1);
    sctx.closePath();
    sctx.fillStyle = '#b0ffb0';
    sctx.globalAlpha = 0.7;
    sctx.fill();
    sctx.restore();
    // Prop-like details
    sctx.save();
    sctx.beginPath();
    sctx.arc(nozzleX + 10, cy, ch * 0.08, 0, Math.PI * 2);
    sctx.fillStyle = '#fff';
    sctx.globalAlpha = 0.5;
    sctx.fill();
    sctx.restore();

    // Internal airflow sine waves
    sctx.save();
    sctx.globalAlpha = 0.5;
    sctx.strokeStyle = '#68e0ff';
    sctx.lineWidth = 2;
    sctx.beginPath();
    for (let x = chamber.x + chamber.w * 0.08; x < chamber.x + chamber.w * 0.78; x += 6) {
        let rel = (x - chamber.x) / chamber.w;
        let y = cy + Math.sin(rel * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        if (x === chamber.x + chamber.w * 0.08) sctx.moveTo(x, y);
        else sctx.lineTo(x, y);
    }
    sctx.stroke();
    sctx.restore();

    // Air particles
    sctx.save();
    for (let i = 0; i < 12; i++) {
        let px = chamber.x + chamber.w * (0.08 + i * 0.06 + ((params.timeRef.current * 0.3 + i * 0.2) % 1) * 0.7);
        let py = cy + Math.sin((px - chamber.x) / chamber.w * 2 * Math.PI * 2 + params.timeRef.current * params.simRef.current.pulseHz * 2) * chamber.h * 0.18;
        sctx.beginPath();
        sctx.arc(px, py, 2.5, 0, Math.PI * 2);
        sctx.fillStyle = 'rgba(80,200,255,0.7)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fill();
    }
    sctx.restore();
}
