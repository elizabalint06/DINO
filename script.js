const UP = 38;
const INTERVAL = 5;
const SECOND = 1000;
const DINO_X_POSITION = 50;
const DINO_Y_POSITION = 50;
const DINO_HEIGHT = 40;
const DINO_WIDTH = 30;
const GRAVITY = 0.2;
const JUMP_POWER = -8;
const OBSTACLE_FREQUENCY = 2000;
const TEN = 10;
const OBSTACLE_FREQUENCY_LIMIT = 5000;
const FREQUENCY_DECREASES = 5;
const GROUND_Y_POSITION = 50;
const OBSTACLE_MIN_HEIGHT = 35;
const OBSTACLE_MAX_HEIGHT = 50;
const OBSTACLE_MIN_SPEED = 0.8;
const OBSTACLE_WIDTH = 30;

const gameBoard = document.getElementById("gameBoard");
const ctx = gameBoard.getContext("2d");

const dino = {
    x: DINO_X_POSITION,
    y: gameBoard.height - DINO_Y_POSITION - DINO_HEIGHT,
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
    updateDinoPosition();
    updateObstacles();
    draw();
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
        
        if (dino.y >= gameBoard.height - GROUND_Y_POSITION - DINO_HEIGHT) {
            dino.y = gameBoard.height - GROUND_Y_POSITION - DINO_HEIGHT;
            dino.isJumping = false;
            dino.velocityY = 0;
        }
    }
}

function checkCollision() {
    obstacles.some(obstacle => {
        if (
            dino.x < obstacle.x + obstacle.width && 
            dino.x + dino.width > obstacle.x &&    
            dino.y < obstacle.y + obstacle.height && 
            dino.y + dino.height > obstacle.y       
        ) {
            clearInterval(obstacleInterval);
            clearInterval(interval);
            gameOverScreen();
        }
    });
}
function draw() {
    ctx.fillStyle = dino.color;
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function printScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

function keyPressed(e) {
    if (e.keyCode == UP && !dino.isJumping) { 
        dino.isJumping = true; 
        dino.velocityY = dino.jumpPower;
    }
}

function createObstacle() {
    const obstacleHeight = OBSTACLE_MIN_HEIGHT + Math.random() * OBSTACLE_MAX_HEIGHT;
    const obstacleSpeed = OBSTACLE_MIN_SPEED + Math.random() * 
        OBSTACLE_MIN_SPEED + score / 2;
    const obstacle = {
        x: gameBoard.width,
        y: gameBoard.height - GROUND_Y_POSITION - obstacleHeight,
        width: OBSTACLE_WIDTH, 
        height: obstacleHeight, 
        color: 'red',
        speed: obstacleSpeed
    };
    obstacles.push(obstacle);
}

function gameOverScreen() {
    document.getElementById("gameOver").textContent = "Your score: " + score;
    document.getElementById("gameOver").style.display = 'block' ;
}

startGame();