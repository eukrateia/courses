(function () {  // create global variables to be used in any part of the game
  let canvas; // variable to reference DOM element (<canvas>)
  let canvasContext; // variable to assign drawing methods (or functions)

  let ballX = 50; // variable for ball X position
  let ballY = 50; // variable for ball Y position

  let ballSpeedX = 10; // variable for ball speed in X direction
  let ballSpeedY = 4; // variable for ball speed in Y direction

  let paddle1Y = 250;
  const PADDLE_HEIGHT = 100;

  function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
      x: mouseX,
      y: mouseY
    }
  }

  window.onload = function () {
    console.log("This is the console. You can write anything here!");

    // assign <canvas id="gameCanvas"> to variable canvas (global variable)
    canvas = document.getElementById("gameCanvas");

    // assign '2d' drawing methods to canvasContext (global variable)
    canvasContext = canvas.getContext("2d");

    // create local FPS variable and assign initial value
    //   this determines how often calculations & the screen are updated
    //   (the higher the number, the faster the game will process)
    let framesPerSecond = 30;

    // calculate motion & redraw screen
    // setInterval() will repeat everything inside at a rate in milliseconds
    setInterval(function () {
      moveEverything(); // calculate movement
      drawEverything(); // use calculations to redraw screen
    }, 1000 / framesPerSecond); // update the screen every 33.33 ms
  };

  // function used to calculate motion/position changes
  function moveEverything() {
    ballX = ballX + ballSpeedX; // move the ball in X direction
    ballY = ballY + ballSpeedY; // move the ball in Y direction

    // if the ball hits the right side of the screen, reverse the direction
    if (ballX > canvas.width) {
      ballSpeedX = -ballSpeedX;
    }
    // if the ball hits the left side of the screen, reverse the direction
    if (ballX < 0) {
      ballSpeedX = -ballSpeedX;
    }

    // if the ball hits the bottom of the screen, reverse the direction
    if (ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
    // if the ball hits the top of the screen, reverse the direction
    if (ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
  }

  function drawEverything() {
    // draw the black background for the playing area
    colorRect(0, 0, canvas.width, canvas.height, "black");

    // this is left player paddle
    colorRect(0, 210, 10, 100, "white");

    // draw the ball
    colorCircle(ballX, ballY, 10, "white");
  }

  // draw a circle
  function colorCircle(centerX, centerY, radius, drawColor) {
    // 'fillStyle' defines the color of the circle
    canvasContext.fillStyle = drawColor;

    // '.beginPath()' starts a new shape to draw
    //    (clears the current internal path object)
    canvasContext.beginPath();

    // add an arc to the path
    // there is no circle function so '.arc()' must be used
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    /*
      .arc() parameters:
      .arc(
        centerX, 
        centerY, 
        radius, 
        startAngle [radians; 0 is at 3 o'clock], 
        endAngle, 
        true/false [counter-clockwise/clockwise]); default = false
    */

    // draw the path (ball) with '.fill()'
    canvasContext.fill();
  }

  // draw a rectangle
  function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
  }
})();
