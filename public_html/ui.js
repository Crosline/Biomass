var controlBoxToggleButton = document.getElementById("toggle-information-nav");
var controlBoxContents = document.getElementById("control-information-box-wrapper");
var toggleShaderButton = document.getElementById("toggle-shader-button");
var increaseLighting = document.getElementById("plus");
var decreaseLighting = document.getElementById("minus");
var lightingAmount = document.getElementById("lighting-amount");
var outerBar = document.getElementById("outer-bar");
var innerBar = document.getElementById("inner-bar");

var energyPercentage = document.getElementById("energy-amount");

var toggleControlBox = true;
var toggleShader = false 
var totalEnergy = 200;
var gameOver = false;

controlBoxToggleButton.addEventListener("click", (event)=>{
    event.preventDefault();
    if(toggleControlBox){
                controlBoxToggleButton.innerHTML = "Click here to see controls"
        controlBoxContents.style.maxHeight = 0;
    }
    else{
        controlBoxContents.style.maxHeight = "70vh";
        controlBoxToggleButton.innerHTML = "Click here to hide controls"

    }
    toggleControlBox = !toggleControlBox;
})


toggleShaderButton.addEventListener("click", (event)=>{
    event.preventDefault();
    toggleShader = !toggleShader;
})

increaseLighting.addEventListener("click", (event) => {
    event.preventDefault();
    if(lightingAmount.value < parseInt(lightingAmount.max)){
        lightingAmount.value = parseInt(lightingAmount.value)+1;
        GLOBAL_SERVICE_PROVIDER.lightingIntensity =  parseInt(lightingAmount.value)/10; 
    }
})

decreaseLighting.addEventListener("click", (event) => {
    event.preventDefault();
    if(lightingAmount.value > parseInt(lightingAmount.min)){
        lightingAmount.value = parseInt(lightingAmount.value)-1;
        GLOBAL_SERVICE_PROVIDER.lightingIntensity =  parseInt(lightingAmount.value)/10; 

    }
})


var energyInterval =  setInterval(function(){
    if(totalEnergy <= 0){
        gameOver = true;
        clearInterval(energyInterval);
    }
    else{
        totalEnergy--;
        energyPercentage.innerHTML = totalEnergy / 2 + "%";
        innerBar.style.width = parseInt(300 * (totalEnergy/200)) + "px"; 
    
    }
}, 1000);