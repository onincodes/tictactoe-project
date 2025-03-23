let board = document.getElementById("board");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let reset = document.getElementById("reset");

let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let state = [];
let moves = 0;
let playerTurn1 = true; // True = X, False = O
let currentIndex = -1; // to track current history position

// Winning patterns
const winPatterns = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Main diagonal
  [2, 4, 6], // Other diagonal
];

function createBoard() {
  for (let i = 0; i < 9; i++) {
    let tictactoeGrid = document.createElement("div");
    tictactoeGrid.classList.add("cell");
    tictactoeGrid.setAttribute("id", `box${i}`);

    board.appendChild(tictactoeGrid);

    tictactoeGrid.addEventListener("click", () => {
      if (currentIndex !== state.length - 1) return; // prevent moves in history view

      addMove(tictactoeGrid, i);
    });
  }
}

createBoard(); // call to create the main board

function addMove(element, boxNumber) {
  if (element.textContent) return; // prevent overwiting moves

  moves++;

  // Check if the cell is empty
  if (!element.textContent) {
    if (playerTurn1) {
      element.textContent = "X";
      playerTurn1 = false;
    } else {
      element.textContent = "O";
      playerTurn1 = true;
    }
  }

  updateBoard(element, boxNumber);
}

function updateBoard(element, boxNumber) {
  let row = Math.floor(boxNumber / 3);
  let column = boxNumber % 3;
  gameBoard[row][column] = element.innerText;

  updateState(gameBoard);
}

function updateState(boardCopy) {
  const newBoard = [];
  for (let i = 0; i < boardCopy.length; i++) {
    const row = [];
    for (let j = 0; j < boardCopy[i].length; j++) {
      row.push(boardCopy[i][j]);
    }

    newBoard.push(row);
  }

  if (currentIndex !== state.length - 1) {
    state = state.slice(0, currentIndex + 1); //remove future states if rewinding
  }

  state.push(newBoard);
  currentIndex = state.length - 1; // updates history index

  console.log(state);

  checkEndGame();
}

function checkEndGame() {
  // show previous button when game ends
  if (moves === 9) {
    prev.classList.add("show");
  }

  // enable/disable Prev Button
  prev.disabled = currentIndex <= 0;

  // enable/disable Next Button
  next.disabled = currentIndex >= state.length - 1 ? true : false;

  // show Next button when moving back in history
  if (currentIndex < state.length - 1) {
    next.classList.add("show");
  } else {
    next.classList.remove("show");
  }
}

function reflectBoard(index) {
  if (index < 0 || index >= state.length) return;

  let tempBoard = state[index];
  let moveString = tempBoard.flat();

  for (let grid = 0; grid < moveString.length; grid++) {
    document.getElementById(`box${grid}`).textContent = moveString[grid];
  }

  currentIndex = index;

  checkEndGame();
}

prev.addEventListener("click", () => {
  if (currentIndex > 0) {
    reflectBoard(currentIndex - 1);
  }
});

next.addEventListener("click", () => {
  if (currentIndex < state.length - 1) {
    reflectBoard(currentIndex + 1);
  }
});

// Reset function
function resetGame() {
  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  state = [];
  moves = 0;
  playerTurn1 = true;
  currentIndex = -1; // reset history index

  prev.classList.remove("show");
  next.classList.remove("show");
  prev.disabled = true;
  next.disabled = true;

  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));

  checkEndGame(); // ensure buttons are properly updated after reset
}

reset.addEventListener("click", resetGame);
