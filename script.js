"use strict";

var acornGame = [[40,20],[40,22],[39,22],[42,21],[43,22],[44,22],[45,22]];
var game = [];
var canvas, canvasDocItem;
var pauseButton;
var gameRunning = false;
var tickSpeedSelect = 3;
var gameSizeSelect = 1;
var canvasDocItem, canvas, pauseButton;
var gridWidth, gridHeight;
var gameSizeX, gameSizeY;
var maxX, maxY;

var COLOR_GRID = '#80aaff';
var COLOR_DEAD = '#ffe4b3';
var COLOR_ALIVE = '#ffa500';
var TICK_SPEEDS = [20,40,60,80,100,160,280,480,720,1020,1500];
var GAME_SIZES = [{x:70,y:50},{x:140,y:100},{x:210,y:150}];

// for game array:
// 1 => alive
// 0 => has always been dead
// -1 => dead, but was once alive

(function()
{
  canvasDocItem = document.getElementById('game');
  canvas = canvasDocItem.getContext('2d');
  pauseButton = document.getElementById("PauseButton");

  // start up the simulation
  initGame();
  drawGame();
  runGame();

  // handler for user click behavior
  canvasDocItem.onclick = function(e) {
    toggleTile(getClickCell(e));
    drawGame();
  };
})();

function initGame()
{
  // calculate game size
  gameSizeX = GAME_SIZES[gameSizeSelect].x;
  gameSizeY = GAME_SIZES[gameSizeSelect].y;
  maxX = gameSizeX-1;
  maxY = gameSizeY-1;

  // calculate grid height and width
  gridWidth = canvasDocItem.getAttribute("width") / gameSizeX;
  gridHeight = canvasDocItem.getAttribute("height") / gameSizeY;

  clearBoard();
  
  for (var i=0; i < acornGame.length; i++)
    game[acornGame[i][0]][acornGame[i][1]] = 1;
}

// handler for use with the html button
function makeAcorn()
{
  initGame();
  drawGame();
}

function changeSize() {
  if (gameSizeSelect == GAME_SIZES.length-1)
    gameSizeSelect = 0;
  else
    gameSizeSelect++;

  initGame();
  drawGame();
}

// advances the simulation one generation periodically based on the tick speed
function runGame()
{
  if (gameRunning)
  {
    tickGame();
    drawGame();
  }
  setTimeout(function() {runGame();}, TICK_SPEEDS[tickSpeedSelect]);
}

// for clearing the whole board
function clearBoard()
{
  for (var x=0; x<gameSizeX; x++)
  {
    game[x] = [];
    for (var y=0; y<gameSizeY; y++)
    {
      game[x][y] = 0;
    }
  }
  pauseButton.innerHTML = "Start";
  gameRunning = false;

  drawGame();
}

// handler for use with the tick game button
function tickGameButton()
{
  if (!gameRunning)
  {
    tickGame();
    drawGame();
  }
}

// randomizes board
function randomizeBoard()
{
  for (var x=0; x<gameSizeX; x++)
  {
    game[x] = [];
    for (var y=0; y<gameSizeY; y++)
    {
      game[x][y] = Math.round(Math.random());
    }
  }
  drawGame();
}

// faster tick speed
function tickSpeedUp()
{
  if (tickSpeedSelect > 0)
    tickSpeedSelect--;
}

// slower tick speed
function tickSpeedDown()
{
  if (tickSpeedSelect < (TICK_SPEEDS.length - 1))
    tickSpeedSelect++;
}

// pauses or unpauses the game
function togglePauseButton()
{
  if (gameRunning)
  {
    pauseButton.innerHTML = "Resume";
    gameRunning = false;
  }
  else
  {
    pauseButton.innerHTML = "Pause";
    gameRunning = true;
  }
}

// helper function for counting number of live neighbours to a cell 
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

// helper function for checking whether a neightbour cell is alive,
// even nonexistent ones that are off the side of the board
function getTile(x, y)
{
  // if not past any borders, return normal value of this tile
  if (0 <= x && x <= maxX && 0 <= y && y <= maxY)
    return game[x][y];

  // otherwise we need to go to other side of board
  var realX = x;
  var realY = y;
  if (x == -1)
    realX = maxX;
  else if (x == gameSizeX)
    realX = 0;
  if (y == -1)
    realY = maxY;
  else if (y == gameSizeY)
    realY = 0;

  return game[realX][realY];
}

// moves the game forward one generation
function tickGame()
{
  var updatedGame = [];

  for (var x=0; x < gameSizeX; x++)
  {
    updatedGame[x] = [];
    for (var y=0; y < gameSizeY; y++)
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

// draws game to canvas
function drawGame()
{
  canvas.clearRect(0, 0, 1120, 800);

  for (var x=0; x < gameSizeX; x++)
  {
    for (var y=0; y < gameSizeY; y++)
    {
      canvas.beginPath();
      canvas.rect(x*gridWidth, y*gridHeight, gridWidth, gridHeight);
      if (game[x][y] == 1)
      {
        canvas.fillStyle = COLOR_ALIVE;
        canvas.fill();
      }
      else if (game[x][y] === 0)
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

function getClickCell(event) {
  // get the pixel locations of the click relative to the canvas
  var reference = canvasDocItem.getBoundingClientRect();
  var x = event.clientX - reference.left;
  var y = event.clientY - reference.top;

  // calculate the canvas tile for this click
  x = Math.floor(x / gridWidth);
  y = Math.floor(y / gridHeight);

  return {x: x, y: y};
}

function toggleTile(tile) {
  if (game[tile.x][tile.y] == 1)
    game[tile.x][tile.y] = -1;
  else
    game[tile.x][tile.y] = 1;
}