// Connecting to server. Don't touch this :-) 
let socket = io();


// Your script starts here ------------------------------------------------------

let myPlayerIndex = 0;
let playerColors = ['#f80', '#08f', '#80f', '#0f8', '#8f0', '#f08']
let playerCount = 0;
let whosTurn = 0;

let shipCounter = 0;
let shipNumber = 0;

let gridSize = 10;
$('.wrapper').children().remove();
$('.wrapper').css("grid-template-columns", "repeat(" + gridSize + ", 50px)");
for (let i = 0; i < gridSize * gridSize; i++) {
    $('.wrapper').append('<div class="cell empty"></div>');
}

let setArray = []
let arrayFilter = [];

$('.ship4').click(function () {
    $('.wrapperShip .cell').removeClass('active');
    $('.ship4').addClass('active');
    setArray = ["start"];
    shipCounter = 4;
    shipNumber = 4;
});

$('.ship3').click(function () {
    $('.wrapperShip .cell').removeClass('active');
    $('.ship3').addClass('active');
    setArray = ["start"];
    shipCounter = 3;
    shipNumber = 3;
});

$('.ship2').click(function () {
    $('.wrapperShip .cell').removeClass('active');
    $('.ship2').addClass('active');
    setArray = ["start"];
    shipCounter = 2;
    shipNumber = 2;
});

$('.ship1').click(function () {
    $('.wrapperShip .cell').removeClass('active');
    $('.ship1').addClass('active');
    setArray = ["start"];
    shipCounter = 1;
    shipNumber = 1;
});


$('.wrapper .cell').click(function () {
    if (shipCounter > 0) {
        checkPosition($(this));
    } 
});

function checkPosition(that) {

    if (setArray[0] != "start") {

        if (shipCounter == shipNumber - 1) {
            arrayFilter = setArray.filter(function (element) {
                return that.index() == element - 10 || that.index() == element + 10 || that.index() == element - 1 || that.index() == element + 1;
            })

            if (that.index() == setArray[0] - 1 || that.index() == setArray[0] + 1) {
                shipOrientation = "horizontal";
            } else {
                shipOrientation = "vertical";
            }
        } else {
            if (shipOrientation == "horizontal") {
                arrayFilter = setArray.filter(function (element) {
                    return that.index() == element - 1 || that.index() == element + 1;
                })
            } else {
                arrayFilter = setArray.filter(function (element) {
                    return that.index() == element - 10 || that.index() == element + 10;
                })
            }
        }

        if (arrayFilter.length != 0) {
            that.addClass('set');
            shipCounter--;
            setArray.push(that.index());
        }
    } else {
        setArray = [];
        that.addClass('set');
        shipCounter--;
        setArray.push(that.index());
    }

    if (shipCounter == 0) {
        $('.ship'+shipNumber).addClass('ready');
    } 

}



// Incoming events 
socket.on('connected', function (msg) {
    console.log(msg);
    socket.emit('serverEvent', { type: "reset" });
});

socket.on('serverEvent', function (message) {
    console.log("Incoming event: ", message);

    if (message.type == "reset") {
        whosTurn = 0;
        $('.cell').addClass("empty");
        $('.cell').removeClass("set");
    }

    if (message.type == "played") {
        let cell = $('.wrapper').children()[message.cellIndex];
        cell = $(cell);
        cell.removeClass("empty");
        cell.css("background-color", playerColors[message.playerIndex]);
        whosTurn++;
        if (whosTurn >= playerCount) {
            whosTurn = 0;
        }
        updateStatus();
    }

});

socket.on('newUsersEvent', function (myID, myIndex, userList) {
    console.log("New users event: ");
    console.log("That's me: " + myID);
    console.log("My index in the list: " + myIndex);
    console.log("That's the new users: ");
    console.log(userList);

    playerCount = userList.length;
    myPlayerIndex = myIndex;

    updateStatus();
});

function updateStatus() {
    $('#player-status').html("There are " + playerCount + " players connected");

    $('#playcolor').css("background-color", playerColors[myPlayerIndex]);
    $('body').css("background-color", playerColors[myPlayerIndex] + "4"); // background color like playing color but less opacity

    if (whosTurn == myPlayerIndex) {
        $('#turn-status').html("It's your turn.");
    } else {
        $('#turn-status').html("Waiting for player " + (whosTurn + 1) + ".");
    }
}

