// ================================
// SAVE + PREVIEW (UNCHANGED LOGIC)
// ================================

function previewPalette(btn) {
    const colors = Array.from(
        btn.closest(".palette-card").querySelectorAll(".swatch"),
        s => s.getAttribute("data-color").replace("#", "")
    );

    window.location.href = `Dlightdark.html?colors=${colors.join(",")}`;
}

function savePalette(btn) {
    const card = btn.closest(".palette-card");

    const name = card.querySelector(".palette-info b")
        .innerText.replace("Palette Name:", "").trim();

    const colors = Array.from(
        card.querySelectorAll(".swatch"),
        s => s.getAttribute("data-color")
    );

    const desc = card.querySelector(".palette-info span").innerText.trim();

    let saved = JSON.parse(localStorage.getItem("userPalettes")) || [];

    if (saved.some(p =>
        JSON.stringify(p.colors) === JSON.stringify(colors)
    )) {
        alert("Already saved!");
        return;
    }

    saved.push({
        name,
        colors,
        description: `Saved: ${desc}`
    });

    localStorage.setItem("userPalettes", JSON.stringify(saved));
    alert(`"${name}" saved successfully!`);
}


// ================================
// CONTRAST ENGINE (FIX)
// ================================

function getLuminance(r, g, b) {
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

function hexToRgb(hex) {
    hex = hex.replace("#", "");
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

function applyContrastFix() {

    // Fix swatches
    document.querySelectorAll(".swatch").forEach(el => {
        const hex = el.getAttribute("data-color");
        if (!hex) return;

        const { r, g, b } = hexToRgb(hex);
        const lum = getLuminance(r, g, b);

        el.style.color = lum < 140 ? "white" : "black";
    });

    // Fix table cells (mood guide)
    document.querySelectorAll("td").forEach(td => {
        const bg = window.getComputedStyle(td).backgroundColor;
        const rgb = bg.match(/\d+/g);

        if (!rgb) return;

        const r = parseInt(rgb[0]);
        const g = parseInt(rgb[1]);
        const b = parseInt(rgb[2]);

        const lum = getLuminance(r, g, b);

        td.style.color = lum < 140 ? "white" : "black";
    });
}


// ================================
// INIT
// ================================

document.addEventListener("DOMContentLoaded", applyContrastFix);