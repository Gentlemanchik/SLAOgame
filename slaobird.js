
//interval
let bartimer1;
let bartimer2;

let difbartimer1;
let difbartimer2;

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

let dragonArray = [];
let dragonWidth = 60;
let dragonHeight = 60;
let dragonX = boardWidth;
let dragonY = 0;
let dragonVelosity = -4;

let dragonImg;

//spider

let spiderArray = [];
let spiderWidth = 60;
let spiderHeight = 60;
let spiderX = boardWidth;
let spiderY = 0;
let spiderVelosityX = -2;
let spiderVelosityY = 1.5;
let spiderDirrection = 0;

let spiderImg;

//web

let webArray = [];
let webWidth = 60;
let webHeight = boardHight;
let webX = boardWidth;
let webY = -boardHight;
let webDirrection = 0;

let webImg;

//gears

let gearArray = [];
let gearWidth = 40;
let gearHight = 40;
let gearX = boardWidth;
let gearY = boardHight/2;

//physics

let velosityX = -2;
let velosityY = 0; //jump speed
let gravity = 0.2;
let jumpSpeed = -4.5;
let distance = 0;
let dx = 2;

//all parametres
let gameState = 0;
let score = 0;
let gearscore = 0;
let scaleImg = 10;
let difficultyState = 0;

//audio

let musicBG;
let musicGameOver;
let musicGOYes = true;
let musicCoin;

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

    dragonImg = new Image();
    dragonImg.src = "./dragon.png";

    spiderImg = new Image();
    spiderImg.src = "./spider.png";

    webImg = new Image();
    webImg.src = "./web.png";

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

    musicBG = new Audio();
    musicBG.src = "./music.mp3";
    musicGameOver = new Audio();
    musicGameOver.src = "./gameovermusic.mp3";
    musicWin = new Audio();
    musicWin.src = "./victory.mp3";
    musicCoin = new Audio();
    musicCoin.src = "./collectcoin.mp3";
    musicBG.volume = 0.5;

    requestAnimationFrame(update);
    // bartimer1 = setInterval(placePipes, 10000); //every 10 sec.
    // bartimer2 = setInterval(placeGears, 2000); //every 2 sec.
    document.addEventListener("keydown", moveBird);
}

function update() {
    requestAnimationFrame(update);

    //проверка состояния игры
    switch(gameState) {
        case 0:
            musicGameOver.pause();
            musicGameOver.currentTime = 0;
            if (gameState == 0) {
                context.drawImage(textStart, boardWidth/4, boardHight/4, boardWidth/2, boardHight/2);
            }
            return;
        case 1:
            break;
        case 2:
            if (gameState == 2) {
                if (scaleImg <100) {
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
                    for (let i = 0; i< spiderArray.length; i++){
                        let spider = spiderArray[i];
                        context.drawImage(webImg, spider.x, spider.y - boardHight + spiderHeight/2, spider.width, boardHight);
                        context.drawImage(spider.img, spider.x, spider.y, spider.width, spider.height);
                    }
                    context.drawImage(gearCollectTable, 0, 0, 140, 80);
                    context.fillStyle = "white";
                        context.font = "30px WoWfont";
                    context.fillText(gearscore, 60, 45)
                    if (gearscore<10) {
                        context.fillText("/30", 75, 45);
                     }
                     else {
                        context.fillText("/30",90,45);
                    }
                    context.drawImage(textGameOver, 300, -150 + 350*(scaleImg/100), 300, 150);
                    scaleImg += 5;
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
                        context.fillText("/30", 75, 45);
                     }
                     else {
                        context.fillText("/30",90,45);
                    }
                    context.drawImage(textGameOver, 300, 200, 300, 150);
                }
            }
            if (musicGOYes) {
                musicGameOver.play();
                musicGOYes = false;
            }
            musicBG.pause();
            musicBG.currentTime = 0;
            return;
        case 3:
            musicBG.pause();
            musicBG.currentTime = 0;
            if (musicGOYes) {
                musicWin.play();
                musicGOYes = false;
            }
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
                    for (let i = 0; i< spiderArray.length; i++){
                        let spider = spiderArray[i];
                        context.drawImage(webImg, spider.x, spider.y - boardHight + spiderHeight/2, spider.width, boardHight);
                        context.drawImage(spider.img, spider.x, spider.y, spider.width, spider.height);
                    }
                    context.drawImage(gearCollectTable, 0, 0, 140, 80);
                    context.fillStyle = "white";
                        context.font = "30px WoWfont";
                    context.fillText(gearscore, 60, 45)
                    if (gearscore<10) {
                        context.fillText("/30", 75, 45);
                     }
                     else {
                        context.fillText("/30",90,45);
                    }
                    context.drawImage(textGameWin,100+(350*(100-scaleImg)/100),25+(300*(100-scaleImg)/100),700*(scaleImg/100),600*(scaleImg/100));
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
                    for (let i = 0; i< spiderArray.length; i++){
                        let spider = spiderArray[i];
                        context.drawImage(webImg, spider.x, spider.y - boardHight + spiderHeight/2, spider.width, boardHight);
                        context.drawImage(spider.img, spider.x, spider.y, spider.width, spider.height);
                    }
                    context.drawImage(gearCollectTable, 0, 0, 140, 80);
                    context.fillStyle = "white";
                        context.font = "30px WoWfont";
                    context.fillText(gearscore, 60, 45)
                    if (gearscore<10) {
                        context.fillText("/30", 75, 45);
                     }
                     else {
                        context.fillText("/30",90,45);
                    }
                    context.drawImage(textGameWin,100,25,700,600);
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

    //spiders

    for (let i = 0; i< spiderArray.length; i++) {
        if (difficultyState <2 ) {
            spiderArray.length = 0;
        }
        let spider = spiderArray[i];
        spider.x += spiderVelosityX;
        if (spider.dirrection == 0) {
            spider.y += spiderVelosityY;
        }
        else {
            spider.y += -spiderVelosityY;
        }

        if (spider.y < 0 && spider.dirrection == 1) {
            spider.dirrection = 0;
        }
        if ((spider.y + spider.height) > boardHight && spider.dirrection == 0) {
            spider.dirrection = 1;
        }

        context.drawImage(webImg, spider.x, spider.y - boardHight + spiderHeight/2, spider.width, boardHight);
        context.drawImage(spider.img, spider.x, spider.y, spider.width, spider.height);

        if (detectCollision(bird,spider)) {
            gameState = 2;
        }
    }

    //clear spiders
    while (spiderArray.length > 0 && spiderArray[0].x < -spiderWidth){
        spiderArray.shift(); // удаляет первого паука.
    }

    //dragons
    for (let i =0; i < dragonArray.length; i++) {
        if (difficultyState < 1) {
            dragonArray.length = 0;
        }
            let dragon = dragonArray[i];
            dragon.x += dragonVelosity;
            context.drawImage(dragon.img, dragon.x, dragon.y, dragon.width, dragon.height);
            if (detectCollision(bird,dragon)) {
                gameState = 2;
            }
    }

    //clear dragons

    while (dragonArray.length >0 && dragonArray[0].x < -dragonWidth) {
        dragonArray.shift(); //удаляет дракона, который вылетел
    }

    //gears

    for (let i = 0; i < gearArray.length; i++) {
        let gear = gearArray[i];
        gear.x += velosityX;
        context.drawImage(gear.img, gear.x, gear.y, gear.width, gear.height);

        if (!gear.collect && detectCollision(bird,gear)) {
            gearscore += 1;
            if (!gear.collect) {
                musicCoin.play();
            }
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
        context.fillText("/30", 75, 45);
    }
    else {
        context.fillText("/30",90,45);
    }
    
    //меняем сложность
    if (gearscore > 10 && gearscore < 24) {
        difficultyState = 1;
    }

    if (gearscore > 20) {
        difficultyState = 2;
    }

    //условие победы
    if (gearscore == 5) {
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

function placeDragons() {
    if (gameState == 2) {
        return
    }

    let randomDragonY = board.height/2 + (Math.random() - 0.5)*(boardHight/2);
    let dragon = {
        img : dragonImg,
        x : dragonX,
        y : randomDragonY,
        width : dragonWidth,
        height : dragonHeight,
    }

    dragonArray.push(dragon);
}

function placeSpiders() {
    if (gameState == 2) {
        return
    }

    let randomSpiderY = board.height/2 + (Math.random() - 0.5)*(boardHight/2);
    let randomSpiderDirrection = Math.floor(Math.random()*2);
    let spider = {
        img : spiderImg,
        x : spiderX,
        y : randomSpiderY,
        width : spiderWidth,
        height : spiderHeight,
        dirrection : randomSpiderDirrection
    }

    spiderArray.push(spider);
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
            dragonArray = [];
            spiderArray = [];
            score = 0;
            gameState = 0;
            gearArray = [];
            gearscore = 0;
            velosityX = -2;
            scaleImg = 10;
            clearInterval(bartimer1);
            clearInterval(bartimer2);
            clearInterval(difbartimer1);
            clearInterval(difbartimer2);
        }
        else if (gameState == 0) {
            musicBG.play();
            bartimer1 = setInterval(placePipes, 10000); //every 10 sec.
            bartimer2 = setInterval(placeGears, 2000); //every 2 sec.
            difbartimer1 = setInterval(placeDragons, 6000); //every 6 sec.
            difbartimer2 = setInterval(placeSpiders, 6500); //every 6,5 sec.
            gameState = 1;
            difficultyState = 0;
            musicGOYes = true;
        }
        else if (gameState == 3 && e.code == "KeyX") {
            context.clearRect(0, 0, board.width, board.height);
            bird.y = birdY;
            pipeArray = [];
            dragonArray = [];
            spiderArray = [];
            score = 0;
            gameState = 0;
            gearArray = [];
            gearscore = 0;
            velosityX = -2;
            scaleImg = 10;
            clearInterval(bartimer1);
            clearInterval(bartimer2);
            clearInterval(difbartimer1);
            clearInterval(difbartimer2);
        }
    }
}



function detectCollision(a,b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x && 
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}