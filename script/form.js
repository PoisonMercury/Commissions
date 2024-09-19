class FormData {
    name;
    /**
     * @type {HTMLSelectElement}
     */
    package;
    additions = {
        background: null,
        extraCharacters: null
    }

    /**
     * 
     * @param {HTMLFormElement} element 
     */
    constructor(element){
        this.element = element;

        this.name = this.element.elements.name
        this.package = this.element.elements.package

        this.additions.background = this.element.elements.background
        this.additions.extraCharacters = this.element.elements.extraCharacters
    }
    
    get total(){
        let total = 0;
        
        total += this.selectedCost(this.package)
        total += this.selectedCost(this.additions.background)

        total += this.additions.extraCharacters.value * this.additions.extraCharacters.getAttribute("cost")
        console.log(total)

        if(total > 0){
            return total;
        } else {
            return 0;
        }
    }

    get packageName(){
        return this.package.options[this.package.selectedIndex].text
    }
    

    /**
     * @param {HTMLSelectElement} selectElement
     * @private
     */
    selectedCost(selectElement){
        return Number.parseInt(selectElement.options[selectElement.selectedIndex].getAttribute("cost"))
    }
}

document.getElementById("form").addEventListener("change", generateImage);
document.getElementById("export").addEventListener("click", downloadImage);


/**
 * 
 * @param {Event} event 
 */
async function generateImage(event){
    event.preventDefault();
    event.stopPropagation();

    let formData = new FormData(event.currentTarget);
    console.log(formData);

    const canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext("2d");

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    console.log(canvasWidth, canvasHeight);

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Text
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(formData.name.value, 10, 50);

    ctx.font = "20px Arial";
    ctx.fillText(formData.packageName, 10, canvasHeight-55);

    ctx.font = "20px Arial";
    ctx.fillText("Extra Characters - " + formData.additions.extraCharacters.value, 10, canvasHeight-35);

    ctx.font = "20px Arial";
    ctx.fillText("Background - " + formData.additions.background.value, 10, canvasHeight-15);
    
    ctx.font = "50px Arial";
    ctx.textAlign = "right";
    ctx.fillText("$"+formData.total, canvasWidth-10, canvasHeight/2+10);
    ctx.textAlign = "left";

    ctx.font = "15px Arial";
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