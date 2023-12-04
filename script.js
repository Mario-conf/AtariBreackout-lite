window.onload = function () {
    const canvas = document.getElementById("breakoutCanvas");
    const ctx = canvas.getContext("2d");

    let brickRowCount = 1;
    let brickColumnCount = 5;  // Número inicial de columnas
    const brickWidth = (canvas.width - brickColumnCount * 2) / brickColumnCount; // Ancho ajustado
    const brickHeight = 20;
    const brickPadding = 2;  // Espacio entre bloques
    let brickOffsetTop = 30;
    let brickOffsetLeft = 0;

    let bricks = [];

    let paddleHeight = 10;
    let paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 2;
    let dy = -2;

    let score = 0;
    let level = 1;

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);

    let rightPressed = false;
    let leftPressed = false;

    function keyDownHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            rightPressed = false;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function getRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function createBricks() {
        let bricks = [];
        for (let c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (let r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1, color: getRandomColor() };
            }
        }
        return bricks;
    }

    function drawBricks() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status === 1) {
                    let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = bricks[c][r].color;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function collisionDetection() {
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;

                        if (score === brickRowCount * brickColumnCount) {
                            level++;
                            score = 0;
                            brickRowCount++;
                            brickColumnCount++;
                            brickOffsetTop += brickHeight + brickPadding;
                            resetBricks();
                            dx = (dx > 0) ? dx + 1 : dx - 1;
                            dy = (dy > 0) ? dy + 1 : dy - 1;
                        }
                    }
                }
            }
        }
    }

    function resetBricks() {
        bricks = createBricks();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }

        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                document.location.reload();
                alert("Perdiste. Recarga la página para volver a intentarlo.");
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        x += dx;
        y += dy;

        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Puntos: " + score, 8, 20);

        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Nivel: " + level, canvas.width - 80, 20);

        requestAnimationFrame(draw);
    }

    resetBricks();
    draw();
};
