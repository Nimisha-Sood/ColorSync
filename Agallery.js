// Triggers the LightDark workspace preview via URL variables
function previewPalette(btn) {
    const colors = Array.from(btn.closest(".palette-card").querySelectorAll(".swatch"), s => s.getAttribute("data-color").replace("#", ""));
    window.location.href = `Dlightdark.html?colors=${colors.join(",")}`;
}

// Commits the selected 5-color block straight to storage
function savePalette(btn) {
    const card = btn.closest(".palette-card");
    const name = card.querySelector(".palette-info b").innerText.replace("Palette Name:", "").trim();
    const colors = Array.from(card.querySelectorAll(".swatch"), s => s.getAttribute("data-color"));
    const desc = card.querySelector(".palette-info span").innerText.trim();

    let saved = JSON.parse(localStorage.getItem("userPalettes")) || [];
    if (saved.some(p => JSON.stringify(p.colors) === JSON.stringify(colors))) return alert("Already saved!");

    saved.push({ name, colors, description: `Saved: ${desc}` });
    localStorage.setItem("userPalettes", JSON.stringify(saved));
    alert(`"${name}" saved successfully!`);
}