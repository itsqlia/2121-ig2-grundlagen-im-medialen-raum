// Connecting to server. Don't touch this :-) 
let socket = io();


// Your script starts here ------------------------------------------------------

let userName = document.querySelector("input#username");
let chatMessages = document.querySelector(".chat-messages");
let newMessage = document.querySelector("textarea#newmessage");

newMessage.addEventListener("input", function(e) {

    if(e.inputType == "insertLineBreak") {
        // Get text from textarea and remove spaces and return at the end
        let messageText = newMessage.value.trim();
        // Get the name of the user from the input field
        let name = userName.value;
        // Send the message out
        socket.emit('serverEvent', {type:"message", from:name, text:messageText});
        // Clear textarea
        newMessage.value = "";
    }
 
});


// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "message") {
        console.log(message);
        let newDiv = document.createElement("div");
        newDiv.className = "message";
        // Add class "own", if the sending user was me
        if (message.from == userName.value) {
            newDiv.className += " own";
        }
        let now = new Date();
        newDiv.innerHTML = "<div class='header'>" + message.from + " at " + now.toLocaleTimeString() + "</div>"
        newDiv.innerHTML += "<div class='text'>" + message.text + "</div>";


        chatMessages.prepend(newDiv);
    }

});


