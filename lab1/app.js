function updateColorPicker(r, g, b) {
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    document.getElementById('colorPicker').value = hexColor;
}


function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    return [
        Math.round(((c - k) / (1 - k)) * 100) || 0,
        Math.round(((m - k) / (1 - k)) * 100) || 0,
        Math.round(((y - k) / (1 - k)) * 100) || 0,
        Math.round(k * 100) || 0
    ];
}


function cmykToRgb(c, m, y, k) {
    const r = 255 * (1 - c / 100) * (1 - k / 100);
    const g = 255 * (1 - m / 100) * (1 - k / 100);
    const b = 255 * (1 - y / 100) * (1 - k / 100);
    return [Math.round(r), Math.round(g), Math.round(b)];
}


function rgbToHsv(r, g, b) {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0, s = 0, v = max;

    if (delta !== 0) {
        if (max === rNorm) {
            h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        } else if (max === gNorm) {
            h = (bNorm - rNorm) / delta + 2;
        } else {
            h = (rNorm - gNorm) / delta + 4;
        }
        h = Math.round(h * 60);
        s = max === 0 ? 0 : delta / max;
    }

    return [h, Math.round(s * 100), Math.round(v * 100)];
}


function hsvToRgb(h, s, v) {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255)
    ];
}

function updateColorBox(r, g, b) {
    document.getElementById('colorBox').style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function updateFromRGB() {
    const r = +document.getElementById('rRange').value;
    const g = +document.getElementById('gRange').value;
    const b = +document.getElementById('bRange').value;


    const [c, m, y, k] = rgbToCmyk(r, g, b);
    document.getElementById('cRange').value = c;
    document.getElementById('mRange').value = m;
    document.getElementById('yRange').value = y;
    document.getElementById('kRange').value = k;
    document.getElementById('cInput').value = c;
    document.getElementById('mInput').value = m;
    document.getElementById('yInput').value = y;
    document.getElementById('kInput').value = k;


    const [h, s, v] = rgbToHsv(r, g, b);
    document.getElementById('hRange').value = h;
    document.getElementById('sRange').value = s;
    document.getElementById('vRange').value = v;
    document.getElementById('hInput').value = h;
    document.getElementById('sInput').value = s;
    document.getElementById('vInput').value = v;

    updateColorBox(r, g, b);
    updateColorPicker(r, g, b);
}


function updateFromCMYK() {
    const c = +document.getElementById('cRange').value;
    const m = +document.getElementById('mRange').value;
    const y = +document.getElementById('yRange').value;
    const k = +document.getElementById('kRange').value;


    const [r, g, b] = cmykToRgb(c, m, y, k);
    document.getElementById('rRange').value = r;
    document.getElementById('gRange').value = g;
    document.getElementById('bRange').value = b;
    document.getElementById('rInput').value = r;
    document.getElementById('gInput').value = g;
    document.getElementById('bInput').value = b;


    const [h, s, v] = rgbToHsv(r, g, b);
    document.getElementById('hRange').value = h;
    document.getElementById('sRange').value = s;
    document.getElementById('vRange').value = v;
    document.getElementById('hInput').value = h;
    document.getElementById('sInput').value = s;
    document.getElementById('vInput').value = v;

    updateColorBox(r, g, b);
    updateColorPicker(r, g, b);
}


function updateFromHSV() {
    const h = +document.getElementById('hRange').value;
    const s = +document.getElementById('sRange').value;
    const v = +document.getElementById('vRange').value;


    const [r, g, b] = hsvToRgb(h, s, v);
    document.getElementById('rRange').value = r;
    document.getElementById('gRange').value = g;
    document.getElementById('bRange').value = b;
    document.getElementById('rInput').value = r;
    document.getElementById('gInput').value = g;
    document.getElementById('bInput').value = b;


    const [c, m, y, k] = rgbToCmyk(r, g, b);
    document.getElementById('cRange').value = c;
    document.getElementById('mRange').value = m;
    document.getElementById('yRange').value = y;
    document.getElementById('kRange').value = k;
    document.getElementById('cInput').value = c;
    document.getElementById('mInput').value = m;
    document.getElementById('yInput').value = y;
    document.getElementById('kInput').value = k;

    updateColorBox(r, g, b);
    updateColorPicker(r, g, b);
}

function updateFromColorPicker() {
    const color = document.getElementById('colorPicker').value;
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    document.getElementById('rInput').value = r;
    document.getElementById('rRange').value = r;
    document.getElementById('gInput').value = g;
    document.getElementById('gRange').value = g;
    document.getElementById('bInput').value = b;
    document.getElementById('bRange').value = b;

    updateFromRGB();
}

document.getElementById('colorPicker').addEventListener('input', updateFromColorPicker);


document.getElementById('rRange').addEventListener('input', () => {
    document.getElementById('rInput').value = document.getElementById('rRange').value;
    updateFromRGB();
});
document.getElementById('gRange').addEventListener('input', () => {
    document.getElementById('gInput').value = document.getElementById('gRange').value;
    updateFromRGB();
});
document.getElementById('bRange').addEventListener('input', () => {
    document.getElementById('bInput').value = document.getElementById('bRange').value;
    updateFromRGB();
});
document.getElementById('rInput').addEventListener('input', () => {
    document.getElementById('rRange').value = document.getElementById('rInput').value;
    updateFromRGB();
});
document.getElementById('gInput').addEventListener('input', () => {
    document.getElementById('gRange').value = document.getElementById('gInput').value;
    updateFromRGB();
});
document.getElementById('bInput').addEventListener('input', () => {
    document.getElementById('bRange').value = document.getElementById('bInput').value;
    updateFromRGB();
});


document.getElementById('cRange').addEventListener('input', () => {
    document.getElementById('cInput').value = document.getElementById('cRange').value;
    updateFromCMYK();
});
document.getElementById('mRange').addEventListener('input', () => {
    document.getElementById('mInput').value = document.getElementById('mRange').value;
    updateFromCMYK();
});
document.getElementById('yRange').addEventListener('input', () => {
    document.getElementById('yInput').value = document.getElementById('yRange').value;
    updateFromCMYK();
});
document.getElementById('kRange').addEventListener('input', () => {
    document.getElementById('kInput').value = document.getElementById('kRange').value;
    updateFromCMYK();
});
document.getElementById('cInput').addEventListener('input', () => {
    document.getElementById('cRange').value = document.getElementById('cInput').value;
    updateFromCMYK();
});
document.getElementById('mInput').addEventListener('input', () => {
    document.getElementById('mRange').value = document.getElementById('mInput').value;
    updateFromCMYK();
});
document.getElementById('yInput').addEventListener('input', () => {
    document.getElementById('yRange').value = document.getElementById('yInput').value;
    updateFromCMYK();
});
document.getElementById('kInput').addEventListener('input', () => {
    document.getElementById('kRange').value = document.getElementById('kInput').value;
    updateFromCMYK();
});


document.getElementById('hRange').addEventListener('input', () => {
    document.getElementById('hInput').value = document.getElementById('hRange').value;
    updateFromHSV();
});
document.getElementById('sRange').addEventListener('input', () => {
    document.getElementById('sInput').value = document.getElementById('sRange').value;
    updateFromHSV();
});
document.getElementById('vRange').addEventListener('input', () => {
    document.getElementById('vInput').value = document.getElementById('vRange').value;
    updateFromHSV();
});
document.getElementById('hInput').addEventListener('input', () => {
    document.getElementById('hRange').value = document.getElementById('hInput').value;
    updateFromHSV();
});
document.getElementById('sInput').addEventListener('input', () => {
    document.getElementById('sRange').value = document.getElementById('sInput').value;
    updateFromHSV();
});
document.getElementById('vInput').addEventListener('input', () => {
    document.getElementById('vRange').value = document.getElementById('vInput').value;
    updateFromHSV();
});


updateColorBox(128, 128, 128);
updateFromColorPicker(128, 128, 128);