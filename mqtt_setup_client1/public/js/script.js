var body = document.getElementById("body");

var socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

socket.on('eventTrigger', function (msg) {
    console.log(msg);
    console.log(body)
    body.style.backgroundColor = msg;
});