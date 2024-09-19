document.getElementById("form").addEventListener("change", formChange);

/**
 * 
 * @param {Event} event 
 */
function formChange(event){
    console.log('Form Changing')
    console.log(event);

    var totalElement = document.getElementById("total");

    var data = new FormData(event.currentTarget);

    totalElement.innerHTML = data.total;
    

}

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

    /**
     * @param {HTMLSelectElement} selectElement
     * @private
     */
    selectedCost(selectElement){
        return Number.parseInt(selectElement.options[selectElement.selectedIndex].getAttribute("cost"))
    }
}