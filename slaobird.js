

//interval
let bartimer1;
let bartimer2;
let bartimer3;

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

//dragon

let dragonWidth = 45;
let dragonHight = 45;
let dragonX = boardWidth;
let dragonY = 0;

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

//all parametres
let gameState = 0;
let score = 0;
let gearscore = 0;
let scaleImg = 10;

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

    textStart = new Image();
    textStart.src = "./TextStart.png";
    textGameOver = new Image();
    textGameOver.src = "./TextGameOver.png";
    textGameWin = new Image();
    textGameWin.src = "./TextWin.png";

    gearImgCollect = new Image();
    gearImgCollect.src = "./clear.png";

    gearCollectTable = new Image();
    gearCollectTable.src = "./scoretable.png";

    requestAnimationFrame(update);
    // bartimer1 = setInterval(placePipes, 10000); //every 10 sec.
    // bartimer2 = setInterval(placeGears, 2000); //every 2 sec.
    // bartimer3 = setInterval(setDifficulty, 4000); //every 4 sec.
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    //проверка состояния игры
    switch(gameState) {
        case 0:
            if (gameState == 0) {
                context.drawImage(textStart, boardWidth/4, boardHight/4, boardWidth/2, boardHight/2);
            }
            return;
        case 1:
            break;
        case 2:
            if (gameState == 2) {
                context.drawImage(textGameOver, 300, 200, 300, 150);
            }
            return;
        case 3:
            if (gameState == 3) {
                if (scaleImg < 100) {
                    context.clearRect(0, 0, board.width, board.height);
                    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
                    for (let i = 0; i < pipeArray.length; i++) {
                        let pipe = pipeArray[i];
                        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
                    }
                    for (let i = 0; i < gearArray.length; i++) {
                        let gear = gearArray[i];
                        context.drawImage(gear.img, gear.x, gear.y, gear.width, gear.height);
                    }
                    context.drawImage(gearCollectTable, 0, 0, 140, 80);
                    context.fillStyle = "white";
                        context.font = "30px WoWfont";
                    context.fillText(gearscore, 60, 45)
                    if (gearscore<10) {
                        context.fillText("/45", 75, 45);
                     }
                     else {
                        context.fillText("/45",90,45);
                    }
                    context.drawImage(textGameWin,200+(250*(100-scaleImg)/100),25+(225*(100-scaleImg)/100),500*(scaleImg/100),450*(scaleImg/100));
                    scaleImg += 1;
                }
                else {
                    context.clearRect(0, 0, board.width, board.height);
                    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
                    for (let i = 0; i < pipeArray.length; i++) {
                        let pipe = pipeArray[i];
                        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
                    }
                    for (let i = 0; i < gearArray.length; i++) {
                        let gear = gearArray[i];
                        context.drawImage(gear.img, gear.x, gear.y, gear.width, gear.height);
                    }
                    context.drawImage(gearCollectTable, 0, 0, 140, 80);
                    context.fillStyle = "white";
                        context.font = "30px WoWfont";
                    context.fillText(gearscore, 60, 45)
                    if (gearscore<10) {
                        context.fillText("/45", 75, 45);
                     }
                     else {
                        context.fillText("/45",90,45);
                    }
                    context.drawImage(textGameWin,200,25,500,450);
                }
            }
            return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velosityY += gravity;
    //bird.y += velosityY;
    bird.y = Math.max(bird.y + velosityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > boardHight) {
        gameState = 2;
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
            gameState = 2;
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

    //scoretable
    context.drawImage(gearCollectTable, 0, 0, 140, 80);
    //score
    context.fillStyle = "white";
    context.font = "30px WoWfont";
    //context.fillText(score, 5, 45);
    context.fillText(gearscore, 60, 45)
    if (gearscore<10) {
        context.fillText("/45", 75, 45);
    }
    else {
        context.fillText("/45",90,45);
    }

    if (gearscore == 1) {
        gameState = 3;
    }

}

function placePipes() {

    if (gameState == 2){
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
    if (gameState == 2) {
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
        if (gameState == 2) {
            context.clearRect(0, 0, board.width, board.height);
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameState = 0;
            gearArray = [];
            gearscore = 0;
            velosityX = -2;
            scaleImg = 10;
            clearInterval(bartimer1);
            clearInterval(bartimer2);
            //clearInterval(bartimer3);
        }
        else if (gameState == 0) {
            bartimer1 = setInterval(placePipes, 10000); //every 10 sec.
            bartimer2 = setInterval(placeGears, 2000); //every 2 sec.
            //bartimer3 = setInterval(setDifficulty, 4000); //every 4 sec.
            gameState = 1;
        }
        else if (gameState == 3 && e.code == "KeyX") {
            context.clearRect(0, 0, board.width, board.height);
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameState = 0;
            gearArray = [];
            gearscore = 0;
            velosityX = -2;
            scaleImg = 10;
            clearInterval(bartimer1);
            clearInterval(bartimer2);
            //clearInterval(bartimer3);
        }
    }
}



function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && 
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

