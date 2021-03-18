// Connecting to server. Don't touch this :-) 
let socket = io();

let engine
let blocks = []
let balls = []
let collisions = []
let layers = []
let ballVelocity = 10

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
let highScore = 0;


let ballStickLeft = false;
let ballStickRight = false;

let pigSpeed = 7;



class Block {
  constructor(type, attrs, options) {
    this.type = type
    this.attrs = attrs
    this.options = options
    this.hit = false
    this.options.plugin = { block: this, update: this.update }
    switch (this.type) {
      case 'rect':
        this.body = Matter.Bodies.rectangle(attrs.x, attrs.y, attrs.w, attrs.h, this.options)
        break
      case 'circle':
        this.body = Matter.Bodies.circle(attrs.x, attrs.y, attrs.s)
        break
      case 'points':
        let shape = Matter.Vertices.create(attrs.points, Matter.Body.create({}))
        this.body = Matter.Bodies.fromVertices(0, 0, shape, this.options)
        Matter.Body.setPosition(this.body, this.attrs)
        break
        case 'path':
          let path = document.getElementById(attrs.elem)
          if (null != path) {
            this.body = Matter.Bodies.fromVertices(0, 0, Matter.Vertices.scale(Matter.Svg.pathToVertices(path, 10), this.attrs.scale, this.attrs.scale), this.options)
            Matter.Body.setPosition(this.body, this.attrs)
          }
          break
    }
    Matter.World.add(engine.world, [this.body])
  
  }
  update(ball) {
    if (this.attrs.force) {
      Matter.Body.applyForce(ball, ball.position, this.attrs.force)
      
    }
  }
  show() {
    fill(this.attrs.color)
    drawBody(this.body)
  }


}


  // create an engine
  engine = Matter.Engine.create();


 

//rackets
 blocks.push(new Block('rect',{ x: 20, y: HEIGHT/2 , w: 40, h: 150, color: "cyan" }, { isStatic: false, density:500000}));
blocks.push(new Block('rect',{ x: WIDTH - 20, y: HEIGHT/2 , w: 40, h: 150, color: "cyan" }, { isStatic: false, density:500000,friction: 0}));
let racket2 =blocks[0].body
let racket1 = blocks[1].body

ball = Matter.Bodies.circle(WIDTH/2, HEIGHT/2, 20,{frictionAir:0, friction: 0 ,restitution: 1})
Matter.World.add(engine.world, ball)
balls.push(ball)



blocks.push(new Block('rect',{ x: WIDTH/2, y: HEIGHT/3 , w: 50, h: 50, color: "pink" }, { isStatic: false}));
blocks.push(new Block('rect',{ x: WIDTH/2, y: (HEIGHT/3)*2 , w: 50, h: 50, color: "pink" }, { isStatic: false}));
let pig1 = blocks[2].body
let pig2 = blocks[3].body


//wall borders
blocks.push(new Block('rect',{ x: -10, y: -10 , w: 20, h: 4000, color: "cyan" }, { isStatic: true}));
blocks.push(new Block('rect',{ x: -10, y: -10 , w: 4000, h: 20, color: "cyan" }, { isStatic: true}));
blocks.push(new Block('rect',{ x: WIDTH + 10, y: HEIGHT + 10 , w: 4000, h: 20, color: "cyan" }, { isStatic: true}));
blocks.push(new Block('rect',{ x: WIDTH + 10, y: HEIGHT +10 , w: 20, h: 4000, color: "cyan" }, { isStatic: true}));




  // Process collisions - check whether ball hits a Block object
  Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs
    pairs.forEach((pair, i) => {
      if (balls.includes(pair.bodyA)) {
        collide(pair.bodyB, pair.bodyA)

      }
      if (balls.includes(pair.bodyB)) {
        collide(pair.bodyA, pair.bodyB)
      }
    })
    // check for collision between Block and ball
    function collide(bodyBlock, bodyBall) {
      // check if bodyBlock is really a body in a Block class
      if (bodyBlock.plugin && bodyBlock.plugin.block) {
        // remember the collision for processing in 'beforeUpdate'
        collisions.push({ hit: bodyBlock.plugin.block, ball: bodyBall })

        
        ballVelocity =-ballVelocity;
       

      }
    }
  })

  Matter.Events.on(engine, 'beforeUpdate', function(event) {
    // process collisions at the right time
    collisions.forEach((collision, i) => {
      // "inform" blocks: got hit by a ball
      collision.hit.update(collision.ball)
    });
    collisions = []
   
   });
  








function startEngine() {
  if (0 == engine.timing.timestamp) {
    Matter.Engine.run(engine)
    engine.world.gravity.y =0;
  }
}


function setup() {

  createCanvas(WIDTH, HEIGHT)
  let c = color(Math.random() * 256, Math.random() * 256, Math.random() * 256);
  fill(c);
  startEngine();


}

function draw() {

  background(50);

  if (running && runningBall) {
    Matter.Body.setVelocity(ball, {x:ballVelocity,y:ballVelocity});
    
  }

  if (myPlayerIndex == 0) {

    socket.emit('serverEvent', "step")

  }

  fill("white");
  textAlign(CENTER);
  textSize(30);
  text("Score  " + score, WIDTH / 2, 50)

push();
  fill("red");
  textAlign(CENTER);
  textSize(30);
  text("High Score  " + highScore, WIDTH / 2, 90)
pop();


  if (notReady) {
    fill("white")
    textSize(36);
    textAlign(CENTER);
    text("Press 'Enter' to Start!", WIDTH / 2, HEIGHT / 6)
  }

  push();
  fill("yellow");
  balls.forEach(ball => drawBody(ball))
  pop();

  step = false
  blocks.forEach(block => block.show())

  push();
  rectMode(CENTER);

  pop();
  tastendruck();

}



// Incoming events 
socket.on('serverEvent', function (message) {

  if (message == "Racket1Up") {

    Matter.Body.translate(racket1, {x:0,y:-10});

  }

  if (message == "Racket1Down") {

    Matter.Body.translate(racket1, {x:0,y:10});

  }

  if (message == "Racket2Up") {

    Matter.Body.translate(racket2, {x:0,y:-10});

  }

  if (message == "Racket2Down") {

    Matter.Body.translate(racket2, {x:0,y:10});

  }

  if (message == "Pig1Up") {

   
    Matter.Body.translate(pig1, {x:0,y:-pigSpeed});
  }

  if (message == "Pig1Down") {

    Matter.Body.translate(pig1, {x:0,y:pigSpeed});

  }

  if (message == "Pig1Left") {

    Matter.Body.translate(pig1, {x:-pigSpeed,y:0});

  }

  if (message == "Pig1Right") {

    Matter.Body.translate(pig1, {x:pigSpeed,y:0});
  }

  if (message == "Pig2Up") {

    Matter.Body.translate(pig2, {x:0,y:-pigSpeed});

  }

  if (message == "Pig2Down") {

    Matter.Body.translate(pig2, {x:0,y:pigSpeed});

  }

  if (message == "Pig2Left") {

    Matter.Body.translate(pig2, {x:-pigSpeed,y:0});

  }

  if (message == "Pig2Right") {

    Matter.Body.translate(pig2, {x:pigSpeed,y:0});
  }

  //step

  if (message == "step") {
    //////////
  }

  //reset
  if (message == "reset") {
    running = true;
    runningBall = true;
    notReady = false;
  }

  if (message == "BallUp") {

  
    Matter.Body.translate(ball, {x:0,y:-10});

  }

  if (message == "BallDown") {

  
    Matter.Body.translate(ball, {x:0,y:10});

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

function drawBody(body) {
  if (body.parts && body.parts.length > 1) {
    body.parts.filter((part, i) => i > 0).forEach((part, i) => {
      drawVertices(part.vertices)
    })
  } else {
    if (body.type == "composite") {
      body.bodies.forEach((body, i) => {
        drawVertices(body.vertices)
      })
    } else {
      drawVertices(body.vertices)
    }
  }
}

function drawVertices(vertices) {
  beginShape()
  vertices.forEach((vert, i) => {
    vertex(vert.x, vert.y)
  })
  endShape(CLOSE)
}
  