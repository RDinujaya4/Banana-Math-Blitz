document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    const toggleMusicButton = document.getElementById("toggle-music");

//Get from: https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
            const [key, value] = cookies[i].split("=");
            if (key === name) return value;
        }
        return null;
    }

    function playMusic() {
        music.play().catch(error => console.log("Autoplay blocked. Waiting for user interaction."));
    }

    const savedPreference = getCookie("musicMuted");
    if (savedPreference === "true") {
        music.muted = true;
        toggleMusicButton.textContent = "🔇 Unmute";
    } else {
        music.muted = false;
        toggleMusicButton.textContent = "🔊 Mute";
    }
//https://stackoverflow.com/questions/6529645/how-to-add-background-music-to-a-web-page
    document.body.addEventListener("click", playMusic, { once: true });

    toggleMusicButton.addEventListener("click", () => {
        if (music.muted) {
            music.muted = false;
            toggleMusicButton.textContent = "🔊 Mute";
            setCookie("musicMuted", "false", 7);
        } else {
            music.muted = true;
            toggleMusicButton.textContent = "🔇 Unmute";
            setCookie("musicMuted", "true", 7);
        }
    });
});