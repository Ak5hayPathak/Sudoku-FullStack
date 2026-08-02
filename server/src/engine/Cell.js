class Cell {
  constructor(value = 0, fixed = false) {
    this.value = value;
    this.fixed = fixed;
    this.certain = false;
    this.guessed = false;
    this.wrong = false;
    this.candidates = new Set();
  }

  //Value
  getValue() {
    return this.value;
  }

  setValue(value) {
    if (Number.isInteger(value) && value >= 0 && value <= 9) {
      this.value = value;

      if (value !== 0) this.candidates.clear(); //Clear notes when a number is set
    } else {
      throw new Error("Invalid Value!");
    }
  }

  //Fixed
  isFixed() {
    return this.fixed;
  }

  setFixed(fixed) {
    if (typeof fixed !== "boolean") {
      throw new Error("Invalid Value!");
    }

    if (this.fixed) {
      throw new Error("Cannot modify a fixed cell.");
    }

    this.fixed = fixed;
  }

  //Certain
  isCertain() {
    return this.certain;
  }

  setCertain(certain) {
    if (typeof certain !== "boolean") {
      throw new Error("Invalid Value!");
    }

    this.certain = certain;
  }

  //Guessed
  isGuessed() {
    return this.guessed;
  }

  setGuessed(guessed) {
    if (typeof guessed !== "boolean") {
      throw new Error("Invalid Value!");
    }

    this.guessed = guessed;
  }

  //Wrong
  isWrong() {
    return this.wrong;
  }

  setWrong(wrong) {
    if (typeof wrong !== "boolean") {
      throw new Error("Invalid Value!");
    }

    this.wrong = wrong;
  }

  // Candidates / Notes
  getCandidates() {
    return this.candidates;
  }

  getCandidate(index) {
    return [...this.candidates][index]; // Convert Set to Array
  }

  addCandidate(n) {
    if (Number.isInteger(n) && n >= 1 && n <= 9) {
      this.candidates.add(n);
    }
  }

  removeCandidate(n) {
    this.candidates.delete(n);
  }

  clearCandidates() {
    this.candidates.clear();
  }

  hasCandidates() {
    // Helper
    return this.candidates.size > 0;
  }
}
