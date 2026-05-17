// Select elements
let color1 = document.getElementById("color1");
let color2 = document.getElementById("color2");

let button = document.getElementById("generateGradientButton");

let preview = document.getElementById("gradientPreview");
let cssText = document.getElementById("cssCode");

let copyButton = document.getElementById("copyCodeButton");

// Generate Gradient
button.addEventListener("click", function () {

    let c1 = color1.value;
    let c2 = color2.value;

    let gradient = "linear-gradient(to right, " + c1 + ", " + c2 + ")";

    // Apply gradient
    preview.style.background = gradient;
    preview.style.height = "150px"; // so it is visible

    // Show CSS code
    cssText.innerText = gradient;
});


// Copy to clipboard
copyButton.addEventListener("click", function () {
    navigator.clipboard.writeText(cssText.innerText);
    alert("CSS code copied!");
});