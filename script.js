
var acornGame = [[70,50],[70,52],[69,52],[72,51],[73,52],[74,52],[75,52]];
var game = [];
var canvas;
var pauseButton;
var game_running = false;
var tick_speed_select = 3;

var GAME_SIZE_X = 140;
var GAME_SIZE_Y = 100;
var MAX_X = GAME_SIZE_X-1;
var MAX_Y = GAME_SIZE_Y-1;
var COLOR_GRID = '#80aaff';
var COLOR_DEAD = '#ffe4b3';
var COLOR_ALIVE = '#ffa500';
var TICK_SPEEDS = [20,40,60,80,100,160,280,480,720,1020,1500];

// for game array:
// 1 => alive
// 0 => has always been dead
// -1 => dead, but was once alive

(function()
{
  canvasDocItem = document.getElementById('game');
  canvas = canvasDocItem.getContext('2d');
  pauseButton = document.getElementById("PauseButton");
  initGame();
  drawGame();
  runGame();
})();

function runGame()
{
  if (game_running)
  {
    tickGame();
    drawGame();
  }
  setTimeout(function() {runGame();}, TICK_SPEEDS[tick_speed_select]);
}

function clearBoard()
{
  for (var x=0; x<GAME_SIZE_X; x++)
  {
    game[x] = [];
    for (var y=0; y<GAME_SIZE_Y; y++)
    {
      game[x][y] = 0;
    }
  }
  pauseButton.innerHTML = "Start";
  game_running = false;

  drawGame();
}

function tickGameButton()
{
  if (!game_running)
  {
    tickGame();
    drawGame();
  }
}

function randomizeBoard()
{
  for (var x=0; x<GAME_SIZE_X; x++)
  {
    game[x] = [];
    for (var y=0; y<GAME_SIZE_Y; y++)
    {
      game[x][y] = Math.round(Math.random());
    }
  }
  drawGame();
}

function tickSpeedUp()
{
  if (tick_speed_select > 0)
    tick_speed_select--;
}

function tickSpeedDown()
{
  if (tick_speed_select < (TICK_SPEEDS.length - 1))
    tick_speed_select++;
}

function togglePauseButton()
{
  if (game_running)
  {
    pauseButton.innerHTML = "Resume";
    game_running = false;
  }
  else
  {
    pauseButton.innerHTML = "Pause";
    game_running = true;
  }
}

function initGame()
{
  clearBoard();
  
  for (var i=0; i < acornGame.length; i++)
    game[acornGame[i][0]][acornGame[i][1]] = 1;
}

function makeAcorn()
{
  initGame();
  drawGame();
}

function countNeighbours(x, y)
{
  var neighbours = 0;
  
  if (getTile(x-1, y-1) == 1)
    neighbours++;
  if (getTile(x-1, y) == 1)
    neighbours++;
  if (getTile(x-1, y+1) == 1)
    neighbours++;
  if (getTile(x+1, y-1) == 1)
    neighbours++;
  if (getTile(x+1, y) == 1)
    neighbours++;
  if (getTile(x+1, y+1) == 1)
    neighbours++;
  if (getTile(x, y-1) == 1)
    neighbours++;
  if (getTile(x, y+1) == 1)
    neighbours++;
  
  return neighbours;
}

function getTile(x, y)
{
  // if not past any borders, return normal value of this tile
  if (0 <= x && x <= MAX_X && 0 <= y && y <= MAX_Y)
    return game[x][y];

  // otherwise we need to go to other side of board
  var realX = x;
  var realY = y;
  if (x == -1)
    realX = MAX_X;
  else if (x == GAME_SIZE_X)
    realX = 0;
  if (y == -1)
    realY = MAX_Y;
  else if (y == GAME_SIZE_Y)
    realY = 0;

  return game[realX][realY];
}

function tickGame()
{
  var updatedGame = [];

  for (var x=0; x < GAME_SIZE_X; x++)
  {
    updatedGame[x] = [];
    for (var y=0; y < GAME_SIZE_Y; y++)
    {
      var n = countNeighbours(x,y);
      // if this tile was alive...
      if (game[x][y] == 1)
      {
        // case where it is still alive...
        if ( (n == 2) || (n == 3) )
        {
          updatedGame[x][y] = 1;
        }
        // case where it is now dead...
        else
        {
          updatedGame[x][y] = -1;
        }
      }
      // if this tile was dead...
      else
      {
        // case where it is now alive
        if ( n == 3 )
        {
          updatedGame[x][y] = 1;
        }
        // case where still dead, with kind type of deadness as before
        else
        {
          updatedGame[x][y] = game[x][y];
        }
      }
    }
  }
  
  game = updatedGame;
}

function drawGame()
{
  canvas.clearRect(0, 0, 1120, 800);

  for (var x=0; x < GAME_SIZE_X; x++)
  {
    for (var y=0; y < GAME_SIZE_Y; y++)
    {
      canvas.beginPath();
      canvas.rect(x*8, y*8, 8, 8);
      if (game[x][y] == 1)
      {
        canvas.fillStyle = COLOR_ALIVE;
        canvas.fill();
      }
      else if (game[x][y] == 0)
      {
        canvas.strokeStyle = COLOR_GRID;
        //canvas.strokeStyle = COLOR_GRID_DEAD;
        canvas.stroke();
      }
      else if (game[x][y] == -1)
      {
        canvas.fillStyle = COLOR_DEAD;
        canvas.fill();
        canvas.strokeStyle = COLOR_GRID;
        canvas.stroke();
      }
    }
  }
}
