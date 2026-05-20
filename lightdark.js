document.addEventListener("DOMContentLoaded", () => {
    /*DOM ELEMENTS*/
    const colorInputs = document.querySelectorAll(".colorInput");
    const previewBoxes = document.querySelectorAll("#lightPalette .colorBox, #darkPalette .colorBox");
    const previewButton = document.getElementById("previewBtn");
    function getContrastColor(hex) {
        const rgbValues = [1, 3, 5].map(position =>
            parseInt(hex.slice(position, position + 2), 16)
        );
        const brightness = (rgbValues[0] * 299 + rgbValues[1] * 587 + rgbValues[2] * 114) / 1000;
        return brightness >= 128? "#1d1e2c": "#ffffff";
    }
    const urlParams = new URLSearchParams(window.location.search);
    const colorParam = urlParams.get("colors");
    if (colorParam) {
        colorParam.split(",").forEach((hex, index) => {
                if (colorInputs[index]) {
                    colorInputs[index].value = hex.startsWith("#")? hex: `#${hex}`;
                }
            });
    }

    /*UPDATE PREVIEW FUNCTION*/
    function updatePreview() {
         const activeColorsCount = colorParam? colorParam.split(",").length: colorInputs.length;
        colorInputs.forEach((input, index) => {
            const selectedColor = input.value.toUpperCase();
            const textColor =getContrastColor(selectedColor);
            const relatedBoxes = [previewBoxes[index], previewBoxes[index + 5]];
            relatedBoxes.forEach((box) => {
                if (!box) return;
                if (index < activeColorsCount) {
                    box.style.backgroundColor = selectedColor;
                    box.style.color = textColor;
                    box.textContent = selectedColor;
                }
                else {
                    box.style.backgroundColor = "#ffffff";
                    box.style.color = "transparent";
                    box.textContent = "";
                }
            });
        });
    }

    /*BUTTON EVENT*/
    if (previewButton) {
        previewButton.addEventListener("click", updatePreview);
    }

    /*INITIAL PREVIEW LOAD*/
    updatePreview();
});