let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let rockIndex = 0;

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const monkey = document.getElementById("monkey");
const rockContainer = document.getElementById("rockContainer");
const fish1 = document.getElementById("fish1");
const fish2 = document.getElementById("fish2");

const rockPositions = [260, 510, 760, 1010];

rockPositions.forEach((pos) => {
    const rock = document.createElement("img");
    rock.src = "../assets/images/rock.png";
    rock.classList.add("rock");
    rock.style.left = `${pos}px`;
    rockContainer.appendChild(rock);
});

function updateScore(points) {
    score = Math.max(0, score + points); // Ensure score never goes below 0
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
            resetGame();
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
                startTimer(); // Restart timer for new question
            } else {
                document.getElementById("feedback").textContent = "Invalid puzzle data received.";
            }
        })
        .catch(error => {
            console.error("Error fetching puzzle:", error);
            document.getElementById("feedback").textContent = "Failed to load puzzle.";
        });
}

// Modify the check button event to handle the final move
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

        
        if (rockIndex === rockPositions.length) {
            // Monkey jumps to treasure after answering the last question
            setTimeout(() => {
                monkey.style.transition = "transform 0.8s ease-out";
                monkey.style.transform = `translateX(${rockPositions[rockIndex - 1] + 170}px) translateY(-120px)`; // Jump up slightly

                setTimeout(() => {
                    monkey.style.transform = `translateX(1280px) translateY(0px)`; // Land on the treasure position
                
                    setTimeout(() => {
                        let rewardPoints = Math.floor(Math.random() * 91) + 10; // Random points between 10-100
                        updateScore(rewardPoints);
                        alert(`You found the treasure! 🎉 You earned ${rewardPoints} points!`);
                        setTimeout(fetchPuzzle, 1000);
                        resetGame();
                    }, 1000);
                }, 300); // Mid-air delay
            }, 300);
        } else {
            // Continue normal jumping process
            setTimeout(fetchPuzzle, 1000);
            moveMonkey();
            }      
    } else {
        feedbackEl.textContent = "Incorrect. Try again!";
        feedbackEl.style.color = "red";
        updateScore(-5);
        setTimeout(fetchPuzzle, 2000);
        resetGame();
    }
});

document.getElementById("nextButton").addEventListener("click", function () {
    fetchPuzzle();
});

function moveMonkey() {
    if (rockIndex < rockPositions.length) {
        monkey.style.transition = "transform 0.7s ease-out"; // Smooth jumping effect
        monkey.style.transform = `translateX(${rockPositions[rockIndex]}px) translateY(-100px)`; // Move up slightly

        setTimeout(() => {
            monkey.style.transform = `translateX(${rockPositions[rockIndex]}px) translateY(0px)`; // Land on the rock

            setTimeout(() => {
                rockIndex++;
            }, 300); // Small delay after landing
        }, 400); // Time spent in the air
    }
}

function resetGame() {
    rockIndex = 0;
    monkey.style.transform = `translateX(0px)`;
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

