function previewPalette(btn) {
    const colors = Array.from(
        btn.closest(".palette-card").querySelectorAll(".swatch"),
        s => s.getAttribute("data-color").replace("#", "")
    );
    window.location.href = `Dlightdark.html?colors=${colors.join(",")}`;
}
function savePalette(btn) {
    const card = btn.closest(".palette-card");
    const name = card.querySelector(".palette-info b").innerText.replace("Palette Name:", "").trim();
    const colors = Array.from(card.querySelectorAll(".swatch"), s => s.getAttribute("data-color"));
    const desc = card.querySelector(".palette-info span").innerText.trim();

    let saved = JSON.parse(localStorage.getItem("userPalettes")) || [];
    if (saved.some(p => JSON.stringify(p.colors) === JSON.stringify(colors))) {
        alert("Already saved!");
        return;
    }

    saved.push({ name, colors, description: `Saved: ${desc}` });
    localStorage.setItem("userPalettes", JSON.stringify(saved));
    alert(`"${name}" saved!`);
}
function applyStylesAndContrast() {
    document.querySelectorAll(".swatch").forEach(el => {
        const hex = el.getAttribute("data-color");
        if (!hex) return;

        // Calculate Contrast (Perceptive Luminance)
        const r = parseInt(hex.substring(1, 3), 16);
        const g = parseInt(hex.substring(3, 5), 16);
        const b = parseInt(hex.substring(5, 7), 16);
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Dynamic text color
        el.style.color = lum < 140 ? "white" : "black";

        // Reinforce layout properties via JS
        el.style.flex = "1"; 
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.height = "100%"; 
        el.style.fontSize = "12px";
        el.style.fontWeight = "bold";
    });
}
document.addEventListener("DOMContentLoaded", () => {
    applyStylesAndContrast();
});