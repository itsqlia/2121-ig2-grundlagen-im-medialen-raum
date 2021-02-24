var socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});

var buttons = document.getElementsByClassName("button")

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', clickEvent);
}

function clickEvent(e) {
    var bgColor = e.target.className.replace("button ","");
    socket.emit('eventTrigger', bgColor);
}
