// Connecting to server. Don't touch this :-) 
let socket = io();



socket.on('connected', function (msg) {
  console.log(msg);
});

let myPlayerIndex = 0;
let myPlayerIndexOffset = 0;
let playerCount = 0;
let HEIGHT = 1080;
let WIDTH = 1920;
let MOUSEX;
let step = false
let bounce = false

let running = false
let runningBall = false

let gameover = false
let notReady = true;

let myIndex;

let score = 0;
let stopScore = false;


let ballStickLeft = false;
let ballStickRight = false;

let pigSpeed = 7;


class Block {
  constructor(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
  }

  show() {
    fill(this.color)
    rect(this.x, this.y, this.w, this.h)
  }




}
let racket1 = new Block(50, HEIGHT / 2, 40, 150, "cyan")
let racket2 = new Block(50, HEIGHT / 2, 40, 150, "cyan")

// OOP final
class Ball {

  constructor(pos, color, size) {
    this.pos = pos
    this.color = color
    this.size = size
    this.move = {
      x: 10,
      y: 10
    }
  }

  show() {
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  update() {
    if (running && runningBall) {
      this.pos.x = this.pos.x + this.move.x
      this.pos.y = this.pos.y + this.move.y
    }
    if (this.pos.x < 35|| this.pos.x > (WIDTH-35) - this.size / 2) {
      this.move.x = -this.move.x
    }
    if (this.pos.y < this.size / 2 || this.pos.y > HEIGHT - this.size / 2) {
      this.move.y = -this.move.y
    }


    if (this.intersect(racket1)) {

      if(ball.pos.x < WIDTH/2){
        ball.pos.x += 15
      }
      else{
        ball.pos.x -= 15
      }

      if (stopScore == false) {

        score += 1;
        

      }
      hold();
      this.move.x = -this.move.x;
      this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)
      console.log("HIT")
    }

    if (this.intersect(racket2)) {

      if(ball.pos.x < WIDTH/2){
        ball.pos.x += 15
      }
      else{
        ball.pos.x -= 15
      }

      if (stopScore == false) {

        score += 1;

      }
      hold();
      this.move.x = -this.move.x;
      this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)
      console.log("HIT")
    }

    if (this.intersect(pig1)) {

      restart()
    }

    if (this.intersect(pig2)) {

      restart()
    }

  }





  intersect(obj) {
    let left = Math.max(this.pos.x - this.size / 2, obj.x)
    let right = Math.min(this.pos.x + this.size / 2, obj.x + obj.w)
    let top = Math.max(this.pos.y - this.size / 2, obj.y)
    let bottom = Math.min(this.pos.y + this.size / 2, obj.y + obj.h)
    if (right >= left && bottom >= top) {
      return {
        x: left,
        y: top,
        w: right - left,
        h: bottom - top
      }
    }

  }
}

let ball = new Ball({
  x: WIDTH / 2,
  y: HEIGHT / 2
}, 'red', 20)


class Pig {
  constructor(x, y, w, h, color) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.color = color
  }

  show() {
    fill(this.color)
    rect(this.x, this.y, this.w, this.h)
  }


}

let pig1 = new Pig(WIDTH / 2, HEIGHT / 3, 50, 50, "pink")
let pig2 = new Pig(WIDTH / 2, (HEIGHT / 3) * 2, 50, 50, "pink")



function setup() {

  createCanvas(WIDTH, HEIGHT)
  let c = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  fill(c);



}

function draw() {

  background(50);

  // push();
  // fill(100,100,100);
  // noStroke();
  // rect(0,0,40,1080);
  // rect(1880,0,40,1080);
  // pop();

  if (myPlayerIndex == 0) {

    socket.emit('serverEvent', "step")

  }

  fill("white");
  textAlign(CENTER);
  textSize(30);
  text("Score  " + score, WIDTH / 2, 50)


  if (notReady) {
    fill("white")
    textSize(36);
    textAlign(CENTER);
    text("Press 'Enter' to Start!", WIDTH / 2, HEIGHT / 6)
  }

  ball.show()
  step = false
  racket1.show()
  racket2.show()

  push();
  rectMode(CENTER);
  pig1.show();
  pig2.show();
  pop();

  // racket.x = mouseX
  racket1.x = WIDTH - 40;
  racket2.x = 0;
  tastendruck();

}



// Incoming events 
socket.on('serverEvent', function (message) {

  if (message == "Racket1Up") {

    racket1.y -= 10

  }

  if (message == "Racket1Down") {

    racket1.y += 10

  }

  if (message == "Racket2Up") {

    racket2.y -= 10

  }

  if (message == "Racket2Down") {

    racket2.y += 10

  }

  if (message == "Pig1Up") {

    pig1.y -= pigSpeed

  }

  if (message == "Pig1Down") {

    pig1.y += pigSpeed

  }

  if (message == "Pig1Left") {

    pig1.x -= pigSpeed

  }

  if (message == "Pig1Right") {

    pig1.x += pigSpeed
  }

  if (message == "Pig2Up") {

    pig2.y -= pigSpeed

  }

  if (message == "Pig2Down") {

    pig2.y += pigSpeed

  }

  if (message == "Pig2Left") {

    pig2.x -= pigSpeed

  }

  if (message == "Pig2Right") {

    pig2.x += pigSpeed
  }

  //step

  if (message == "step") {
    ball.update()
  }

  //reset
  if (message == "reset") {
    running = true;
    runningBall = true;
    notReady = false;
  }

  if (message == "BallUp") {

    ball.pos.y -= 10

  }

  if (message == "BallDown") {

    ball.pos.y += 10

  }

  if (message == "PlayBall") {
   
    runningBall = true;
    ballStickLeft = false;
    ballStickRight = false;
    stopScore = false;


  }

});

function tastendruck() {

  let myPlayerRole = (myPlayerIndex + myPlayerIndexOffset) % 4;

  if (running == true) {


    if (keyIsDown(38)) {

      if (myPlayerRole == 0) {
        socket.emit('serverEvent', "Racket1Up")

        if (ballStickRight == true) {
          socket.emit('serverEvent', "BallUp")
        }
      }
      if (myPlayerRole == 1) {
        socket.emit('serverEvent', "Racket2Up")

        if (ballStickLeft == true) {
          socket.emit('serverEvent', "BallUp")
        }
      }
      if (myPlayerRole == 2) {
        socket.emit('serverEvent', "Pig1Up")
      }
      if (myPlayerRole == 3) {
        socket.emit('serverEvent', "Pig2Up")
      }


    } else if (keyIsDown(40)) {

      if (myPlayerRole == 0) {
        socket.emit('serverEvent', "Racket1Down")

        if (ballStickRight == true) {
          socket.emit('serverEvent', "BallDown")
        }
      }
      if (myPlayerRole == 1) {
        socket.emit('serverEvent', "Racket2Down")

        if (ballStickLeft == true) {
          socket.emit('serverEvent', "BallDown")
        }
      }
      if (myPlayerRole == 2) {
        socket.emit('serverEvent', "Pig1Down")
      }
      if (myPlayerRole == 3) {
        socket.emit('serverEvent', "Pig2Down")
      }
    }

    if (keyIsDown(37)) {

      if (myPlayerRole == 2) {
        socket.emit('serverEvent', "Pig1Left")
      }
      if (myPlayerRole == 3) {
        socket.emit('serverEvent', "Pig2Left")
      }

    } else if (keyIsDown(39)) {

      if (myPlayerRole == 2) {
        socket.emit('serverEvent', "Pig1Right")
      }
      if (myPlayerRole == 3) {
        socket.emit('serverEvent', "Pig2Right")
      }
    }

    if (keyIsDown(32)) {

      if (myPlayerRole == 0 && ballStickRight == true) {

        socket.emit('serverEvent', "PlayBall")

      }

      if (myPlayerRole == 1 && ballStickLeft == true) {

        socket.emit('serverEvent', "PlayBall")

      }
    }


  }

  if (keyCode == 13) {
    startGame();

  }
  // Deprecated code!
  window.addEventListener("keydown", function (e) {
    // space and arrow keys
    if ([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);



}
socket.on('newUsersEvent', function (myID, myIndex, userList) {
  console.log("New users event: ");
  console.log("That's me: " + myID);
  console.log("My index in the list: " + myIndex);
  console.log("That's the new users: ");
  console.log(userList);

  playerCount = userList.length;
  myPlayerIndex = myIndex;

  // updateStatus();

  // function updateStatus() {

  // }

});


// Click to start

function startGame() {
  socket.emit('serverEvent', "reset");
}

function restart() {
  score = 0;
  running = false;
  runningBall = false;
  ball.pos = { x: WIDTH / 2, y: HEIGHT / 2 };
  pig1.x = WIDTH / 2
  pig1.y = HEIGHT / 3
  pig2.x = WIDTH / 2
  pig2.y = (HEIGHT / 3) * 2
  setTimeout(startAgain, 3000);
  myPlayerIndexOffset +=2;

}

function startAgain() {
  running = true;
  runningBall = true;

}

function hold() {

  runningBall = false;
  stopScore = true;


  if (ball.pos.x < WIDTH / 2) {

    ballStickLeft = true;
  }

  if (ball.pos.x > WIDTH / 2) {

    ballStickRight = true;
  }

}