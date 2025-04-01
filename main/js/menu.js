document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const logoutButton = document.querySelector(".logout-btn");

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("User is signed in:", user.email);
        } else {
            console.log("No user signed in. Redirecting to login...");
            window.location.href = "login.html";
        }

    });

    logoutButton.addEventListener("click", function () {
        logoutButton.textContent = "Logging out...";
        logoutButton.disabled = true;

        auth.signOut()
            .then(() => {
                console.log("User logged out successfully");
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
