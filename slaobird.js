
//board
let board;
let boardWidth = 900;
let boardHight = 500;
let context;

//bird

let birdwidth = 45;
let birdhight = 45;
let birdX = boardWidth/10;
let birdY = boardHight/2;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdhight
}

//pipes

let pipeArray = [];
let pipeWidth = 64;
let pipeHight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics

let velosityX = -2;
let velosityY = 0; //jump speed
let gravity = 0.2;

let gameOver = false;
let score = 0;

window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHight;
    board.width = boardWidth;
    context = board.getContext('2d');

    //draw SLAObird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load img
    birdImg = new Image();
    birdImg.src = "./slaobird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe2.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./toppipe2.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 3000); //every 3 sec.
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velosityY += gravity;
    //bird.y += velosityY;
    bird.y = Math.max(bird.y + velosityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > boardHight) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velosityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird,pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //удаляет 1-ю преграду
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    //game over text

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90);
    }
}

function placePipes() {

    if (gameOver){
        return;
    }

    let randomPipeY = pipeY - pipeHight/4 - Math.random()*(pipeHight/2);
    let openingSpace = board.height/3;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHight,
        passed : false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y: randomPipeY + pipeHight + openingSpace,
        width : pipeWidth,
        height : pipeHight,
        passed: false
    }

    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
    {
        //jump
        velosityY = -6;

        //reset game 
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && 
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}