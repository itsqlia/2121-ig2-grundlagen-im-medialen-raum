// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

// Sending a userID will help all connected users to know where the message came from
let myUserID = "Maler_in";


// Your script starts here ---------------------------------------

let body = document.getElementById("body");


// Incoming events 
socket.on('serverEvent', function (user, message) {
    console.log("Incoming event: ", user, message);
    body.style.backgroundColor = message;
});
