// ===============================
// ELEMENTOS DO JOGO
// ===============================

const game =
    document.querySelector(".game");

const mario =
    document.getElementById("mario");

const obstacles =
    document.querySelectorAll(".obstacle");

const scoreElement =
    document.getElementById("score");

const highScoreElement =
    document.getElementById("high-score");

const startMessage =
    document.getElementById("start-message");

const gameOverMessage =
    document.getElementById("game-over");


// ===============================
// CONFIGURAÇÕES
// ===============================

let gameStarted = false;

let gameOver = false;

let score = 0;

let highScore = 0;

let gameSpeed = 6;

let marioY = 0;

let velocityY = 0;

const gravity = 0.7;

const jumpForce = 14;

let canJump = true;

let lastTime = 0;

let animationId;


// ===============================
// POSIÇÃO DOS OBSTÁCULOS
// ===============================

const obstaclePositions = [

    950,

    1350,

    1800

];


obstacles.forEach(
    (obstacle, index) => {

        obstacle.dataset.x =
            obstaclePositions[index];

    }
);


// ===============================
// INICIAR O JOGO
// ===============================

function startGame() {

    if (gameStarted) {

        return;

    }


    gameStarted = true;

    gameOver = false;

    score = 0;

    gameSpeed = 6;

    marioY = 0;

    velocityY = 0;

    canJump = true;


    scoreElement.textContent =
        "00000";


    startMessage.style.display =
        "none";


    gameOverMessage.style.display =
        "none";


    mario.classList.add(
        "running"
    );


    resetObstacles();


    lastTime =
        performance.now();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ===============================
// REINICIAR OBSTÁCULOS
// ===============================

function resetObstacles() {

    obstacles.forEach(
        (obstacle, index) => {

            const position =
                obstaclePositions[index];

            obstacle.dataset.x =
                position;

            obstacle.style.left =
                position + "px";

        }
    );

}


// ===============================
// LOOP PRINCIPAL
// ===============================

function gameLoop(currentTime) {

    if (!gameStarted) {

        return;

    }


    if (gameOver) {

        return;

    }


    const deltaTime =
        (currentTime - lastTime) /
        16.67;


    lastTime =
        currentTime;


    updateMario(deltaTime);

    updateObstacles(deltaTime);

    checkCollisions();

    updateScore();

    updateSpeed();


    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


// ===============================
// MOVIMENTO DO MARIO
// ===============================

function updateMario(deltaTime) {

    if (
        marioY > 0 ||
        velocityY > 0
    ) {

        velocityY -=
            gravity * deltaTime;

        marioY +=
            velocityY * deltaTime;

    }


    if (marioY <= 0) {

        marioY = 0;

        velocityY = 0;

        canJump = true;

        mario.classList.remove(
            "jumping"
        );

        mario.classList.add(
            "running"
        );

    }


    mario.style.bottom =
        (40 + marioY) + "px";

}


// ===============================
// PULO
// ===============================

function jump() {

    if (!gameStarted) {

        startGame();

        return;

    }


    if (gameOver) {

        restartGame();

        return;

    }


    if (!canJump) {

        return;

    }


    velocityY =
        jumpForce;

    canJump = false;


    mario.classList.remove(
        "running"
    );

    mario.classList.add(
        "jumping"
    );

}


// ===============================
// MOVIMENTO DOS OBSTÁCULOS
// ===============================

function updateObstacles(deltaTime) {

    obstacles.forEach(
        (obstacle) => {

            let x =
                Number(
                    obstacle.dataset.x
                );


            x -=
                gameSpeed *
                deltaTime;


            // ===============================
            // OBSTÁCULO SAIU DA TELA
            // ===============================

            if (x < -100) {

                const otherPositions =
                    Array.from(
                        obstacles
                    )
                    .map(
                        (item) =>
                            Number(
                                item.dataset.x
                            )
                    );


                const furthest =
                    Math.max(
                        ...otherPositions
                    );


                x =
                    furthest +
                    350 +
                    Math.random() *
                    250;

            }


            obstacle.dataset.x =
                x;

            obstacle.style.left =
                x + "px";

        }
    );

}


// ===============================
// COLISÃO
// ===============================

function checkCollisions() {

    const marioRect =
        mario.getBoundingClientRect();


    obstacles.forEach(
        (obstacle) => {

            const obstacleRect =
                obstacle.getBoundingClientRect();


            const collision =

                marioRect.left <
                obstacleRect.right &&

                marioRect.right >
                obstacleRect.left &&

                marioRect.top <
                obstacleRect.bottom &&

                marioRect.bottom >
                obstacleRect.top;


            if (collision) {

                endGame();

            }

        }
    );

}


// ===============================
// FINALIZAR JOGO
// ===============================

function endGame() {

    if (gameOver) {

        return;

    }


    gameOver = true;

    gameStarted = false;


    cancelAnimationFrame(
        animationId
    );


    mario.classList.remove(
        "running"
    );


    mario.classList.remove(
        "jumping"
    );


    gameOverMessage.style.display =
        "block";


    if (score > highScore) {

        highScore =
            score;

        highScoreElement.textContent =
            String(highScore)
            .padStart(5, "0");

    }

}


// ===============================
// REINICIAR JOGO
// ===============================

function restartGame() {

    gameOver = false;

    gameStarted = false;


    mario.style.bottom =
        "40px";


    marioY = 0;

    velocityY = 0;

    canJump = true;


    resetObstacles();


    gameOverMessage.style.display =
        "none";


    score = 0;

    scoreElement.textContent =
        "00000";


    startGame();

}


// ===============================
// ATUALIZAR PONTUAÇÃO
// ===============================

function updateScore() {

    score += 0.05;


    const displayedScore =
        Math.floor(score);


    scoreElement.textContent =
        String(displayedScore)
        .padStart(5, "0");

}


// ===============================
// AUMENTAR VELOCIDADE
// ===============================

function updateSpeed() {

    const newSpeed =
        6 +
        Math.floor(
            score / 300
        );


    if (newSpeed <= 12) {

        gameSpeed =
            newSpeed;

    }

}


// ===============================
// TECLADO
// ===============================

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            jump();

        }

    }
);


// ===============================
// CLIQUE DO MOUSE
// ===============================

game.addEventListener(
    "click",
    () => {

        jump();

    }
);