const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

// Configuração inicial
const size = 30;
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];
let direction;
let isGameOver = false;  // Variável para controlar o estado do jogo

const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

const incrementeScore = () => {
    score.innerText = parseInt(score.innerText) + 1;
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#101920";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(600, i);
        ctx.stroke();
    }
}

const drawFood = () => {
    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 50;
    ctx.fillStyle = color;
    ctx.fillRect(food.x, food.y, size, size);
}

const drawSnake = () => {
    ctx.shadowBlur = 50;
    ctx.fillStyle = "white";

    snake.forEach((position, index) => {
        if (index === snake.length - 1) {
            ctx.fillStyle = "Silver";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1];

    if (direction === "right") {
        snake.push({ x: head.x + size, y: head.y });
    } else if (direction === "left") {
        snake.push({ x: head.x - size, y: head.y });
    } else if (direction === "down") {
        snake.push({ x: head.x, y: head.y + size });
    } else if (direction === "up") {
        snake.push({ x: head.x, y: head.y - size });
    }
    snake.shift();
}

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementeScore();
        snake.push({ ...head });

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find(position => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];

    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;
    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;
    isGameOver = true;  // Marca o jogo como finalizado
    menu.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)";
}

let loopId;
const gameLoop = () => {
    if (isGameOver) return;  // Para o loop se o jogo tiver acabado

    clearInterval(loopId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 100);
};

document.addEventListener("keydown", ({ key }) => {
    if (isGameOver) return;  // Ignora as teclas se o jogo acabou

    if (key === "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key === "ArrowLeft" && direction !== "right") {
        direction = "left";
    } else if (key === "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key === "ArrowUp" && direction !== "down") {
        direction = "up";
    }
});

buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none";
    snake = [initialPosition];
    isGameOver = false;  // Reinicia o estado do jogo
    gameLoop();
})

// Inicia o loop do jogo
gameLoop();
