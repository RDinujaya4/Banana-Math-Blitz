let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let rockIndex = 0;
let chances = 3;

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
    score = Math.max(0, score + points);
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
            
            setTimeout(() => {
                alert(`Times up, Game will restart`);
            }, 100);
            
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
       
        if (rockIndex === rockPositions.length) {
            finaljump();
        } else {
            setTimeout(fetchPuzzle, 1000);
            moveMonkey();
            }      
    } else {    
            feedbackEl.textContent = "Incorrect. Try again!";
            feedbackEl.style.color = "red";
            updateScore(-5);
            monkeyfall();
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

function finaljump(){
    setTimeout(() => {
        monkey.style.transition = "transform 0.8s ease-out";
        monkey.style.transform = `translateX(${rockPositions[rockIndex - 1] + 170}px) translateY(-120px)`; // Jump up slightly

        setTimeout(() => {
            monkey.style.transform = `translateX(1280px) translateY(0px)`; // Land on the treasure position
        
            setTimeout(() => {
                let rewardPoints = Math.floor(Math.random() * 91) + 10; // Random points between 10-100
                updateScore(rewardPoints);
                alert(`You found the treasure! 🎉 You earned ${rewardPoints} points!`);
                setTimeout(fetchPuzzle, 800);
                resetGame();
            }, 1000);
        }, 300); // Mid-air delay
    }, 300);
}

function monkeyfall() {
    let currentX = rockIndex > 0 ? rockPositions[rockIndex - 1] : 0; // Get last rock position
    
            monkey.style.transition = "transform 1.5s ease-in";
            monkey.style.transform = `translateX(${currentX}px) translateY(155px) rotate(360deg)`; // Falls down
              
            setTimeout(() => {
                fish1.style.left = `${currentX}px`; // Fish1 appears at monkey's falling position
                fish1.style.bottom = "0px";
                fish1.style.display = "block";
                fish1.style.animation = "fishHit 1.5s ease-in-out";
            
                let gameContainerWidth = document.getElementById("bottom-section").offsetWidth; 
                let fish2Right = gameContainerWidth - (currentX + 210); // Adjust fish2's position from the right
            
                fish2.style.right = `${fish2Right}px`; // Corrected position from the right
                fish2.style.bottom = "0px";
                fish2.style.display = "block";
                fish2.style.animation = "fishHit 1.5s ease-in-out";
            }, 1500);
                           
            setTimeout(() => {
                alert("Oh no! The monkey got hit by the fish! 😢 The game will restart.");
                animateFish();
                resetGame();
            }, 1600); // Delay before fish appears
        
            setTimeout(fetchPuzzle, 1300);
}

function resetGame() {
    rockIndex = 0;
    monkey.style.transition = "none";
    monkey.style.transform = `translateX(0px) translateY(0px) rotate(0deg)`;
}

function animateFish() {
    fish1.style.animation = "swimLeftToRight 9s linear infinite";
    fish2.style.animation = "swimRightToLeft 9s linear infinite";
}

window.onload = () => {
    fetchPuzzle();
    animateFish();
};

