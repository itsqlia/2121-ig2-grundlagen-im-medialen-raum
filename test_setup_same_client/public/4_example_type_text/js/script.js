// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

let randomHue = Math.round(Math.random() * 360);
let myColor = "hsl(" + randomHue + ", 100%, 50%)";

let content = document.getElementById("content");

window.addEventListener("keypress", keypressHandler);

function keypressHandler(e) {
    // Sending an event 
    socket.emit('serverEvent', {key:e.key, color:myColor});
}

// Incoming events 
socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    let newSpan = document.createElement('span');
    newSpan.style.color = message.color;
    let newLetter = document.createTextNode(message.key);
    newSpan.appendChild(newLetter);
    content.appendChild(newSpan);
});
