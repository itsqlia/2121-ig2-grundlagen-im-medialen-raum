// Connecting to server. Don't touch this :-) 
let socket = io();

// Sending a userID will help to know if the message came from me or from others
let myUserID = Math.random().toString(36).substr(2, 9).toUpperCase();


// Your script starts here ------------------------------------------------------


function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    fill(255, 128, 0);
}

function draw() {
    // put drawing code here
}

function mouseDragged() {
    // Sending an event 
    socket.emit('serverEvent', {user:myUserID, type:"draw", x:mouseX, y:mouseY});
}

function keyPressed() {
    if (key == " ") {
        socket.emit('serverEvent', {user:myUserID, type:"reset"});
    }
}

// Event when connecting 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', {user:myUserID, type:"reset"});
});


// Incoming events 
socket.on('serverEvent', function (message) {
    //console.log("Incoming event: ", user, x, y);
    
    if (message.type == "draw") {
        if (message.user == myUserID) { 
          fill(128, 80);
        } else {
          fill(255, 128, 0, 100);
        }

        circle(message.x, message.y, 20);
    }

    if (message.type == "reset") {
        background(255);
    }

});

