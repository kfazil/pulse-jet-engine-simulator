export function drawHUD(
    hctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    computeTelemetry: () => { thrust: number; temp: number; rate: number }
) {
    hctx.clearRect(0, 0, width, height);
    const { thrust, temp, rate } = computeTelemetry();
    const gy = height * 0.18;
    const hudGy = gy;
    const knobPositions = [
        { label: 'THRUST', color: '#68e0ff', x: width * 0.18, arcColor: 'rgba(104,224,255,0.95)', shadow: '#68e0ff', value: Math.max(0, Math.min(1, thrust / 40)), arcR: 60, display: thrust.toFixed(1) + ' N' },
        { label: 'TEMP', color: '#ff7df2', x: width * 0.5, arcColor: 'rgba(255,125,242,0.92)', shadow: '#ff7df2', value: Math.max(0, Math.min(1, (temp - 300) / 900)), arcR: 60, display: temp.toFixed(0) + ' K' },
        { label: 'RATE', color: '#fff', x: width * 0.82, arcColor: 'rgba(255,255,255,0.85)', shadow: '#fff', value: Math.max(0, Math.min(1, (rate - 5) / (250 - 5))), arcR: 60, display: rate.toFixed(1) + ' Hz' }
    ];

    function drawKnobArc(hctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
        hctx.save();
        hctx.beginPath();
        hctx.arc(x, y, r, 0, Math.PI * 2);
        hctx.strokeStyle = 'rgba(40,60,90,0.35)';
        hctx.lineWidth = 14;
        hctx.shadowColor = color;
        hctx.shadowBlur = 24;
        hctx.stroke();
        hctx.restore();
    }

    function drawKnobValueArc(hctx: CanvasRenderingContext2D, x: number, y: number, r: number, value: number, arcColor: string, color: string) {
        hctx.save();
        hctx.beginPath();
        hctx.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + value * Math.PI * 2);
        hctx.strokeStyle = arcColor;
        hctx.lineWidth = 10;
        hctx.shadowColor = color;
        hctx.shadowBlur = 18;
        hctx.lineCap = 'round';
        hctx.stroke();
        hctx.restore();
    }

    function drawKnobValueText(hctx: CanvasRenderingContext2D, x: number, y: number, display: string, arcColor: string, color: string) {
        hctx.save();
        hctx.font = 'bold 22px system-ui';
        hctx.textAlign = 'center';
        hctx.textBaseline = 'middle';
        hctx.fillStyle = arcColor;
        hctx.shadowColor = color;
        hctx.shadowBlur = 12;
        hctx.fillText(display, x, y);
        hctx.restore();
    }

    function drawKnobLabelText(hctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string) {
        hctx.save();
        hctx.font = 'bold 15px system-ui';
        hctx.textAlign = 'center';
        hctx.textBaseline = 'top';
        hctx.fillStyle = color;
        hctx.shadowColor = color;
        hctx.shadowBlur = 10;
        hctx.fillText(label, x, y);
        hctx.restore();
    }

    knobPositions.forEach(knob => {
        const x = knob.x;
        const arcR = knob.arcR;
        const value = knob.value;
        drawKnobArc(hctx, x, hudGy, arcR, knob.color);
        drawKnobValueArc(hctx, x, hudGy, arcR, value, knob.arcColor, knob.color);
        drawKnobValueText(hctx, x, hudGy, knob.display, knob.arcColor, knob.color);
        drawKnobLabelText(hctx, x, hudGy + arcR + 18, knob.label, knob.color);
    });
}
