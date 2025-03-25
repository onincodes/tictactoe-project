let board = document.getElementById("board");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let reset = document.getElementById("reset");

let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let state = []; // history array
let moves = 0;
let playerTurn1 = true; // True = X, False = O
let currentIndex = -1; // to track current history position
let gameOver = false; // track if the game is already finished

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

    // check if the move is the latest move
    tictactoeGrid.addEventListener("click", () => {
      if (currentIndex !== state.length - 1) return; // prevent moves in history view

      addMove(tictactoeGrid, i);
    });
  }
}

createBoard(); // call to create the main board

// to add X or O
function addMove(element, boxNumber) {
  if (gameOver || element.textContent) return; // prevent moves if game is over or cell is occupied

  moves++;

  if (playerTurn1) {
    element.textContent = "X";
    playerTurn1 = false;
  } else {
    element.textContent = "O";
    playerTurn1 = true;
  }

  updateBoard(element, boxNumber);
}

// to update the main board
function updateBoard(element, boxNumber) {
  let row = Math.floor(boxNumber / 3);
  let column = boxNumber % 3;
  gameBoard[row][column] = element.innerText;

  updateState(gameBoard);
}

// this function makes a copy of the gameBoard but not linked. To use as history state.
function updateState(boardCopy) {
  const newBoard = [];
  for (let i = 0; i < boardCopy.length; i++) {
    const row = [];
    for (let j = 0; j < boardCopy[i].length; j++) {
      row.push(boardCopy[i][j]);
    }
    newBoard.push(row);
  }

  if (state.length === 0) {
    state.push([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  }

  state.push(newBoard);
  currentIndex = state.length - 1; // updates currentIndex to track the latest move in history

  console.log(state);
  checkEndGame();
}

// check for winner
function checkWinner() {
  let flatBoard = gameBoard.flat(); // convert 2D board to 1D array

  for (let pattern of winPatterns) {
    let [a, b, c] = pattern;

    // check if all three positions in the pattern contain the same player ("X" or "O")
    if (
      flatBoard[a] &&
      flatBoard[a] === flatBoard[b] &&
      flatBoard[a] === flatBoard[c]
    ) {
      return flatBoard[a] === "X" ? "X" : "O"; // explicitly return "X" or "O"
    }
  }

  return null; // no winner yet
}

// to check if the game is over
function checkEndGame() {
  let winner = checkWinner();
  let isDraw = moves === 9 && !winner;

  // show prev/next buttons only when the game is over
  if (winner || isDraw) {
    prev.classList.add("show");
    next.classList.add("show");
  } else {
    prev.classList.remove("show");
    next.classList.remove("show");
  }

  // hide prev button if there's no previous state
  if (currentIndex === 0) {
    prev.classList.remove("show");
  }

  // hide next button if there's no next state
  if (currentIndex === state.length - 1) {
    next.classList.remove("show");
  }

  if (!gameOver && (winner || isDraw) && currentIndex === state.length - 1) {
    gameOver = true;
    setTimeout(() => {
      alert(winner ? `Player ${winner} wins!` : "It's a draw!");
    }, 100);
  }
}

// updates the UI to match a past move without changing the actual game state
function reflectBoard(index) {
  if (index < 0 || index >= state.length) return; // to avoid out-of-bounds errors

  let tempBoard = state[index];
  let moveString = tempBoard.flat();

  // updates the textContent to match the stored move data (moveString[grid])
  for (let grid = 0; grid < moveString.length; grid++) {
    document.getElementById(`box${grid}`).textContent = moveString[grid];
  }

  // keeps track of the current move number so that the game knows which move is being displayed
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

// reset function
function resetGame() {
  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  state = [
    [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  ];
  moves = 0;
  playerTurn1 = true;
  currentIndex = 0;
  gameOver = false;

  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));

  // ensure prev/next buttons are hidden on reset
  prev.classList.remove("show");
  next.classList.remove("show");

  checkEndGame();
}

reset.addEventListener("click", resetGame);
