// Get the query string from the current URL
const queryString = window.location.search;

// Create a URLSearchParams object from the query string
const urlParams = new URLSearchParams(queryString);

// Get the score from the URLSearchParams object
const score = urlParams.get('score');
const scoreSpan = document.getElementById("score");

scoreSpan.textContent = score;
// Use the score value
console.log(`Score: ${score}`);