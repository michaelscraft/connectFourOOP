/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

window.addEventListener('load', () => {
  const playerOne = document.querySelector('#gameConfigForm input[name="player1"]');
  playerOne.focus();
});

class ConnectFour {
  constructor(width, height, playerOne, playerTwo) {
    this.table = document.querySelector('#board');
    this.modal = document.querySelector('.modal');

    this.topBarButtons = []; // is set when game starts;
    this.tableRows = []; // is set when game starts;
    this.board = []; // generated when game starts

    this.width = width;
    this.height = height;
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;

    this.currPlayer = playerOne;
    this.gameOver = false;
  }

  init() {
    this.buildBoardMatrix();
    this.buildTopBar();
    this.buildTable();
    this.addEvents();
  }

  // Create Board Matrix
  buildBoardMatrix() {
    const { height, width } = this;
    const boardMatrix = [];

    for (let i = 0; i < height; i++) { // creating matrix rows
      boardMatrix.push([]);
    }

    boardMatrix.forEach((arr) => { // creating matrix columns
      for (let i = 0; i < width; i++) {
        arr.push(null);
      }
    });

    this.board = boardMatrix;
  }

  buildTopBar() {
    const { table, width } = this;
    const tableTopBar = document.createElement('tr');

    tableTopBar.setAttribute('id', 'column-top'); // assigning id 'column-top' to top row

    // creating top row (buttons) HTML
    for (let x = 0; x < width; x++) { // creating columns for top row;
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      tableTopBar.append(headCell);
    }
    table.append(tableTopBar); // appending top row to our board
  }

  /* creating HTML game board  */
  buildTable() {
    const { table, height, width } = this;

    for (let y = 0; y < height; y++) { // creating table rows
      const row = document.createElement('tr');
      for (let x = 0; x < width; x++) { // creating table columns
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`); // assigning unique id to each cell
        row.append(cell);
      }
      table.append(row); // appending game board HTML to table
    }
    const [topBarButtons, ...rest] = [...document.querySelectorAll('#board tr')];
    this.tableRows = rest;
    this.topBarButtons = topBarButtons;
  }

  // Adding Events listners
  addEvents() {
    this.topBarButtons.addEventListener('click', (e) => this.handleClick(e));
  }

  // Runnning checks
  // checkForWin: check board cell-by-cell for "does a win start here?"
  checkForWin() {
    const {
      board, currPlayer, height, width,
    } = this;
    const _win = (cells) => cells.every(
      ([y, x]) => y >= 0
        && y < height
        && x >= 0
        && x < width
        && board[y][x] === currPlayer,
    );

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
    return false;
  }

  /** Check for empty spots in "X" Col */
  findSpotForCol(x) {
    const colX = this.tableRows.map((tr) => tr.cells[x]);
    const emptySpot = colX.filter((spot) => !spot.children.length);

    return emptySpot.length - 1;
  }

  checkForTie() {
    const noNull = this.board.flat().every((val) => val !== null);

    return noNull;
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const emptySpot = this.tableRows[y].cells[x]; // getting empty cell using x y coordinates;
    const div = document.createElement('div');

    if (this.currPlayer === this.playerOne) {
      div.classList.add('player1');
      emptySpot.append(div);
    } else {
      div.classList.add('player2');
      emptySpot.append(div);
    }
    this.board[y][x] = this.currPlayer;
  }

  // handleClick: handle click of column top to play piece
  handleClick(evt) {
    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === -1 || this.gameOver) return;

    this.placeInTable(y, x);
    if (this.checkForWin()) this.endGame(`${this.currPlayer} won!`);
    if (!this.gameOver && this.checkForTie()) this.endGame('Its a tie :-(');
    if (this.currPlayer === this.playerOne) {
      this.currPlayer = this.playerTwo;
    } else {
      this.currPlayer = this.playerOne;
    }
  }

  endGame(msg) {
    this.gameOver = true;
    setTimeout(() => {
      alert(`${msg}`);
      this.table.innerHTML = '';
      this.modal.classList.toggle('hide');
    }, 100);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const modal = document.querySelector('.modal');
const form = document.querySelector('#gameConfigForm');
const handleSubmit = (e) => {
  e.preventDefault();
  const size = e.target.size.value;
  let playerOne = e.target.player1.value;
  let playerTwo = e.target.player2.value;
  let width = 4;
  let height = 4;

  if (playerOne === '') playerOne = 'Player 1';
  if (playerTwo === '') playerTwo = 'Player 2';
  if (size === 'small') {
    width = 4;
    height = 4;
  } else if (size === 'medium') {
    width = 6;
    height = 6;
  } else {
    width = 8;
    height = 8;
  }
  modal.classList.toggle('hide');
  const startGame = new ConnectFour(height, width, playerOne, playerTwo);

  return startGame.init();
};

form.addEventListener('submit', handleSubmit);
