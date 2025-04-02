document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const db = firebase.firestore();
//Get idea from: https://www.youtube.com/watch?v=kjyMta25TMI&ab_channel=VectorM%3A
    const usernameElement = document.querySelector(".username");
    const emailElement = document.querySelector(".score-container p:nth-child(1) span");
    const gamesPlayedElement = document.querySelector(".score-container p:nth-child(2) span");
    const totalScoreElement = document.querySelector(".score-container p:nth-child(3) span");
    const highScoreElement = document.querySelector(".score-container p:nth-child(4) span");

    auth.onAuthStateChanged(user => {
        if (user) {
            const userId = user.uid;

            db.collection("users").doc(userId).get()
                .then(doc => {
                    if (doc.exists) {
                        const userData = doc.data();

                        usernameElement.textContent = userData.username || "Unknown Player";
                        emailElement.textContent = userData.email || "N/A";
                        totalScoreElement.textContent = userData.totalScore || 0;
                        highScoreElement.textContent = userData.highScore || 0;
                        gamesPlayedElement.textContent = userData.gamesPlayed || 0;
                    } else {
                        console.error("User data not found!");
                    }
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        } else {
            console.log("No user logged in");
            window.location.href = "login.html";
        }
    });
});
