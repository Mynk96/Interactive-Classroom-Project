(function(){
  var socket = io.connect(host);
  Reveal.initialize({
    history: true
  });
  function setup() {

  // Front end logic :
  // This function creates a canvas with size window.innerWidth and window.innerHieght = width and height available.
  createCanvas(500, 500);
  // Setting the background to white
  background(255);
  // Tells canvas API : "If I pass (x, y) to ellipse function, it should draw an ellipse with center as (x, y)"
  ellipseMode(CENTER);

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
    y: mouseY
  };

  // We'll emit data and tell server that we're emitting this because 'mouse' event has occured.
  // We can make multiple such events and send different stuff, but we don't require this right now.
  socket.emit('mouse', data);

  // Just some canvas related things, to make an circle on the canvas we're working on at location of mouse.
  noStroke();
  fill(0);
  ellipse(data.x, data.y, 30, 30);
}

// Every time some other canvas sends us a 'mouse' event with their mouse data, this function executes and draws a pink circle on our canvas.
function newDrawing (data) {
  push();
  noStroke();
  fill(255, 0, 255);
  ellipse(data.x, data.y, 30, 30);
  pop();
}

  /** start - only in master.js **/
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
  
})();