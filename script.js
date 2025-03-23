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

    tictactoeGrid.addEventListener("click", () => {
      if (currentIndex !== state.length - 1) return; // prevent moves in history view

      addMove(tictactoeGrid, i);
    });
  }
}

createBoard(); // call to create the main board

// to add X or O
function addMove(element, boxNumber) {
  if (element.textContent) return; // prevent adding a move to an already occupied cell

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

// to update the main board
function updateBoard(element, boxNumber) {
  let row = Math.floor(boxNumber / 3);
  let column = boxNumber % 3;
  gameBoard[row][column] = element.innerText;

  updateState(gameBoard);
}

// update the board (index) state
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

  // show buttons when game is over
  if (winner || isDraw) {
    prev.classList.add("show");
    next.classList.add("show");
  }

  // enable/disable Prev Button
  prev.disabled = currentIndex <= 0;

  // enable/disable Next Button
  next.disabled = currentIndex >= state.length - 1;

  // show Next button only if rewinding is possible (future moves exist)
  if (currentIndex < state.length - 1) {
    next.classList.add("show");
  } else {
    next.classList.remove("show");
  }

  // show the alert ONLY when the game ends naturally
  if (!gameOver && (winner || isDraw) && currentIndex === state.length - 1) {
    gameOver = true; // mark game as over
    setTimeout(() => {
      if (winner) {
        alert(`Player ${winner} wins!`);
      } else {
        alert("It's a draw!");
      }
    }, 100);
  }
}

// updates the UI to match a past move without changing the actual game state
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

// reset function
function resetGame() {
  gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  state = [];
  moves = 0;
  playerTurn1 = true;
  currentIndex = -1;
  gameOver = false; // allows a new game to start after resetting

  prev.classList.remove("show");
  next.classList.remove("show");
  prev.disabled = true;
  next.disabled = true;

  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));

  checkEndGame(); // ensure buttons update correctly
}

reset.addEventListener("click", resetGame);
