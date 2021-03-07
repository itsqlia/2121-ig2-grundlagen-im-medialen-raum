// Connecting to server. Don't touch this :-) 
let socket = io();


// Your script starts here ------------------------------------------------------

let userNameElement = document.querySelector("#username");
let userColorElement = document.querySelector("#usercolor");
let chatMessagesElement = document.querySelector(".chat-messages");
let newMessageElement = document.querySelector("textarea#newmessage");

// Get the stored username so you don't have to type it in when reloading
userNameElement.value = localStorage.getItem('simpleChatUserName');
let userColor = textToColor(userNameElement.value);
userColorElement.style.backgroundColor = userColor;

// listen to changes in the textfield to send the message if a return happens
newMessageElement.addEventListener("input", function(e) {
    // in Chrome, a return does NOT give "insertLineBreak" but "insertText" with data = null
    if(e.inputType == "insertLineBreak" || (e.inputType == "insertText" && e.data == null)) {
        // Get text from textarea and remove spaces and return at the end
        let messageText = newMessageElement.value.trim();
        // Clear textarea
        newMessageElement.value = "";

        if (messageText != "") {
            // Get the name of the user from the input field
            let name = userNameElement.value;
            // Send the message out
            socket.emit('serverEvent', {type:"message", from:name, text:messageText, color:userColor});
        }

    }
 
});

// listen to changes of the username to store it locally
userNameElement.addEventListener("input", function(e) {
    userColor = textToColor(userNameElement.value);
    userColorElement.style.backgroundColor = userColor;
    localStorage.setItem('simpleChatUserName', username.value);
});


// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "message") {
        let now = new Date();
        let newDiv = document.createElement("div");
        newDiv.className = "message";
        newDiv.style.backgroundColor = message.color;
        // Add class "own", if the sending user was me
        if (message.from == userNameElement.value) {
            newDiv.className += " own";
            newDiv.innerHTML = "<div class='header'>" + now.toLocaleTimeString() + "</div>"
        } else {
            newDiv.innerHTML = "<div class='header'>" + message.from + " at " + now.toLocaleTimeString() + "</div>"
        }
        newDiv.innerHTML += "<div class='text'>" + message.text + "</div>";

        chatMessagesElement.prepend(newDiv);
        chatMessagesElement.scrollTo(0, 0);
    }

});


function textToColor(text) {
    text = text.replaceAll(/[\s\-äöüß]/g, "");
    let val = parseInt(text, 36);
    let hue = val % 360;
    let crom = val % 47;
    let color = chroma.lch(70, 30 + crom, hue).hex();
    return color;
}