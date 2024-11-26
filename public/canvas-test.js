const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");
ctx.lineWidth = 1;

// getting mouse position and storing it in an object
let mouse = {
  x: undefined,
  y: undefined,
  drawing: false,
};

// gameState object tracks what kind of operation the mouse click should do
let gameState = {
  type: "particle",
};

const startDrawEvents = ["mousedown", "touchstart"];
const stopDrawEvents = ["mouseup", "touchend"];

// add event listeners to track mouse position, whether the mouse is held down,
// and the game state
document.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

document.addEventListener("touchmove", (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

// Add event listeners to changing drawing to 'true' on startDraw events...
startDrawEvents.forEach((eventType) =>
  document.addEventListener(eventType, (e) => {
    mouse.drawing = true;
  })
);

//... and change it to 'false' on stopDraw events
stopDrawEvents.forEach((eventType) =>
  document.addEventListener(eventType, (e) => {
    mouse.drawing = false;
  })
);

document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    gameState.type = "particle";
  }
  if (e.key === "2") {
    gameState.type = "eraser";
  }
  if (e.key === "3") {
    gameState.type = "fixed";
  }
});

// setting up functions and variables for the board
let props = {
  ctx: ctx,
  active: "#00ff00",
  waiting: "#ff0000",
};

// instantiating and starting the board
let board = new Board({
  width: 600,
  height: 600,
  cellSize: 3,
  stepFunction: statefulToggle,
  updateInterval: 30,
  cellByCell: true,
  props: props,
  draw: statefulDraw,
});

board.start();
