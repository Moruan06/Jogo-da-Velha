// --- MODULE for managing the game data (the board array) ---
const gameBoard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const updateSquare = (index, marker) => {
    if (index >= 0 && index < board.length) {
      board[index] = marker;
    }
  };

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  return { getBoard, updateSquare, resetBoard };
})();

// --- MODULE for controlling what the player sees (DOM interaction) ---
const displayController = (() => {
  const squares = document.querySelectorAll(".square");
  const scorePlayer1 = document.querySelector(".scorePlayer1");
  const scorePlayer2 = document.querySelector(".scorePlayer2");
  const warning = document.querySelector(".warning");

  const updateBoard = () => {
    const board = gameBoard.getBoard();
    board.forEach((marker, index) => {
      squares[index].textContent = marker;
      squares[index].disabled = !!marker;
    });
  };

  const updateScores = (p1Score, p2Score) => {
    scorePlayer1.textContent = p1Score;
    scorePlayer2.textContent = p2Score;
  };

  const showMessage = (message) => {
    warning.textContent = message;
  };

  const highlightResult = (result, line) => {
    if (result === "win") {
      line.forEach((index) => squares[index].classList.add("win"));
    } else if (result === "draw") {
      squares.forEach((square) => square.classList.add("draw"));
    }
  };

  const clearHighlights = () => {
    squares.forEach((square) => {
      square.classList.remove("win");
      square.classList.remove("draw");
    });
  };

  // Add click listeners to squares, which call the game controller
  squares.forEach((square) => {
    square.addEventListener("click", (e) => {
      // Use data-index from the HTML for a cleaner approach
      const index = parseInt(e.target.dataset.index);
      gameController.playRound(index);
    });
  });

  return { updateBoard, updateScores, showMessage, highlightResult, clearHighlights };
})();

// --- FACTORY for creating player objects ---
const playerFactory = (marker, name) => {
  let roundWins = 0;
  const getRoundWins = () => roundWins;
  const increaseRoundWins = () => roundWins++;
  const resetWins = () => (roundWins = 0);
  return { name, marker, getRoundWins, increaseRoundWins, resetWins };
};

// --- MODULE for the main game logic (the "brain") ---
const gameController = (() => {
  const player1 = playerFactory("X", "Player 1");
  const player2 = playerFactory("O", "Player 2");
  let currentPlayer = player1;
  let turnCount = 0;
  let isGameOver = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    displayController.showMessage(`It's ${currentPlayer.name}'s turn!`);
  };

  const checkWinner = () => {
    const board = gameBoard.getBoard();
    const winnerCombos = [
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 4, 8], [2, 4, 6],           // Diagonals
    ];

    for (const combo of winnerCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combo };
      }
    }
    return null;
  };

  const startNewRound = () => {
    gameBoard.resetBoard();
    displayController.clearHighlights();
    displayController.updateBoard();
    turnCount = 0;
    isGameOver = false;
    switchPlayer(); // Start the new round with the next player
  };
  
  const playRound = (index) => {
    if (gameBoard.getBoard()[index] || isGameOver) {
      return; // Stop if square is taken or round is over
    }

    gameBoard.updateSquare(index, currentPlayer.marker);
    displayController.updateBoard();
    turnCount++;

    const result = checkWinner();
    if (result) {
      isGameOver = true;
      const winner = result.winner === player1.marker ? player1 : player2;
      winner.increaseRoundWins();
      displayController.updateScores(player1.getRoundWins(), player2.getRoundWins());
      displayController.highlightResult("win", result.line);
      
      if (winner.getRoundWins() === 3) {
        displayController.showMessage(`${winner.name} is the grand winner!!`);
      } else {
        displayController.showMessage(`${winner.name} won this round!`);
        setTimeout(startNewRound, 2000);
      }
      return;
    }

    if (turnCount === 9) {
      isGameOver = true;
      displayController.showMessage("It's a draw!");
      displayController.highlightResult("draw");
      setTimeout(startNewRound, 2000);
      return;
    }
    switchPlayer();
  };
  
  return { playRound };
})();

const startGame = (() => {
    const startBtn = document.querySelector("#start");
    const startScreen = document.querySelector(".startScreen");
    const gameScreen = document.querySelector(".gameScreen");

    startBtn.addEventListener("click", () => {
        startScreen.style.display = "none";
        gameScreen.style.visibility = "visible";
        gameScreen.style.width = "100%";
        displayController.showMessage("It's Player 1's turn!");
    });
})();