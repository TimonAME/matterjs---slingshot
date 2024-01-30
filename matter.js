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
let platform = Matter.Bodies.rectangle(1200, 500, 300, 20, { isStatic: true });
let stack = Matter.Composites.stack(1100, 270, 4, 4, 0, 0, function(x, y) {
    return Matter.Bodies.polygon(x, y, 8, 30); 
});

let ball = Matter.Bodies.circle(300, 600,20);
let sling = Matter.Constraint.create({ 
    pointA: { x: 300, y: 600 }, 
    bodyB: ball, 
    stiffness: 0.05
});


let firing = false;
Matter.Events.on(mouseConstraint,'enddrag', function(e) {
  if(e.body === ball) firing = true;
});

Matter.Events.on(engine,'afterUpdate', function() {
  if (firing && Math.abs(ball.position.x-300) < 20 && Math.abs(ball.position.y-600) < 20) {
      ball = Matter.Bodies.circle(300, 600, 20);
      Matter.World.add(engine.world, ball);
      sling.bodyB = ball;
      firing = false;
  }
});

Composite.add(engine.world, [platform, stack, ball, sling]);