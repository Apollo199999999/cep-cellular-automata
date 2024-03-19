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
        if (grid[row][col] === 1) {
          fill(0);
        } else {
          fill(255);
        }
        rect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }
  }
  
  
  function updateGrid(grid) {
    let newGrid = createEmptyGrid(gridWidthNum, gridHeightNum);
  
    for (let row = 0; row < gridHeightNum; row++) {
      for (let col = 0; col < gridWidthNum; col++) {
        let liveNeighbours = countLiveNeighbours(grid, row, col);
  
        if (grid[row][col] === 1) {
          if (liveNeighbours === 2 || liveNeighbours === 3) {
            newGrid[row][col] = 1; // Survival
          }
        } else {
          if (liveNeighbours === 3) {
            newGrid[row][col] = 1; // Birth
          }
        }
      }
    }
  
    return newGrid;
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
        count += grid[newRow][newCol];
      }
    }
    return count;
  }
  
  function toggleCellState() {
    let row = Math.floor(mouseY / cellSize);
    let col = Math.floor(mouseX / cellSize);
    grid[row][col] = grid[row][col] === 1 ? 0 : 1;
  }
  
  function keyPressed() {
    if (key === ' ') {
      isRunning = !isRunning;
    }
  }
  
  let gridHeightNum;
  let gridWidthNum;
  let cellSize;
  let grid;
  let isRunning = false;
  
  function setup() {
    frameRate(10);
    cellSize = 10;
    // Number of grids should depend on width of window
    gridWidthNum = Math.floor((windowWidth - 400) / cellSize);
    gridHeightNum = Math.floor((windowHeight) / cellSize);
    grid = createEmptyGrid(gridWidthNum, gridHeightNum);
    createCanvas(gridWidthNum * cellSize, gridHeightNum * cellSize).mousePressed(toggleCellState);
  }
  
  function draw() {
    background(255);
    drawGrid(grid);
    if (isRunning) {
      grid = updateGrid(grid);
    }
  }