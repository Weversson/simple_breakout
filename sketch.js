// --- VARIÁVEIS DO JOGO ---
let score = 0;
let lives = 3;
let bricks = [];
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_SIZE = 10;
const BRICK_PADDING = 10;

// Variáveis da Bola
let ball;
const BALL_SIZE = 5; // A bola é um ponto, então seu tamanho é o peso do traço
let ballSpeedX;
let ballSpeedY;

// Variáveis da Raquete (Paddle)
let paddle;
const PADDLE_WIDTH = 50;
const PADDLE_HEIGHT = 2; // A raquete é uma linha
let paddleSpeed = 5;

// --- FUNÇÃO DE SETUP ---
function setup() {
  createCanvas(400, 400);

  // Inicialização da bola
  ball = {
    x: width / 2,
    y: height - 60,
    size: BALL_SIZE
  };
  ballSpeedX = 2;
  ballSpeedY = -2;

  // Inicialização da raquete
  paddle = {
    x: (width - PADDLE_WIDTH) / 2,
    y: height - 40,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT
  };
 
  // Criação dos tijolos
  createBricks();
}

// --- FUNÇÃO DE DESENHO (LOOP PRINCIPAL) ---
function draw() {
  background(220);

  // Desenha a área de interesse
  noFill();
  stroke("gray");
  strokeWeight(1);
  rect(10, 10, width - 20, height - 20);

  // Desenha todos os elementos
  drawBall();
  drawPaddle();
  drawBricks();
  drawUI();

  // Lógica do jogo
  moveBall();
  movePaddle();
  checkWallCollision();
  checkPaddleCollision();
  checkBrickCollision();

  // Lógica de Fim de Jogo
  checkGameOver();
}

// --- FUNÇÕES DE DESENHO ---

function drawBall() {
  stroke('red');
  strokeWeight(ball.size);
  point(ball.x, ball.y);
}

function drawPaddle() {
  stroke(0);
  strokeWeight(paddle.height);
  line(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
}

function createBricks() {
  const offsetX = (width - BRICK_COLS * (BRICK_SIZE + BRICK_PADDING)) / 2;
  const offsetY = 40;

  for (let c = 0; c < BRICK_COLS; c++) {
    bricks[c] = [];
    for (let r = 0; r < BRICK_ROWS; r++) {
      let brickX = c * (BRICK_SIZE + BRICK_PADDING) + offsetX;
      let brickY = r * (BRICK_SIZE + BRICK_PADDING) + offsetY;
      bricks[c][r] = { x: brickX, y: brickY, status: 1 };
    }
  }
}

function drawBricks() {
  noStroke();
  fill(0);
  for (let c = 0; c < BRICK_COLS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      if (bricks[c][r].status === 1) {
        rect(bricks[c][r].x, bricks[c][r].y, BRICK_SIZE, BRICK_SIZE);
      }
    }
  }
}

function drawUI() {
  fill(0);
  noStroke();
  textSize(12);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 20, 20);
  text(`Lives: ${lives}`, width - 70, 20);
}

// --- FUNÇÕES DE LÓGICA DO JOGO ---

function moveBall() {
  ball.x += ballSpeedX;
  ball.y += ballSpeedY;
}

function movePaddle() {
  if (keyIsDown(LEFT_ARROW)) {
    paddle.x -= paddleSpeed;
  } else if (keyIsDown(RIGHT_ARROW)) {
    paddle.x += paddleSpeed;
  }
 
  paddle.x = constrain(paddle.x, 10, width - PADDLE_WIDTH - 10);
}

function checkWallCollision() {
  // Colisão com as paredes laterais
  if (ball.x > width - 10 || ball.x < 10) {
    ballSpeedX *= -1;
  }
 
  // Colisão com a parede superior
  if (ball.y < 10) {
    ballSpeedY *= -1;
  }
 
  // Perda de vida ao passar pela parte inferior
  if (ball.y > height - 10) {
    lives--;
    if (lives > 0) {
      resetBallAndPaddle();
    }
  }
}

function checkPaddleCollision() {
  // Colisão da bola com a raquete
  if (ball.y > paddle.y - 5 && ball.y < paddle.y + 5) {
    if (ball.x > paddle.x - 5 && ball.x < paddle.x + paddle.width + 5) {
      ballSpeedY *= -1;
    }
  }
}

function checkBrickCollision() {
  for (let c = 0; c < BRICK_COLS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      let brick = bricks[c][r];
      if (brick.status === 1) {
        // Lógica de colisão
        if (ball.x > brick.x && ball.x < brick.x + BRICK_SIZE && ball.y > brick.y && ball.y < brick.y + BRICK_SIZE) {
          ballSpeedY *= -1;
          brick.status = 0;
          score += 10;
        }
      }
    }
  }
}

// --- FUNÇÕES AUXILIARES ---

function resetBallAndPaddle() {
  ball.x = width / 2;
  ball.y = height - 60;
  ballSpeedY = -2;
  paddle.x = (width - PADDLE_WIDTH) / 2;
}

function checkGameOver() {
  if (lives === 0) {
    gameOver("Game Over!");
  }

  let allBricksBroken = true;
  for (let c = 0; c < BRICK_COLS; c++) {
    for (let r = 0; r < BRICK_ROWS; r++) {
      if (bricks[c][r].status === 1) {
        allBricksBroken = false;
        break;
      }
    }
    if (!allBricksBroken) break;
  }

  if (allBricksBroken) {
    gameOver("Você Venceu!");
  }
}

function gameOver(message) {
  noLoop();
  textSize(20);
  textAlign(CENTER, CENTER);
  fill(0);
  text(message, width / 2, height / 2);
  textSize(12);
  text("Pressione F5 para jogar novamente", width / 2, height / 2 + 20);
}