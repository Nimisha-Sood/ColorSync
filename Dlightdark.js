document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".colorInput");
    const previews = document.querySelectorAll("#lightPalette .colorBox, #darkPalette .colorBox");

    // Dynamic contrast calculator: returns dark text for light colors, light text for dark colors
    const getContrast = (hex) => {
        const rgb = [1, 3, 5].map(x => parseInt(hex.slice(x, x + 2), 16));
        return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 >= 128 ? "#1d1e2c" : "#ffffff";
    };

    // Snatch and check parameters traveling through the URL from the gallery page
    const colorParam = new URLSearchParams(window.location.search).get("colors");
    if (colorParam) {
        colorParam.split(",").forEach((hex, i) => {
            if (inputs[i]) {
                inputs[i].value = hex.startsWith("#") ? hex : `#${hex}`;
            }
        });
    }

    // Updates both Light (i) and Dark (i + 5) visual blocks concurrently
    const updatePreview = () => {
        // MODIFICATION: Check exactly how many active colors came from the URL param string
        const activeColorsCount = colorParam ? colorParam.split(",").length : inputs.length;

        inputs.forEach((input, i) => {
            const val = input.value.toUpperCase();
            const textCol = getContrast(val);
            
            [previews[i], previews[i + 5]].forEach(box => {
                if (box) {
                    // MODIFICATION: Only display selected colors. If it's an extra unselected 5th box, make it white.
                    if (i < activeColorsCount) {
                        box.style.backgroundColor = val;
                        box.style.color = textCol;
                        box.textContent = val;
                    } else {
                        box.style.backgroundColor = "#ffffff";
                        box.style.color = "transparent";
                        box.textContent = "";
                    }
                }
            });
        });
    };

    // INTERACTIVE HOOKS: Modified to execute ONLY on explicit button click
    const previewBtn = document.getElementById("previewBtn");
    if (previewBtn) {
        previewBtn.addEventListener("click", updatePreview);
    }
});