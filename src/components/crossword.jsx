import React, { useState } from 'react';

const Crossword = ({ gridSize }) => {
  const emptyCell = '_';
  const [grid, setGrid] = useState(
    Array.from({ length: gridSize }, () => Array(gridSize).fill(emptyCell))
  );

  const update = (word) => {
    if (canBePlaced(word)) {
      addWord(word);
      return true;
    }
    return false;
  };

  const canBePlaced = (word) => {
    if (isValidPosition(word.row, word.column) && fitsOnGrid(word)) {
      for (let index = 0; index < word.text.length; index++) {
        let currentRow = word.vertical ? word.row + index : word.row;
        let currentColumn = !word.vertical ? word.column + index : word.column;

        if (
          (word.text.charAt(index) === grid[currentRow][currentColumn] ||
            emptyCell === grid[currentRow][currentColumn]) &&
          placementLegal(word, currentRow, currentColumn)
        ) {
          // We can place a word!
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const getIntersections = () => {
    let intersections = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let column = 0; column < gridSize; column++) {
        if (isLetter(row, column)) {
          if (
            isValidPosition(row - 1, column) &&
            isValidPosition(row + 1, column) &&
            isValidPosition(row, column - 1) &&
            isValidPosition(row, column + 1) &&
            isLetter(row - 1, column) &&
            isLetter(row + 1, column) &&
            isLetter(row, column - 1) &&
            isLetter(row, column + 1)
          ) {
            intersections++;
          }
        }
      }
    }
    return intersections;
  };

  const placementLegal = (word, row, column) => {
    let illegal = false;
    if (word.vertical) {
      illegal =
        isInterference(row, column + 1, row + 1, column) ||
        isInterference(row, column - 1, row + 1, column) ||
        overwritingVerticalWord(row, column) ||
        invadingTerritory(word, row, column);
    } else {
      illegal =
        isInterference(row + 1, column, row, column + 1) ||
        isInterference(row - 1, column, row, column + 1) ||
        overwritingHorizontalWord(row, column) ||
        invadingTerritory(word, row, column);
    }
    return !illegal;
  };

  const invadingTerritory = (word, row, column) => {
    let invading = false;
    const empty = isEmptyCell(row, column);
    if (word.vertical) {
      const weHaveNeighbors =
        (doesCharacterExist(row, column - 1) ||
          doesCharacterExist(row, column + 1)) ||
        (endOfWord(word, row, column) &&
          doesCharacterExist(row + 1, column));

      invading = empty && weHaveNeighbors;
    } else {
      const weHaveNeighbors =
        (doesCharacterExist(row - 1, column) ||
          doesCharacterExist(row + 1, column)) ||
        (endOfWord(word, row, column) &&
          doesCharacterExist(row, column + 1));

      invading = empty && weHaveNeighbors;
    }
    return invading;
  };

  const endOfWord = (word, row, column) => {
    return word.vertical
      ? word.row + word.text.length - 1 === row
      : word.column + word.text.length - 1 === column;
  };

  const doesCharacterExist = (row, column) => {
    return isValidPosition(row, column) && isLetter(row, column);
  };

  const overwritingHorizontalWord = (row, column) => {
    const leftColumn = column - 1;
    return (
      isValidPosition(row, leftColumn) &&
      isLetter(row, column) &&
      isLetter(row, leftColumn)
    );
  };

  const overwritingVerticalWord = (row, column) => {
    const rowAbove = row - 1;
    return (
      isValidPosition(rowAbove, column) &&
      isLetter(row, column) &&
      isLetter(rowAbove, column)
    );
  };

  const isInterference = (row, column, nextRow, nextColumn) => {
    return (
      isValidPosition(row, column) &&
      isValidPosition(nextRow, nextColumn) &&
      isLetter(row, column) &&
      isLetter(nextRow, nextColumn)
    );
  };

  const isLetter = (row, column) => {
    return grid[row][column] !== emptyCell;
  };

  const isEmptyCell = (row, column) => {
    return !isLetter(row, column);
  };

  const addWord = (word) => {
    const newGrid = grid.map(row => row.slice()); // Create a copy of the grid
    for (let letterIndex = 0; letterIndex < word.text.length; letterIndex++) {
      let row = word.row;
      let column = word.column;
      if (word.vertical) {
        row += letterIndex;
      } else {
        column += letterIndex;
      }
      newGrid[row][column] = word.text.charAt(letterIndex);
    }
    setGrid(newGrid); // Update the state with the new grid
  };

  const fitsOnGrid = (word) => {
    return word.vertical
      ? word.row + word.text.length <= gridSize
      : word.column + word.text.length <= gridSize;
  };

  const isValidPosition = (row, column) => {
    return row >= 0 && row < gridSize && column >= 0 && column < gridSize;
  };

  return (
    <div>
      <h2>Crossword Puzzle</h2>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 30px)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} style={{ border: '1px solid black', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Crossword;
