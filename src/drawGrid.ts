export function drawGrid(sctx: CanvasRenderingContext2D, width: number, height: number) {
    sctx.save();
    sctx.globalAlpha = 0.18;
    for (let gx = 0; gx < width; gx += 32) {
        sctx.beginPath();
        sctx.moveTo(gx, 0);
        sctx.lineTo(gx, height);
        sctx.strokeStyle = 'rgba(104,224,255,0.25)';
        sctx.shadowColor = '#68e0ff';
        sctx.shadowBlur = 12;
        sctx.lineWidth = 1.2;
        sctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 32) {
        sctx.beginPath();
        sctx.moveTo(0, gy);
        sctx.lineTo(width, gy);
        sctx.strokeStyle = 'rgba(255,125,242,0.18)';
        sctx.shadowColor = '#ff7df2';
        sctx.shadowBlur = 12;
        sctx.lineWidth = 1.2;
        sctx.stroke();
    }
    sctx.restore();
}
