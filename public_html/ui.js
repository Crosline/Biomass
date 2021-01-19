var controlBoxToggleButton = document.getElementById("toggle-information-nav");
var controlBoxContents = document.getElementById("control-information-box-wrapper");
var toggleControlBox = true;

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

