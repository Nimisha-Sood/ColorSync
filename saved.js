/*PAGE LOAD*/
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("saved-palettes");
    let palettes = JSON.parse(localStorage.getItem("userPalettes")) || [];
    container.innerHTML = "";

    /*EMPTY STATE*/
    if (palettes.length === 0) {
        container.innerHTML = `<h3>No palettes saved yet</h3>`;
        return;
    }

    /*RENDER EACH PALETTE*/
    palettes.forEach((palette, index) => {
        const card = document.createElement("div");
        card.className = "palette-section";
        const title = document.createElement("h2");
        title.innerText = palette.name || `Palette ${index + 1}`;
        const info = document.createElement("p");
        info.innerHTML = `<b>Type:</b>${palette.type || "Custom"}<br><b>Created By:</b>${palette.creator || "Unknown"}`;

        /*COLOR SWATCH ROW*/
        const colorsRow = document.createElement("div");
        colorsRow.style.display = "flex";
        colorsRow.style.marginTop = "15px";
        colorsRow.style.marginBottom = "15px";
        colorsRow.style.borderRadius = "10px";
        colorsRow.style.overflow = "hidden";

        /*CREATE COLOR BOXES*/
        palette.colors.forEach((color) => {
            const box = document.createElement("div");
            box.style.background = color;
            box.style.flex = "1";
            box.style.height = "100px";
            box.style.display = "flex";
            box.style.alignItems = "center";
            box.style.justifyContent = "center";
            box.style.fontWeight = "bold";
            box.style.color = getContrastColor(color);
            box.innerText = color;
            colorsRow.appendChild(box);
        });

        /*PREVIEW BUTTON*/
        const previewButton = document.createElement("button");
        previewButton.innerText = "Preview";
        previewButton.style.marginRight = "10px";
        previewButton.addEventListener("click", () => {
            const colors = palette.colors.map(color =>
                color.replace("#", "")
            );
            window.location.href =`lightdark.html?colors=${colors.join(",")}`;
        });

        /*DELETE BUTTON*/
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
            palettes.splice(index, 1);
            localStorage.setItem("userPalettes", JSON.stringify(palettes));
            location.reload();
        });

        /*APPEND ELEMENTS*/
        card.appendChild(title);
        card.appendChild(info);
        card.appendChild(colorsRow);
        card.appendChild(previewButton);
        card.appendChild(deleteButton);
        container.appendChild(card);
    });
});

/*CONTRAST CALCULATOR*/
function getContrastColor(hex) {
    const num = parseInt(hex.slice(1), 16);
    const red = num >> 16;
    const green = (num >> 8) & 0x00FF;
    const blue = num & 0x0000FF;
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;
    return brightness > 125? "black": "white";
}