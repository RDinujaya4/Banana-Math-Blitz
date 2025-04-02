document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const logoutButton = document.querySelector(".logout-btn");

//Get code idea from: https://dev.to/maasak/sign-up-login-logout-users-with-firebase-authentication-3oa9
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("User is signed in:", user.email);
        } else {
            console.log("No user signed in. Redirecting to login...");
            window.location.href = "login.html";
        }

    });
//Reference from: https://dev.to/maasak/sign-up-login-logout-users-with-firebase-authentication-3oa9
    logoutButton.addEventListener("click", function () {
        logoutButton.textContent = "Logging out...";
        logoutButton.disabled = true;

        auth.signOut()
            .then(() => {
                console.log("User logged out successfully");
                localStorage.clear();
                window.location.href = "login.html";
            })
            .catch(error => {
                console.error("Logout Error:", error);
                alert("Logout failed. please try again.");
                logoutButton.textContent = "Logout";
                logoutButton.disabled = false;
            });
    });
});

//Code get from: https://dev.to/gyantocode/how-to-track-user-inactivity-on-your-website-and-why-it-matters-2b7h
let inactivityTimer;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        auth.signOut().then(() => {
            localStorage.clear();
            alert("You have been logged out due to inactivity.");
            window.location.href = "login.html";
        });
    }, 1 * 60 * 1000);
}

document.addEventListener("mousemove", resetInactivityTimer);
document.addEventListener("keydown", resetInactivityTimer);
document.addEventListener("click", resetInactivityTimer);

resetInactivityTimer();