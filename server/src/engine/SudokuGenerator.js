import Board from "./Board.js";

class SudokuGenerator {
  static SIZE = 9;

  static DiggingSequence = {
    LEFT_TO_RIGHT: "LEFT_TO_RIGHT",
    S_SHAPE: "S_SHAPE",
    JUMP_ONE: "JUMP_ONE",
    RANDOM: "RANDOM",
  };

  static Difficulty = {
    EXTREMELY_EASY: "EXTREMELY_EASY",
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    DIFFICULT: "DIFFICULT",
    EVIL: "EVIL",
  };

  //step 1
  //randomly fill a sudoku with 11 values to start
  static randomFill() {
    let row, col, val;
    let fillCells = 11;

    const board = new Board();

    while (fillCells > 0) {
      row = Math.floor(Math.random() * this.SIZE);
      col = Math.floor(Math.random() * this.SIZE);

      val = Math.floor(Math.random() * this.SIZE) + 1;

      if (board.getCell(row, col).getValue() === 0) {
        while (!board.isSafe(row, col, val)) {
          val = Math.floor(Math.random() * this.SIZE) + 1;
        }
        board.getCell(row, col).setValue(val);
        fillCells--;
      }
    }
    return board;
  }

  //step 2
  // We repeatedly create a partially filled board (maxAttempts times if we don't get the result)
  //Then try to solve it randomly
  //If it solves within the time limit we return the solved board
  //else we try again until maxAttempts is reached, then throw an error

  static generateTerminalPattern(maxAttempts, timeLimitMillis) {
    for (let attempts = 1; attempts <= maxAttempts; attempts++) {
      const board = this.randomFill();
      const start = Date.now();

      if (board.solveSudokuRandom() && Date.now() - start <= timeLimitMillis) {
        return board;
      }
    }

    throw new Error(`Failed after ${maxAttempts} attempts.`);
  }

  //step 3
  // We create a list of all 81 cell coordinates [row, col]
  // We then reorder that list based on the selected digging strategy
  //Then digHoles() follows this order when deciding which clues to remove

  static generateCellSequence(sequence) {
    const cells = [];

    for (let i = 0; i < this.SIZE; i++) {
      for (let j = 0; j < this.SIZE; j++) {
        cells.push([i, j]);
      }
    }

    switch (sequence) {
      case this.DiggingSequence.LEFT_TO_RIGHT:
        break;

      case this.DiggingSequence.S_SHAPE:
        cells.sort(
          (a, b) =>
            (a[0] % 2 === 0 ? a[1] : this.SIZE - a[1]) -
            (b[0] % 2 === 0 ? b[1] : this.SIZE - b[1])
        );
        break;

      case this.DiggingSequence.JUMP_ONE:
        cells.sort((a, b) => ((a[0] + a[1]) % 2) - ((b[0] + b[1]) % 2));
        break;

      case this.DiggingSequence.RANDOM:
        for (let i = cells.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [cells[i], cells[j]] = [cells[j], cells[i]];
        }
        break;
    }

    return cells;
  }

  //step 4
  //We choose a random minimum number of clues(fixed/filled values) that the board
  //must have based on its difficulty
  //Easier puzzle keeps more clues while harder puzzle keeps fewer

  static getRandomTotalGivens(difficulty) {
    switch (difficulty) {
      case this.Difficulty.EXTREMELY_EASY:
        return 40 + Math.floor(Math.random() * 6); // 40–45

      case this.Difficulty.EASY:
        return 34 + Math.floor(Math.random() * 5); // 34–38

      case this.Difficulty.MEDIUM:
        return 30 + Math.floor(Math.random() * 4); // 30–33

      case this.Difficulty.DIFFICULT:
        return 26 + Math.floor(Math.random() * 4); // 26–29

      default:
        return 18 + Math.floor(Math.random() * 5); // 18–22
    }
  }

  //step 5
  //We choose a random minimum number of clues(fixed/filled values) that each row and column
  //must have based on its difficulty
  //Easier puzzle keeps more clues while harder puzzle keeps fewer

  static getRandomRowColGivens(difficulty) {
    let upper;

    switch (difficulty) {
      case this.Difficulty.EXTREMELY_EASY:
        upper = 4;
        break;

      case this.Difficulty.EASY:
        upper = 3;
        break;

      case this.Difficulty.MEDIUM:
        upper = 2;
        break;

      case this.Difficulty.DIFFICULT:
      default:
        upper = 1;
    }

    return Math.floor(Math.random() * upper); // 0 to upper-1
  }

  //step 6
  //We ensure that each row and column has at least the minimum required clues
  //Also, the total number of clues is at least the required minimum for the chosen difficulty

  static checkRestrictions(board, difficulty) {
    let totalGivens = 0;

    // Random bounds for this puzzle
    const minTotal = this.getRandomTotalGivens(difficulty);
    const minRowCol = this.getRandomRowColGivens(difficulty);

    for (let i = 0; i < this.SIZE; i++) {
      let rowCount = 0;
      let colCount = 0;

      for (let j = 0; j < this.SIZE; j++) {
        if (board.getCell(i, j).getValue() !== 0) rowCount++;
        if (board.getCell(j, i).getValue() !== 0) colCount++;
      }

      if (rowCount < minRowCol || colCount < minRowCol) {
        return false;
      }

      totalGivens += rowCount;
    }

    return totalGivens >= minTotal;
  }

  //step 7
  //We check if the puzzle still has a unique solution after removing a clue
  //We try every possible value except the original one in the emptied cell
  //If another value can also lead to a valid solved Sudoku
  //then the puzzle has multiple solutions so it returns false.

  static checkUniqueness(board, row, col, originalVal) {
    for (let i = 1; i <= 9; i++) {
      if (i === originalVal) continue;
      if (!board.isSafe(row, col, i)) continue;

      const copy = new Board(board);

      copy.getCell(row, col).setValue(i);

      if (copy.solveSudoku()) {
        return false;
      }
    }

    return true;
  }

  //step 8
  // We generate a fully solved Sudoku board,
  // mark all cells as initially removable,
  // get the order in which cells will be tested for removal
  // We try removing each clue one by one
  // if removing a clue breaks difficulty constraints or uniqueness,
  // we restore it and mark that cell as non-removable
  // Else keep the cell empty
  // Then we return the resulting Sudoku puzzle

  static digHoles(sequence, difficulty) {
    const board = this.generateTerminalPattern(1000, 100);

    const canBeDug = Array.from({ length: this.SIZE }, () =>
      Array(this.SIZE).fill(true)
    );

    const cellSequence = this.generateCellSequence(sequence);

    for (const [r, c] of cellSequence) {
      if (!canBeDug[r][c]) continue;

      const temp = board.getCell(r, c).getValue();
      board.getCell(r, c).setValue(0);

      if (
        !this.checkRestrictions(board, difficulty) ||
        !this.checkUniqueness(board, r, c, temp)
      ) {
        board.getCell(r, c).setValue(temp);
        canBeDug[r][c] = false; // prune
      }
    }

    return board;
  }

  //step 9- final
  //We try to generate a puzzle for up to 1 second
  //We call digHoles() to create the puzzle
  //mark all remaining numbers as fixed clues
  //We return the completed Sudoku puzzle or null if generation fails within the time limit

  static generate(difficulty, sequence) {
    const timeLimit = 1000; // 1 second
    const startTime = Date.now();

    while (Date.now() - startTime < timeLimit) {
      const board = this.digHoles(sequence, difficulty);

      if (board) {
        // Mark remaining clues as fixed
        for (let i = 0; i < this.SIZE; i++) {
          for (let j = 0; j < this.SIZE; j++) {
            if (board.getCell(i, j).getValue() !== 0) {
              board.getCell(i, j).setFixed(true);
            }
          }
        }

        return board;
      }
    }

    console.error("Failed to generate board within time limit.");
    return null;
  }
}

export default SudokuGenerator;

let board = SudokuGenerator.generate(
  SudokuGenerator.Difficulty.EVIL,
  SudokuGenerator.DiggingSequence.RANDOM
);
console.log("Difficulty:", SudokuGenerator.Difficulty.EVIL);
console.log("Digging Sequence:", SudokuGenerator.DiggingSequence.RANDOM);
console.log();
board.printBoard();
