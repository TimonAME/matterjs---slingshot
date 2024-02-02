const matterContainer = document.querySelector("#matter-container");
const THICCNESS = 400;

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
  element: matterContainer,
  engine: engine,
  options: {
    width: matterContainer.clientWidth,
    height: matterContainer.clientHeight,
    background: "transparent",
    wireframes: true,
    showAngleIndicator: true
  }
});

var ground = Bodies.rectangle(
  matterContainer.clientWidth / 2,
  matterContainer.clientHeight + THICCNESS / 2,
  27184,
  THICCNESS,
  { isStatic: true }
);
// add all of the bodies to the world
Composite.add(engine.world, [ground]);

let mouse = Matter.Mouse.create(render.canvas);
let mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false
    }
  }
});

Composite.add(engine.world, mouseConstraint);

// allow scroll through the canvas
mouseConstraint.mouse.element.removeEventListener(
  "mousewheel",
  mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
  "DOMMouseScroll",
  mouseConstraint.mouse.mousewheel
);

// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);

function handleResize(matterContainer) {
  // set canvas size to new values
  render.canvas.width = matterContainer.clientWidth;
  render.canvas.height = matterContainer.clientHeight;

  // reposition ground
  Matter.Body.setPosition(
    ground,
    Matter.Vector.create(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2
    )
  );
}

window.addEventListener("resize", () => handleResize(matterContainer));



//Slingshot Game

// platform and stack
let isSpawned = false;
let platform;
let stack;
function spawnPlatformAndStack(x, y){
  let radius = 30; // Adjust as needed
  let rows = 8; // Adjust as needed
  let columns = 3; // Adjust as needed
  
  let platformX = x // Adjust as needed
  let platformY = y; // Adjust based on radius and rows
  let platformWidth = columns * radius * 2; // Adjust based on radius and columns
  platform = Matter.Bodies.rectangle(platformX, platformY, platformWidth, 20, { isStatic: true });
  
  let stackX = platformX - platformWidth / 2; // Adjust based on radius and columns
  let stackY = platformY - (rows * radius * 2); // Adjust based on radius and rows
  stack = Matter.Composites.stack(stackX, stackY, columns, rows, 0, 0, function(x, y) {
      return Matter.Bodies.polygon(x, y, 8, radius); 
  });
  Composite.add(engine.world, [platform, stack]);
  isSpawned = true;
}
function removePlatformAndStack(){
  Matter.Composite.remove(engine.world, platform);
  Matter.Composite.remove(engine.world, stack);
  isSpawned = false;
}

// Add an event listener for right mouse button click
window.addEventListener('contextmenu', function(e) {
  e.preventDefault();

  // Check if spawnedObj is defined
  if (isSpawned) {
    removePlatformAndStack();
  }

  // Get the mouse position
  var mouseX = e.clientX;
  var mouseY = e.clientY;

  // Create a new body
  spawnPlatformAndStack(mouseX, mouseY);
}, false);


// Slingshot
let ballX = 450;
let ballY = 450;
let ballRadius = 20;

let ball = Matter.Bodies.circle(ballX, ballY, ballRadius);
let sling = Matter.Constraint.create({ 
    pointA: { x: ballX, y: ballY }, 
    bodyB: ball, 
    stiffness: 0.05
});

let firing = false;
Matter.Events.on(mouseConstraint,'enddrag', function(e) {
  if(e.body === ball) firing = true;
});

Matter.Events.on(engine,'afterUpdate', function() {
  if (firing && Math.abs(ball.position.x-ballX) < 20 && Math.abs(ball.position.y-ballY) < 20) {
      ball = Matter.Bodies.circle(ballX, ballY, ballRadius);
      Matter.World.add(engine.world, ball);
      sling.bodyB = ball;
      firing = false;
  }
});

Composite.add(engine.world, [ball, sling]);


/*
let ball;
let sling;

// Add an event listener for left mouse button click
window.addEventListener('mousedown', function(e) {
  // Prevent default action
  e.preventDefault();

  // Remove the old ball and sling from the world
  if (typeof ball !== 'undefined') {
      Matter.Composite.remove(engine.world, ball);
  }
  if (typeof sling !== 'undefined') {
      Matter.Composite.remove(engine.world, sling);
  }

  // Get the mouse position
  ballX = e.clientX;
  ballY = e.clientY;

  // Create a new ball at the mouse position
  ball = Matter.Bodies.circle(ballX, ballY, ballRadius);

  // Create a new sling attached to the new ball
  sling = Matter.Constraint.create({ 
      pointA: { x: mouseX, y: mouseY }, 
      bodyB: ball, 
      stiffness: 0.05
  });

  // Add the new ball and sling to the world
  Matter.World.add(engine.world, [ball, sling]);
}, false);
*/