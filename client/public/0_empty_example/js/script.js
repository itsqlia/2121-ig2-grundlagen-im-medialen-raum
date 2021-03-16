// Connecting to server. Don't touch this :-) 
let socket = io();



socket.on('connected', function (msg) {
    console.log(msg);
});

let pos = {
    x: 0,
    y: 0
  }
  let move = {
    x: 13,
    y: 22,
    v: 0
  }
  
  function setup() {
    createCanvas(windowWidth, windowHeight);
  }
  
  function draw() {
    background(220);
    pos.x = pos.x + move.x
    pos.y = pos.y + move.y
    
    rect(mouseX-100,windowHeight -100, 200, 50)
    ellipse(pos.x,pos.y,50)
  }

// Incoming events 
socket.on('serverEvent', function (message) {

});
