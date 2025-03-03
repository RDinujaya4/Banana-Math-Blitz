let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let bambooIndex = 0;
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const monkey = document.getElementById("monkey");
const splash = document.getElementById("splash");
const bambooContainer = document.getElementById("bambooContainer");


const bambooPositions = [100, 250, 400, 550, 700];

bambooPositions.forEach((pos, index) => {
    const bamboo = document.createElement("img");
    bamboo.src = "../assets/images/bamboo.png";
    bamboo.classList.add("bamboo");
    bamboo.style.left = `${pos}px`;
    bambooContainer.appendChild(bamboo);
});

function updateScore(points) {
    score += points;
    scoreDisplay.textContent = `Score: ${score}`;
}

function startTimer() {
    timeLeft = 30;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            timerDisplay.textContent = "Time's up! Moving to next question...";
            updateScore(-5);
            setTimeout(fetchPuzzle, 2000);
        }
    }, 1000);
}

function fetchPuzzle() {
    const apiUrl = "https://marcconrad.com/uob/banana/api.php";
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.question && (data.solution !== undefined)) {
                document.getElementById("puzzleImage").src = data.question;
                correctSolution = data.solution;
                document.getElementById("feedback").textContent = "";
                document.getElementById("answerInput").value = "";
                document.getElementById("nextButton").style.display = "none";
                startTimer();
            } else {
                document.getElementById("feedback").textContent = "Invalid puzzle data received.";
            }
        })
        .catch(error => {
            console.error("Error fetching puzzle:", error);
            document.getElementById("feedback").textContent = "Failed to load puzzle.";
        });
}

document.getElementById("checkButton").addEventListener("click", function() {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    const feedbackEl = document.getElementById("feedback");

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = "Please enter a valid number!";
        feedbackEl.style.color = "red";
        return;
    }

    if (userAnswer === correctSolution) {
        feedbackEl.textContent = "Correct! 🎉 Loading next question...";
        feedbackEl.style.color = "green";
        updateScore(10);
        
        setTimeout(fetchPuzzle, 2000);
        moveMonkey();
    } else {
        feedbackEl.textContent = "Incorrect. Try again!";
        feedbackEl.style.color = "red";
        updateScore(-5);
        clearInterval(timer);
        resetGame();
    }
});

document.getElementById("nextButton").addEventListener("click", function() {
    fetchPuzzle();
});

function moveMonkey() {
    if (bambooIndex < bambooPositions.length) {
        monkey.style.transform = `translateX(${bambooPositions[bambooIndex]}px) translateY(-20px)`;
        bambooIndex++;
    } else {
        alert("You reached the treasure! 🎉");
        resetGame();
    }
}


function fallIntoRiver() {
    splash.style.left = `${bambooPositions[bambooIndex]}px`;
    splash.style.bottom = "120px";
    splash.style.display = "block";
    setTimeout(resetGame, 2000);
}

function resetGame() {
    bambooIndex = 0;
    monkey.style.transform = `translateX(0px)`;
    splash.style.display = "none";
}

window.onload = fetchPuzzle;
