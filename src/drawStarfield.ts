export function drawStarfield(sctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
    for (let i = 0; i < 60; i++) {
        const x = (i * 97 % width);
        const y = (i * 173 % height);
        const tw = (Math.sin((time * 0.8 + i) * 0.9) + 1) / 2;
        sctx.save();
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 8;
        sctx.fillStyle = `rgba(255,255,255,${0.06 + tw * 0.16})`;
        sctx.fillRect(x, y, 2, 2);
        sctx.restore();
    }
}
