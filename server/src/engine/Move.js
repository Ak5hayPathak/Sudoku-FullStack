import Cell from "./Cell.js";

class Move {
    constructor(row, col, oldCell, newCell = null) {
        this.row = row;
        this.col = col;
        this.oldCell = Move.copyCell(oldCell);
        this.newCell = newCell ? Move.copyCell(newCell) : null;
    }

    // Getters
    getRow() {
        return this.row;
    }

    getCol() {
        return this.col;
    }

    getOldCell() {
        return this.oldCell;
    }

    getNewCell() {
        return this.newCell;
    }

    // deep copy
    static copyCell(cell) {
        const copy = new Cell(cell.getValue(), cell.isFixed());

        copy.setCertain(cell.isCertain());
        copy.setGuessed(cell.isGuessed());
        copy.setWrong(cell.isWrong());

        for (const n of cell.getCandidates()) {
            copy.addCandidate(n);
        }

        return copy;
    }
}

export default Move;