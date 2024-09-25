class FormData {
    name;
    /**
     * @type {HTMLSelectElement}
     */
    package;
    generalPkg = {
        style: null,
        background: null,
        extraCharacters: null
    }
    png = {
        style: null,
        outfits: null,
        blinking: null,
    }

    /**
     * 
     * @param {HTMLFormElement} element 
     */
    constructor(element){
        this.element = element;

        this.name = this.element.elements.name
        this.package = this.element.elements.package

        this.generalPkg.background = this.element.elements.background
        this.generalPkg.extraCharacters = this.element.elements.extraCharacters
        this.generalPkg.style = this.element.elements.style;

        this.png.style = this.element.elements.pngTuber;
        this.png.outfits = this.element.elements.outfits;
        this.png.blinking = this.element.elements.blinking;
    }
    
    get total(){
        let total = 0;
        
        const packageVal = this.package.value;

        if(packageVal == "sketch"){
            return this.selectedCost(this.package);
        } else if(packageVal == "png-tuber"){
            return this.calcPng();
        } else {
            return this.selectedCost(this.package) + this.calcGeneral();
        }
        

    }

    get packageName(){
        return this.package.options[this.package.selectedIndex].text
    }
    
    get packageDisplayName(){
        if(this.package.value == "sketch"){
            return "Sketch";
        } else if(this.package.value == "png-tuber"){
            return "PNG Tuber" + " - " + this.png.style.value;
        } else {
            return this.package.value + " - " + this.generalPkg.style.value;
        }
    }

    get type(){
        if(this.package.value == "sketch"){
            return "Sketch";
        } else if(this.package.value == "png-tuber"){
            return "PNG Tuber";
        } else {
            return "General";
        }
    }
    calcGeneral(){
        let total = 0;

        total += this.selectedCost(this.generalPkg.background);
        total += this.generalPkg.extraCharacters.value * this.generalPkg.extraCharacters.getAttribute("cost");
        total += this.selectedCost(this.generalPkg.style);
        return total;
    }

    calcPng(){
        let total = 0;
        
        total += this.selectedCost(this.png.style);
        total += this.png.outfits.value * this.png.outfits.getAttribute("cost");
        if(this.png.blinking.checked){
            total += Number.parseInt(this.png.blinking.getAttribute("cost"));
        }
        return total;
    }
    /**
     * @param {HTMLSelectElement} selectElement
     * @private
     */
    selectedCost(selectElement){
        return Number.parseInt(selectElement.options[selectElement.selectedIndex].getAttribute("cost"))
    }

    validate(){
        let valid = true;
        if(this.name.value == ""){
            this.name.classList.add("invalid");
            valid = false;
        }
        return valid;
    }
}

document.getElementById("form").addEventListener("change", generateImage);
document.getElementById("export").addEventListener("click", downloadImage);

document.addEventListener("DOMContentLoaded", getParams);
function getParams(){
    let params = new URLSearchParams(window.location.search);
    
    const package = document.getElementById("package");
    if(params.get("pkg") == null) return;
    package.value = params.get("pkg");
}

function handlePackageChange(event){
    const formData = new FormData(event.currentTarget);
    const package = formData.package.value;
    console.log(package);
    
    const pngDiv = document.getElementById("pngDiv");
    const nonSketch = document.getElementById("nonSketch");
    pngDiv.hidden = package != "png-tuber"
    nonSketch.hidden = package == "sketch" || package == "png-tuber";
}

/**
 * 
 * @param {Event} event 
 */
async function generateImage(event){
    console.log('Generate Image');
    event.preventDefault();
    event.stopPropagation();

    handlePackageChange(event);
    let formData = new FormData(event.currentTarget);
    console.log(formData);
    console.log(formData.total);
    const result = document.getElementById("result");

    if(!formData.validate()){
        result.style.display = "none";
        return;
    }
    result.style.display = "flex";

    const canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    console.log(canvasWidth, canvasHeight);

    const background = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    background.addColorStop(0, "#ff68aa");
    background.addColorStop(1, "#0000ff");

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    // Text
    ctx.font = "50px JingleStar";
    ctx.fillStyle = "white";
    ctx.fillText(formData.name.value, 10, 50);

    ctx.font = "20px NoteWorthy";
    switch(formData.type){
        case "Sketch":
            ctx.fillText(formData.packageDisplayName , 10, canvasHeight-15);
            break;
        case "PNG Tuber":
            ctx.fillText(formData.packageDisplayName , 10, canvasHeight-55);
            ctx.fillText("Blinking - " + (formData.png.blinking.checked ? "Yes" : "No"), 10, canvasHeight-35);
            ctx.fillText("Additional Outfits - " + formData.png.outfits.value, 10, canvasHeight-15);
            break;
        case "General":
            ctx.fillText(formData.packageDisplayName , 10, canvasHeight-55);

            ctx.fillText("Extra Characters - " + formData.generalPkg.extraCharacters.value, 10, canvasHeight-35);
        
            ctx.fillText("Background - " + formData.generalPkg.background.value, 10, canvasHeight-15);
          
            break;
    }  
    ctx.font = "50px NoteWorthy";
    ctx.textAlign = "right";
  
    ctx.fillText("$"+formData.total, canvasWidth-10, canvasHeight/2+10);
    ctx.textAlign = "left";

    ctx.font = "15px NoteWorthy";
    var dateTime = new Date();

    let dateTimeText = dateTime.toLocaleDateString('en-US', { timeZone: "America/Chicago" }) + " " + dateTime.toLocaleTimeString('en-US', { timeZone: "America/Chicago" });
    let textWidth = ctx.measureText(dateTimeText).width;
    ctx.fillText(dateTimeText, canvasWidth - textWidth - 10, canvasHeight - 15);
}

async function downloadImage(event){
    const canvas = document.getElementById("canvas");
    const canvasData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "commission_request.png";
    link.href = canvasData;
    link.click();
}