var express = require('express');
var app = express();

// get port number from arguments
var port = process.argv[2] || 3001;
app.set('port', port);
app.use('/', express.static(__dirname + '/public'));

var mqtt = require('mqtt');
var client = mqtt.connect("mqtt://mqtt.hfg.design:1883/someDomain");

client.on('connect', function () {
    console.log("mqtt connected");
    client.subscribe('serverEvent', function (err) {});
})

// Incoming messages from mqtt broker
client.on('message', function (topic, message) {
    console.log("Incoming from mqtt: " + message);
    // parse message to array
    var args = JSON.parse(message);
    // Sending message to browser script
    io.emit('serverEvent', ...args);
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

    // Receiving message from browser script 
    socket.on('serverEvent', function () {
        // Put all arguments in an array and stringify it
        var args = JSON.stringify([...arguments]);
        // Publish to mqtt
        console.log('Publishing to mqtt:', args);
        client.publish("serverEvent", args);
    }); 
});