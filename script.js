const UP = 38;
const INTERVAL = 50;
const SECOND = 1000;
const DINO_X_POSITION = 50;
const DINO_Y_POSITION = 50;
const DINO_HEIGHT = 40;
const DINO_WIDTH = 30;
const GRAVITY = 8;
const JUMP_POWER = -70;
const OBSTACLE_FREQUENCY = 2000;
const TEN = 10;
const OBSTACLE_FREQUENCY_LIMIT = 500;
const FREQUENCY_DECREASES = 50;
const GROUND_Y_POSITION = 50;
const SCORE_X_POSITION = 10;
const SCORE_Y_POSITION = 30;
const OBSTACLE_MIN_HEIGHT = 20;
const OBSTACLE_MAX_HEIGHT = 40;
const OBSTACLE_MIN_SPEED = 5;
const OBSTACLE_WIDTH = 30;
const GAME_OVER_X_POSITION = 150;

const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

const dino = {
    x: DINO_X_POSITION,
    y: gameBoard.height - DINO_Y_POSITION,
    height: DINO_HEIGHT,
    width: DINO_WIDTH,
    color: "green",
    velocityY: 0, 
    gravity: GRAVITY, 
    jumpPower: JUMP_POWER, 
    isJumping: false,
};

let obstacles = [];
let interval;
let score = 0;
let obstacleInterval;
let obstacleFrequency = OBSTACLE_FREQUENCY;

function startGame() {
    document.addEventListener("keydown", keyPressed);

    backgroundImage = new Image();
    backgroundImage.src = 'png/Cartoon_Forest_BG_01/Layers/Ground.png';
    backgroundImage.onload = function () {
        printBackGround();
    }

    obstacleInterval = setInterval(createObstacle, obstacleFrequency);
    interval = setInterval(frameUpdate, INTERVAL);
    setInterval(function() {
        ++score; 
        if(score % TEN === 0 && obstacleFrequency > OBSTACLE_FREQUENCY_LIMIT) {
            clearInterval(obstacleInterval);
            obstacleFrequency -= FREQUENCY_DECREASES;
            obstacleInterval = setInterval(createObstacle, obstacleFrequency);
        }
    }, SECOND);
}

function frameUpdate() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    printBackGround();
    drawDino();
    updateObstacles();
    drawObstacles();
    updateDinoPosition();
    checkCollision();
    printScore();
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= obstacle.speed;
    });
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function updateDinoPosition() {
    if (dino.isJumping) {
        dino.velocityY += dino.gravity;
        dino.y += dino.velocityY;
        
        if (dino.y >= gameBoard.height - GROUND_Y_POSITION) {
            dino.y = gameBoard.height - GROUND_Y_POSITION;
            dino.isJumping = false;
            dino.velocityY = 0;
        }
    }
}

function checkCollision() {
    obstacles.forEach(obstacle => {
        if (
            dino.x <= obstacle.x + obstacle.width &&
            dino.x + dino.width >= obstacle.x &&
            dino.y <= obstacle.y &&
            dino.y + dino.height >= obstacle.y - obstacle.height
        ) {
            clearInterval(interval);
            clearInterval(obstacleInterval);
            gameOverScreen();
        }
    });
}

function drawDino() {
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y - dino.height, dino.width, dino.height);
}   

function drawObstacles() {
    obstacles.forEach(obstacle => {
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y - obstacle.height, obstacle.width, obstacle.height);
    });
} 

function printBackGround() {
    ctx.drawImage(
        backgroundImage, 0, 0, gameBoard.width, gameBoard.height
    )
}

function printScore() {
    ctx.fillStyle = "black";
    ctx.font = "20px Monospace";
    ctx.fillText("Score: " + score, SCORE_X_POSITION, SCORE_Y_POSITION);
}

function keyPressed(e) {
    if (e.keyCode == UP && !dino.isJumping) { 
        dino.isJumping = true; 
        dino.velocityY = dino.jumpPower;
    }
}

function createObstacle() {
    let obstacleHeight = OBSTACLE_MIN_HEIGHT + Math.random() * OBSTACLE_MAX_HEIGHT;
    let obstacleSpeed = OBSTACLE_MIN_SPEED + Math.random() * OBSTACLE_MIN_SPEED + score / 2;
    let obstacle = {
        x: gameBoard.width,
        y: gameBoard.height - GROUND_Y_POSITION,
        width: OBSTACLE_WIDTH, 
        height: obstacleHeight, 
        color: 'red',
        speed: obstacleSpeed
    };
    obstacles.push(obstacle);
}

function gameOverScreen() {
    ctx.fillStyle = "red";
    ctx.font = "50px Monospaced";
    ctx.fillText("Your score: " + score,
        gameBoard.width / 2 - GAME_OVER_X_POSITION, gameBoard.height / 2);
}

startGame();