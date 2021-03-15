// Connecting to server. Don't touch this :-) 
let socket = io();
socket.on('connected', function (msg) {
    console.log(msg);
});


// Your script starts here ------------------------------------------------------

let content = document.getElementById("content");


// Incoming events 
socket.on('serverEvent', function () {
    //console.log("Incoming event: ", arguments);
});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    // console.log("New users event: ");
    // console.log("That's the new users: ");
    // console.log(userList);

    let htmlText = "That's me: " + myID + "<br><br>";
   
    userList.sort((a, b) => a.topic > b.topic);

    if (userList.length > 0) {
        for (var i = 0; i < userList.length; i++) {
            let connectionDate = new Date(userList[i].since);
            htmlText += userList[i].id + " | " + connectionDate.toLocaleString() + " | " + userList[i].topic + "<br>";
        }
    
    } else {
        htmlText += "Nobody else is here :-("
    }

    content.innerHTML = htmlText;
});

