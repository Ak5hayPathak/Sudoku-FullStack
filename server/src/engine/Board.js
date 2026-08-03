import Cell from "./Cell.js";

class Board {
  constructor(other = null) {
    if (other) {
      this.board = other.board.map((row) =>
        row.map((cell) => new Cell(cell.value, cell.fixed))
      );
    } else {
      this.board = Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => new Cell())
      );
    }
  }

  refreshBoard() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.isFixed()) continue;

        cell.setValue(0);
        cell.setCertain(false);
        cell.setGuessed(false);
        cell.setWrong(false);
        cell.clearCandidates();
      }
    }
  }

  checkRowColumn(i, j) {
    if (
      Number.isInteger(i) &&
      i >= 0 &&
      i < 9 &&
      Number.isInteger(j) &&
      j >= 0 &&
      j < 9
    ) {
      return true;
    }

    throw new Error("Invalid row/column!");
  }

  getCell(i, j) {
    this.checkRowColumn(i, j);
    return this.board[i][j];
  }

  setCell(i, j, cell) {
    this.checkRowColumn(i, j);

    if (cell instanceof Cell) {
      this.board[i][j] = cell;
    } else {
      throw new Error("Invalid Cell!");
    }
  }

  printBoard() {
    for (let i = 0; i < 9; i++) {
      if (i % 3 === 0 && i !== 0) {
        console.log("------+-------+------");
      }

      let row = "";

      for (let j = 0; j < 9; j++) {
        if (j % 3 === 0 && j !== 0) {
          row += "| ";
        }

        const val = this.board[i][j].getValue();
        row += (val === 0 ? "_" : val) + " ";
      }

      console.log(row);
    }
  }

  isEmpty() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell.getValue() !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  isSafe(row, col, val) {
    this.checkRowColumn(row, col);
    if (!Number.isInteger(val) || val < 1 || val > 9)
      throw new Error("Value must be integer and between 1 and 9 (inclusive)!");
    //row and col check
    for (let i = 0; i < 9; i++) {
      if (
        this.board[row][i].getValue() == val ||
        this.board[i][col].getValue() == val
      )
        return false;
    }

    //3x3 box check
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[startRow + i][startCol + j].getValue() == val)
          return false;
      }
    }
    return true;
  }

  isCorrect(row, col) {
    this.checkRowColumn(row, col);

    const val = this.board[row][col].getValue();
    if (val === 0) {
      this.board[row][col].setWrong(false);
      return true; // empty cell is always safe
    }

    this.board[row][col].setValue(0);
    const safe = this.isSafe(row, col, val);
    this.board[row][col].setValue(val);
    this.board[row][col].setWrong(!safe);
    return safe;
  }

  //Fisher–Yates shuffle for shuffling an array
  //to randomly choose a number to fill the sudoku cell
  getShuffledDigits() {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [digits[i], digits[j]] = [digits[j], digits[i]]; // swap
    }

    return digits;
  }

  solveSudokuRandom() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j].getValue() === 0) {
          const digits = this.getShuffledDigits(); // get a random order of digits

          for (const val of digits) {
            if (this.isSafe(i, j, val)) {
              this.board[i][j].setValue(val);

              if (this.solveSudokuRandom()) {
                return true;
              }

              this.board[i][j].setValue(0);
            }
          }

          return false;
        }
      }
    }

    return true;
  }

  solveSudoku() {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j].getValue() === 0) {
          for (let k = 1; k <= 9; k++) {
            if (this.isSafe(i, j, k)) {
              this.board[i][j].setValue(k);

              if (this.solveSudoku()) {
                return true;
              }

              this.board[i][j].setValue(0);
            }
          }

          return false;
        }
      }
    }

    return true;
  }

  isComplete() {
    // Check all cells are filled
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.board[row][col].getValue() === 0) {
          return false;
        }
      }
    }

    // Check all rows, columns, and boxes are valid
    return this.isValid();
  }

  isValid() {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const value = this.board[row][col].getValue();

        if (value !== 0) {
          this.board[row][col].setValue(0);

          if (!this.isSafe(row, col, value)) {
            this.board[row][col].setValue(value);
            return false;
          }

          this.board[row][col].setValue(value);
        }
      }
    }

    return true;
  }

  getNumCount(num) {
    if (!Number.isInteger(num) || num < 1 || num > 9) {
      return -1;
    }

    let count = 0;

    for (const row of this.board) {
      for (const cell of row) {
        if (cell.getValue() === num) {
          count++;
        }
      }
    }

    return count;
  }
}

export default Board;

// let b = new Board();
// b.solveSudokuRandom();
// b.printBoard();
