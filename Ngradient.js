// ===== ELEMENTS =====
let color1=document.getElementById("color1");
let color2=document.getElementById("color2");
let gradientType=document.getElementById("gradientType");
let direction=document.getElementById("direction");
let angleSlider=document.getElementById("angleSlider");
let angleValue=document.getElementById("angleValue");
let generateBtn=document.getElementById("generateGradientButton");
let preview=document.getElementById("gradientPreview");
let cssText=document.getElementById("cssCode");
let copyButton=document.getElementById("copyCodeButton");
let toast=document.getElementById("toast");

// ===== ANGLE SLIDER =====
angleSlider.addEventListener("input",()=>{
    angleValue.innerText=angleSlider.value+"°";
});

// ===== GENERATE BUTTON =====
generateBtn.addEventListener("click",()=>{
    generateGradient();
});

// ===== MAIN GRADIENT FUNCTION =====
function generateGradient(){
    let c1=color1.value;
    let c2=color2.value;
    let type=gradientType.value;
    let dir=direction.value;
    let angle=angleSlider.value;
    let gradient="";
    if(type==="linear"){gradient="linear-gradient("+angle+"deg, "+c1+", "+c2+")";
    }
    else{
        gradient="radial-gradient(circle, "+c1+", "+c2+")";
    }
    preview.style.background=gradient;
    preview.style.height="180px";
    cssText.innerText=
    "background: "+gradient+";";
}

// ===== COPY CSS =====
copyButton.addEventListener("click",()=>{
    navigator.clipboard.writeText(
        cssText.innerText
    );
    showToast("CSS Code Copied!");
});

// ===== TOAST =====
function showToast(message){
    toast.innerText=message;
    toast.style.opacity="1";
    setTimeout(()=>{
        toast.style.opacity="0";
    },2000);
}

// ===== INITIAL LOAD =====
generateGradient();