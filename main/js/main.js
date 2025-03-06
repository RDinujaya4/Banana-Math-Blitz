let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let rockIndex = 0;

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const monkey = document.getElementById("monkey");
const splash = document.getElementById("splash");
const rockContainer = document.getElementById("rockContainer");
const fish1 = document.getElementById("fish1");
const fish2 = document.getElementById("fish2");

const rockPositions = [280, 530, 780, 1030];

rockPositions.forEach((pos) => {
    const rock = document.createElement("img");
    rock.src = "../assets/images/rock.png";
    rock.classList.add("rock");
    rock.style.left = `${pos}px`;
    rockContainer.appendChild(rock);
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
            timerDisplay.textContent = "Time's up!";
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

document.getElementById("checkButton").addEventListener("click", function () {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    const feedbackEl = document.getElementById("feedback");

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = "Please enter a valid number!";
        feedbackEl.style.color = "red";
        return;
    }

    if (userAnswer === correctSolution) {
        feedbackEl.textContent = "Correct! 🎉";
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

document.getElementById("nextButton").addEventListener("click", function () {
    fetchPuzzle();
});

function moveMonkey() {
    if (rockIndex < rockPositions.length) {
        monkey.style.transform = `translateX(${rockPositions[rockIndex]}px) translateY(0px)`;
        rockIndex++;
    } else {
        alert("You reached the treasure! 🎉");
        resetGame();
    }
}

function fallIntoRiver() {
    splash.style.left = `${rockPositions[rockIndex]}px`;
    splash.style.bottom = "120px";
    splash.style.display = "block";
    setTimeout(resetGame, 2000);
}

function resetGame() {
    rockIndex = 0;
    monkey.style.transform = `translateX(0px)`;
    splash.style.display = "none";
}

// Fish Animation
function animateFish() {
    fish1.style.animation = "swimLeftToRight 9s linear infinite";
    fish2.style.animation = "swimRightToLeft 9s linear infinite";
}

window.onload = () => {
    fetchPuzzle();
    animateFish();
};
