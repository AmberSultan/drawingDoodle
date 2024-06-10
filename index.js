const canvas = document.querySelector('canvas');
const context = canvas.getContext("2d");

const toolBtn = document.querySelectorAll(".option.elements"),
fillColor = document.querySelector("#fillColor"),
colorBtns =  document.querySelectorAll(".options .option"),
colorPicker =  document.querySelector("#color-picker"),
clearCanvas =  document.querySelector(".clr"),
saveImage =  document.querySelector(".save"),
sliderSize = document.querySelector("#sliderRange");

let previousMouseX, previousMouseY,snapshot,
isDrawing = false,
selectedTool = "brush",
brushSize = 3,
selectedColor = "#000";


const setCanvasBackground = () =>{
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = selectedColor;
}

window.addEventListener("load" , ()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});

const drawRectangle = (e) => {
//fillColor
if(fillColor.checked){

    snapshot =  context.getImageData(0, 0, canvas.width, canvas.height);
    context.beginPath();
    const width = e.offsetX - previousMouseX;
    const height = e.offsetY - previousMouseY;
    context.fillStyle = fillColor.value;
    context.fillRect(previousMouseX, previousMouseY, width, height);

}
else{
    snapshot =  context.getImageData(0, 0, canvas.width, canvas.height);
    context.strokeStyle = fillColor.value; // Set stroke color
    const width = e.offsetX - previousMouseX;
    const height = e.offsetY - previousMouseY;
    context.strokeRect(previousMouseX, previousMouseY, width, height); // Draw outlined rectangle
} 
};

const drawCircle = (e) => {
    context.beginPath();
    let radius = Math.sqrt(Math.pow((previousMouseX - e.offsetX), 2) + Math.pow((previousMouseY - e.offsetY), 2));
    context.arc(previousMouseX, previousMouseY, radius, 0, 2 * Math.PI);
    

    if(fillColor.checked){
        context.fillStyle = fillColor.value;
        context.fill();
    }
    else{
        context.strokeStyle = fillColor.value;
        context.stroke();
    }

};

const drawTriangle = (e) =>{


    context.beginPath();
    context.moveTo(previousMouseX, previousMouseY);
    context.lineTo(e.offsetX, e.offsetY);
    context.lineTo(previousMouseX * 2 - e.offsetX, e.offsetY);
    context.closePath();
    
    if(fillColor.checked){
        context.fillStyle = fillColor.value;
        context.fill();
    }
    else{
        context.strokeStyle = fillColor.value;
        context.stroke();
    }

};


const drawing = (e)=>{

    //console.log("Fill color checked:", fillColor.checked);

    if(!isDrawing) return;
    context.putImageData(snapshot, 0, 0);

    if(selectedTool === "brush" || selectedTool === "eraser"){

    context.strokeStyle = selectedTool ===  "eraser" ? "#fff" : selectedColor;
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke(); //draw line according to color
    }
    else if(selectedTool === "rectangle"){
        drawRectangle(e);
    }
    else if(selectedTool === "circle"){
        drawCircle(e);
    }
    else if(selectedTool === "triangle"){
        drawTriangle(e);
    }
};
const startDrawing = (e) =>{
    isDrawing = true;
   // console.log("start Drawing");
    previousMouseX = e.offsetX;
    previousMouseY = e.offsetY;
    context.beginPath();  //new line start from new point not from the previous line
    context.lineWidth = brushSize;
    context.strokeStyle = selectedColor;
    context.fillStyle = selectedColor;
};
const stopDrawing = (e) =>{
    isDrawing = false;
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height); 
};

toolBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        
        document.querySelectorAll(".option.active").forEach(option => {     // Remove "active" class from all elements with both classes "option" and "active"
            option.classList.remove("active");
        });

        btn.classList.add("active");
        document.querySelectorAll(".option span.active").forEach(option => {   //for span text
            option.classList.remove("active");
        });

        btn.classList.add("active"); //add active class
        selectedTool = btn.id;
        console.log(selectedTool);
    });
});

sliderSize.addEventListener("change", ()=>{
    brushSize = parseInt(sliderSize.value);
});

colorBtns.forEach(btn=>{
    btn.addEventListener("click", () =>{
        document.querySelectorAll(".option.selected").forEach(option => {     // Remove "active" class from all elements with both classes "option" and "active"
            option.classList.remove("selected");
        });

        btn.classList.add("selected");
        document.querySelectorAll(".option span.selected").forEach(option => {   //for span text
            option.classList.remove("selected");
        });
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
        console.log(selectedColor);

    });
    

});

clearCanvas.addEventListener("click", () => {
    console.log("clear")
    context.clearRect(0, 0, canvas.width, canvas.height);
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height); // Update the snapshot after clearing
    setCanvasBackground();
});

saveImage.addEventListener("click", () => {

    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
});

colorPicker.addEventListener("change", () =>{
    colorPicker.parentElement.style.background= colorPicker.value;
    colorPicker.parentElement.click();
});

canvas.addEventListener("mousemove" , drawing);
// canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousedown', (e) => {
    if (selectedTool === "brush" || selectedTool === "eraser") {
        startDrawing(e);
        drawRectangle(e);
    } else  if (selectedTool === 'circle') {
        startDrawing(e);
        drawCircle(e);
    }
 else if (selectedTool === 'triangle') {
    startDrawing(e);
    drawTriangle(e);
}
    else {
        startDrawing(e);
    }
});
canvas.addEventListener('mouseup', stopDrawing);