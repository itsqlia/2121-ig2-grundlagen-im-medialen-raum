// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

// let whosthereButton = document.getElementById("whosthere");
let content = document.getElementById("content");

// whosthereButton.addEventListener("click", function(e) {
//     socket.emit('whosThereEvent');
// });



// Incoming events 
socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);
});

socket.on('newUsersEvent', function (myID, userList) {
    console.log("New users event: ");
    console.log("That's me: " + myID);
    console.log("That's the new users: ");
    console.log(userList);

    let htmlText = "That's me: " + myID + "<br><br>";
    for (var i = 0; i < userList.length; i++) {
        let connectionDate = new Date(userList[i].since);
        htmlText += userList[i].user + " is connected since " + connectionDate.toLocaleTimeString() + "<br>";
    }

    content.innerHTML = htmlText;

});

