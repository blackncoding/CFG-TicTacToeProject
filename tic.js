// Gets all the individual cells on the game board
const cells = document.querySelectorAll(".cell");

// Gets the H2 element that displays the current game status (in the HTML)
const gameStatus = document.querySelector("#gameStatus");

// Gets the button that needs to be clicked for players to restart the game
const restartBtn = document.querySelector("#restartBtn");

// Define the possible ways to win the game. This will be used to check a winner after each input
const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal from top left to bottom right
  [2, 4, 6], // Diagonal from top right to bottom left
];

// Create an empty game board, where each cell is initially unmarked. It is an array of empty strings instead of a completely empty array makes it easier to update as we  dont need to consider length of the array changinng as this has been predefined as 9, which perfectly represents the gamboard
let gameBoard = ["", "", "", "", "", "", "", "", ""];

// Track the current player and whether the game is active
let currentPlayer = "X"; // Player X, which is also player 1 starts the game at inisialisation
let isGameActive = false; // The game isn't running yet as the sells have not yet been

// Run the initialiseGame function as soon as the page loads
initialiseGame();
function initialiseGame() {
  // Allow each cell to respond when clicked. The forEach loop allows us to access each individual cell within the "cells" querySelectorAll we have
  cells.forEach((cell) => cell.addEventListener("click", clicked));

  // Set up the restart button to work when clicked as soon as page loads
  restartBtn.addEventListener("click", restartGame);

  // Display a message letting the first player know to start the game
  gameStatus.textContent = `Waiting for Player ${currentPlayer} to start the game`;

  // Indicate that game has started
  isGameActive = true;
}

//This is the function carried out when each cell is clicked
function clicked() {
  const cellID = event.target.id; //Whenever each cell clicked, we want to know the ID, this will help update the gameboard

  // If there are no empty cells (draw) or game isnt active due to a win stop the function here
  if (gameBoard[cellID] != "" || !isGameActive) {
    return; //Return means cell will no longer be updated and check winner will no longer happen
  }

  // Apply the current player's move to the cell and check if there's a winner
  updateCell(cellID); //Run the updateCell function to update the cell whener it is clicked
}

function updateCell(id) {
  gameBoard[id] = currentPlayer; // The index of the cell selected represents the index within the gameBoard array that will be updated with the symbol of the current plyer . i.e. if cell with id 8 of 8 is selected, in gamBeoard array the last index (index 8 aka position 9) will be updated from an empty string to X or O depending on who the current player is
  const cell = document.getElementById(id);
  cell.textContent = currentPlayer; // Update the text within the selected
  addColour(cell); // Run the addColour function so that each player gets a colour cwhen they click on the cell
  checkWinner(); //With each click, check if there is a winner yet
}

function addColour(cell) {
  if (currentPlayer == "X") {
    cell.style.color = "#91e5f6"; // When a cell is clciked and it is Player X's turn, make their character this colour
  } else {
    cell.style.color = "#02c39a"; // Same as above but for )
  }
}

function checkWinner() {
  let hasWon = false; // Start off with noone having won

  // In the for loop to iterate through all winning combinations as defined previously
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i]; // Get the current win condition
    const a = gameBoard[condition[0]]; // Get the value of the first cell in the condition
    const b = gameBoard[condition[1]]; // Get the value of the second cell in the condition
    const c = gameBoard[condition[2]]; // Get the value of the third cell in the condition

    // If any cell in this condition is empty, keep the loop going
    if (!a || !b || !c) {
      continue; //
    }

    // If all three cells have the same symbol, a player has won. player win deoends on the X or O positions in the gameboard
    if (a === b && b === c) {
      hasWon = true; // Update that winning condition has been met, this allows us to run our if function below
      break; // Exit the loop because there is a winner so we dont need to loop any further
    }
  }

  //if hasWon is true, as it will be if a==b &b==c
  if (hasWon) {
    gameStatus.textContent = `GAME OVER: ${currentPlayer} has Won!`; //Show who has won in gameStatus H2
    gameStatus.style.color = "red"; //change the colour of the status from white in CSS to red
    updatePlayerScore(currentPlayer); // update the player score to add 1 to whoever the current player was. current player is the last person who played as that would be the person who won the game
    isGameActive = false; // End the game since a winner is declared
  } else if (!gameBoard.includes("")) {
    //if gameBoard no longer has any empty arraws consider this a draw
    gameStatus.textContent = "GAME OVER: Match draw";
    isGameActive = false; // End the game in a draw is there is a draw
  } else {
    changePlayer(); // If no-one has either won or there is not a draw switch to the other player's turn
  }
}

function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X"; // if current player is X, if noone has won yet switch to O and vice versa
  gameStatus.textContent = `Waiting for Player ${currentPlayer} to play turn`;
}

// Keep track of the number of wins for each player
let xWins = 0; // Player 1 wins, this is set to 0 when page is loaded
let oWins = 0; // Player 2 wins counter, this is set to 0 when page is loaded

//aAd a counter to count the number of times a player has won. this will update the x/OWins variables. this is only run when someone has won
function updatePlayerScore(winningPlayer) {
  if (winningPlayer === "X") {
    xWins++;
  } else if (winningPlayer === "O") {
    oWins++;
  }

  // Update the scoreboard display
  const xScoreDisplay = document.querySelector("#xScore");
  const oScoreDisplay = document.querySelector("#oScore");
  xScoreDisplay.textContent = `Player X: ${xWins} wins`; //Display with current value of x/O as determined by the update player score function
  oScoreDisplay.textContent = `Player O: ${oWins} wins`;
}

//Restart game button
function restartGame() {
  currentPlayer = currentPlayer === "X" ? "O" : "X"; //if X started last game, O will start next game. X always starts the game as indicated gloablly before game insitialisation
  gameBoard = ["", "", "", "", "", "", "", "", ""]; //make gameboard empty again
  gameStatus.textContent = `Waiting for ${currentPlayer} to start game`; //tell current player on a display that it is their turn
  cells.forEach((cell) => {
    cell.textContent = "";
  }); //For each cell remove the X and Os
  isGameActive = true; // Change gameactive back to true as we have a new game
  gameStatus.style.color = "white"; //Change game display back to white at it is usually red if someone has won
}
