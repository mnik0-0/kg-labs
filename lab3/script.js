const canvas1 = document.getElementById('lineCanvas1');
const canvas2 = document.getElementById('lineCanvas2');
const canvas3 = document.getElementById('lineCanvas3');
const circleCanvas = document.getElementById('circleCanvas');

const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const ctx3 = canvas3.getContext('2d');
const ctxCircle = circleCanvas.getContext('2d');

ctx1.translate(canvas1.width / 2, canvas1.height / 2);
ctx2.translate(canvas2.width / 2, canvas2.height / 2);
ctx3.translate(canvas3.width / 2, canvas3.height / 2);
ctxCircle.translate(circleCanvas.width / 2, circleCanvas.height / 2);


function drawGrid(ctx) {
    ctx.clearRect(-canvas1.width / 2, -canvas1.height / 2, canvas1.width, canvas1.height);
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    for (let x = -canvas1.width / 2; x <= canvas1.width / 2; x += 10) {
        ctx.moveTo(x, -canvas1.height / 2);
        ctx.lineTo(x, canvas1.height / 2);
    }
    for (let y = -canvas1.height / 2; y <= canvas1.height / 2; y += 10) {
        ctx.moveTo(-canvas1.width / 2, y);
        ctx.lineTo(canvas1.width / 2, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, -canvas1.height / 2);
    ctx.lineTo(0, canvas1.height / 2);
    ctx.moveTo(-canvas1.width / 2, 0);
    ctx.lineTo(canvas1.width / 2, 0);
    ctx.stroke();
}

function stepByStep(x1, y1, x2, y2, ctx) {
    const startTime = performance.now();


    let isSteep = Math.abs(y2 - y1) > Math.abs(x2 - x1);

    if (isSteep) {
        [x1, y1] = [y1, x1];
        [x2, y2] = [y2, x2];
    }

    if (x1 > x2) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
    }

    const dx = x2 - x1;
    const dy = y2 - y1;

    const k = dy / dx;

    let y = y1;

    for (let x = x1; x <= x2; x++) {
        if (isSteep) {
            drawPixel(Math.round(y), x, ctx);
        } else {
            drawPixel(x, Math.round(y), ctx);
        }
        y += k;
    }

    const endTime = performance.now();
    document.getElementById('stepByStepTime').textContent = `Step-by-Step Time: ${(endTime - startTime).toFixed(2)} ms`;
}


function dda(x1, y1, x2, y2, ctx) {
    const startTime = performance.now();

    const dx = x2 - x1;
    const dy = y2 - y1;
    const L = Math.max(Math.abs(dx), Math.abs(dy));

    const xInc = dx / L;
    const yInc = dy / L;

    let x = x1, y = y1;

    for (let i = 0; i <= L; i++) {
        drawPixel(Math.round(x), Math.round(y), ctx);
        x += xInc;
        y += yInc;
    }

    const endTime = performance.now();
    document.getElementById('ddaTime').textContent = `DDA Time: ${(endTime - startTime).toFixed(2)} ms`;
}


function bresenhamLine(x1, y1, x2, y2, ctx) {
    const startTime = performance.now();

    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var signX = x1 < x2 ? 1 : -1;
    var signY = y1 < y2 ? 1 : -1;

    var error = deltaX - deltaY;

    drawPixel(x2, y2, ctx);
    while (x1 != x2 || y1 != y2) {
        drawPixel(x1, y1, ctx);
        var error2 = error * 2;

        if (error2 > -deltaY) {
            error -= deltaY;
            x1 += signX;
        }
        if (error2 < deltaX) {
            error += deltaX;
            y1 += signY;
        }
    }

    const endTime = performance.now();
    document.getElementById('bresenhamLineTime').textContent = `Bresenham Line Time: ${(endTime - startTime).toFixed(2)} ms`;
}


function bresenhamCircle(xc, yc, r, ctx) {
    const startTime = performance.now();

    let x = 0, y = r;
    let delta = 3 - 2 * r;
    drawCirclePoints(xc, yc, x, y, ctx);
    while (y >= x) {
        x++;
        if (delta > 0) {
            y--;
            delta += 4 * (x - y) + 10;
        } else {
            delta += 4 * x + 6;
        }
        drawCirclePoints(xc, yc, x, y, ctx);
    }

    const endTime = performance.now();
    document.getElementById('bresenhamCircleTime').textContent = `Bresenham Circle Time: ${(endTime - startTime).toFixed(2)} ms`;
}


function drawCirclePoints(xc, yc, x, y, ctx) {
    drawPixel(xc + x, yc + y, ctx);
    drawPixel(xc - x, yc + y, ctx);
    drawPixel(xc + x, yc - y, ctx);
    drawPixel(xc - x, yc - y, ctx);
    drawPixel(xc + y, yc + x, ctx);
    drawPixel(xc - y, yc + x, ctx);
    drawPixel(xc + y, yc - x, ctx);
    drawPixel(xc - y, yc - x, ctx);
}

function drawPixel(x, y, ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(x * 10 - 5, y * 10 - 5, 10, 10);
}


function drawLine() {
    const x1 = parseInt(document.getElementById('startX').value);
    const y1 = parseInt(document.getElementById('startY').value);
    const x2 = parseInt(document.getElementById('endX').value);
    const y2 = parseInt(document.getElementById('endY').value);


    drawGrid(ctx1);
    drawGrid(ctx2);
    drawGrid(ctx3);


    stepByStep(x1, y1, x2, y2, ctx1);
    dda(x1, y1, x2, y2, ctx2);
    bresenhamLine(x1, y1, x2, y2, ctx3);
}


function drawCircle() {
    const r = Math.abs(parseInt(document.getElementById('radius').value));


    ctxCircle.clearRect(-circleCanvas.width / 2, -circleCanvas.height / 2, circleCanvas.width, circleCanvas.height);
    drawGrid(ctxCircle);


    bresenhamCircle(0, 0, r, ctxCircle);
}

drawGrid(ctx1);
drawGrid(ctx2);
drawGrid(ctx3);
drawGrid(ctxCircle);
