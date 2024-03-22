// #region Game of Life code

function createEmptyGrid(numCols, numRows) {
  let newGrid = new Array(numCols);
  for (let i = 0; i < numRows; i++) {
    newGrid[i] = new Array(numCols).fill(0);
  }
  return newGrid;
}

function drawGrid(grid) {
  for (let row = 0; row < gridHeightNum; row++) {
    for (let col = 0; col < gridWidthNum; col++) {
      // Cells are coloured based on how alive they are
      fill(map(grid[row][col], 0.0, 1.0, 255, 0));
      rect(col * cellSize, row * cellSize, cellSize, cellSize);
    }
  }
}


function updateGrid(grid) {
  let newGrid = createEmptyGrid(gridWidthNum, gridHeightNum);

  for (let row = 0; row < gridHeightNum; row++) {
    for (let col = 0; col < gridWidthNum; col++) {
      let liveNeighbours = countLiveNeighbours(grid, row, col);

      if (grid[row][col] > 0) {
        // Current cell is alive

        // Survival
        if (liveNeighbours === 3) {
          // Cell is surrounded by 3 live neighbours, hence cell is fully alive
          newGrid[row][col] = 1;
        }

        // Overpopulation
        else if (liveNeighbours === 4) {
          // 80% chance of dying
          newGrid[row][col] = calculateCellAliveDegree(0.8);
        }
        else if (liveNeighbours >= 5) {
          // Cell is dead
          newGrid[row][col] = 0;
        }

        // Lonliness
        else if (liveNeighbours === 2) {
          // 50% chance of dying
          newGrid[row][col] = calculateCellAliveDegree(0.2);
        }
        else if (liveNeighbours === 1) {
          // 80% chance of dying
          newGrid[row][col] = calculateCellAliveDegree(0.8);
        }
        else if (liveNeighbours === 0) {
          // Cell is dead
          newGrid[row][col] = 0;
        }

      } else {
        // Current cell is dead

        // Birth
        if (liveNeighbours === 3) {
          // Birth when cell has exactly 3 neighbours
          newGrid[row][col] = 1;
        }
      }
    }
  }

  return newGrid;
}

function calculateCellAliveDegree(deathProbability) {
  let probability = Math.random();
  if (probability < deathProbability) {
    // Cell is dead
    return 0;
  }
  else {
    // Cell is partially alive
    return 1 - deathProbability;
  }
}

function countLiveNeighbours(grid, row, col) {
  let count = 0;
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) {
        continue;
      }

      // Why (row + dr + gridHeightNum) % gridHeightNum instead of just (row + dr) % gridHeightNum?
      // To prevent newRow/newCol from becoming negative when it checks cells at the edges of the sketch
      let newRow = (row + dr + gridHeightNum) % gridHeightNum;
      let newCol = (col + dc + gridWidthNum) % gridWidthNum;

      if (grid[newRow][newCol] > 0) {
        // Cell is not dead
        count += 1;
      }
    }
  }
  return count;
}

// Allows the user to make a cell alive
function toggleCellState() {
  let row = Math.floor(mouseY / cellSize);
  let col = Math.floor(mouseX / cellSize);
  grid[row][col] = grid[row][col] === 1 ? 0 : 1;
}

// #endregion

// #region p5js setup

let gridHeightNum;
let gridWidthNum;
let cellSize;
let grid;
let isRunning = false;

function setup() {
  // Framerate should be 60 otherwise it will affect ui animations as well
  // This is because animations fundamentally rely on window.requestAnimationFrame() method
  frameRate(60);
  // Size of cells
  cellSize = 15;
  // Number of grids should depend on width of window
  gridWidthNum = Math.floor((windowWidth - 400) / cellSize);
  gridHeightNum = Math.floor((windowHeight - 1) / cellSize);
  grid = createEmptyGrid(gridWidthNum, gridHeightNum);
  createCanvas(gridWidthNum * cellSize, gridHeightNum * cellSize);
}

function mouseClicked() {
  toggleCellState();
}

function mouseDragged() {
  toggleCellState();
}

function draw() {
  background(255);
  drawGrid(grid);
  if (frameCount % 2 == 0) {
    if (isRunning) {
      grid = updateGrid(grid);
    }
  }
}

// #endregion

// #region UI handling

function startGame() {
  isRunning = true;
}

function pauseGame() {
  isRunning = false;
}

function playSound() {
  //todo
}

function stopSound() {
  //todo
}

// #endregion