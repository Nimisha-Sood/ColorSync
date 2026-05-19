const uploadBtn = document.getElementById("uploadBtn");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const paletteContainer = document.getElementById("paletteContainer");
const hoverCircle = document.querySelector(".hover-circle");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");


// Open File Explorer
uploadBtn.addEventListener("click", () => {
  imageInput.click();
});


// Upload Image
imageInput.addEventListener("change", function () {

  const file = this.files[0];

  if(file){

    const reader = new FileReader();

    reader.onload = function(e){

      previewImage.src = e.target.result;
      previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);
  }
});


// Draw Image on Canvas
previewImage.addEventListener("load", () => {

  canvas.width = previewImage.naturalWidth;
  canvas.height = previewImage.naturalHeight;

  ctx.drawImage(
    previewImage,
    0,
    0,
    canvas.width,
    canvas.height
  );
});


// Mouse Hover on Image
previewImage.addEventListener("mousemove", (e) => {

  const rect = previewImage.getBoundingClientRect();

  const x = Math.floor(
    ((e.clientX - rect.left) / rect.width) * canvas.width
  );

  const y = Math.floor(
    ((e.clientY - rect.top) / rect.height) * canvas.height
  );

  // Hover Circle
  hoverCircle.style.display = "block";

  hoverCircle.style.left = `${e.clientX - rect.left}px`;
  hoverCircle.style.top = `${e.clientY - rect.top}px`;

  // Get Pixel Color
  const pixel = ctx.getImageData(x, y, 1, 1).data;

  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];

  generatePalette(r, g, b);
});


// Hide Circle
previewImage.addEventListener("mouseleave", () => {
  hoverCircle.style.display = "none";
});


function generatePalette(r, g, b){

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

  // CREATE BOXES ONLY ONCE
  if(paletteContainer.children.length === 0){

    shades.forEach(() => {

      const colorBox = document.createElement("div");

      colorBox.classList.add("color-box");

      paletteContainer.appendChild(colorBox);

    });
  }

  // UPDATE COLORS SMOOTHLY
  shades.forEach((color, index) => {

    const colorBox = paletteContainer.children[index];

    const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    const hex =
      "#" +
      color
        .map(c => c.toString(16).padStart(2, "0"))
        .join("");

    // COLOR NAME
    const colorName = colorNamer(hex).basic[0].name;
    // SMOOTH UPDATE
    colorBox.style.background = rgb;

    colorBox.innerHTML = `
      <div>
        ${colorName}
        <br>
        (${hex})
      </div>
    `;

    // COPY HEX
    colorBox.onclick = () => {

      navigator.clipboard.writeText(hex);

      colorBox.innerHTML = "Copied!";

      setTimeout(() => {

        colorBox.innerHTML = `
          <div>
            ${colorName}
            <br>
            (${hex})
          </div>
        `;

      }, 1000);
    };
  });
}