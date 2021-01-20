var controlBoxToggleButton = document.getElementById("toggle-information-nav");
var controlBoxContents = document.getElementById("control-information-box-wrapper");
var toggleShaderButton = document.getElementById("toggle-shader-button");
var increaseLighting = document.getElementById("plus");
var decreaseLighting = document.getElementById("minus");
var lightingAmount = document.getElementById("lighting-amount");
var outerBar = document.getElementById("outer-bar");
var innerBar = document.getElementById("inner-bar");
var energyPercentage = document.getElementById("energy-amount");
var truckCapacitySpan = document.getElementById("truck-capacity-span");
var scoreSpan = document.getElementById("score");
var scoreEndgameSpan = document.getElementById("score-endgame");
var gameOverScreen = document.getElementById("game-over");

var toggleControlBox = true;
var toggleShader = false 

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
    if(GLOBAL_SERVICE_PROVIDER.totalEnergy <= 0){
        targetProxy.gameOver = true;
        clearInterval(energyInterval);
    }
    else{
        GLOBAL_SERVICE_PROVIDER.totalEnergy--;
        energyPercentage.innerHTML = GLOBAL_SERVICE_PROVIDER.totalEnergy / 2 + "%";
        innerBar.style.width = parseInt(300 * (GLOBAL_SERVICE_PROVIDER.totalEnergy/200)) + "px"; 
    
    }
}, 1000);

var targetProxy = new Proxy(GLOBAL_SERVICE_PROVIDER, {
  set: function (target, key, value) {
      console.log(`${key} set to ${value}`);

    
      target[key] = value;
      if(!(key == "gameOver")){
        if(key == "unload"){
            target[key] = !value;
            GLOBAL_SERVICE_PROVIDER.score += parseInt(GLOBAL_SERVICE_PROVIDER.truckLoad * 2 * (Math.random() + 1))
            scoreSpan.innerHTML = GLOBAL_SERVICE_PROVIDER.score;
    
            if((GLOBAL_SERVICE_PROVIDER.totalEnergy + parseInt(4/5 * GLOBAL_SERVICE_PROVIDER.truckLoad)) > 200 ){
                GLOBAL_SERVICE_PROVIDER.totalEnergy = 200;
            }
            else{
                GLOBAL_SERVICE_PROVIDER.totalEnergy += parseInt(4/5 * GLOBAL_SERVICE_PROVIDER.truckLoad);
            }
            
            
            GLOBAL_SERVICE_PROVIDER.truckLoad = 0;
          }
          if(key == "truckLoad"){
            truckCapacitySpan.innerHTML = String(value) + "/" + 20;
    
          }

      }
      else if(key == "gameOver"){
          console.log("here");
        scoreEndgameSpan.innerHTML =  GLOBAL_SERVICE_PROVIDER.score;
        gameOverScreen.style.display = "block";
      }
     

      return true;
  }
});


