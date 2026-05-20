/*PREVIEW PALETTE*/
function previewPalette(button) {
    const colors = Array.from(
        button.closest(".palette-card").querySelectorAll(".swatch"),
        swatch => swatch.getAttribute("data-color").replace("#", "")
    );
    window.location.href =`lightdark.html?colors=${colors.join(",")}`;
}

/*SAVE PALETTE*/
function savePalette(button) {
    const paletteCard = button.closest(".palette-card");
    const paletteName = paletteCard.querySelector(".palette-info strong").parentElement.innerText.split("\n")[0].replace("Palette Name:", "").trim();
    const colors = Array.from(paletteCard.querySelectorAll(".swatch"),
        swatch => swatch.getAttribute("data-color")
    );
    const description = paletteCard.querySelector(".palette-info span").innerText.trim();
    let savedPalettes = JSON.parse(localStorage.getItem("userPalettes")) || [];
    const alreadySaved = savedPalettes.some(palette =>
            JSON.stringify(palette.colors) === JSON.stringify(colors)
        );
    if (alreadySaved) {
        alert("Palette already saved!");
        return;
    }
    savedPalettes.push({
        name: paletteName,
        colors: colors,
        description: `Saved: ${description}`
    });
    localStorage.setItem("userPalettes", JSON.stringify(savedPalettes));
    alert(`"${paletteName}" saved!`);
}

/*APPLY CONTRAST + SWATCH STYLING*/
function applyStylesAndContrast() {
    const swatches = document.querySelectorAll(".swatch");
    swatches.forEach((swatch) => {
        const hexColor = swatch.getAttribute("data-color");
        if (!hexColor) return;
        const red = parseInt(hexColor.substring(1, 3), 16);
        const green = parseInt(hexColor.substring(3, 5), 16);
        const blue = parseInt(hexColor.substring(5, 7), 16);
        const luminance = (0.299 * red) + (0.587 * green) + (0.114 * blue);
        swatch.style.color = luminance < 140? "white": "black";
        swatch.style.flex = "1";
        swatch.style.display = "flex";
        swatch.style.alignItems = "center";
        swatch.style.justifyContent = "center";
        swatch.style.height = "100%";
        swatch.style.fontSize = "12px";
        swatch.style.fontWeight = "bold";
    });
}

/*INITIAL PAGE LOAD*/
document.addEventListener("DOMContentLoaded", () => {
    applyStylesAndContrast();
});