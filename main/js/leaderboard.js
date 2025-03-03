document.addEventListener("DOMContentLoaded", function(){
    const leaderboardData = [
        { rank: 1, username: "MonkeyKing", score: 5000 },
        { rank: 2, username: "BananaMaster", score: 4500 },
        { rank: 3, username: "JungleWizard", score: 4000 },
        { rank: 4, username: "MathGenius", score: 3500 },
        { rank: 5, username: "SpeedSolver", score: 3000 }
    ];

    const leaderboardBody = document.getElementById("leaderboard-body");

    leaderboardData.forEach(player => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${player.rank}</td>
            <td>${player.username}</td>
            <td>${player.score}</td>
        `;
        leaderboardBody.appendChild(row);
    });
});