
// Fetching express and socket functions from node_modules folder and storing them in variables.
var express = require('express'),
    http = require('http'),
    path = require('path'),
    socket = require('socket.io'),
    app = express(),
    masterUser = 'username',
    masterPass = 'password',
    port = process.env.PORT || 3000;

app.use(express.static("public"));


//var auth = express.basicAuth(masterUser, masterPass);

// Calling result of express function and storing it in a variable called 'app'

// Telling our app to serve whatever's inside public folder


// For things to work with socket.io, we need to create a server variable and pass it to socket, store it as a variable 'io'
let server = app.listen(3000);
const io = socket(server);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/client', function (req, res) {
    res.sendfile(__dirname + '/public/client.html');
});

// 'connection' is an event in networking, on every new connection, we want to fire a function called "newConnection" which is defined in next line.
io.on("connection", newConnection);

// Function will fire on every new connection (..2 times for 2 different tabs and so on)..
function newConnection (socket) {
  // Will output different IDs for different connections to Node terminal.
  console.log("New connection  : " + socket.id);

  // I've created an event called "mouse", whenever this event occurs, we want to call 'mouseMessage' function which is defined later.
  socket.on('mouse', mouseMessage);
  socket.on("slidechanged", function (data) {
        socket.broadcast.emit("slidechanged", data);
    });
  socket.on('clickEvent', function (message){
    socket.broadcast.emit('clickEvent', message);
  });

  // One can change name of this event to anything like..'yolo' or anything else, and it'll work,
  // provided you're changing it everywhere else..and by everywhere else, I mean : script.js in public folder.

  // MouseMessage will take the message that we recieve from client side and then broadcast it to other instances opened.
  // It'll not send the same thing back to the tab it recieved mouse data from, because..that'll be stupid.
  function mouseMessage (message) {
    socket.broadcast.emit('mouse', message);
  }
}