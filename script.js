let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameOver = false;
let gameMode = '';
let playerSymbol = 'X';
let aiSymbol = 'O';
let difficulty = 'easy';
let scores = { player: 0, ia: 0, draw: 0 };

function startGame(mode) {
  gameMode = mode;
  resetGame();
}

function setPlayer(symbol) {
  playerSymbol = symbol;
  aiSymbol = symbol === 'X' ? 'O' : 'X';
  currentPlayer = 'X';
}

function setDifficulty(level) {
  difficulty = level;
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  isGameOver = false;
  currentPlayer = 'X';
  drawBoard();
  showMessage(`À ${currentPlayer} de jouer`);
  if (gameMode === 'ia' && aiSymbol === 'X') {
    aiMove();
  }
}

function resetScores() {
  scores = { player: 0, ia: 0, draw: 0 };
  updateScores();
}

function drawBoard() {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((cell, i) => {
    const cellDiv = document.createElement('div');
    cellDiv.classList.add('cell');
    cellDiv.textContent = cell;
    if (!cell && !isGameOver) {
      cellDiv.addEventListener('click', () => makeMove(i));
    }
    boardDiv.appendChild(cellDiv);
  });
}

function makeMove(index) {
  if (board[index] || isGameOver) return;

  board[index] = currentPlayer;
  drawBoard();
  if (checkWin(currentPlayer)) {
    endGame(currentPlayer);
    return;
  }

  if (board.every(cell => cell)) {
    endGame(null);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  showMessage(`À ${currentPlayer} de jouer`);

  if (gameMode === 'ia' && currentPlayer === aiSymbol) {
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  let index;
  if (difficulty === 'easy') {
    const emptyIndices = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  } else {
    index = minimax(board, aiSymbol).index;
  }

  makeMove(index);
}

function minimax(newBoard, player) {
  const emptyIndices = newBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);

  if (checkWinOnBoard(newBoard, playerSymbol)) return { score: -10 };
  if (checkWinOnBoard(newBoard, aiSymbol)) return { score: 10 };
  if (emptyIndices.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < emptyIndices.length; i++) {
    const index = emptyIndices[i];
    const move = { index };
    newBoard[index] = player;

    const result = minimax(newBoard, player === aiSymbol ? playerSymbol : aiSymbol);
    move.score = result.score;

    newBoard[index] = '';
    moves.push(move);
  }

  let bestMove;
  if (player === aiSymbol) {
    let bestScore = -Infinity;
    moves.forEach(m => {
      if (m.score > bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach(m => {
      if (m.score < bestScore) {
        bestScore = m.score;
        bestMove = m;
      }
    });
  }

  return bestMove;
}

function checkWin(player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(combo => combo.every(i => board[i] === player));
}

function checkWinOnBoard(b, player) {
  const combos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return combos.some(combo => combo.every(i => b[i] === player));
}

function endGame(winner) {
  isGameOver = true;
  const sound = document.getElementById('winSound');
  if (winner) {
    showMessage(`${winner} gagne ! 🎉`);
    sound.play();
    if (winner === playerSymbol) scores.player++;
    else scores.ia++;
  } else {
    showMessage("Match nul !");
    scores.draw++;
  }
  updateScores();
}

function updateScores() {
  document.getElementById('score-player').textContent = scores.player;
  document.getElementById('score-ia').textContent = scores.ia;
  document.getElementById('score-draw').textContent = scores.draw;
}

function showMessage(text) {
  document.getElementById('message').textContent = text;
}

function toggleMusic() {
  const music = document.getElementById('bgMusic');
  music.muted = !music.muted;
}
