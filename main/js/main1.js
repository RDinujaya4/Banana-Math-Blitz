let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let rockIndex = 0;
let chances = 3; // Number of chances (hearts)

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const monkey = document.getElementById("monkey");
const rockContainer = document.getElementById("rockContainer");
const fish1 = document.getElementById("fish1");
const fish2 = document.getElementById("fish2");

// Heart images (HTML IDs)
const heart1 = document.getElementById("heart1");
const heart2 = document.getElementById("heart2");
const heart3 = document.getElementById("heart3");

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
            
            setTimeout(() => {
                alert(`Times up, Game will restart`);
            }, 100);
            
            updateScore(-5);           
            loseHeart();
            setTimeout(fetchPuzzle, 2500);
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

        // Decrease chances when the answer is wrong
        loseHeart();
        setTimeout(fetchPuzzle, 1300);
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
    monkey.style.transition = "none";
    monkey.style.transform = `translateX(0px) translateY(0px) rotate(0deg)`;
    chances = 3; // Reset chances
    updateHearts(); // Update hearts display
}

function updateHearts() {
    // Hide all hearts
    heart1.style.display = "none";
    heart2.style.display = "none";
    heart3.style.display = "none";

    // Show hearts based on remaining chances
    if (chances >= 1) heart1.style.display = "inline-block";
    if (chances >= 2) heart2.style.display = "inline-block";
    if (chances >= 3) heart3.style.display = "inline-block";
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
        
            //setTimeout(fetchPuzzle, 1300);
}
function loseHeart() {
    chances--;
    updateHearts(); // Update hearts after losing one
    //setTimeout(fetchPuzzle, 500);

    if (chances <= 0) {
       // alert("Oh no! You've lost all your hearts. The game will restart.");
        setTimeout(() => {
        monkeyfall();
       },100);  
    }
}

// Fish Animation
function animateFish() {
    fish1.style.animation = "swimLeftToRight 9s linear infinite";
    fish2.style.animation = "swimRightToLeft 9s linear infinite";
}

window.onload = () => {
    fetchPuzzle();
    updateHearts(); // Initialize heart display
    animateFish();
};
