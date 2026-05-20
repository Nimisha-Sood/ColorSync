//ELEMENT REFERENCES
const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const paletteContainer = document.getElementById("paletteContainer");
const hoverCircle = document.querySelector(".hover-circle");
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

//OPEN FILE EXPLORER
uploadBtn.addEventListener("click", () => {
    imageInput.click();
});

//IMAGE UPLOAD
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function (event) {
    previewImage.src = event.target.result;
    previewImage.style.display = "block";
  };
  reader.readAsDataURL(file);
});

//DRAW IMAGE ON CANVAS
previewImage.addEventListener("load", () => {
  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;
  ctx.drawImage(previewImage, 0, 0, canvas.width, canvas.height);
});

//IMAGE HOVER DETECTION
previewImage.addEventListener("mousemove", (event) => {
  const rect = previewImage.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);
  hoverCircle.style.display = "block";
  hoverCircle.style.left = `${event.clientX - rect.left}px`;
  hoverCircle.style.top = `${event.clientY - rect.top}px`;
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  generatePalette(r, g, b);
});

//HIDE HOVER CIRCLE
previewImage.addEventListener("mouseleave", () => {
  hoverCircle.style.display = "none";
});

//GENERATE COLOR PALETTE
function generatePalette(r, g, b) {
  const shades = [
    [r, g, b],
    [
      Math.min(r + 40, 255),
      Math.min(g + 40, 255),
      Math.min(b + 40, 255)
    ],
    [
      Math.min(r + 80, 255),
      Math.min(g + 80, 255),
      Math.min(b + 80, 255)
    ],
    [
      Math.max(r - 40, 0),
      Math.max(g - 40, 0),
      Math.max(b - 40, 0)
    ],
    [
      Math.max(r - 80, 0),
      Math.max(g - 80, 0),
      Math.max(b - 80, 0)
    ]
  ];
    
  //CREATE COLOR BOXES ONLY ONCE
  if (paletteContainer.children.length === 0) {
    shades.forEach(() => {
      const colorBox = document.createElement("div");
      colorBox.classList.add("color-box");
      paletteContainer.appendChild(colorBox);
    });
  }

  //UPDATE PALETTE COLORS
  shades.forEach((color, index) => {
    const colorBox = paletteContainer.children[index];
    const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    const hex = "#" + color.map(c => c.toString(16).padStart(2, "0")).join("").toUpperCase();

    //GET COLOR NAME
    const colorName = colorNamer(hex).basic[0].name;

    //DYNAMIC TEXT CONTRAST
    const brightness = (color[0] * 299 + color[1] * 587 + color[2] * 114) / 1000;
    const textColor = brightness > 150? "#000000": "#FFFFFF";

    //APPLY STYLES
    colorBox.style.background = rgb;
    colorBox.style.color = textColor;

    //DISPLAY CONTENT
    colorBox.innerHTML = `<div>${colorName}<br>(${hex})</div>`;

    //COPY HEX CODE
    colorBox.onclick = () => {
      navigator.clipboard.writeText(hex);
      colorBox.innerHTML = "Copied!";
      setTimeout(() => {
        colorBox.innerHTML = `<div>${colorName}<br>(${hex})</div>`;
      }, 1000);
    };
  });
}