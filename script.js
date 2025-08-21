const squares = document.querySelectorAll(".square");
const scorePlayer1 = document.querySelector(".scorePlayer1");
const scorePlayer2 = document.querySelector(".scorePlayer2");
const warning = document.querySelector(".warning");
squares.forEach((square, index) => {
  square.addEventListener("click", (e) => {
    gameController.playRound(index);
  });
});

const startGame = (() => {
  const startBtn = document.querySelector("#start");
  startBtn.addEventListener("click", (e) => {
    e.target.style.visibility = "hidden";
    e.target.closest(".startScreen").style.textShadow =
      "0 0 10px  rgba(255, 191, 5, 0.5)";
    document.querySelector(".gameScreen").style =
      "visibility: visible; width: 100%";
    gameBoard.resetBoard();
  });

  const getBtn = () => startBtn;

  return { getBtn };
})();

const gameBoard = (() => {
  let board = Array(9).fill("");

  const render = () => {
    board.forEach((marker, index) => {
      const currentSquare = squares[index];
      currentSquare.textContent = marker;
    });
  };
  const drawGame = (index, marker) => {
    board[index] = marker;
    render();
  };

  const getBoard = () => board;
  const resetBoard = () => {
    board = Array(9).fill("");
    squares.forEach((square) => {
      square.classList.remove("win");
      square.classList.remove("draw");
    });
    warning.textContent = "";
    render();
  };

  const showDraw = () => {
    squares.forEach((square) => {
      square.classList.add("draw");
    });
  };

  const showWinners = (winLine) => {
    winLine.forEach((index) => {
      squares[index].classList.add("win");
    });
  };
  render();
  return { drawGame, getBoard, resetBoard, showWinners, showDraw };
})();

const defineWinner = () => {
  const winnerCombos = [
    //columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const combos of winnerCombos) {
    const [a, b, c] = combos;
    if (
      gameBoard.getBoard()[a] &&
      gameBoard.getBoard()[a] == gameBoard.getBoard()[b] &&
      gameBoard.getBoard()[a] == gameBoard.getBoard()[c]
    ) {
      return { winner: gameBoard.getBoard()[a], line: combos };
    }
  }

  return null;
};

const playerFactory = (marker, name) => {
  let roundWins = 0;
  const getRoundWins = () => roundWins;
  const increaseRoundWins = () => roundWins++;
  const resetWins = () => (roundWins = 0);

  return { name, marker, getRoundWins, increaseRoundWins, resetWins };
};

const gameController = (() => {
  const player1 = playerFactory("X", "Player 1");
  const player2 = playerFactory("O", "Player 2");

  let currentPlayer = player1;
  let turnCount = 0;

  const switchPlayer = () =>
    (currentPlayer = currentPlayer === player1 ? player2 : player1);

  const playRound = (index) => {
    if (gameBoard.getBoard()[index]) {
      return;
    }
    gameBoard.drawGame(index, currentPlayer.marker);
    const result = defineWinner();
    turnCount++;
      if (result) {
        const winner = result.winner === player1.marker ? player1 : player2;
        const scoreElement = winner === player1 ? scorePlayer1 : scorePlayer2;

        winner.increaseRoundWins();

        if (winner.getRoundWins() === 3) {
          document.querySelector(".gameScreen").style.visibility = "hidden";
          const playAgainBtn = startGame.getBtn();
          playAgainBtn.style.visibility = "visible";
          playAgainBtn.style.width = "auto";
          playAgainBtn.textContent = "Play Again!";
          warning.textContent = `${winner.name} is the winner!!`;

          player1.resetWins();
          player2.resetWins();
          scorePlayer1.textContent = 0;
          scorePlayer2.textContent = 0;
        } else {
          warning.textContent = `${winner.name} won this round!`;
          scoreElement.textContent = winner.getRoundWins();
        }
        gameBoard.showWinners(result.line);
        setTimeout(gameBoard.resetBoard, 2000);
        turnCount = 0;
        return;
      }
      if (turnCount === 9) {
        warning.textContent = "It's a draw!";
        gameBoard.showDraw();
        setTimeout(gameBoard.resetBoard, 2000);
        turnCount = 0;
        return;
      }
      switchPlayer();
      warning.textContent = `It's ${currentPlayer.name} time!`;
    }
  return { playRound };
})();
