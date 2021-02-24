// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help all connected users to know where the message came from
let myUserID = Math.round(Math.random() * 1000000);


// Your script starts here ---------------------------------------


function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(255, 128, 0);
}

function draw() {
    // put drawing code here
}

function mouseDragged() {
    //console.log(mouseX, mouseY);

    // Sending an event 
    socket.emit('serverEvent', myUserID, mouseX, mouseY);
}

// Incoming events 
socket.on('serverEvent', function (user, x, y) {
    //console.log("Incoming event: ", user, x, y);
    
    if (user == myUserID) { 
      fill(128, 80);
    } else {
      fill(255, 128, 0);
    }

    circle(x, y, 20);
});

