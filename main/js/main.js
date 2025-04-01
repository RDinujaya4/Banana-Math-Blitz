let correctSolution = null;
let timer;
let timeLeft = 30;
let score = 0;
let rockIndex = 0;
let chances = 3;
let isMuted = false;

const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const monkey = document.getElementById("monkey");
const rockContainer = document.getElementById("rockContainer");
const fish1 = document.getElementById("fish1");
const fish2 = document.getElementById("fish2");
const heart1 = document.getElementById("heart1");
const heart2 = document.getElementById("heart2");
const heart3 = document.getElementById("heart3");
const rockPositions = [260, 510, 760, 1010];
const jumpSound = document.getElementById("jumpSound");
const fallSound = document.getElementById("fallSound");
const treasureSound = document.getElementById("treasureSound");
const backgroundSound = document.getElementById("background_Sound");
const muteButton = document.getElementById("muteButton");

function saveScoreAndExit() {
    const user = firebase.auth().currentUser;
    
    if (!user) {
        console.error("No authenticated user found");
        alert("You must be logged in to save scores");
        window.location.href = '../public/login.html';
        return;
    }
    
    const userId = user.uid;
    const db = firebase.firestore();
    
    showPopup("Saving your score...");

    const userRef = db.collection("users").doc(userId);

    userRef.get()
        .then((docSnap) => {
            if (docSnap.exists) {
                const userData = docSnap.data();
                const currentTotal = userData.totalScore || 0;
                const gamesPlayed = userData.gamesPlayed || 0;
                const highScore = userData.highScore || 0;
                const username = userData.username || "Player";

                return userRef.update({
                    totalScore: currentTotal + score,
                    gamesPlayed: gamesPlayed + 1,
                    highScore: score > highScore ? score : highScore,
                    lastPlayed: new Date()
                }).then(() => username);

            } else {
                const username = user.displayName || "Player";

                return userRef.set({
                    userId: userId,
                    username: username,
                    totalScore: score,
                    gamesPlayed: 1,
                    highScore: score,
                    createdAt: new Date(),
                    lastPlayed: new Date()
                }).then(() => username);
            }
        })
        .then((username) => {
            return db.collection("scores").add({
                userId: userId,
                username: username,
                score: score,
                timestamp: new Date(),
                gameVersion: "1.0"
            });
        })
        .then(() => {
            console.log("Score saved successfully");

            localStorage.removeItem("currentScore");

            window.location.href = '../public/menu.html';
        })
        .catch((error) => {
            console.error("Error saving score:", error);
            showPopup("Failed to save your score. Please try again.");
        });
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        const userId = user.uid;
        const db = firebase.firestore();

        db.collection("users").doc(userId).get()
            .then((doc) => {
                if (doc.exists) {
                    const username = doc.data().username;
                    document.getElementById("usernameDisplay").textContent = username;
                } else {
                    console.error("User document not found!");
                    document.getElementById("usernameDisplay").textContent = "Unknown Player";
                }
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                document.getElementById("usernameDisplay").textContent = "Error loading username";
            });
    } else {
        console.log("No user is signed in");
        document.getElementById("usernameDisplay").textContent = "Guest";
    }
});

document.getElementById("save_exit").addEventListener("click", saveScoreAndExit);

muteButton.addEventListener("click", function() {
    isMuted = !isMuted;

    document.cookie = `mute=${isMuted}; path=/; max-age=${30 * 24 * 60 * 60}`;

    if (isMuted) {
        muteButton.textContent = "🔇 Unmute";
        backgroundSound.pause();
    } else {
        muteButton.textContent = "🔊 Mute";
        backgroundSound.play();
    }
});

function playSound(sound) {
    if (!isMuted && sound) {
        sound.pause();
        sound.currentTime = 0;
        sound.play().catch(e => console.error("Sound play error:", e));
    }
}

rockPositions.forEach((pos) => {
    const rock = document.createElement("img");
    rock.src = "../assets/images/rock.png";
    rock.classList.add("rock");
    rock.style.left = `${pos}px`;
    rockContainer.appendChild(rock);
});

//Add local Storage for a session
function updateScore(points) {
    score = Math.max(0, score + points);
    scoreDisplay.textContent = `Score: ${score}`;

    localStorage.setItem("currentScore", score);
}

function loadScore() {
    const savedScore = localStorage.getItem("currentScore");
    if (savedScore !== null) {
        score = parseInt(savedScore, 10);
        scoreDisplay.textContent = `Score: ${score}`;
    } else {
        score = 0;
    }
}

loadScore();

function resetScore() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    localStorage.removeItem("currentScore");
}

function startTimer() {
    timeLeft = 30;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time Left : ${timeLeft}s`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                timerDisplay.textContent = "Time's up!";
                
                if (chances <= 1) {
                    updateScore(-5);
                    loseHeart();
                } else {
                    let popupTimeout;
                    showPopup("Time's up! Play again.", function () {
                        clearTimeout(popupTimeout);
                        updateScore(-5);
                        loseHeart();
                    });

                    popupTimeout = setTimeout(() => {
                        localStorage.setItem("logoutAlert", "true");
                        auth.signOut().then(() => {
                            localStorage.removeItem("currentScore");
                            window.location.href = "../public/login.html";
                        });
                    },15000);
                }
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
            loseHeart();
    }
});

document.getElementById("nextButton").addEventListener("click", function () {
    fetchPuzzle();
});

function moveMonkey() {
    if (rockIndex < rockPositions.length) {
        monkey.style.transition = "transform 0.7s ease-out";
        monkey.style.transform = `translateX(${rockPositions[rockIndex]}px) translateY(-100px)`;
        playSound(jumpSound);

        setTimeout(() => {
            monkey.style.transform = `translateX(${rockPositions[rockIndex]}px) translateY(0px)`;

            setTimeout(() => {
                rockIndex++;
            }, 300);
        }, 400);
    }
}

function finaljump(){
    setTimeout(() => {
        monkey.style.transition = "transform 0.8s ease-out";
        monkey.style.transform = `translateX(${rockPositions[rockIndex - 1] + 170}px) translateY(-120px)`;
        playSound(jumpSound);

        setTimeout(() => {
            monkey.style.transform = `translateX(1280px) translateY(0px)`;
        
            setTimeout(() => {
                let rewardPoints = Math.floor(Math.random() * 91) + 10;
                playSound(treasureSound);
                showPopup(`You found the treasure! 🎉 You earned ${rewardPoints} points!`, function () {
                    updateScore(rewardPoints);
                    fetchPuzzle();
                    resetGame();
                });             
            }, 1000);
        }, 300);
    }, 300);
}

function monkeyfall() {
    let currentX = rockIndex > 0 ? rockPositions[rockIndex - 1] : 0;
    
            monkey.style.transition = "transform 1.5s ease-in";
            monkey.style.transform = `translateX(${currentX}px) translateY(155px) rotate(360deg)`;
            playSound(fallSound);

            setTimeout(() => {
                fish1.style.left = `${currentX}px`;
                fish1.style.bottom = "0px";
                fish1.style.display = "block";
                fish1.style.animation = "fishHit 1.5s ease-in-out";
            
                let gameContainerWidth = document.getElementById("bottom-section").offsetWidth; 
                let fish2Right = gameContainerWidth - (currentX + 210);
            
                fish2.style.right = `${fish2Right}px`;
                fish2.style.bottom = "0px";
                fish2.style.display = "block";
                fish2.style.animation = "fishHit 1.5s ease-in-out";
            }, 1500);
                           
            setTimeout(() => {
                showPopup("Oh no! The monkey got hit by the fish! 😢 The game will restart.", function () {
                    animateFish();
                    fetchPuzzle();
                    resetGame();
                });
            }, 1600);
}

function resetGame() {
    rockIndex = 0;
    monkey.style.transition = "none";
    monkey.style.transform = `translateX(0px) translateY(0px) rotate(0deg)`;
    chances = 3;
    updateHearts();
}

function updateHearts() {
    heart1.style.display = "none";
    heart2.style.display = "none";
    heart3.style.display = "none";

    if (chances >=1) heart1.style.display = "inline-block";
    if (chances >=2) heart2.style.display = "inline-block";
    if (chances >=3) heart3.style.display = "inline-block";
}

function loseHeart() {
    chances--;
    updateHearts();
    
    if (chances <=0) {
        setTimeout (() => {
            monkeyfall();
        },100);
    } else {  
        fetchPuzzle();
    }
}

function showPopup(message, callback) {
    document.getElementById("popupText").textContent = message;
    document.getElementById("popupMessage").style.display = "flex";
    
    document.getElementById("popupOkButton").onclick = function () {
        closePopup();
        if (callback) callback();
    };
}

function closePopup() {
    document.getElementById("popupMessage").style.display = "none";
}

function animateFish() {
    fish1.style.animation = "swimLeftToRight 9s linear infinite";
    fish2.style.animation = "swimRightToLeft 9s linear infinite";
}

window.onload = () => {
    document.body.addEventListener("click", () => {
        backgroundSound.loop = true;
        playSound(backgroundSound);
    }, { once: true});

    fetchPuzzle();
    updateHearts();
    animateFish();

    const cookies = document.cookie.split("; ");
    const muteCookie = cookies.find(row => row.startsWith("mute="));
    if (muteCookie) {
        isMuted = muteCookie.split("=")[1] === "true";
    }

    if (isMuted) {
        muteButton.textContent = "🔇 Unmute";
        backgroundSound.pause();
    } else {
        muteButton.textContent = "🔊 Mute";
        backgroundSound.play();
    }

    const user = firebase.auth().currentUser;
    if (!user) {
        console.log("No user is signed in during game load");
    }
};