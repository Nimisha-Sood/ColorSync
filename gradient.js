/*DOM ELEMENTS*/
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const gradientType = document.getElementById("gradientType");
const angleSlider = document.getElementById("angleSlider");
const angleValue = document.getElementById("angleValue");
const generateBtn = document.getElementById("generateGradientButton");
const gradientPreview = document.getElementById("gradientPreview");
const cssCode = document.getElementById("cssCode");
const copyCodeButton = document.getElementById("copyCodeButton");
const toast = document.getElementById("toast");

/* Update angle text while sliding */
angleSlider.addEventListener("input", () => {
    angleValue.innerText = `${angleSlider.value}°`;
});

/*GENERATE BUTTON*/
generateBtn.addEventListener("click", () => {
    generateGradient();
});

/*MAIN GRADIENT FUNCTION*/
function generateGradient() {
    const firstColor = color1.value;
    const secondColor = color2.value;
    const selectedType = gradientType.value;
    const selectedAngle = angleSlider.value;
    let gradient = "";
    if (selectedType === "linear") {
        gradient = `linear-gradient(${selectedAngle}deg, ${firstColor}, ${secondColor})`;
    }
    else {
        gradient = `radial-gradient(circle, ${firstColor}, ${secondColor})`;
    }
    gradientPreview.style.background = gradient;
    gradientPreview.style.height = "180px";
    cssCode.innerText = `background: ${gradient};`;
}

/*COPY CSS CODE*/
copyCodeButton.addEventListener("click", () => {
    navigator.clipboard.writeText(
        cssCode.innerText
    );
    showToast("CSS Code Copied!");
});

/*TOAST NOTIFICATION*/
function showToast(message) {
    toast.innerText = message;
    toast.style.opacity = "1";
    setTimeout(() => {
        toast.style.opacity = "0";
    }, 2000);
}

/* Generate default gradient on startup */
generateGradient();