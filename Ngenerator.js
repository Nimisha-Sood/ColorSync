// ===== ELEMENTS =====
let colorPicker=document.getElementById("colorPicker");
let hexInput=document.getElementById("hexInput");
let generateBtn=document.getElementById("generatePaletteButton");
let compDiv=document.getElementById("complementaryPalette");
let anaDiv=document.getElementById("analogousPalette");
let monoDiv=document.getElementById("monochromaticPalette");
let toast=document.getElementById("toast");

// ===== INPUT SYNC =====
colorPicker.addEventListener("input",()=>{
    hexInput.value=colorPicker.value;
});
hexInput.addEventListener("input",()=>{
    let value=hexInput.value;
    let hexPattern=/^#[0-9A-Fa-f]{6}$/;
    if(hexPattern.test(value)){
        colorPicker.value=value;
        hexInput.style.border="2px solid green";
    }
    else{
        hexInput.style.border="2px solid red";
    }
});

// ===== GENERATE BUTTON =====
generateBtn.addEventListener("click",()=>{
    let base=colorPicker.value;
    generateAllPalettes(base);
});

// ===== GENERATE ALL =====
function generateAllPalettes(base){
    compDiv.innerHTML="";
    anaDiv.innerHTML="";
    monoDiv.innerHTML="";
    generateComplementary(base);
    generateAnalogous(base);
    generateMonochromatic(base);

}

// ===== COMPLEMENTARY =====
function generateComplementary(color){
    let hsl=hexToHSL(color);
    let complementaryHue=(hsl.h+180)%360;
    let complementaryColor=HSLToHex(
        complementaryHue,
        hsl.s,
        hsl.l
    );
    createBox(color,compDiv);
    createBox(complementaryColor,compDiv);
}

// ===== ANALOGOUS =====
function generateAnalogous(color){
    let hsl=hexToHSL(color);
    let color1=HSLToHex(
        (hsl.h-30+360)%360,
        hsl.s,
        hsl.l
    );
    let color2=color;
    let color3=HSLToHex(
        (hsl.h+30)%360,
        hsl.s,
        hsl.l
    );
    createBox(color1,anaDiv);
    createBox(color2,anaDiv);
    createBox(color3,anaDiv);
}

// ===== MONOCHROMATIC =====
function generateMonochromatic(color){
    let hsl=hexToHSL(color);
    createBox(
        HSLToHex(hsl.h,hsl.s,20),
        monoDiv
    );
    createBox(
        HSLToHex(hsl.h,hsl.s,35),
        monoDiv
    );
    createBox(
        HSLToHex(hsl.h,hsl.s,50),
        monoDiv
    );
    createBox(
        HSLToHex(hsl.h,hsl.s,65),
        monoDiv
    );
    createBox(
        HSLToHex(hsl.h,hsl.s,80),
        monoDiv
    );
}

// ===== CREATE BOX =====
function createBox(color,parent){
    let box=document.createElement("div");
    box.className="color-box";
    box.style.background=color;
    box.style.color=getContrastColor(color);
    box.innerText=color;
    box.addEventListener("click",()=>{
        navigator.clipboard.writeText(color);
        showToast(color+" copied!");
    });
    parent.appendChild(box);
}

// ===== SAVE PALETTE =====
let paletteForm=document.getElementById("paletteForm");
paletteForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let paletteName=document.getElementById("paletteName").value;
    let category=document.getElementById("paletteCategory").value;
    let creator=document.getElementById("creatorName").value;
    if(paletteName.trim()===""|| category===""|| creator.trim()==="") {
        showToast("Please fill the form!");
        return;
    }
    let base=colorPicker.value;
    let palette=[];
    if(category==="complementary"){
        let hsl=hexToHSL(base);
        let complementaryHue=(hsl.h+180)%360;
        palette=[base, HSLToHex(complementaryHue,hsl.s,hsl.l)];
    }
    else if(category==="analogous"){
        let hsl=hexToHSL(base);
        palette=[HSLToHex((hsl.h-30+360)%360,hsl.s,hsl.l), base, HSLToHex((hsl.h+30)%360,hsl.s,hsl.l)];
    }
    else if(category==="monochromatic"){
        let hsl=hexToHSL(base);
        palette=[HSLToHex(hsl.h,hsl.s,20), HSLToHex(hsl.h,hsl.s,35), HSLToHex(hsl.h,hsl.s,50), HSLToHex(hsl.h,hsl.s,65), HSLToHex(hsl.h,hsl.s,80)];
    }
    let saved=JSON.parse(localStorage.getItem("palettes"))||[];
    saved.push({type:category, name:paletteName, creator:creator, colors:palette});
    localStorage.setItem(
        "palettes",
        JSON.stringify(saved)
    );
    showToast("Palette Saved!");
    paletteForm.reset();
});

// ===== TOAST =====
function showToast(message){
    toast.innerText=message;
    toast.style.opacity="1";
    setTimeout(()=>{
        toast.style.opacity="0";
    },2000);
}

// ===== HEX TO HSL =====
function hexToHSL(hex){
    let r=parseInt(hex.slice(1,3),16)/255;
    let g=parseInt(hex.slice(3,5),16)/255;
    let b=parseInt(hex.slice(5,7),16)/255;
    let max=Math.max(r,g,b);
    let min=Math.min(r,g,b);
    let h,s,l;
    l=(max+min)/2;
    if(max===min){
        h=s=0;
    }
    else{
        let d=max-min;
        s=l>0.5
        ?d/(2-max-min)
        :d/(max+min);
        switch(max){
            case r:
                h=(g-b)/d+(g<b?6:0);
                break;

            case g:
                h=(b-r)/d+2;
                break;

            case b:
                h=(r-g)/d+4;
                break;
        }
        h=h*60;
    }
    return{
        h:Math.round(h),
        s:Math.round(s*100),
        l:Math.round(l*100)
    };
}

// ===== HSL TO HEX =====
function HSLToHex(h,s,l){
    s/=100;
    l/=100;
    let c=(1-Math.abs(2*l-1))*s;
    let x=c*(1-Math.abs((h/60)%2-1));
    let m=l-c/2;
    let r=0;
    let g=0;
    let b=0;
    if(0<=h&&h<60){
        r=c;
        g=x;
        b=0;
    }
    else if(60<=h&&h<120){
        r=x;
        g=c;
        b=0;
    }
    else if(120<=h&&h<180){
        r=0;
        g=c;
        b=x;
    }
    else if(180<=h&&h<240){
        r=0;
        g=x;
        b=c;
    }
    else if(240<=h&&h<300){
        r=x;
        g=0;
        b=c;
    }
    else{
        r=c;
        g=0;
        b=x;
    }
    r=Math.round((r+m)*255);
    g=Math.round((g+m)*255);
    b=Math.round((b+m)*255);
    return"#"+
    r.toString(16).padStart(2,'0')+
    g.toString(16).padStart(2,'0')+
    b.toString(16).padStart(2,'0');
}

// ===== CONTRAST =====
function getContrastColor(hex){
    let num=parseInt(hex.slice(1),16);
    let r=num>>16;
    let g=(num>>8)&0x00FF;
    let b=num&0x0000FF;
    let brightness=
    (r*299+g*587+b*114)/1000;
    return brightness>125
    ?"black"
    :"white";
}