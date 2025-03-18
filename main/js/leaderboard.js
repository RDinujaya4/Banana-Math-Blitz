document.addEventListener("DOMContentLoaded", function () {
    const leaderboardBody = document.getElementById("leaderboard-body");

    if (!firebase.apps.length) {
        console.error("Firebase not initialized");
        return;
    }

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