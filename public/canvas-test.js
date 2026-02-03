const canvas = document.getElementById("canvas");

const cellSize = 3;
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
const fitToCellSize = (value) => Math.floor(value / cellSize) * cellSize;

const setCanvasSize = () => {
  let width = window.innerWidth;
  let height = window.innerHeight;

  if (!isMobile()) {
    const maxWidth = Math.max(320, Math.min(window.innerWidth - 48, 420));
    const maxHeight = Math.max(540, Math.min(window.innerHeight - 140, 820));
    width = maxWidth;
    height = maxHeight;
  }

  canvas.width = fitToCellSize(width);
  canvas.height = fitToCellSize(height);
};

setCanvasSize();

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

// add event listeners to track mouse position, whether the mouse is held down,
// and the game state 
const updatePointerFromEvent = (clientX, clientY) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = clientX - rect.left;
  mouse.y = clientY - rect.top;
};

document.addEventListener("mousemove", (e) => {
  updatePointerFromEvent(e.clientX, e.clientY);
});

document.addEventListener("touchmove", (e) => {
  updatePointerFromEvent(e.touches[0].clientX, e.touches[0].clientY);
});

// Add event listeners to changing drawing to 'true' on startDraw events...
["mousedown", "touchstart"].forEach((eventType) =>
  document.addEventListener(eventType, (e) => {
    mouse.drawing = true;
  })
);

//... and change it to 'false' on stopDraw events
["mouseup", "touchend"].forEach((eventType) =>
  document.addEventListener(eventType, (e) => {
    mouse.drawing = false;
  })
);

const toolSelect = document.getElementById("tool-select");
if (toolSelect) {
  gameState.type = toolSelect.value;
  toolSelect.addEventListener("change", (e) => {
    gameState.type = e.target.value;
  });
}

const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !menu.classList.contains("open");
    menu.classList.toggle("open", willOpen);
    menuToggle.classList.toggle("open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menu.setAttribute("aria-hidden", String(!willOpen));
  });
}

// setting up functions and variables for the board
let props = {
  ctx: ctx,
  active: "#00ff00",
  waiting: "#ff0000",
};

// instantiating and starting the board
let board = new Board({
  width: canvas.width,
  height: canvas.height,
  cellSize: cellSize,
  stepFunction: statefulToggle,
  updateInterval: 30,
  cellByCell: true,
  props: props,
  draw: statefulDraw,
});

board.start();

document.addEventListener(
  "touchmove",
  (e) => {
    if (mouse.drawing) {
      e.preventDefault();
    }
  },
  { passive: false }
);
