document.addEventListener("DOMContentLoaded",()=>{
let container=document.getElementById("saved-palettes");
let palettes=JSON.parse(localStorage.getItem("userPalettes"))||[];
container.innerHTML="";
if(palettes.length===0){
container.innerHTML=`
<h3>No palettes saved yet</h3>
`;
return;
}

palettes.forEach((palette,index)=>{
let card=document.createElement("div");
card.className="palette-section";
let title=document.createElement("h2");
title.innerText=palette.name || `Palette ${index+1}`;
let info=document.createElement("p");
info.innerHTML=`
<b>Type:</b> ${palette.type || "Custom"}
<br>
<b>Created By:</b> ${palette.creator || "Unknown"}
`;
let colorsRow=document.createElement("div");
colorsRow.style.display="flex";
colorsRow.style.marginTop="15px";
colorsRow.style.marginBottom="15px";
colorsRow.style.borderRadius="10px";
colorsRow.style.overflow="hidden";
palette.colors.forEach(color=>{
let box=document.createElement("div");
box.style.background=color;
box.style.flex="1";
box.style.height="100px";
box.style.display="flex";
box.style.alignItems="center";
box.style.justifyContent="center";
box.style.fontWeight="bold";
box.style.color=getContrastColor(color);
box.innerText=color;
colorsRow.appendChild(box);
});
let previewBtn=document.createElement("button");
previewBtn.innerText="Preview";
previewBtn.style.marginRight="10px";
previewBtn.addEventListener("click",()=>{
let colors=palette.colors.map(c=>c.replace("#",""));
window.location.href=
`Dlightdark.html?colors=${colors.join(",")}`;
});
let deleteBtn=document.createElement("button");
deleteBtn.innerText="Delete";
deleteBtn.addEventListener("click",()=>{
palettes.splice(index,1);
localStorage.setItem(
"userPalettes",
JSON.stringify(palettes)
);
location.reload();
});
card.appendChild(title);
card.appendChild(info);
card.appendChild(colorsRow);
card.appendChild(previewBtn);
card.appendChild(deleteBtn);
container.appendChild(card);
});
});

function getContrastColor(hex){
let num=parseInt(hex.slice(1),16);
let r=num>>16;
let g=(num>>8)&0x00FF;
let b=num&0x0000FF;
let brightness=(r*299+g*587+b*114)/1000;
return brightness>125 ? "black" : "white";
}