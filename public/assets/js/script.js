// To work with socket, we need to create a socket variable in client side as well.
// This variable will be used to 'emit' data from client to server, server will then process it and do things with it.
var socket;
var address = "http://localhost:3000";
socket = io.connect(address);
Reveal.initialize({
    history: true
  });

  notifyServer = function(event){
    data = {
      indexv : Reveal.getIndices().v,
      indexh : Reveal.getIndices().h,
      indexf : Reveal.getIndices().f || 0
    }
    socket.emit("slidechanged" , data);
  }
  // listeners for slide change/ fragment change events
  Reveal.addEventListener("slidechanged", notifyServer);
  Reveal.addEventListener("fragmentshown", notifyServer);
  Reveal.addEventListener("fragmenthidden", notifyServer);
  /** end - only in master.js **/

  // Move to corresponding slide/ frament on receiving 
  // slidechanged event from server
  socket.on('slidechanged', function (data) {
    Reveal.slide(data.indexh, data.indexv, data.indexf);
  });
// A variable to store address, as it can change..

// This function will by default run every time the document loads, it's one of the facilities provided by a vendor library 
// that I'm using to draw things on canvas. There's depth to explanation of this function, it provides some scoping for other functions,
// required to draw things on screen. So don't replace it with some immideately invoking anonymous function by any chance.
var canvas;
function setup() {

  // Front end logic :
  // This function creates a canvas with size window.innerWidth and window.innerHieght = width and height available.
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.id("canvas1");
  hideCanvas();
  // Setting the background to white
  //background(255);
  // Tells canvas API : "If I pass (x, y) to ellipse function, it should draw an ellipse with center as (x, y)"
  //ellipseMode(CENTER);

  // Client-server communication : 
  // Notice how we haven't defined any variable called 'io' here, but we're calling a function on it..
  // That variable comes from client side library provided by socket.io, which is referenced in my index.html
  // According to people at socket.io, we need to do the following :

  // We have to tell our socket to execute a function called 'newDrawing' everytime a 'mouse' event occurs.
  // This 'mouse' event is same as one we talked about in server.js.
  socket.on('mouse', newDrawing);
}

// This function will execute when mouse is dragged. It looks like I'm just defining this function..and really, that's what we're doing.
// Execution will be handled by our vendor canvas library. 
function mouseDragged() {
  // Console log what we're sending to server on every mouse drag event.
  console.log("Sending : " + mouseX + " , " + mouseY);

  // This is the data that we want to send to server : location of x and y coordinates of mouse whenever we drag it..
  let data = {
    x: mouseX,
    y: mouseY,
    prevX : pmouseX,
    prevY : pmouseY
  };

  // We'll emit data and tell server that we're emitting this because 'mouse' event has occured.
  // We can make multiple such events and send different stuff, but we don't require this right now.
  socket.emit('mouse', data);

  // Just some canvas related things, to make an circle on the canvas we're working on at location of mouse.
  stroke(255);
  strokeWeight(5);
  line(data.x, data.y, data.prevX, data.prevY);
}

// Every time some other canvas sends us a 'mouse' event with their mouse data, this function executes and draws a pink circle on our canvas.
function newDrawing (data) {
  push();
  stroke(255);
  strokeWeight(5);
  line(data.x, data.y, data.prevX, data.prevY);
  pop();
}
function test() {
  var canvas = document.getElementById('canvas1');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  socket.emit('clickEvent', 'messgae');
}
function hideCanvas() {
  $(document).ready(function(){
      $("canvas").hide();
      document.getElementsByClassName('reveal')[0].style.zIndex="1";
  });
}
function showCanvas() {
  $(document).ready(function(){
      $("canvas").show();
      document.getElementsByClassName('reveal')[0].style.zIndex="-100";
  });
}
