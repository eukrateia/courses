(function () {  // create global variables to be used in any part of the game
  // create global variables to be used in any part of the game
  let canvas; // variable to reference DOM element (<canvas>)
  let canvasContext; // variable to assign drawing methods (or functions)

  let ballX = 50; // variable for ball X position
  let ballY = 50; // variable for ball Y position

  let ballSpeedX = 10; // variable for ball speed in X direction
  let ballSpeedY = 4; // variable for ball speed in Y direction

  let player1Score = 0;
  let player2Score = 0;
  const WINNING_SCORE = 3;

  let showingWinScreen = false;

  let paddle1Y = 250;
  let paddle2Y = 250;

  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;

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

  function handleMouseClick(evt) {
    if (showingWinScreen) {
      player1Score = 0;
      player2Score = 0;
      showingWinScreen = false;
    }

  }

  // this is where the game starts once the page is ready
  window.onload = function () {
    console.log("This is the console. You can write anything here!");

    // assign <canvas id="gameCanvas"> to variable canvas (global variable)
    canvas = document.getElementById('gameCanvas');

    // assign '2d' drawing methods to canvasContext (global variable)
    canvasContext = canvas.getContext('2d');

    // set game default font type & size
    canvasContext.font = "30px Arial";

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

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
      function (evt) {
        let mousePos = calculateMousePos(evt);
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        // paddle2Y = mousePos.y - (PADDLE_HEIGHT / 2);
      }
    );

  };

  function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
      showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
  }

  function computerMovement() {

    let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);

    if (paddle2YCenter < ballY - 35) {
      paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
      paddle2Y -= 6;
    }
  }

  // function used to calculate motion/position changes
  function moveEverything() {

    if (showingWinScreen) {
      return;
    }

    computerMovement();

    ballX += ballSpeedX; // move the ball in X direction
    ballY += ballSpeedY; // move the ball in Y direction

    // if the ball hits the left side of the screen, reverse the direction
    if (ballX < 0) {
      if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
      } else {
        player2Score++; // must be before ballReset()
        ballReset();
      }
      
    }

    // if the ball hits the right side of the screen, reverse the direction
    if (ballX > canvas.width) {
      if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.35;
      } else {
        player1Score++; // must be before ballReset()
        ballReset();
      }
    }

    // if the ball hits the top of the screen, reverse the direction
    if (ballY < 0) {
      ballSpeedY = -ballSpeedY;
    }
    
    // if the ball hits the bottom of the screen, reverse the direction
    if (ballY > canvas.height) {
      ballSpeedY = -ballSpeedY;
    }
    
  }

  function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
      colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
  }

  function drawEverything() {
    // draw the black background for the playing area
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {

      canvasContext.fillStyle = 'white';

      if (player1Score >= WINNING_SCORE) {
        canvasContext.fillText("Left Player Won!", 350, 200);
      } else if (player2Score >= WINNING_SCORE) {
        canvasContext.fillText("Right Player Won!", 350, 200);
      }

      canvasContext.fillStyle = 'white';
      canvasContext.fillText("click to continue", 350, 500);
      return;
    }

    drawNet();

    // this is left player paddle
    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // this is right computer paddle
    colorRect(canvas.width - PADDLE_WIDTH, paddle2Y,
      PADDLE_WIDTH, PADDLE_HEIGHT, 'white');

    // draw the ball
    colorCircle(ballX, ballY, 10, 'yellow');

    canvasContext.fillStyle = 'white';
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);

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
});
