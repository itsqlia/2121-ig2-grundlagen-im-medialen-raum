// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help all connected users to know where the message came from
let myUserID = Math.round(Math.random() * 1000000);


// Your script starts here ---------------------------------------

let body = document.getElementById("body");
var buttons = document.getElementsByClassName("button")

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', clickEvent);
}

function clickEvent(e) {
    var bgColor = e.target.className.replace("button ","");

    // Sending an event 
    socket.emit('serverEvent', myUserID, bgColor);
}

// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
    body.style.backgroundColor = message;
});
