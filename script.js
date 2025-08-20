const gameBoard = (() => {
  let board = Array(9).fill("");
  const squares = document.querySelectorAll(".square");

  const render = () => {
    board.forEach((marker, index) => {
        const currentSquare = squares[index];
        currentSquare.textContent = marker;

        if(marker){
            currentSquare.classList.add("played");
        }else{
            currentSquare.classList.remove("played");
        }
    })
  };
  const drawGame = (index, marker) => {
    board[index] = marker;
    render();
  };

  const getBoard = () => board;
  const resetBoard = () => {
    board = Array(9).fill("");
    render();
  };
  render();
  return { drawGame, getBoard, resetBoard };
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
      return gameBoard.getBoard()[a];
    }
  }

  return null;
};

const playerFactory = (marker) => {
  let roundWins = 0;
  const getRoundWins = () => roundWins;
  const increaseRoundWins = () => roundWins++;
  return { marker, getRoundWins, increaseRoundWins };
};

const gameController = (() => {
  const player1 = playerFactory("X");
  const player2 = playerFactory("O");

  let currentPlayer = player1;
  let turnCount = 0;

  const switchPlayer = () =>
    (currentPlayer = currentPlayer === player1 ? player2 : player1);

  const playRound = (index) => {
    if (gameBoard.getBoard()[index]) {
      console.log("ja jogaram ai, jogue dnv");
      return;
    }
    gameBoard.drawGame(index, currentPlayer.marker);
    const winnerSymbol = defineWinner();
    turnCount++;
    if (winnerSymbol) {
      if (winnerSymbol === player1.marker) {
        player1.increaseRoundWins();
        if (player1.getRoundWins() === 3) {
          console.log("o player1 é o grande vencedor!!");
          return;
        } else {
          console.log(`Vitória! O round é do player1!`);
        }
      } else {
        player2.increaseRoundWins();
        if (player2.getRoundWins() === 3) {
          console.log("o player2 é o grande vencedor!!");
          return;
        } else {
          console.log(`Vitória! O round é do player2!`);
        }
      }
      gameBoard.resetBoard();
      turnCount = 0;
      return;
    }
    if (turnCount === 9) {
      console.log("Deu velha!");
      gameBoard.resetBoard();
      turnCount = 0;
      return;
    }
    switchPlayer();
    console.log(`vez do jogador ${currentPlayer.marker}!`);
  };

  return { playRound };
})();