const mario = document.querySelector(".mario");

document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        mario.style.bottom = "100px";

        setTimeout(() => {
            mario.style.bottom = "0";
        }, 500);
    }
});