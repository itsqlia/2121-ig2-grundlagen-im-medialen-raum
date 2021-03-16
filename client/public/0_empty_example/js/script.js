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

    if (this.intersect(racket)) {
      

        this.move.y = -this.move.y;
        this.color = color(Math.random() * 256, Math.random() * 256, Math.random() * 256)  
        
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

  }}

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
  //if (gameover == false){
    background(50);

    
//}
  // if (ball2.pos.y > windowHeight - ball2.size / 2){
  //   ball2.size = 0;
  //   background("red");
  //   text("GAME OVER",windowWidth/2, windowHeight/2,);
  //   gameover = true;
    
//}



  
 
  ball2.update()
  ball2.show()
  step = false
  racket.show()
  // racket.x = mouseX
  racket.y = windowHeight - 100;
  tastendruck();
}



// Incoming events 
socket.on('serverEvent', function (message) {

  if(message == "Racket1Left"){

    racket.x -= 10

  }

  if(message == "Racket1Right"){

    racket.x += 10

  }

});

function tastendruck() {

  if (keyIsDown(37)) {
    
    socket.emit('serverEvent', "Racket1Left")
    
  } else if (keyIsDown(39)) {
    
    socket.emit('serverEvent', "Racket1Right")
      
  } 


}