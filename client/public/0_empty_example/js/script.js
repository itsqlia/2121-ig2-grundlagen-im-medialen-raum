// Connecting to server. Don't touch this :-) 
let socket = io();



socket.on('connected', function (msg) {
    console.log(msg);
});


let HEIGHT;
let WIDTH;
let MOUSEX;
let step = false
let bounce = false
let running = true
let gameover = false

// let blocks = [{
//   x: 200,
//   y: 200,
//   w: 100,
//   h: 400
// },
// {
//   x: 400,
//   y: 50,
//   w: 400,
//   h: 50
// },
// {
//   x: 400,
//   y: 200,
//   w: 50,
//   h: 50
// }]

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

let blocks = []
  // new Block (200,200,100,400,"black"),
  // new Block (400,50,400,50,"green"),
  // new Block (400,200,50,50,"pink"),
  for (i = 0; i < 40; i++){
    blocks[i] = new Block(i*50 ,50, 48, 20, "lightgreen")
  }

let racket = new Block(300,300,150,20,"cyan")

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
    if (running || step) {
      this.pos.x = this.pos.x + this.move.x
      this.pos.y = this.pos.y + this.move.y
    }
    if (this.pos.x < this.size / 2 || this.pos.x > windowWidth - this.size / 2) {
      this.move.x = -this.move.x
    }
    if (this.pos.y < this.size / 2 || this.pos.y > windowHeight - this.size / 2) {
      this.move.y = -this.move.y
    }

    if (this.hits(racket)) {
      if ((((this.pos.y + this.size / 2) == racket.y) || // ball above obj
          (this.pos.y == (racket.y + racket.h)))) {


        this.move.y = -this.move.y;
        this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)


      } else if ((((this.pos.x + this.size / 2) == racket.x) || // ball left of obj
          (this.pos.x == (racket.x + racket.w)))) {


        this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)
        this.move.x = -this.move.x;

      }
}

    blocks.forEach((block, i) => {
      if (this.hits(block)) {
        if ((((this.pos.y + this.size / 2) == block.y) || // ball above obj
            (this.pos.y == (block.y + block.h)))) {
              block.y = 0;
              block.x = 0;
              block.w = 0;
              block.h = 0;
          this.move.y = -this.move.y;
          this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)


        } else if ((((this.pos.x + this.size / 2) == block.x) || // ball left of obj
            (this.pos.x == (block.x + block.w)))) {
              block.y = 0;
              block.x = 0;
              block.w = 0;
              block.h = 0;
          this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)
          this.move.x = -this.move.x;

        }

      }
    });

  }

  keyPressed() {

    switch (keyCode) {

      // stop start durch leertaste
      case 32:
        running = !running;
        break;
        //Richtungswechsel
      case LEFT_ARROW:
        if (this.move.x > 0) {
          this.move.x = -this.move.x
        };
        console.log('L')
        break;
      case RIGHT_ARROW:
        if (this.move.x < 0) {
          this.move.x = -this.move.x
        };
        console.log('R')
        break;
      case 38:
        if (this.move.y > 0) {
          this.move.y = -this.move.y
        };
        break;
      case 40:
        if (this.move.y < 0) {
          this.move.y = -this.move.y
        };
        break;



        // + für schneller
      case 187:
        this.move.x = this.move.x * 1.2;
        this.move.y = this.move.y * 1.2;
        break;

        // - für langsamer
      case 189:
        this.move.x = this.move.x / 1.2;
        this.move.y = this.move.y / 1.2;
        break;

      case 83: // s
        step = true
        break;

      default:
        console.log("KeyCode ist: " + keyCode)
    }

  }

  hits(obj) {
    return !(
      (((this.pos.y + this.size / 2) < (obj.y)) || // ball above obj
        (this.pos.y > (obj.y + obj.h))) || // ball under obj
      (((this.pos.x + this.size / 2) < obj.x) || // ball left of obj
        (this.pos.x > (obj.x + obj.w))) // ball right of obj
    )
  }

}

let ball2 = new Ball({
  x: 10,
  y: 300
}, 'red', 20)


function setup() {
  createCanvas(windowWidth, windowHeight)

  frameRate(30)
  let c = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  fill(c);

}

function draw() {
  if (gameover == false){
    background(50);
}
  if (ball2.pos.y > windowHeight - ball2.size / 2){
    ball2.size = 0;
    background("red");
    text("GAME OVER",windowWidth/2, windowHeight/2,);
    gameover = true;
    
  }



  blocks.forEach((block, i) => {
    block.show()
  });
  ball2.update()
  ball2.show()
  step = false
  racket.show()
  racket.x = mouseX
  racket.y = 600

}

function keyPressed() {
  ball2.keyPressed(keyCode)
  return false;
}

// Incoming events 
socket.on('serverEvent', function (message) {


});
