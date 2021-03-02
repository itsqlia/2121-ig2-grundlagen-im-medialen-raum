var express = require('express');
var app = express();

// get port number from arguments
var port = process.argv[2] || 3001;
app.set('port', port);
app.use('/', express.static(__dirname + '/public'));

// get topic from arguments
console.log(process.argv[3]);
var myTopic = process.argv[3] || "teamplayer";

var mqtt = require('mqtt');
var client = mqtt.connect("mqtt://mqtt.hfg.design:1883/");

var userID = Math.random().toString(36).substr(2, 9).toUpperCase();
console.log("You are user: " + userID);
var userIndex;
var connectionTimestamp = Date.now();

var usersConnected = [];
// For collecting users through whosThereEvent and imHereEvent
var usersCollect = [];
var usersCollectPending = false;

client.on('connect', function () {
    console.log("mqtt client connected");
    client.subscribe(myTopic + '/serverEvent', function (err) {});
    client.subscribe(myTopic + '/whosThereEvent', function (err) {});
    client.subscribe(myTopic + '/imHereEvent', function (err) {});
    // ask for users every 2 seconds to know if someone disconnected
    setInterval(function() {
        if (!usersCollectPending) {
            client.publish(myTopic + '/whosThereEvent', userID);
        }
    }, 2000);
})



// Incoming messages from mqtt broker
client.on('message', function (topic, message) {

    if (topic == myTopic + '/serverEvent"') {
        console.log("Incoming from mqtt: " + topic + ", " + message);
        // parse message to array
        var args = JSON.parse(message);
        // first argument of the message is the sender id
        var senderID = args.shift();
        // Sending message to browser script, no matter if the sender was me or someone else
        io.emit('serverEvent', ...args);
        // Additionally create different events for messages from me and others
        if (senderID == userID) {
            io.emit('localEvent', ...args);
        } else {
            io.emit('remoteEvent', ...args);
        }
    }

    if (topic == myTopic + '/whosThereEvent') {
        // console.log("Incoming from mqtt: " + topic + ", " + message);

        // Start collecting all connected users 
        usersCollect = [];
        usersCollectPending = true;

        if (process.argv[4] != "invisible") client.publish(myTopic + '/imHereEvent', JSON.stringify({id:userID, since:connectionTimestamp}));
        setTimeout(function() {
            usersCollectPending = false;
            // Sort users on connectionTimestamp to keep order of users constant
            usersCollect.sort(function(a, b) {return (a.since < b.since) ? -1 : (a.since > b.since) ? 1 : 0});
            if (JSON.stringify(usersConnected) != JSON.stringify(usersCollect)) {
                console.log('Users changed!!');
                usersConnected = [...usersCollect];
                console.log('**** new users list:');
                for (var i = 0; i < usersConnected.length; i++) {
                    console.log(usersConnected[i]);
                }
                userIndex = usersConnected.findIndex(el => el.id == userID);
                io.emit('newUsersEvent', userID, userIndex, usersConnected);
            }

        }, 500);
    }

    if (topic == myTopic + '/imHereEvent') {
        // console.log("Incoming from mqtt: " + topic + ", " + message);
        message = JSON.parse(message);
        // console.log('**** user ' + message.id + ' is here since ' + message.since);
        var foundUser = usersCollect.find(function(el) {return el.id == message.id});
        if (!foundUser) usersCollect.push(message);
    }

})

// Listen for requests
var server = app.listen(app.get('port'), function () {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});

// Loading socket.io
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    // When the client connects, they are sent a message
    socket.emit('connected', 'You are connected!'); 
    console.log("User connected!");

    // as soon as the browser script is connected, ask for other connected users...
    client.publish(myTopic + '/whosThereEvent', userID);
    // ... and send the actual list (useful if just the browser script was relaoded)
    io.emit('newUsersEvent', userID, userIndex, usersConnected);

    // Receiving message from browser script 
    socket.on('serverEvent', function () {
        // Put userID and all arguments in an array and stringify it
        var args = JSON.stringify([userID, ...arguments]);
        // Publish to mqtt
        console.log('Publishing to mqtt:', args);
        client.publish(myTopic + '/serverEvent', args);
    }); 

    // The browser script can trigger a whosThereEvent. Propably not necessary to use.
    socket.on('whosThereEvent', function () {
        if (!usersCollectPending) {
            client.publish(myTopic + '/whosThereEvent', userID);
        }
    }); 

});