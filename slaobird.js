
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

//gears

let gearArray = [];
let gearWidth = 40;
let gearHight = 40;
let gearX = boardWidth;
let gearY = boardHight/2;

//physics

let velosityX = -2;
let velosityY = 0; //jump speed
let gravity = 0.3;
let jumpSpeed = -5;

let gameOver = false;
let score = 0;
let gearscore = 0;

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

    gearImg1 = new Image();
    gearImg1.src = "./gear.png";
    gearImg2 = new Image();
    gearImg2.src = "./gear2.png"
    gearImg3 = new Image();
    gearImg3.src = "./gear3.png";

    gearImgCollect = new Image();
    gearImgCollect.src = "./clear.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 10000); //every 10 sec.
    setInterval(placeGears, 2000); //every 2 sec.
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

    //gears

    for (let i = 0; i < gearArray.length; i++) {
        let gear = gearArray[i];
        gear.x += velosityX;
        context.drawImage(gear.img, gear.x, gear.y, gear.width, gear.height);

        if (!gear.collect && detectCollision(bird,gear)) {
            gearscore += 1;
            gear.collect = true;
            gear.img = gearImgCollect;
        }

        //clear GearXPipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            if (detectCollision(pipe, gear)) {
                gear.collect = true;
                gear.img = gearImgCollect;
            }
        }
    }

    //clear gears
    while (gearArray.length >0 && gearArray[0].x < gearWidth) {
        gearArray.shift();
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    context.fillText(gearscore, 5, 90)

    //game over text

    if (gameOver) {
        context.fillStyle = "red";
        context.font = "75px sans-serif";
        context.fillText("GAME OVER", boardWidth/2, boardHight/2);
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

function placeGears() {
    if (gameOver) {
        return
    }

    let gearImgArray = [gearImg1, gearImg2, gearImg3];
    let randomGearY = board.height/2 + (Math.random() - 0.5)*(boardHight/2);
    let gear = {
        img : gearImgArray[Math.floor(Math.random()*3)],
        x : gearX,
        y : randomGearY,
        width : gearWidth,
        height : gearHight,
        collect : false
    }

    gearArray.push(gear);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
    {
        //jump
        velosityY = jumpSpeed;

        //reset game 
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            gearArray = [];
            gearscore = 0;
        }
    }
}

function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && 
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}