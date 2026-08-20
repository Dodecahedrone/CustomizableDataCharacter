const reset = document.getElementById("reset");
const save = document.getElementById("save");
//const saveImage = document.getElementById("saveImage");
const load = document.getElementById("load");
const saveCode = document.getElementById("saveCode");
const eyes = document.getElementById("eyes");
const mouth = document.getElementById("mouth");
const fullBody = document.getElementById("fullBody");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const directions = document.getElementById("directions");
const trackingCheck = document.getElementById("showTracking");


const defaults = {};

const savedFeatures = {};

const directionTexts = [
    "Adjust the sliders in the right sidebar to change the character's eyes and eyebrows.",
    "Adjust the sliders in the right sidebar to change the character's mouth.",
    "Drag and drop the pink squares to adjust the position of the limbs and body. Adjust the sliders in the right sidebar to change the body and head rotation."
];

const facialFeatures = [
    'mouthScaleY',
    'mouthScaleX',
    'mouthShape',
    'rightEyeShape',
    'rightEyeClose',
    'leftEyeShape',
    'leftEyeClose',
];

const featureSliders = [
    'overallRotation',
    'mouthScaleY',
    'mouthScaleX',
    'bodyRotate',
    'headRotate',
    'mouthShape',
    'rightEyeShape',
    'rightEyeClose',
    'leftEyeShape',
    'leftEyeClose',
];

const featureCheckboxes = [
    'rightArmDirection',
    'leftArmDirection',
]

const featurePositions = [
    'overallX', 
    'overallY', 
    'rightArmY',
    'rightArmX',
    'leftArmY',
    'leftArmX',
    'rightLegY',
    'rightLegX',
    'leftLegY',
    'leftLegX',
    'bodyY',
    'bodyX'
]

let screen = 0;

const r = new rive.Rive({
    src: "pad_customizable_v8.riv",
    canvas: document.getElementById("canvas"),
    autoplay: true,
    autoBind: true,
    stateMachines: "Animate Character",
    canvasBufferType: 'webgl2',
    onLoad: () => {
        const vmi = r.viewModelInstance;

        // 2. Loop through each dimension to set up the logic
        featureSliders.forEach(dim => {
            
            
            const inputEl = document.getElementById(dim);
            //const textEl = document.getElementById(`${dim}-val`);
            const riveInput = vmi.number(dim);

            //console.log(riveInput);

            // Set the initial values from the HTML inputs into Rive & Text
            if (riveInput) {
                defaults[dim] = riveInput.value;
                savedFeatures[dim] = riveInput.value;
                riveInput.value = parseFloat(inputEl.value);
                //textEl.textContent = inputEl.value;
            }

            // Listen for changes on the number inputs
            inputEl.addEventListener('input', (event) => {
                const newValue = parseFloat(event.target.value) || 0;

                // Update the text next to the input
                //textEl.textContent = newValue;

                // Update the Rive variable safely
                if (riveInput) {
                    riveInput.value = newValue;
                }
            });
            
        });

        featureCheckboxes.forEach(dim => {
            
            
            const inputEl = document.getElementById(dim);
            const riveInput = vmi.boolean(dim);

            //console.log(dim);
            //console.log(riveInput);

            // Set the initial values from the HTML inputs into Rive & Text
            if (riveInput) {
                defaults[dim] = riveInput.value;
                savedFeatures[dim] = riveInput.value;
                riveInput.value = inputEl.checked;
            }

            // Listen for changes on the number inputs
            inputEl.addEventListener('input', (event) => {
                const checked = inputEl.checked;
                console.log(checked);

                // Update the Rive variable safely
                if (riveInput) {
                    riveInput.value = checked;
                }
            });
            
        });

        featurePositions.forEach(dim => {
            const riveInput = vmi.number(dim);

            if (riveInput) {
                defaults[dim] = riveInput.value;
                savedFeatures[dim] = riveInput.value;
            }
        });
        
        console.log(defaults);

        vmi.number("overallScale").value = 300;
        vmi.number("overallY").value = 1482;
        vmi.color("trackingOpacity").value = 0x00CC7878;
        document.getElementById("canvas").style.pointerEvents = "none";

        r.resizeDrawingSurfaceToCanvas();
        
    },
});

function changeDirections(){
    directions.textContent = directionTexts[screen];
}

next.addEventListener("click", function(){
    if(screen == 2){
        return;
    }

    screen++;
    
    if(screen == 1){
        eyes.style.display = "none";
        mouth.style.display = "inline-block";
        fullBody.style.display = "none";

        previous.disabled = false;
    } else 
    {
        eyes.style.display = "none";
        mouth.style.display = "none";
        fullBody.style.display = "inline-block";

        const vmi = r.viewModelInstance;

        facialFeatures.forEach(dim => {
            const riveInput = vmi.number(dim);
            savedFeatures[dim] = riveInput.value;
        })


        featureSliders.forEach(dim => {
            const inputEl = document.getElementById(dim);
            //const textEl = document.getElementById(`${dim}-val`);
            const riveInput = vmi.number(dim);

            inputEl.value = savedFeatures[dim];
            //textEl.textContent = savedFeatures[dim];

            if (riveInput) {
                riveInput.value = inputEl.value;
            }
            
        });

        featurePositions.forEach(dim => {
            const riveInput = vmi.number(dim);

            if (riveInput) {
                riveInput.value = savedFeatures[dim];
            }
        });

        vmi.number("overallScale").value = 100;
        vmi.color("trackingOpacity").value = 0x80CC7878;

        document.getElementById("canvas").style.pointerEvents = "auto";

        next.disabled = true;
        
    }

    save.disabled = !(screen === 2);
    changeDirections();
})

trackingCheck.addEventListener('change', function() { 
    const vmi = r.viewModelInstance;

    if (this.checked) {
        vmi.color("trackingOpacity").value = 0x80CC7878;
    } else {
        vmi.color("trackingOpacity").value = 0x00CC7878;
    }
});

previous.addEventListener("click", function(){
    if(screen == 0){
        return;
    }

    screen--;
    
    if(screen == 1){
        eyes.style.display = "none";
        mouth.style.display = "inline-block";
        fullBody.style.display = "none";

        const vmi = r.viewModelInstance;

        featureSliders.forEach(dim => {
            const riveInput = vmi.number(dim);
            savedFeatures[dim] = riveInput.value;
        });

        featureCheckboxes.forEach(dim => {
            const riveInput = vmi.boolean(dim);
            savedFeatures[dim] = riveInput.value;
        });

        featurePositions.forEach(dim => {
            const riveInput = vmi.number(dim);
            savedFeatures[dim] = riveInput.value;
        });


        featureSliders.forEach(dim => {
            const inputEl = document.getElementById(dim);
            //const textEl = document.getElementById(`${dim}-val`);
            const riveInput = vmi.number(dim);

            inputEl.value = defaults[dim];
            //textEl.textContent = defaults[dim];

            if (riveInput) {
                riveInput.value = inputEl.value;
            }
            
        });

        featurePositions.forEach(dim => {
            const riveInput = vmi.number(dim);

            if (riveInput) {
                riveInput.value = defaults[dim];
            }
        });

        facialFeatures.forEach(dim => {
            const inputEl = document.getElementById(dim);
            //const textEl = document.getElementById(`${dim}-val`);
            const riveInput = vmi.number(dim);

            inputEl.value = savedFeatures[dim];
            //textEl.textContent = savedFeatures[dim];

            if (riveInput) {
                riveInput.value = inputEl.value;
            }
        })

        vmi.number("overallScale").value = 300;
        vmi.color("trackingOpacity").value = 0x00CC7878;
        vmi.number("overallY").value = 1482;

        document.getElementById("canvas").style.pointerEvents = "none";

        next.disabled = false;
    } else 
    {
        eyes.style.display = "inline-block";
        mouth.style.display = "none";
        fullBody.style.display = "none";

        previous.disabled = true;
    }

    save.disabled = !(screen === 2);
    changeDirections();
})

reset.addEventListener("click", function(){
    const vmi = r.viewModelInstance;
    if (!vmi) {
        console.error("Rive State Machine not loaded yet.");
        return;
    }

    featureSliders.forEach(dim => {
        const inputEl = document.getElementById(dim);
        //const textEl = document.getElementById(`${dim}-val`);
        const riveInput = vmi.number(dim);

        inputEl.value = defaults[dim];
        //textEl.textContent = defaults[dim];

        if (riveInput) {
            riveInput.value = inputEl.value;
        }
        
    });

    featurePositions.forEach(dim => {
        const riveInput = vmi.number(dim);

        if (riveInput) {
            if(dim != 'overallY') {
                riveInput.value = defaults[dim];
            } else {
                savedFeatures[dim] = defaults[dim];
            }
        }
    });

    if(screen == 2 || screen == 3){
        vmi.number("overallY").value = 560.12;
    }
});

save.addEventListener("click", function() {
    console.log("save click");

    // 1. Initialize our storage object
    const savedConfiguration = {
        timestamp: new Date().toISOString(),
        features: {}
    };

    const vmi = r.viewModelInstance;
    if (!vmi) {
        console.error("Rive State Machine not loaded yet.");
        return;
    }

    // 2. Extract Sliders (Numbers)
    featureSliders.forEach(dim => {
        const riveInput = vmi.number(dim);
        if (riveInput) {
            savedConfiguration.features[dim] = riveInput.value;
        }
    });

    // 3. Extract Checkboxes (Booleans)
    featureCheckboxes.forEach(dim => {
        const riveInput = vmi.boolean(dim); // Note: use .boolean() for checkboxes
        if (riveInput) {
            savedConfiguration.features[dim] = riveInput.value;
        }
    });

    // 4. Extract Drag-and-Drop Positions (Numbers)
    featurePositions.forEach(dim => {
        const riveInput = vmi.number(dim);
        if (riveInput) {
            savedConfiguration.features[dim] = riveInput.value;
        }
    });

    // 5. Do something with the final data payload
    console.log("Successfully captured character state:", savedConfiguration);
    
    // Example: For your study, you'll likely send this string to your backend
    const jsonToSave = JSON.stringify(savedConfiguration);

    saveCode.value = jsonToSave;

    window.parent.postMessage({
        type: "CHARACTER_SAVE",
        data: jsonToSave
    }, "*");
    
    // Optional: Temporary visual feedback for the participant
    alert("Character configuration saved successfully!");
});

/*
saveImage.addEventListener("click", function() {
    const canvas = document.getElementById("canvas");

    // 1. Resize the drawing surface to match canvas size
    r.resizeDrawingSurfaceToCanvas();

    // 2. Ensure Rive is rendering a frame
    // If your animation is playing, startRendering() ensures the engine is active
    if (typeof r.startRendering === "function") {
        r.startRendering();
    }

    // 3. Grab the image on the next frame execution
    requestAnimationFrame(() => {
        // Optional: If the animation is paused/static, draw the current artboard state
        // r.scrub(); 

        const imageURI = canvas.toDataURL("image/png");

        
        const downloadLink = document.createElement("a");
        downloadLink.download = "myCharacter.png";
        downloadLink.href = imageURI;

        downloadLink.click();
        
    });
});
*/


load.addEventListener("click", function() {
    const result = prompt("Enter the saved JSON configuration string:");
    
    // Safety check if the user cancels the prompt or leaves it empty
    if (!result) return;

    try {
        const saved = JSON.parse(result);
        const vmi = r.viewModelInstance;
        
        if (!vmi) {
            alert("Error: Rive instance is not fully loaded yet.");
            return;
        }

        // Target the features sub-object
        const features = saved.features;
        if (!features) {
            alert("Invalid data structure: Could not find 'features' in the JSON.");
            return;
        }

        // Loop through all saved keys dynamically
        Object.keys(features).forEach(dim => {
            const savedValue = features[dim];

            // 1. Update the Rive Character State Machine
            // We dynamically look for Number or Boolean inputs based on what the key holds
            if (typeof savedValue === "number") {
                const riveNumber = vmi.number(dim);
                if (riveNumber) riveNumber.value = savedValue;
            } else if (typeof savedValue === "boolean") {
                const riveBoolean = vmi.boolean(dim);
                if (riveBoolean) riveBoolean.value = savedValue;
            }

            // 2. Update the Web Browser UI Elements (Sliders/Checkboxes)
            // This ensures the page elements match the newly loaded character shape
            const inputEl = document.getElementById(dim);
            if (inputEl) {
                if (inputEl.type === "checkbox") {
                    inputEl.checked = savedValue;
                } else {
                    inputEl.value = savedValue;
                }
            }

            // 3. Update any visible text label readouts (e.g., "mouthShape-val")
            /*
            const textEl = document.getElementById(`${dim}-val`);
            if (textEl) {
                textEl.textContent = savedValue;
            }
                */
        });

        // Force Rive to redraw the surface with the new variables
        //r.resizeDrawingSurfaceToCanvas();
        //alert("Character configuration loaded successfully!");

    } catch (error) {
        // Catch syntax errors if someone inputs malformed JSON text
        console.error("Failed to parse JSON configuration:", error);
        alert("Error: Invalid JSON format string. Please try copying the exact snippet again.");
    }
});

// 1482 for Y

mouth.style.display = "none";
fullBody.style.display = "none";