// Connecting to server. Don't touch this :-) 
var socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help all connected users to know where the message came from
let myUserID = "Farbenchef_in";


// Your script starts here ---------------------------------------

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
});