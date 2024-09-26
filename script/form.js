class FormData {
    /**
     * @type {HTMLInputElement}
     */
    name;
    /**
     * @type {HTMLSelectElement}
     */
    package;
    /**
     * @typedef {Object} GeneralPackage
     * @property {HTMLSelectElement} style
     * @property {HTMLSelectElement} background
     * @property {HTMLInputElement} extraCharacters
     */

    /**@type {GeneralPackage} */
    generalPkg = {
        style: null,
        background: null,
        extraCharacters: null
    }
    /**
     * @typedef {Object} PNGTuber
     * @property {HTMLSelectElement} style
     * @property {HTMLInputElement} outfits
     * @property {HTMLInputElement} blinking
     */

    /**@type {PNGTuber} */
    png = {
        style: null,
        outfits: null,
        blinking: null,
    }
    /**
     * @typedef {Object} Emoji
     * @property {HTMLInputElement} count
     */
    /**@type {Emoji} */
    emoji = {
        count: null
    }
    description = "";

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

        this.description = this.element.elements.description;

        this.emoji.count = this.element.elements.emojiCount;
    }
    /**
     * @returns {Number} Total of the package
     */
    
    get total(){
        
        const packageVal = this.package.value.toLowerCase();

        if(packageVal == "sketch"){
            return this.selectedCost(this.package);
        } else if(packageVal == "png-tuber"){
            return this.calcPng();
        } else if(packageVal == "emoji"){
            return this.calcEmoji();
        } else {
            return this.selectedCost(this.package) + this.calcGeneral();
        }
        

    }

    get packageName(){
        return this.package.options[this.package.selectedIndex].text
    }
    
    /**
     * @returns {String} The display name of the package
     */
    get packageDisplayName(){
        const value = this.package.value.toLowerCase();
        if(value == "sketch"){
            return "Sketch";
        } else if(value == "png-tuber"){
            return "PNG Tuber" + " - " + this.png.style.value;
        } else {
            return this.package.value + " - " + this.generalPkg.style.value;
        }
    }

    /**
     * @returns {String} The type of the package
     */
    get type(){
        const value = this.package.value.toLowerCase();
        if(value == "sketch"){
            return "Sketch";
        } else if(value == "png-tuber"){
            return "PNG Tuber";
        } else if(value == "emoji"){
            return "Emoji";
        } else {
            return "General";
        }
    }
    
    /**
     * @private
     * @returns {Number} The cost of the general package
     */
    calcGeneral(){
        let total = 0;

        total += this.selectedCost(this.generalPkg.background);
        total += this.generalPkg.extraCharacters.value * (parseInt(this.generalPkg.extraCharacters.getAttribute("cost")) + (this.package.value == "Full-body" ? 5 : 0));
        total += this.selectedCost(this.generalPkg.style);
        return total;
    }

    /**
     * @private
     * @returns {Number} The cost of the PNG Tuber package
     */
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
     * @private
     * @returns {Number} The cost of the emoji package
     */
    calcEmoji(){
        console.log("Calculating emoji");
        console.log(this.emoji.count.value);
        let total = 0;
        total += this.emoji.count.value * Number.parseInt(this.emoji.count.getAttribute("cost"));
        return total;
    }
    /**
     * @param {HTMLSelectElement} selectElement
     * @private
     */
    selectedCost(selectElement){
        return Number.parseInt(selectElement.options[selectElement.selectedIndex].getAttribute("cost"))
    }

    /**
     * @returns {Boolean}
     */
    validate(){
        let valid = true;
        if(this.name.value == ""){
            this.name.classList.add("invalid");
            valid = false;
        } else this.name.classList.remove("invalid");
        valid = this.checkNumber(this.png.outfits) && valid;
        valid = this.checkNumber(this.generalPkg.extraCharacters) && valid;
        valid = this.checkNumber(this.emoji.count) && valid;
        return valid;
    }

    /**
     * @private
     * @param {HTMLInputElement} input 
     * @returns {Boolean}
     */
    checkNumber(input){
        const max = Number.parseInt(input.getAttribute("max"));
        const min = Number.parseInt(input.getAttribute("min"));
        const value = Number.parseInt(input.value);
        if(value > max || value < min){
            input.classList.add("invalid");
            return false;
        } else {
            input.classList.remove("invalid");
            return true;
        }
    }
}

document.getElementById("form").addEventListener("change", generateImage);
document.getElementById("export").addEventListener("click", downloadImage);

document.addEventListener("DOMContentLoaded", getParams);
function getParams(){
    let params = new URLSearchParams(window.location.search);
    
    const package = document.getElementById("package");
    const pkg = params.get("pkg");
    const png = params.get("png");
    if(pkg != null) package.value = pkg;
    if(png != null) document.getElementById("pngTuber").value = png;
    handlePackageChange({currentTarget: document.getElementById("form")});
}

/**
 * 
 * @param {Event} event 
 */
function handlePackageChange(event){
    const formData = new FormData(event.currentTarget);
    const package = formData.package.value.toLowerCase();
    const pngStyle = formData.png.style.value;
    console.log(package);
    
    const pngDiv = document.getElementById("pngDiv");
    const nonSketch = document.getElementById("nonSketch");
    const nonPopcat = document.getElementById("nonPopcat");
    const emojiDiv  = document.getElementById("emojiDiv");
    pngDiv.hidden = package != "png-tuber"
    nonPopcat.hidden = (package == "png-tuber") && pngStyle == "Popcat";
    nonSketch.hidden = package == "sketch" || package == "png-tuber" || package == "emoji";
    emojiDiv.hidden = package != "emoji";
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
    starryBackground(canvas, ctx);
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
            if(formData.png.style.value == "Popcat") {
                ctx.fillText(formData.packageDisplayName , 10, canvasHeight-15);
                break;
            }
            ctx.fillText(formData.packageDisplayName , 10, canvasHeight-55);
            
            ctx.fillText("Blinking - " + (formData.png.blinking.checked ? "Yes" : "No"), 10, canvasHeight-35);
            ctx.fillText("Additional Outfits - " + formData.png.outfits.value, 10, canvasHeight-15);
            break;
        case "Emoji":
            ctx.fillText("Emoji" , 10, canvasHeight-35);
            ctx.fillText("Total - " + formData.emoji.count.value, 10, canvasHeight-15);
            break;
        case "General":
            ctx.fillText(formData.packageDisplayName , 10, canvasHeight-55);

            ctx.fillText("Extra Characters - " + formData.generalPkg.extraCharacters.value, 10, canvasHeight-35);
        
            ctx.fillText("Background - " + formData.generalPkg.background.value, 10, canvasHeight-15);
          
            break;
    }  

    // Description

    const maxWidth = canvasWidth / 1.5;
    const lineHeight = 25;
    const words = formData.description.value.split(' ');
    let line = '';
    let y = 85;

    let maxLines = 5;
    let lineCount = 0;

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            if (lineCount >= maxLines) {
                break;
            }
            ctx.fillText(line, 10, y);
            line = words[i] + ' ';
            y += lineHeight;
            lineCount++;
        } else {
            line = testLine;
        }
    }
    
    if (line.trim().length > 0 && lineCount < maxLines) {
        ctx.fillText(line, 10, y);
    }
    ctx.fillText(line, 10, y);


    // Price

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

/**
 * @param {HTMLCanvasElement} canvas
 * @param {CanvasRenderingContext2D} ctx
 */
function starryBackground(canvas, ctx){
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const stars = 500;

    const starColors = [
        "rgba(255, 128, 128, 0.5)",
        "rgba(255, 192, 128, 0.5)",
        "rgba(255, 255, 128, 0.5)",
        "rgba(128, 255, 128, 0.5)",
        "rgba(128, 128, 255, 0.5)",
        "rgba(192, 128, 255, 0.5)"
    ]

    const backgroundColors =  [
        ["#ff68aa", "#0000ff"],
        ["#0000ff", "#ff68aa"],
        ["#800080", "#FFA500"],
        ["#FFA500", "#800080"],
        
    ]

    const background = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);

    const randomBg = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
    background.addColorStop(0, randomBg[0]);
    background.addColorStop(1, randomBg[1]);

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.font = "100px";

    for(let i = 0; i < stars; i++){
        const x = Math.random() * canvasWidth;
        const y = Math.random() * canvasHeight;
        const i = Math.round(Math.random() * starColors.length);
        const radius = Math.random() * 2;
        ctx.fillStyle = starColors[i];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    } 
}

/**
 * @param {Event} event 
 */
function downloadImage(event){
    event.preventDefault();
    const form = document.getElementById("form");
    const formData = new FormData(form);
    if(!formData.validate()){
        return;
    }
    const canvas = document.getElementById("canvas");
    const canvasData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "commission_request.png";
    link.href = canvasData;
    link.click();
}