let board = document.getElementById("board");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let cells = document.getElementsByClassName("cell");

let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let state = [];
let moves = 0;
let playerTurn1 = true; // True = X, False = O

// Loop through all cells and add click event listeners
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", function () {
    addMove(cells[i], i);
  });
}

function addMove(element, boxNumber) {
  moves++;

  let specificGrid = element; // The clicked cell is already passed as 'element'

  // If grid is empty
  if (!specificGrid.textContent) {
    if (playerTurn1) {
      specificGrid.textContent = "X";
      playerTurn1 = false;
    } else {
      specificGrid.textContent = "O";
      playerTurn1 = true;
    }
  }

  updateBoard(specificGrid, boxNumber);
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

  state.push(newBoard);
  console.log(state);

  checkEndGame();
}

function checkEndGame() {
  // check winning combination
  if (moves === 9) {
    prev.classList.add("show");
  }
}

function reflectBoard(index) {
  let tempBoard = state[index];
  let moveString = [];
  for (let i = 0; i < tempBoard.length; i++) {
    for (let j = 0; j < tempBoard[i].length; j++) {
      moveString.push(tempBoard[i][j]);
    }
  }

  for (let grid = 0; grid < moveString.length; grid++) {
    document.getElementById(`box${grid}`).textContent = moveString[grid];
  }
}

prev.addEventListener("click", () => reflectBoard(1));
