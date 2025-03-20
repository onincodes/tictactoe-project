let board = document.getElementById("board");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let cells = document.getElementsByClassName("cell");

let gameBoard = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

let moves = 0;
let playerTurn1 = true; // True = X, False = O

// Loop through all cells and add click event listeners
for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", function () {
    addMove(cells[i], i);
    // will add .push(i) here to update gameBoard?
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
}
