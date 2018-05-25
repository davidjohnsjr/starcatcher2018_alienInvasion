 // laser beam function's object
 var laser = {
    _x: null,
    _y: null,
    _rot: null,
    _xSpeed: null,
    _ySpeed: null,
    //Create new star object with given starting position and speed
    //class functions exist to set other private variables
    create: function (x, y, r, p) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj._rot = r;
        obj._sizeX = 10;
        obj._sizeY = 10;
        obj._xSpeed=0;
        obj._ySpeed=0;
        obj._img = new Image();
        obj._img.src="images/laser.jpg";
        obj._visible = true;
        obj._wp = p;
        return obj;
    },
    //Update the new x and y of the star based on the speed.
    //drawing functionality is left for calling class
    //no input or return
    update: function () {
        this._ySpeed = 10*Math.sin(this._rot)/2;
        this._y += this._ySpeed;
        //console.log(this._y, this._ySpeed, this._xSpeed, this._x);
        this._xSpeed = 10*Math.cos(this._rot)/2;
        this._x += this._xSpeed;
    },
};

  // the objects to avoid or collect will be in this class object   
 var star = {
    _x: null,
    _y: null,
    _xSpeed: null,
    _ySpeed: null,
    _visible: true,

    //Create new star object with given starting position and speed
 
    create: function (x, y, xSpeed, ySpeed) {
        var obj = Object.create(this);
        obj._x = x;
        obj._y = y;
        obj._sizeX = 50;
        obj._sizeY = 50;
        obj._xSpeed=xSpeed;
        obj._ySpeed=ySpeed;
        obj._img = new Image();
        obj._img.src="images/alien.png";
        return obj;
    },

    setImage: function(img){
        this._img.src=img;
    },
    setSize: function(width,height){
        this._sizeX = width;
        this._sizeY = height;
    },

    //Update the new x and y of the star based on the speed.
    //drawing functionality is left for calling class
    //no input or return
    update: function () {
        this._x+=this._xSpeed;
        this._y+=this._ySpeed;
    },
};
        

// StarCatcher Scripts for the game made by Soft Dev 2015
    // when the web page window loads up, the game scripts will be read
window.onload = function() {
    //load canvas
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d"),
        w = canvas.width = 800,
        h = canvas.height = 500;

    var gameOn = false, gameStart = true, pause = true;
    var sc = 5, deadStars =0;

    //load images and x y location for images
    var background = new Image();
    background.src="images/background.jpg";

    var player1Img = new Image();
    player1Img.src="images/spaceship3.jpg";
    var p1x=3/4 * w, p1y=h/2;
    var player2Img = new Image();
    player2Img.src="images/spaceship1.png";
    var p2x=w/4, p2y=h/2;
    var p1Score = 0, p2Score = 0;
    var p1_rot = 0, p2_rot = 0;
    var p1Lives = 5, p2Lives = 5;

    // laser variables
    var laserCount=0, laserVisible=false;
    var laserArray =[];

// our stars are created using a single array with a class of information
    function createStars(sc)   {
        starCount=sc;
        starArray=[];
         // Create an array of stars
        for (var i = 0; i < starCount; i++) {
            // this assigns each element in the array all the information for the star by 
            // using the 'star' class, pass the starting x,y locations 
            //  and speeds into the array.
            if (i<starCount/2) {
                starArray.push(star.create(55,i+50,Math.random()*3,Math.random()*3));
            }
            else {starArray.push(star.create(w-55,i+50,-Math.random()*3,Math.random()*3));}

        } // end for
    } // end of createStars

    createStars(sc);

    // moving stars around the screen and update the players movement

    function starsUpdate () {
        ctx.drawImage(background,0,0,w,h);
        
    //  draw star on screen only if visible
        for (var i = 0; i < starCount; i++) {
            starArray[i].update();
            if (starArray[i]._visible){
                ctx.drawImage(starArray[i]._img, starArray[i]._x-25, starArray[i]._y-25, starArray[i]._sizeX, starArray[i]._sizeY);
            }
            if (starArray[i]._x>w-starArray[i]._sizeX || starArray[i]._x<0) {starArray[i]._xSpeed = -starArray[i]._xSpeed}
            if (starArray[i]._y>h-starArray[i]._sizeY || starArray[i]._y<0) {starArray[i]._ySpeed = -starArray[i]._ySpeed}
            var d1=Math.sqrt(Math.pow(p1x-starArray[i]._x,2)+Math.pow(p1y-starArray[i]._y,2));
            var d2=Math.sqrt(Math.pow(p2x-starArray[i]._x,2)+Math.pow(p2y-starArray[i]._y,2));
            if (d1<50) {playerLives(i,1)}
            if (d2<50) {playerLives(i,2)}
        }  // endFor
           
    }  // end starsUpdate

    // a new array is made to keep track of a button being held down
    var keysDown = [];

    // if the key is held down, the keycode is placed in array
    // then it is deleted upon keyup command.  
    // playerUpdate will now control player movements and use the keysDown array

    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);

    //  player 2 movement keyboard commands
    addEventListener("keyup", function (e) {

        if (e.keyCode == 87) { //  (key: w )
            p2y-=10;
        }
        else if (e.keyCode == 83) { //  (key: s)
            p2y+=10;
        }
        else if (e.keyCode == 65) { //  (key: a)
            p2x-=10;
        }
        else if (e.keyCode == 68) { //  (key: d)
            p2x+=10;
        }
        else if (e.keyCode == 32) { //  (key: space)
            gameOn = !gameOn;
            pause = !pause;
            main();
            console.log(gameOn,pause,gameStart,starArray);
        }
        if (e.keyCode == 70) { //  (key: f)
            p2_rot -= (1/36)*Math.PI;
         }
        if (e.keyCode == 71) { //  (key: g)
            p2_rot -= (1/36)*Math.PI;
        }
        if (e.keyCode == 82) { //  (key: r)
            laserCount ++;
            laserArray.push(laser.create(p2x,p2y,p2_rot,2));
        }
        //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false); 

    //Listens to app for keyboard actions
    addEventListener("keyup", function (e) {

        if (e.keyCode == 38) { //  (key: up arrow)
            p1y-=10;
        }
        if (e.keyCode == 40) { //  (key: down arrow)
            p1y+=10;
        }
        if (e.keyCode == 37) { //  (key: left arrow)
            p1x-=10;
        }
        if (e.keyCode == 39) { //  (key: right arrow)
            p1x+=10;
        }
        if (e.keyCode == 77) { //  (key: m)
            p1_rot += (1/36)*Math.PI;
        }
        if (e.keyCode == 78) { //  (key: n)
            p1_rot -= (1/36)*Math.PI;
        }
        if (e.keyCode == 76) { //  (key: l)
            laserCount ++;
            laserArray.push(laser.create(p1x,p1y,p1_rot,1));
        }
                    
        //take keycode out of array (not being held down anymore)
        delete keysDown[e.keyCode];
    }, false);    

     //player movement
    function playerUpdate() {
        //player two hodling down a key using the array keysDown
        if (87 in keysDown) {// P2 holding down the w key
            p2y -= 5;
        }
        if (83 in keysDown) { // P2 holding down (key: s)
            p2y += 5;
        }
        if (65 in keysDown) { // P2 holding down (key: a)
            p2x -= 5;
        }
        if (68 in keysDown) { // P2 holding down (key: d)
            p2x += 5;
        }
        if (70 in keysDown) { // P2 holding down (key: f)
            p2_rot -= (1/36)*Math.PI;
            rotatePlayer(p2x,p2y,p2_rot,player2Img);
        }
        if (71 in keysDown) { // P2 holding down (key: g)
            p2_rot += (1/36)*Math.PI;
            rotatePlayer(p2x,p2y,p2_rot,player2Img);
        }

        // player one hodling key down
        if (37 in keysDown) { // P2 holding down (key: left arrow)
            p1x -= 5
        }
        if (38 in keysDown) { // P2 holding down (key: up arrow)
            p1y -= 5;
        }
        if (39 in keysDown) { // P2 holding down (key: right arrow)
            p1x += 5;
        }
        if (40 in keysDown) { // P2 holding down (key: down arrow)
            p1y += 5;
        }
        if (77 in keysDown) { // P2 holding down (key: m)
            p1_rot += (1/36)*Math.PI;
            rotatePlayer(p1x,p1y,p1_rot,player1Img);
        }
        if (78 in keysDown) { // P2 holding down (key: n)
            p1_rot -= (1/36)*Math.PI;
            rotatePlayer(p1x,p1y,p1_rot,player1Img);
        }

        //draw images of ships
        
        rotatePlayer(p1x,p1y,p1_rot,player1Img);
        rotatePlayer(p2x,p2y,p2_rot,player2Img);
        
    } // end playerUpdate

    function rotatePlayer(x,y,r,p) {
            // save the current images on the canvas
            ctx.save();
            // move to the center of the canvas
            ctx.translate(x+20,y+20);
            // rotate the canvas to the specified degrees
            ctx.rotate(r);
            // draw image on rotated canvas (thus looking rotated when canvas restored)
            ctx.drawImage(p, -20, -20, 40, 40);
            // restore the previous screen of images
            ctx.restore();
    }  // end rotatePlayer

    function laserBeam() {

        //  draw laser on screen only if selected
        for (var i = 0; i < laserCount; i++) {
            laserArray[i].update();
            if (laserArray[i]._visible){
                ctx.drawImage(laserArray[i]._img, laserArray[i]._x, laserArray[i]._y, laserArray[i]._sizeX, laserArray[i]._sizeY);
                if (laserArray[i]._x>w || laserArray[i]._x<0) {laserArray[i]._xSpeed = 0; laserArray[i]._visible=false;}
                if (laserArray[i]._y>h || laserArray[i]._y<0) {laserArray[i]._ySpeed = 0; laserArray[i]._visible=false;}
                for (var k = 0; k < starCount; k++){
                    if (Math.abs(laserArray[i]._x-starArray[k]._x)<40 & Math.abs(laserArray[i]._y-starArray[k]._y)<20) {
                        if (laserArray[i]._wp==1){scoring(i,k,1);}
                        else {scoring(i,k,2)}
                    }

                } //endFor
            } //end if visible
        }//endFor
           
    }  // end laserBeam
    
    // managing the lives lost
    function playerLives(i,wp) {
        if (wp==1) {
            p1Lives--;
            if (p1Lives==0) {p1x=w+5000}
            else {p1x = Math.random()*w;}
            $("#p1LivesDisp").text(p1Lives);
            p1y = Math.random()*h;

        } // end if wp
        else {
            p2Lives--;
            if (p2Lives==0) {p1x=w+5000}
            else {p2x = Math.random()*w;}
            $("#p2LivesDisp").text(p2Lives);
            p2y = Math.random()*h;

        } // end else
        starArray[i]._x = w+90;
        starArray[i]._visible == false;
        deadStars++;
        if (deadStars == sc) {
            sc = sc+5;
            createStars(sc);
            deadStars=0;
        }
    }

  //  scoring functions to place and score stars
    function scoring(i,k,wp) {
        deadStars++;
        starArray[k]._visible = false;
        starArray[k]._x =w+90;
        laserArray[i]._visible=false;
        laserArray[i]._x=w+90;
        if (wp==1) {        
            p1Score++;
            $("#p1ScoreDisp").text(p1Score);
        }
        else if (wp==2) {
            p2Score++;
            $("#p2LivesDisp").text(p2Lives);
            $("#p2ScoreDisp").text(p2Score);
        }
        if (deadStars == sc) {
            sc = sc+5;
            createStars(sc);
            deadStars=0;
        } 
        if (p1Score == 1) {
            gameOver(1);
        }
        if (p2Score == 3) {
            gameOver(2);
        }
         
    }  // end scoring
       

    function starter() {
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle="black";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle="white";
        ctx.font="30px Sans-Serif";
        ctx.fillText("Press Spacebar to Begin Game",w/4,h/2);
        gameStart=false;
    }
    function paused() {
        ctx.clearRect(0,0,w,h);
        ctx.fillStyle="darkblue";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle="white";
        ctx.font="30px Sans-Serif";
        ctx.fillText("Press Spacebar to Resume Game",w/4,h/2);
        ctx.fillText("Game is paused",w/4,h/4);
    }  // close paused

    function gameOver(wp) {

        ctx.fillStyle= "rgba(250,0,0,.4)";
        ctx.fillRect(50,50,w-100,h-100);
        ctx.fillStyle="black";
        ctx.font="30px Sans-Serif";
        if (wp==1){
            ctx.fillText("Game over, Player one Wins",w/4,h/2);
        }
        if (wp==2){
            ctx.fillText("Game over, Player two Wins",w/4,h/2);
        }
        gameOn = false;
        setTimeout(function() {restarter()},3000);
    }  // close gameover

    function restarter() {
        pause = true;
        p1Score = 0, p2Score =0;
        var p1x=3/4 * w, p1y=h/2;
        var p2x=1/4 * w, p2y=h/2;
        sc = 5, deadStars = 0;
        $("#p1ScoreDisp").text(p1Score);
        $("#p2ScoreDisp").text(p2Score);
        p1Lives = 5, p2Lives = 5, p1_rot = 0, p2_rot =0;
        $("#p1LivesDisp").text(p1Lives);
        $("#p2LivesDisp").text(p2Lives);
        createStars(sc);
        starter();
    }// close restarter

    //Our main function which clears the screens 
    //  and redraws it all again through function updates,
    //  then calls itself out again
    function main(){
        ctx.clearRect(0,0,w,h);
        starsUpdate();
        playerUpdate();
        laserBeam();
        if (gameOn) {requestAnimationFrame(main);}
        if (pause) {paused();}
        if (gameStart) {starter();}

    }
    main();
        
}                 
  