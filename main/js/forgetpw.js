//Inspired by: https://www.youtube.com/watch?v=XpMnUNWMyQI&ab_channel=VectorM%3A
document.addEventListener("DOMContentLoaded", function () {
    const auth = firebase.auth();
    const forgetForm = document.getElementById("forget-form");
    const emailInput = document.getElementById("email");
    const errorMessage = document.getElementById("error-message");
    
    forgetForm.addEventListener("submit", function (e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showError("Please enter a valid email address.");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset email sent! Check your inbox.");
                emailInput.value = "";
            })
            .catch((error) => {
                console.error("Error sending reset email:", error);
                showError(error.message);
            });
    });
    
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }
});
