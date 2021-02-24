var socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


var body = document.getElementById("body");

socket.on('eventTrigger', function (msg) {
    console.log(msg);
    body.style.backgroundColor = msg;
});