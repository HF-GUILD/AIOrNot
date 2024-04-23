import { sendExperimentData } from "./database.js";
// TODO modify sendExperiment to store the data on different collection base on the experiment selected
// A: 12; R: 9
const imagesSelected = [['Landmark_02_A.jpg', 'Landmark_02_R.jpg'], ['Landmark_05_A.jpg', 'Landmark_05_R.jpg'], ['Portrait_05_R.jpg', 'Portrait_05_A.jpg'], ['Animal_02_A.jpg', 'Animal_02_R.jpg'], ['Group_01_R.jpg', 'Group_01_A.jpg'], ['Pet_02_A.jpg', 'Pet_02_R.jpg'], ['Pet_01_R.jpg', 'Pet_01_A.jpg'], ['Animal_05_R.jpg', 'Animal_05_A.jpg'], ['Portrait_02_A.jpg', 'Portrait_02_R.jpg'], ['Landscape_01_R.jpg', 'Landscape_01_A.jpg'], ['Landscape_02_R.jpg', 'Landscape_02_A.jpg'], ['Vehicle_01_A.jpg', 'Vehicle_01_R.jpg'], ['Animal_01_A.jpg', 'Animal_01_R.jpg'], ['Portrait_01_A.jpg', 'Portrait_01_R.jpg'], ['Pet_05_R.jpg', 'Pet_05_A.jpg'], ['Vehicle_02_A.jpg', 'Vehicle_02_R.jpg'], ['Group_02_A.jpg', 'Group_02_R.jpg'], ['Landscape_05_R.jpg', 'Landscape_05_A.jpg'], ['Group_05_A.jpg', 'Group_05_R.jpg'], ['Landmark_01_R.jpg', 'Landmark_01_A.jpg'], ['Vehicle_05_A.jpg', 'Vehicle_05_R.jpg']];
/*[
    ["Animal_01_A.jpg",
    "Animal_01_R.jpg"],
    ["Animal_02_A.jpg",
    "Animal_02_R.jpg"],
    ["Animal_05_A.jpg",
    "Animal_05_R.jpg"],

    ["Group_01_A.jpg",
    "Group_01_R.jpg"],
    ["Group_02_A.jpg",
    "Group_02_R.jpg"],
    ["Group_05_A.jpg",
    "Group_05_R.jpg"],

    ["Landmark_01_A.jpg",
    "Landmark_01_R.jpg"],
    ["Landmark_02_A.jpg",
    "Landmark_02_R.jpg"],
    ["Landmark_05_A.jpg",
    "Landmark_05_R.jpg"],

    ["Landscape_01_A.jpg",
    "Landscape_01_R.jpg"],
    ["Landscape_02_A.jpg",
    "Landscape_02_R.jpg"],
    ["Landscape_05_A.jpg",
    "Landscape_05_R.jpg"],

    ["Pet_01_A.jpg",
    "Pet_01_R.jpg"],
    ["Pet_02_A.jpg",
    "Pet_02_R.jpg"],
    ["Pet_05_A.jpg",
    "Pet_05_R.jpg"],

    ["Portrait_01_A.jpg",
    "Portrait_01_R.jpg"],
    ["Portrait_02_A.jpg",
    "Portrait_02_R.jpg"],
    ["Portrait_05_A.jpg",
    "Portrait_05_R.jpg"],

    ["Vehicle_01_A.jpg",
    "Vehicle_01_R.jpg"],
    ["Vehicle_02_A.jpg",
    "Vehicle_02_R.jpg"],
    ["Vehicle_05_A.jpg",
    "Vehicle_05_R.jpg"]
];*/

const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
let userChoice = "";
let buttonSelected = "";
let choiceChanged = 0;
let timeToChoose = Date.now();
let score = 0;
let responses = {};
let id = 0;
const imagePath = "assets/images/AIOrNot/";
const confidenceContainer = document.getElementById("confidence-container");
let imageLeft = document.getElementById("img-left");
let imageRight = document.getElementById("img-right");
const confidenceRadios = document.querySelectorAll('input[name="confidence"]');
const btnValidate = document.getElementById("btn-validate");

btnLeft.onclick = function () {
    if (btnRight.style.backgroundColor !== "white") {
        btnRight.style.backgroundColor = "white";
        btnRight.style.color = "#262626";
    }
    if (buttonSelected !== "") {
        choiceChanged++;
    }
    buttonSelected = "Left";
    btnLeft.style.backgroundColor = "#262626";
    btnLeft.style.color = "white";
    confidenceContainer.style.display = "flex";
    userChoice = "Left";
};

btnRight.onclick = function () {
    if (btnLeft.style.backgroundColor !== "white") {
        btnLeft.style.backgroundColor = "white";
        btnLeft.style.color = "#262626";
    }
    if (buttonSelected !== "") {
        choiceChanged++;
    }
    buttonSelected = "Right";
    btnRight.style.backgroundColor = "#262626";
    btnRight.style.color = "white";
    confidenceContainer.style.display = "flex";
    userChoice = "Right";
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
    // Reset button background
    btnLeft.style.backgroundColor = "white";
    btnLeft.style.color = "#262626";
    btnRight.style.backgroundColor = "white";
    btnRight.style.color = "#262626";
    confidenceContainer.style.display = "none";
    btnValidate.style.display = "none";
}

function getScore() {
    let filename = imagesSelected[id];
    console.log(filename);
    if (buttonSelected === "Left") {
        let partsLeft = filename[0].split("_");
        let letterLeft = partsLeft[partsLeft.length - 1].split(".")[0];
        if (letterLeft === "R") return 1;
    } else {
        let partsRight = filename[1].split("_");
        let letterRight = partsRight[partsRight.length - 1].split(".")[0];
        if (letterRight === "R") return 1;
    }

    return 0;
}

btnValidate.onclick = function () {
    score += getScore();
    console.log(score);
    responses[imagesSelected[id]] = {"userChoice": userChoice, "confidenceLevel": confidenceLevel,
        "choiceChanged": choiceChanged, "timeToChoose": Date.now() - timeToChoose};
    console.log(responses);
    id++;
    if (id >= imagesSelected.length) {
        sendExperimentData(responses, "second_experiment_results").then(() => {
            location.href = `end.html?score=${encodeURIComponent(score)}`;
        }).catch((error) => {
            console.error("Error sending data:", error);
        });
        //location.href = `end.html?score=${encodeURIComponent(score)}`;
    }
    imageLeft.src = imagePath + imagesSelected[id][0];
    imageRight.src = imagePath + imagesSelected[id][1];

    resetPage();
}