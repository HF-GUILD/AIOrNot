import { sendExperimentData } from "./database.js";

const confidenceContainer = document.getElementById("confidence-container");
const btnAI = document.getElementById("btn-ai");
const btnNotAI = document.getElementById("btn-not-ai");
const confidenceRadios = document.querySelectorAll('input[name="confidence"]');
const btnValidate = document.getElementById("btn-validate");
let responses = {};
let id = 0;
const imagePath = "assets/images/AIOrNot/";
// remove Group_01_R.jpg, because it's the initial image
const imagesSelected = ['Pet_01_R.jpg', 'Landmark_01_R.jpg', 'Landmark_02_R.jpg', 'Portrait_05_R.jpg', 'Pet_05_A.jpg', 'Portrait_02_R.jpg', 'Landmark_02_A.jpg', 'Group_05_A.jpg', 'Vehicle_02_A.jpg', 'Portrait_01_R.jpg', 'Portrait_05_A.jpg', 'Vehicle_02_R.jpg', 'Landmark_01_A.jpg', 'Landmark_05_A.jpg', 'Pet_02_R.jpg', 'Pet_01_A.jpg', 'Animal_02_R.jpg', 'Landscape_05_A.jpg', 'Vehicle_01_R.jpg', 'Group_05_R.jpg', 'Vehicle_05_R.jpg', 'Portrait_02_A.jpg', 'Animal_05_R.jpg', 'Landscape_05_R.jpg', 'Animal_02_A.jpg', 'Animal_01_A.jpg', 'Portrait_01_A.jpg', 'Vehicle_01_A.jpg', 'Landscape_01_R.jpg', 'Vehicle_05_A.jpg', 'Group_01_A.jpg', 'Animal_05_A.jpg', 'Group_02_R.jpg', 'Pet_02_A.jpg', 'Group_02_A.jpg', 'Pet_05_R.jpg', 'Animal_01_R.jpg', 'Landscape_01_A.jpg', 'Landscape_02_A.jpg', 'Landmark_05_R.jpg', 'Landscape_02_R.jpg']
/*[
    "Animal_01_A.jpg",
    "Animal_01_R.jpg",
    "Animal_02_A.jpg",
    "Animal_02_R.jpg",
    "Animal_05_A.jpg",
    "Animal_05_R.jpg",

    "Group_01_A.jpg",
    "Group_01_R.jpg",
    "Group_02_A.jpg",
    "Group_02_R.jpg",
    "Group_05_A.jpg",
    "Group_05_R.jpg",

    "Landmark_01_A.jpg",
    "Landmark_01_R.jpg",
    "Landmark_02_A.jpg",
    "Landmark_02_R.jpg",
    "Landmark_05_A.jpg",
    "Landmark_05_R.jpg",

    "Landscape_01_A.jpg",
    "Landscape_01_R.jpg",
    "Landscape_02_A.jpg",
    "Landscape_02_R.jpg",
    "Landscape_05_A.jpg",
    "Landscape_05_R.jpg",

    "Pet_01_A.jpg",
    "Pet_01_R.jpg",
    "Pet_02_A.jpg",
    "Pet_02_R.jpg",
    "Pet_05_A.jpg",
    "Pet_05_R.jpg",

    "Portrait_01_A.jpg",
    "Portrait_01_R.jpg",
    "Portrait_02_A.jpg",
    "Portrait_02_R.jpg",
    "Portrait_05_A.jpg",
    "Portrait_05_R.jpg",

    "Vehicle_01_A.jpg",
    "Vehicle_01_R.jpg",
    "Vehicle_02_A.jpg",
    "Vehicle_02_R.jpg",
    "Vehicle_05_A.jpg",
    "Vehicle_05_R.jpg"
];*/
let userChoice = "";
let buttonSelected = "";
let choiceChanged = 0;
let timeToChoose = Date.now();
let score = 0; // TODO update it with the real value once we have the real pictures

btnAI.onclick = function () {
    console.log("Button AI");
    console.log(btnAI.style.backgroundColor, btnNotAI.style.backgroundColor === "");
    if (btnNotAI.style.backgroundColor !== "white") {
        btnNotAI.style.backgroundColor = "white";
        btnNotAI.style.color = "#262626";
    }
    if (buttonSelected !== "") {
        choiceChanged++;
    }
    buttonSelected = "AI";
    btnAI.style.backgroundColor = "#262626";
    btnAI.style.color = "white";
    confidenceContainer.style.display = "flex";
    userChoice = "AI";
};

btnNotAI.onclick = function () {
    console.log("Button Not AI");
    if (btnAI.style.backgroundColor !== "white") {
        btnAI.style.backgroundColor = "white";
        btnAI.style.color = "#262626";
    }
    if (buttonSelected !== "") {
        choiceChanged++;
    }
    buttonSelected = "NotAI";
    btnNotAI.style.backgroundColor = "#262626";
    btnNotAI.style.color = "white";
    confidenceContainer.style.display = "flex";
    userChoice = "NotAI";
};

let confidenceLevel = null;

confidenceRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
        console.log(`Selected radio button with value ${radio.value}`);
        confidenceLevel = radio.value;
        btnValidate.style.display = "revert";
    });
});

function resetPage() {
    confidenceLevel = null;
    userChoice = "";
    buttonSelected = "";
    choiceChanged = 0;
    timeToChoose = Date.now()
    // Reset confidence radio buttons
    confidenceRadios.forEach((radio) => {
        radio.checked = false;
    });
    // Reset button background*
    btnAI.style.backgroundColor = "white";
    btnAI.style.color = "#262626";
    btnNotAI.style.backgroundColor = "white";
    btnNotAI.style.color = "#262626";
    confidenceContainer.style.display = "none";
    btnValidate.style.display = "none";
}

function getScore() {
    let filename = imagesSelected[id];
    let parts = filename.split("_");
    let letter = parts[parts.length - 1].split(".")[0];
    if (letter === "R" && buttonSelected === "NotAI") {
        return 1;
    } else if (letter === "A" && buttonSelected === "AI") {
        return 1;
    }
    return 0;
}

btnValidate.onclick = function () {
    const imageUsed = document.getElementById("image-alone");
    score += getScore();
    responses[imageUsed.src] = {"userChoice": userChoice, "confidenceLevel": confidenceLevel,
        "choiceChanged": choiceChanged, "timeToChoose": Date.now() - timeToChoose};
    console.log(responses);
    id++;
    if (id >= imagesSelected.length) {
        sendExperimentData(responses, "first_experiment_results").then(() => {
            location.href = `end.html?score=${encodeURIComponent(score)}`;
        }).catch((error) => {
            console.error("Error sending data:", error);
        });
        //location.href = `end.html?score=${encodeURIComponent(score)}`;
    }
    imageUsed.src = imagePath + imagesSelected[id];//`https://picsum.photos/500/400?random=${id}`;

    resetPage();
}