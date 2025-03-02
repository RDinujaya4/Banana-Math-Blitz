document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("background-music");
    const togggleMusicButton = document.getElementById("toggle-music");

    function playMusic(){
        music.play().catch(error => console.log("Autoplay blocked. Waiting for user interaction."));
        }

        document.body.addEventListener("click", playMusic, {once: true});

        togggleMusicButton.addEventListener("click", () => {
            if(music.paused){
                music.play();
                togggleMusicButton.textContent = "🔊 Mute Music";        
            }else {
                music.pause();
                togggleMusicButton.textContent = "🔇 Play Music";
            }
        });
});