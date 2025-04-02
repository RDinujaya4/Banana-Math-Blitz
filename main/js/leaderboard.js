document.addEventListener("DOMContentLoaded", function () {
    const leaderboardBody = document.getElementById("leaderboard-body");

    if (!firebase.apps.length) {
        console.error("Firebase not initialized");
        return;
    }
//Get idea from: https://medium.com/@tajammalmaqbool11/creating-a-leaderboard-for-your-website-game-using-firebase-and-javascript-7083882b409e
    db.collection("users")
        .orderBy("totalScore", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
            let rank = 1;
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${rank}</td>
                    <td>${userData.username || "Unknown Player"}</td>
                    <td>${userData.totalScore || 0}</td>
                `;

                leaderboardBody.appendChild(row);
                rank++;
            });
        })
        .catch((error) => {
            console.error("Error fetching leaderboard data:", error);
        });
});