// ============================================================================
// ROYAL CHESS ARENA — GRANDMASTER AI & POSITIONAL EVALUATION ENGINE
// ============================================================================

const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000
};

// Piece-Square Tables (from White's perspective, rank 8 down to rank 1)
const PST = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

export function evaluateBoard(chess) {
  if (chess.isCheckmate()) {
    return chess.turn() === 'w' ? -99999 : 99999;
  }
  if (chess.isDraw() || chess.isStalemate() || chess.isThreefoldRepetition()) {
    return 0;
  }

  const board = chess.board();
  let score = 0;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const base = PIECE_VALUES[piece.type] || 0;
      const table = PST[piece.type];
      const positional = table
        ? piece.color === 'w'
          ? table[r][c]
          : table[7 - r][c]
        : 0;

      if (piece.color === 'w') {
        score += base + positional;
      } else {
        score -= base + positional;
      }
    }
  }

  if (chess.inCheck()) {
    score += chess.turn() === 'w' ? -35 : 35;
  }

  return score;
}

export function evaluateBoardForBar(chess) {
  if (chess.isCheckmate()) {
    const winW = chess.turn() === 'b';
    return {
      cp: winW ? 9999 : -9999,
      display: winW ? 'M' : '-M',
      whitePercent: winW ? 100 : 0
    };
  }
  if (chess.isGameOver()) {
    return { cp: 0, display: '0.0', whitePercent: 50 };
  }

  const cp = evaluateBoard(chess);
  const pawns = cp / 100;
  const sign = pawns > 0 ? '+' : '';
  const display = `${sign}${pawns.toFixed(1)}`;
  // Sigmoid curve to map centipawns to 5%..95% bar height
  const clamped = Math.max(-1200, Math.min(1200, cp));
  const whitePercent = Math.round(50 + 46 * Math.tanh(clamped / 450));

  return { cp, display, whitePercent };
}

function orderMoves(moves) {
  return moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += 10 * (PIECE_VALUES[a.captured] || 100) - (PIECE_VALUES[a.piece] || 100) / 10;
    if (b.captured) scoreB += 10 * (PIECE_VALUES[b.captured] || 100) - (PIECE_VALUES[b.piece] || 100) / 10;
    if (a.promotion) scoreA += PIECE_VALUES[a.promotion] || 800;
    if (b.promotion) scoreB += PIECE_VALUES[b.promotion] || 800;
    if (a.san.includes('+')) scoreA += 60;
    if (b.san.includes('+')) scoreB += 60;
    return scoreB - scoreA;
  });
}

function minimax(chess, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoard(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      if (evaluation > maxEval) maxEval = evaluation;
      if (evaluation > alpha) alpha = evaluation;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      if (evaluation < minEval) minEval = evaluation;
      if (evaluation < beta) beta = evaluation;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function findBestMove(chess, level = 3) {
  const moves = orderMoves(chess.moves({ verbose: true }));
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  // Level 1: Beginner (random + occasional simple capture)
  if (level === 1) {
    const captures = moves.filter((m) => m.captured);
    if (captures.length > 0 && Math.random() < 0.45) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = level === 2 ? 2 : level === 3 ? 3 : 3;
  const isWhite = chess.turn() === 'w';
  let bestMove = moves[0];
  let bestVal = isWhite ? -Infinity : Infinity;

  let alpha = -Infinity;
  let beta = Infinity;

  for (const move of moves) {
    chess.move(move);
    // Add slight randomness at lower levels so games feel natural
    const jitter = level === 2 ? (Math.random() - 0.5) * 35 : level === 3 ? (Math.random() - 0.5) * 10 : 0;
    const val = minimax(chess, depth - 1, alpha, beta, !isWhite) + jitter;
    chess.undo();

    if (isWhite) {
      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }
      if (val > alpha) alpha = val;
    } else {
      if (val < bestVal) {
        bestVal = val;
        bestMove = move;
      }
      if (val < beta) beta = val;
    }
  }

  return bestMove;
}

export function computeCapturedAndMaterial(chess) {
  const startCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
  const current = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0 }
  };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      if (sq && sq.type !== 'k') {
        current[sq.color][sq.type]++;
      }
    }
  }

  // Pieces captured BY White (meaning missing Black pieces)
  const capturedByWhite = [];
  const capturedByBlack = [];
  const order = ['q', 'r', 'b', 'n', 'p'];

  for (const type of order) {
    const missingB = Math.max(0, startCounts[type] - current.b[type]);
    for (let i = 0; i < missingB; i++) capturedByWhite.push(type);

    const missingW = Math.max(0, startCounts[type] - current.w[type]);
    for (let i = 0; i < missingW; i++) capturedByBlack.push(type);
  }

  const weights = { p: 1, n: 3, b: 3, r: 5, q: 9 };
  let whiteMat = 0;
  let blackMat = 0;
  for (const type of order) {
    whiteMat += current.w[type] * weights[type];
    blackMat += current.b[type] * weights[type];
  }

  return {
    capturedByWhite,
    capturedByBlack,
    whiteAdvantage: Math.max(0, whiteMat - blackMat),
    blackAdvantage: Math.max(0, blackMat - whiteMat)
  };
}

