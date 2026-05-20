/*DOM ELEMENTS*/
const colorPicker = document.getElementById("colorPicker");
const hexInput = document.getElementById("hexInput");
const generateBtn = document.getElementById("generatePaletteButton");
const complementaryContainer = document.getElementById("complementaryPalette");
const analogousContainer = document.getElementById("analogousPalette");
const monochromaticContainer = document.getElementById("monochromaticPalette");
const paletteForm = document.getElementById("paletteForm");
const toast = document.getElementById("toast");

/* Sync color picker with HEX input */
colorPicker.addEventListener("input", () => {
    hexInput.value = colorPicker.value;
});

/* Validate HEX input and sync picker */
hexInput.addEventListener("input", () => {
    const hexValue = hexInput.value;
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (hexPattern.test(hexValue)) {
        colorPicker.value = hexValue;
        hexInput.style.border = "2px solid green";
    }
    else {
        hexInput.style.border = "2px solid red";
    }
});

/*GENERATE BUTTON*/
generateBtn.addEventListener("click", () => {
    const baseColor = colorPicker.value;
    generateAllPalettes(baseColor);
});

/*GENERATE ALL PALETTES*/
function generateAllPalettes(baseColor) {
    complementaryContainer.innerHTML = "";
    analogousContainer.innerHTML = "";
    monochromaticContainer.innerHTML = "";
    generateComplementary(baseColor);
    generateAnalogous(baseColor);
    generateMonochromatic(baseColor);
}

/*COMPLEMENTARY PALETTE*/
function generateComplementary(color) {
    const hsl = hexToHSL(color);
    const complementaryHue = (hsl.h + 180) % 360;
    const complementaryColor = HSLToHex(complementaryHue, hsl.s, hsl.l);
    createColorBox(color, complementaryContainer);
    createColorBox(complementaryColor, complementaryContainer);
}

/*ANALOGOUS PALETTE*/
function generateAnalogous(color) {
    const hsl = hexToHSL(color);
    const leftColor = HSLToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
    const rightColor = HSLToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
    createColorBox(leftColor, analogousContainer);
    createColorBox(color, analogousContainer);
    createColorBox(rightColor, analogousContainer);
}

/*MONOCHROMATIC PALETTE*/
function generateMonochromatic(color) {
    const hsl = hexToHSL(color);
    createColorBox(HSLToHex(hsl.h, hsl.s, 20), monochromaticContainer);
    createColorBox(HSLToHex(hsl.h, hsl.s, 35), monochromaticContainer);
    createColorBox(HSLToHex(hsl.h, hsl.s, 50), monochromaticContainer);
    createColorBox(HSLToHex(hsl.h, hsl.s, 65), monochromaticContainer);
    createColorBox(HSLToHex(hsl.h, hsl.s, 80), monochromaticContainer);
}

/*CREATE COLOR BOX*/
function createColorBox(color, parentContainer) {
    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.background = color;
    colorBox.style.color = getContrastColor(color);
    colorBox.innerText = color;
    colorBox.addEventListener("click", () => {
        navigator.clipboard.writeText(color);
        showToast(`${color} copied!`);
    });
    parentContainer.appendChild(colorBox);
}

/*SAVE PALETTE*/
paletteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const paletteName = document.getElementById("paletteName").value;
    const paletteCategory = document.getElementById("paletteCategory").value;
    const creatorName = document.getElementById("creatorName").value;
    if (paletteName.trim() === "" || paletteCategory === "" || creatorName.trim() === "") {
        showToast("Please fill the form!");
        return;
    }
    const baseColor = colorPicker.value;
    let paletteColors = [];
    if (paletteCategory === "complementary") {
        const hsl = hexToHSL(baseColor);
        const complementaryHue = (hsl.h + 180) % 360;
        paletteColors = [baseColor, HSLToHex(complementaryHue, hsl.s, hsl.l)];
    }
    else if (paletteCategory === "analogous") {
        const hsl = hexToHSL(baseColor);
        paletteColors = [HSLToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),baseColor, HSLToHex((hsl.h + 30) % 360, hsl.s, hsl.l)];
    }
    else if (paletteCategory === "monochromatic") {
        const hsl = hexToHSL(baseColor);
        paletteColors = [HSLToHex(hsl.h, hsl.s, 20), HSLToHex(hsl.h, hsl.s, 35), HSLToHex(hsl.h, hsl.s, 50), HSLToHex(hsl.h, hsl.s, 65), HSLToHex(hsl.h, hsl.s, 80)];
    }
    const savedPalettes = JSON.parse(localStorage.getItem("userPalettes")) || [];

    savedPalettes.push({
        type: paletteCategory,
        name: paletteName,
        creator: creatorName,
        colors: paletteColors
    });
    localStorage.setItem("userPalettes",JSON.stringify(savedPalettes));
    showToast("Palette Saved!");
    paletteForm.reset();
});

/*TOAST NOTIFICATION*/
function showToast(message) {
    toast.innerText = message;
    toast.style.opacity = "1";
    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}

/*HEX TO HSL CONVERSION*/
function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;
    l = (max + min) / 2;
    if (max === min) {
        h = 0;
        s = 0;
    }
    else {
        const difference = max - min;
        s = l > 0.5? difference / (2 - max - min): difference / (max + min);
        switch (max) {
            case r:
                h = (g - b) / difference + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / difference + 2;
                break;
            case b:
                h = (r - g) / difference + 4;
                break;
        }
        h *= 60;
    }
    return {
        h: Math.round(h),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/*HSL TO HEX CONVERSION*/
function HSLToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= h && h < 60) {
        r = c;
        g = x;
    }
    else if (60 <= h && h < 120) {
        r = x;
        g = c;
    }
    else if (120 <= h && h < 180) {
        g = c;
        b = x;
    }
    else if (180 <= h && h < 240) {
        g = x;
        b = c;
    }
    else if (240 <= h && h < 300) {
        r = x;
        b = c;
    }
    else {
        r = c;
        b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return ("#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0"));
}

/*TEXT CONTRAST DETECTION*/
function getContrastColor(hex) {
    const number = parseInt(hex.slice(1), 16);
    const r = number >> 16;
    const g = (number >> 8) & 0x00FF;
    const b = number & 0x0000FF;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125? "black": "white";
}