document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("saved-palettes");

    // Get palettes from localStorage
    let palettes = JSON.parse(localStorage.getItem("palettes")) || [];

    container.innerHTML = "";

    // If no palettes saved
    if (palettes.length === 0) {
        container.innerHTML = "<h3>No palettes saved yet</h3>";
        return;
    }

    // Loop through palettes
    palettes.forEach((palette, index) => {

        let paletteBox = document.createElement("div");
        paletteBox.style.margin = "20px 0";
        paletteBox.style.padding = "15px";
        paletteBox.style.borderRadius = "10px";
        paletteBox.style.background = "#f5f5f5";

        let title = document.createElement("h3");
        title.innerText = `Saved Palette ${index + 1}`;

        let colorsRow = document.createElement("div");

        palette.forEach(color => {
            let colorBox = document.createElement("div");

            colorBox.style.background = color;
            colorBox.style.color = "#000";
            colorBox.style.display = "inline-block";
            colorBox.style.padding = "20px";
            colorBox.style.margin = "5px";
            colorBox.style.borderRadius = "5px";
            colorBox.innerText = color;

            colorsRow.appendChild(colorBox);
        });

        paletteBox.appendChild(title);
        paletteBox.appendChild(colorsRow);

        container.appendChild(paletteBox);
    });

});