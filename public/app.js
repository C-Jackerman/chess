import { Chess } from '/vendor/chess.js';
import {
  BOARD_THEMES,
  PIECE_SETS,
  UI_THEMES,
  AVATAR_LIST,
  TITLE_LIST,
  renderPieceSVG,
  soundEngine,
  detectOpeningName
} from '/pieces.js';
import {
  evaluateBoardForBar,
  findBestMove,
  computeCapturedAndMaterial
} from '/ai.js';

// ============================================================================
// PERSISTENT USER PROFILE & CUSTOMIZATION SETTINGS
// ============================================================================
const STORAGE_KEYS = {
  PROFILE: 'rca_profile_v1',
  SETTINGS: 'rca_settings_v1'
};

function generatePlayerId() {
  return 'p_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

const defaultProfile = {
  playerId: generatePlayerId(),
  name: 'Kỳ Thủ ' + Math.floor(100 + Math.random() * 899),
  avatar: '♔',
  title: 'GM'
};

const defaultSettings = {
  boardTheme: 'emerald',
  pieceSet: 'staunton',
  uiTheme: 'obsidian',
  soundPack: 'wood',
  board3d: false,
  showEval: true,
  showLegal: true,
  showCoords: true,
  autoQueen: false,
  autoFlipLocal: false,
  tabletopMode: false
};

let userProfile = loadJSON(STORAGE_KEYS.PROFILE, defaultProfile);
if (!userProfile.playerId) userProfile.playerId = generatePlayerId();
if (!['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟','◆','❖','✦','❂'].includes(userProfile.avatar)) {
  userProfile.avatar = '♔';
}
saveJSON(STORAGE_KEYS.PROFILE, userProfile);

let userSettings = { ...defaultSettings, ...loadJSON(STORAGE_KEYS.SETTINGS, defaultSettings) };

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : { ...fallback };
  } catch (_) {
    return { ...fallback };
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {}
}

// ============================================================================
// CORE GAME STATE
// ============================================================================
const state = {
  mode: 'online', // 'online' | 'ai' | 'local'
  chess: new Chess(),
  flipped: false, // false = White at bottom, true = Black at bottom
  selectedSquare: null,
  legalMovesForSelected: [],
  lastMove: null,
  moveHistory: [], // [{ san, from, to, fen, color, captured, flags }]
  viewStepIndex: -1, // -1 means viewing live position; 0..N-1 means viewing history
  pendingPromotion: null, // { from, to, color }
  rightClickSquares: new Set(),
  customArrows: [], // [{ from, to, color }]
  hintArrow: null, // { from, to }

  // AI Mode State
  aiLevel: 3,
  aiPlayerColor: 'w', // human color in AI mode ('w' or 'b')
  aiThinking: false,

  // Clocks for AI / Local modes
  localTimeControl: '10+0',
  clocks: {
    enabled: false,
    initialMs: 600000,
    incrementMs: 0,
    w: 600000,
    b: 600000,
    lastTick: null
  },
  gameEnded: false,
  gameResult: null,

  // Online Room State
  socket: null,
  onlineRoom: null,
  onlineRole: null, // 'w' | 'b' | 'spectator'
  pendingOfferType: null // 'draw' | 'undo'
};

// ============================================================================
// DOM ELEMENTS
// ============================================================================
const el = {
  appLayout: document.getElementById('app-layout'),
  board: document.getElementById('chessboard'),
  arrowsSvg: document.getElementById('board-arrows-svg'),
  reactionsOverlay: document.getElementById('reactions-overlay'),
  evalContainer: document.getElementById('eval-bar-container'),
  evalFillWhite: document.getElementById('eval-fill-white'),
  evalScoreText: document.getElementById('eval-score-text'),
  openingDisplay: document.getElementById('opening-name-display'),
  turnPill: document.getElementById('turn-status-pill'),
  turnDot: document.getElementById('turn-dot'),
  turnText: document.getElementById('turn-status-text'),

  // Player Bars
  topBar: document.getElementById('player-bar-top'),
  topAvatar: document.getElementById('top-player-avatar'),
  topConn: document.getElementById('top-player-conn'),
  topTitle: document.getElementById('top-player-title'),
  topName: document.getElementById('top-player-name'),
  topCaptured: document.getElementById('top-captured-pieces'),
  topMaterial: document.getElementById('top-material-badge'),
  topClock: document.getElementById('top-player-clock'),

  bottomBar: document.getElementById('player-bar-bottom'),
  bottomAvatar: document.getElementById('bottom-player-avatar'),
  bottomConn: document.getElementById('bottom-player-conn'),
  bottomTitle: document.getElementById('bottom-player-title'),
  bottomName: document.getElementById('bottom-player-name'),
  bottomCaptured: document.getElementById('bottom-captured-pieces'),
  bottomMaterial: document.getElementById('bottom-material-badge'),
  bottomClock: document.getElementById('bottom-player-clock'),

  // Modals & Overlays
  promotionModal: document.getElementById('promotion-modal'),
  promotionOptions: document.getElementById('promotion-options'),
  waitingOverlay: document.getElementById('waiting-room-overlay'),
  waitingCode: document.getElementById('waiting-overlay-code'),
  incomingOfferBanner: document.getElementById('incoming-offer-banner'),
  incomingOfferText: document.getElementById('incoming-offer-text'),
  gameoverModal: document.getElementById('gameover-modal'),
  gameoverIcon: document.getElementById('gameover-icon'),
  gameoverTitle: document.getElementById('gameover-title'),
  gameoverSubtitle: document.getElementById('gameover-subtitle'),

  // Right Panel
  movesTbody: document.getElementById('moves-tbody'),
  moveCountBadge: document.getElementById('move-count-badge'),
  chatMessages: document.getElementById('chat-messages'),
  chatForm: document.getElementById('chat-form'),
  chatInput: document.getElementById('chat-input'),

  // Left Panel & Online Controls
  sectionOnline: document.getElementById('section-online-controls'),
  sectionAi: document.getElementById('section-ai-controls'),
  sectionLocal: document.getElementById('section-local-controls'),
  activeRoomBox: document.getElementById('active-room-box'),
  activeRoomCode: document.getElementById('active-room-code'),
  activeRoomRole: document.getElementById('active-room-role'),
  lobbyRoomsList: document.getElementById('lobby-rooms-list'),
  lobbyRoomCount: document.getElementById('lobby-room-count'),
  onlineCountText: document.getElementById('online-count-text'),

  // Profile Elements
  headerAvatar: document.getElementById('header-avatar'),
  headerUsername: document.getElementById('header-username'),
  profileCardAvatar: document.getElementById('profile-card-avatar'),
  profileCardTitle: document.getElementById('profile-card-title'),
  profileCardName: document.getElementById('profile-card-name'),
  profileModeLabel: document.getElementById('profile-mode-label'),
  profileModal: document.getElementById('profile-modal'),
  inputProfileName: document.getElementById('input-profile-name'),
  titlePickerGrid: document.getElementById('title-picker-grid'),
  avatarPickerGrid: document.getElementById('avatar-picker-grid'),

  toastContainer: document.getElementById('toast-container')
};

// ============================================================================
// INITIALIZATION
// ============================================================================
function init() {
  applySettingsToDOM();
  renderProfileToDOM();
  buildCustomizationStudio();
  buildProfileModalPickers();
  bindUIEvents();
  initSocketConnection();

  // Check if URL has ?room=XXXXXX to auto-join online room
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get('room');
  if (inviteCode) {
    switchMode('online', false);
    setTimeout(() => {
      joinOnlineRoomByCode(inviteCode.trim().toUpperCase());
    }, 350);
  } else {
    // Start a default interactive board ready to play immediately
    startNewAiOrLocalGame('ai', false);
    switchMode('online', false);
  }

  // Local/AI clock interval
  setInterval(tickLocalClock, 200);
  renderAll();
}

// ============================================================================
// SOCKET.IO REAL-TIME MULTIPLAYER
// ============================================================================
function initSocketConnection() {
  if (typeof window.io !== 'function') return;
  const socket = window.io();
  state.socket = socket;

  socket.on('connect', () => {
    // If we were in an online room, auto-rejoin to restore seat
    if (state.onlineRoom && state.onlineRoom.code) {
      socket.emit('room:join', {
        code: state.onlineRoom.code,
        playerId: userProfile.playerId,
        name: userProfile.name,
        avatar: userProfile.avatar,
        title: userProfile.title
      });
    }
  });

  socket.on('lobby:update', ({ rooms = [], onlineCount = 1 } = {}) => {
    el.onlineCountText.textContent = `${onlineCount} online`;
    renderLobbyRooms(rooms);
  });

  socket.on('room:joined', ({ room, role }) => {
    handleOnlineRoomJoined(room, role);
  });

  socket.on('room:state', (room) => {
    syncOnlineRoomState(room);
  });

  socket.on('game:moved', ({ move, room }) => {
    syncOnlineRoomState(room, move);
  });

  socket.on('game:restarted', (room) => {
    el.gameoverModal.classList.add('hidden');
    showToast('Ván tái đấu đã bắt đầu. Hai bên đổi màu quân.');
    if (room.players.w?.playerId === userProfile.playerId) {
      state.onlineRole = 'w';
      state.flipped = false;
    } else if (room.players.b?.playerId === userProfile.playerId) {
      state.onlineRole = 'b';
      state.flipped = true;
    }
    syncOnlineRoomState(room);
    soundEngine.play('castle');
  });

  socket.on('game:over', (room) => {
    syncOnlineRoomState(room);
    if (room.result) {
      showGameOverModal(room.result);
      soundEngine.play('gameover');
    }
  });

  socket.on('room:chat-message', (msg) => {
    appendChatMessage(msg);
  });

  socket.on('room:reaction', ({ emoji, sender }) => {
    spawnFloatingReaction(emoji, sender);
  });
}

function handleOnlineRoomJoined(room, role) {
  state.mode = 'online';
  state.onlineRoom = room;
  state.onlineRole = role;
  state.flipped = role === 'b';
  state.viewStepIndex = -1;
  state.selectedSquare = null;
  state.legalMovesForSelected = [];
  state.hintArrow = null;
  state.customArrows = [];

  updateModeTabsUI('online');
  el.activeRoomBox.classList.remove('hidden');
  document.getElementById('lobby-match-controls')?.classList.add('hidden');
  el.activeRoomCode.textContent = room.code;
  el.activeRoomRole.textContent =
    role === 'w' ? 'Quân Trắng' : role === 'b' ? 'Quân Đen' : 'Khán giả';

  // Update URL without reload so user can copy address bar directly
  const url = new URL(window.location.href);
  url.searchParams.set('room', room.code);
  window.history.replaceState({}, '', url.toString());

  syncOnlineRoomState(room);

  // Switch mobile view to board automatically
  setMobileView('board');
}

function syncOnlineRoomState(room, latestMove = null) {
  const prevMoveCount = state.moveHistory.length;
  state.onlineRoom = room;

  if (room.players.w?.playerId === userProfile.playerId) {
    state.onlineRole = 'w';
  } else if (room.players.b?.playerId === userProfile.playerId) {
    state.onlineRole = 'b';
  }

  state.chess.load(room.fen);
  state.moveHistory = room.moveHistory || [];
  state.lastMove = room.lastMove || null;
  state.gameEnded = room.status === 'ended';
  state.gameResult = room.result || null;

  // Waiting overlay visibility
  if (room.status === 'waiting') {
    el.waitingCode.textContent = room.code;
    el.waitingOverlay.classList.remove('hidden');
  } else {
    el.waitingOverlay.classList.add('hidden');
  }

  // Incoming draw or undo offer check
  const myColor = state.onlineRole;
  if (room.drawOfferBy && room.drawOfferBy !== myColor && (myColor === 'w' || myColor === 'b')) {
    state.pendingOfferType = 'draw';
    el.incomingOfferText.textContent = 'Đối thủ đề nghị hòa cờ';
    el.incomingOfferBanner.classList.remove('hidden');
  } else if (room.undoRequestBy && room.undoRequestBy !== myColor && (myColor === 'w' || myColor === 'b')) {
    state.pendingOfferType = 'undo';
    el.incomingOfferText.textContent = 'Đối thủ xin đi lại 1 nước';
    el.incomingOfferBanner.classList.remove('hidden');
  } else {
    state.pendingOfferType = null;
    el.incomingOfferBanner.classList.add('hidden');
  }

  // Play sound if a new move happened
  if (latestMove || state.moveHistory.length > prevMoveCount) {
    const mv = latestMove || state.lastMove;
    playMoveSound(mv, state.chess.inCheck(), state.chess.isGameOver());
  }

  // Render chat if needed
  if (Array.isArray(room.chat)) {
    renderChatHistory(room.chat);
  }

  renderAll();
}

function createOnlineRoom() {
  if (!state.socket) {
    showToast('⚠️ Đang kết nối máy chủ...');
    return;
  }
  const timeControl = document.getElementById('select-online-tc').value;
  const colorPref = document.getElementById('select-online-color').value;

  state.socket.emit(
    'room:create',
    {
      playerId: userProfile.playerId,
      name: userProfile.name,
      avatar: userProfile.avatar,
      title: userProfile.title,
      timeControl,
      colorPref,
      isPublic: true
    },
    (res) => {
      if (res && res.ok) {
        showToast(`✅ Đã tạo phòng ${res.room.code}! Hãy gửi link mời đối thủ.`);
      }
    }
  );
}

function quickMatchOnline() {
  if (!state.socket) return;
  const timeControl = document.getElementById('select-online-tc').value;
  state.socket.emit(
    'room:quickmatch',
    {
      playerId: userProfile.playerId,
      name: userProfile.name,
      avatar: userProfile.avatar,
      title: userProfile.title,
      timeControl
    },
    (res) => {
      if (res && res.ok) {
        if (res.quickMatchWaiting) {
          showToast(`⚡ Đang tìm đối thủ tại phòng ${res.room.code}...`);
        } else {
          showToast(`⚔️ Đã tìm thấy đối thủ! Ván đấu bắt đầu!`);
        }
      }
    }
  );
}

function joinOnlineRoomByCode(code) {
  if (!code) {
    showToast('⚠️ Vui lòng nhập mã phòng gồm 6 ký tự!');
    return;
  }
  if (!state.socket) return;
  state.socket.emit(
    'room:join',
    {
      code,
      playerId: userProfile.playerId,
      name: userProfile.name,
      avatar: userProfile.avatar,
      title: userProfile.title
    },
    (res) => {
      if (!res || !res.ok) {
        showToast(`❌ ${res?.error || 'Không tìm thấy phòng!'}`);
      } else {
        showToast(`✅ Đã vào phòng ${res.room.code}!`);
      }
    }
  );
}

function leaveOnlineRoom() {
  if (state.socket && state.onlineRoom) {
    state.socket.emit('room:leave');
  }
  state.onlineRoom = null;
  state.onlineRole = null;
  el.activeRoomBox.classList.add('hidden');
  document.getElementById('lobby-match-controls')?.classList.remove('hidden');
  el.waitingOverlay.classList.add('hidden');
  el.incomingOfferBanner.classList.add('hidden');

  const url = new URL(window.location.href);
  url.searchParams.delete('room');
  window.history.replaceState({}, '', url.toString());

  startNewAiOrLocalGame('ai', false);
  state.mode = 'online';
  renderAll();
  showToast('🚪 Đã rời phòng đấu.');
}

function renderLobbyRooms(rooms) {
  el.lobbyRoomCount.textContent = rooms.length;
  if (rooms.length === 0) {
    el.lobbyRoomsList.innerHTML = `<div class="empty-lobby-msg">Chưa có phòng chờ. Bấm <b>Tạo phòng</b> để mời bạn bè.</div>`;
    return;
  }

  el.lobbyRoomsList.innerHTML = rooms
    .map((r) => {
      const isPlaying = r.status === 'playing';
      const btnText = isPlaying ? 'Xem' : 'Vào phòng';
      return `
        <div class="lobby-room-item">
          <div class="lobby-room-info">
            <div class="lobby-room-title">${escapeHtml(r.hostName)}</div>
            <div class="lobby-room-sub">Mã: <b>${r.code}</b> · ${escapeHtml(r.timeControlLabel)}</div>
          </div>
          <button type="button" class="btn-secondary btn-xs" data-join-room="${r.code}">${btnText}</button>
        </div>
      `;
    })
    .join('');

  el.lobbyRoomsList.querySelectorAll('[data-join-room]').forEach((btn) => {
    btn.addEventListener('click', () => {
      joinOnlineRoomByCode(btn.getAttribute('data-join-room'));
    });
  });
}

// ============================================================================
// AI & LOCAL 2-PLAYER GAME MANAGEMENT
// ============================================================================
const TC_MAP = {
  '1+0': { initialMs: 60000, incrementMs: 0 },
  '2+1': { initialMs: 120000, incrementMs: 1000 },
  '3+0': { initialMs: 180000, incrementMs: 0 },
  '3+2': { initialMs: 180000, incrementMs: 2000 },
  '5+0': { initialMs: 300000, incrementMs: 0 },
  '10+0': { initialMs: 600000, incrementMs: 0 },
  '15+10': { initialMs: 900000, incrementMs: 10000 },
  'unlimited': { initialMs: 0, incrementMs: 0 }
};

function startNewAiOrLocalGame(targetMode = state.mode, announce = true) {
  state.mode = targetMode;
  state.chess = new Chess();
  state.selectedSquare = null;
  state.legalMovesForSelected = [];
  state.lastMove = null;
  state.moveHistory = [];
  state.viewStepIndex = -1;
  state.pendingPromotion = null;
  state.hintArrow = null;
  state.customArrows = [];
  state.rightClickSquares.clear();
  state.gameEnded = false;
  state.gameResult = null;
  state.aiThinking = false;

  el.gameoverModal.classList.add('hidden');
  el.waitingOverlay.classList.add('hidden');
  el.incomingOfferBanner.classList.add('hidden');

  if (targetMode === 'ai') {
    const colorChoice = document.getElementById('select-ai-color').value;
    if (colorChoice === 'random') {
      state.aiPlayerColor = Math.random() < 0.5 ? 'w' : 'b';
    } else {
      state.aiPlayerColor = colorChoice;
    }
    state.flipped = state.aiPlayerColor === 'b';
    const tcKey = document.getElementById('select-ai-tc').value;
    setupLocalClocks(tcKey);

    if (announce) {
      showToast(`🤖 Bắt đầu đấu AI (Cấp ${state.aiLevel})! Bạn cầm quân ${state.aiPlayerColor === 'w' ? 'Trắng' : 'Đen'}.`);
    }

    if (state.aiPlayerColor === 'b') {
      triggerAiMove();
    }
  } else if (targetMode === 'local') {
    state.flipped = false;
    const tcKey = document.getElementById('select-local-tc').value;
    setupLocalClocks(tcKey);
    if (announce) {
      showToast('👥 Bắt đầu ván đấu 2 Người 1 Máy!');
    }
  }

  renderAll();
}

function setupLocalClocks(tcKey) {
  const tc = TC_MAP[tcKey] || TC_MAP['unlimited'];
  state.clocks.enabled = tc.initialMs > 0;
  state.clocks.initialMs = tc.initialMs;
  state.clocks.incrementMs = tc.incrementMs;
  state.clocks.w = tc.initialMs;
  state.clocks.b = tc.initialMs;
  state.clocks.lastTick = null;
}

function tickLocalClock() {
  if (state.mode === 'online' && state.onlineRoom) {
    // Smooth client-side interpolation for active online game clock
    if (state.onlineRoom.status === 'playing' && state.onlineRoom.initialMs > 0 && state.moveHistory.length > 0) {
      const turn = state.chess.turn();
      state.onlineRoom.clocks[turn] = Math.max(0, state.onlineRoom.clocks[turn] - 200);
      renderClocksOnly();
    }
    return;
  }

  if (!state.clocks.enabled || state.gameEnded || state.moveHistory.length === 0) {
    return;
  }

  const now = Date.now();
  if (!state.clocks.lastTick) {
    state.clocks.lastTick = now;
    return;
  }
  const delta = Math.max(0, now - state.clocks.lastTick);
  state.clocks.lastTick = now;

  const turn = state.chess.turn();
  state.clocks[turn] = Math.max(0, state.clocks[turn] - delta);

  if (state.clocks[turn] <= 0) {
    state.gameEnded = true;
    const winner = turn === 'w' ? 'b' : 'w';
    state.gameResult = {
      winner,
      reason: 'timeout',
      message: `${winner === 'w' ? 'Quân Trắng' : 'Quân Đen'} thắng do đối phương hết thời gian!`
    };
    showGameOverModal(state.gameResult);
    soundEngine.play('gameover');
    renderAll();
    return;
  }

  renderClocksOnly();
}

// ============================================================================
// CHESS MOVE EXECUTION (ONLINE, AI, LOCAL)
// ============================================================================
function canCurrentUserMovePiece(pieceColor) {
  if (state.gameEnded) return false;
  if (state.viewStepIndex !== -1) return false; // Viewing history
  if (state.chess.turn() !== pieceColor) return false;

  if (state.mode === 'online') {
    if (!state.onlineRoom || state.onlineRoom.status !== 'playing') return false;
    return state.onlineRole === pieceColor;
  }
  if (state.mode === 'ai') {
    if (state.aiThinking) return false;
    return state.aiPlayerColor === pieceColor;
  }
  return true; // Local 2P mode
}

function isPromotionMove(from, to) {
  const piece = state.chess.get(from);
  if (!piece || piece.type !== 'p') return false;
  const targetRank = to[1];
  return (piece.color === 'w' && targetRank === '8') || (piece.color === 'b' && targetRank === '1');
}

function attemptMove(from, to, explicitPromotion = null) {
  if (from === to) return false;
  const legal = state.chess.moves({ square: from, verbose: true });
  const matching = legal.find((m) => m.to === to);
  if (!matching) return false;

  // Check if promotion is needed
  if (isPromotionMove(from, to) && !explicitPromotion) {
    if (userSettings.autoQueen) {
      explicitPromotion = 'q';
    } else {
      openPromotionModal(from, to, state.chess.turn());
      return true;
    }
  }

  const promotion = explicitPromotion || 'q';

  // ONLINE MODE
  if (state.mode === 'online') {
    if (!state.onlineRoom || state.onlineRoom.status !== 'playing') {
      showToast('⚠️ Phòng chưa đủ 2 người chơi! Hãy gửi link mời đối thủ hoặc chuyển sang Đấu AI.');
      return false;
    }
    state.selectedSquare = null;
    state.legalMovesForSelected = [];
    state.hintArrow = null;
    state.customArrows = [];

    state.socket.emit('game:move', { from, to, promotion }, (res) => {
      if (res && !res.ok) {
        showToast(`⚠️ ${res.error}`);
        renderAll();
      }
    });
    return true;
  }

  // AI OR LOCAL MODE
  const moveObj = state.chess.move({ from, to, promotion });
  if (!moveObj) return false;

  if (state.clocks.enabled) {
    if (state.moveHistory.length > 0 && state.clocks.incrementMs > 0) {
      state.clocks[moveObj.color] += state.clocks.incrementMs;
    }
    state.clocks.lastTick = Date.now();
  }

  state.selectedSquare = null;
  state.legalMovesForSelected = [];
  state.hintArrow = null;
  state.customArrows = [];
  state.rightClickSquares.clear();

  state.lastMove = {
    from: moveObj.from,
    to: moveObj.to,
    san: moveObj.san,
    color: moveObj.color,
    captured: moveObj.captured || null,
    flags: moveObj.flags
  };

  state.moveHistory.push({
    san: moveObj.san,
    from: moveObj.from,
    to: moveObj.to,
    promotion: moveObj.promotion || null,
    color: moveObj.color,
    captured: moveObj.captured || null,
    flags: moveObj.flags,
    fen: state.chess.fen()
  });

  playMoveSound(state.lastMove, state.chess.inCheck(), state.chess.isGameOver());

  if (state.mode === 'local' && userSettings.autoFlipLocal && !state.chess.isGameOver()) {
    state.flipped = state.chess.turn() === 'b';
  }

  checkLocalOrAiGameEnd();
  renderAll();

  if (state.mode === 'ai' && !state.gameEnded && state.chess.turn() !== state.aiPlayerColor) {
    triggerAiMove();
  }

  return true;
}

function triggerAiMove() {
  state.aiThinking = true;
  renderStatusBanner();

  setTimeout(() => {
    if (state.mode !== 'ai' || state.gameEnded) {
      state.aiThinking = false;
      return;
    }
    const aiMove = findBestMove(state.chess, state.aiLevel);
    state.aiThinking = false;
    if (!aiMove) return;

    const moveObj = state.chess.move(aiMove);
    if (!moveObj) return;

    if (state.clocks.enabled) {
      if (state.clocks.incrementMs > 0) {
        state.clocks[moveObj.color] += state.clocks.incrementMs;
      }
      state.clocks.lastTick = Date.now();
    }

    state.lastMove = {
      from: moveObj.from,
      to: moveObj.to,
      san: moveObj.san,
      color: moveObj.color,
      captured: moveObj.captured || null,
      flags: moveObj.flags
    };

    state.moveHistory.push({
      san: moveObj.san,
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion || null,
      color: moveObj.color,
      captured: moveObj.captured || null,
      flags: moveObj.flags,
      fen: state.chess.fen()
    });

    playMoveSound(state.lastMove, state.chess.inCheck(), state.chess.isGameOver());
    checkLocalOrAiGameEnd();
    renderAll();
  }, 260);
}

function checkLocalOrAiGameEnd() {
  const c = state.chess;
  if (!c.isGameOver()) return false;

  state.gameEnded = true;
  state.clocks.lastTick = null;

  if (c.isCheckmate()) {
    const winner = c.turn() === 'w' ? 'b' : 'w';
    state.gameResult = {
      winner,
      reason: 'checkmate',
      message: `Chiếu hết! ${winner === 'w' ? 'Quân Trắng' : 'Quân Đen'} giành chiến thắng tuyệt đối!`
    };
  } else if (c.isStalemate()) {
    state.gameResult = {
      winner: 'draw',
      reason: 'stalemate',
      message: 'Hòa cờ do Hết nước đi hợp lệ (Stalemate)!'
    };
  } else if (c.isThreefoldRepetition()) {
    state.gameResult = {
      winner: 'draw',
      reason: 'repetition',
      message: 'Hòa cờ do Lặp lại thế cờ 3 lần!'
    };
  } else if (c.isInsufficientMaterial()) {
    state.gameResult = {
      winner: 'draw',
      reason: 'insufficient',
      message: 'Hòa cờ do Không đủ lực lượng chiếu hết!'
    };
  } else {
    state.gameResult = {
      winner: 'draw',
      reason: 'draw',
      message: 'Ván đấu kết thúc với tỷ số Hòa!'
    };
  }

  showGameOverModal(state.gameResult);
  return true;
}

function playMoveSound(move, isCheck, isGameOver) {
  if (isGameOver) {
    soundEngine.play('gameover');
  } else if (isCheck) {
    soundEngine.play('check');
  } else if (move?.flags?.includes('p')) {
    soundEngine.play('promote');
  } else if (move?.flags?.includes('k') || move?.flags?.includes('q')) {
    soundEngine.play('castle');
  } else if (move?.captured) {
    soundEngine.play('capture');
  } else {
    soundEngine.play('move');
  }
}

// ============================================================================
// RENDERING ENGINE (BOARD, ARROWS, EVAL BAR, PLAYERS, MOVES)
// ============================================================================
function renderAll() {
  renderBoard();
  renderArrows();
  renderEvaluationBar();
  renderPlayerBars();
  renderStatusBanner();
  renderMoveHistoryTable();
}

function getDisplayChessInstance() {
  if (state.viewStepIndex >= 0 && state.viewStepIndex < state.moveHistory.length) {
    const temp = new Chess();
    temp.load(state.moveHistory[state.viewStepIndex].fen);
    return temp;
  }
  return state.chess;
}

function renderBoard() {
  const displayChess = getDisplayChessInstance();
  const boardArray = displayChess.board();
  const inCheck = displayChess.inCheck();
  const turnColor = displayChess.turn();

  const activeLastMove =
    state.viewStepIndex >= 0 && state.viewStepIndex < state.moveHistory.length
      ? state.moveHistory[state.viewStepIndex]
      : state.lastMove;

  const legalSet = new Map();
  if (state.viewStepIndex === -1 && state.selectedSquare) {
    for (const m of state.legalMovesForSelected) {
      legalSet.set(m.to, m);
    }
  }

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const rowIndices = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const colIndices = state.flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  let html = '';

  for (let visualRow = 0; visualRow < 8; visualRow++) {
    const r = rowIndices[visualRow];
    for (let visualCol = 0; visualCol < 8; visualCol++) {
      const c = colIndices[visualCol];
      const sqName = files[c] + ranks[r];
      const isLight = (r + c) % 2 === 0;
      const piece = boardArray[r][c];

      const classes = ['square', isLight ? 'light' : 'dark'];
      if (state.selectedSquare === sqName && state.viewStepIndex === -1) {
        classes.push('selected');
      }
      if (activeLastMove && (activeLastMove.from === sqName || activeLastMove.to === sqName)) {
        classes.push('last-move');
      }
      if (state.rightClickSquares.has(sqName)) {
        classes.push('right-highlight');
      }
      if (inCheck && piece && piece.type === 'k' && piece.color === turnColor) {
        classes.push('king-check');
      }

      const showRankCoord = visualCol === 0;
      const showFileCoord = visualRow === 7;
      const legalMove = legalSet.get(sqName);

      let inner = '';
      if (showRankCoord) {
        inner += `<span class="coord-rank">${ranks[r]}</span>`;
      }
      if (showFileCoord) {
        inner += `<span class="coord-file">${files[c]}</span>`;
      }

      if (piece) {
        inner += `
          <div class="piece-wrap piece-color-${piece.color}" data-piece="${piece.color}${piece.type}">
            ${renderPieceSVG(piece.type, piece.color, userSettings.pieceSet)}
          </div>
        `;
      }

      if (legalMove) {
        if (piece || legalMove.flags.includes('e')) {
          inner += `<span class="legal-capture-ring"></span>`;
        } else {
          inner += `<span class="legal-dot"></span>`;
        }
      }

      html += `<div class="${classes.join(' ')}" data-square="${sqName}" role="gridcell" aria-label="${sqName}">${inner}</div>`;
    }
  }

  el.board.innerHTML = html;
}

function squareToSvgCoords(sq) {
  const file = sq.charCodeAt(0) - 97; // 0..7
  const rank = 8 - parseInt(sq[1], 10); // 0..7
  const visualCol = state.flipped ? 7 - file : file;
  const visualRow = state.flipped ? 7 - rank : rank;
  return {
    x: visualCol * 100 + 50,
    y: visualRow * 100 + 50
  };
}

function renderArrows() {
  const arrows = [...state.customArrows];
  if (state.hintArrow) {
    arrows.push({
      from: state.hintArrow.from,
      to: state.hintArrow.to,
      color: '#10b981'
    });
  }

  if (arrows.length === 0) {
    el.arrowsSvg.innerHTML = '';
    return;
  }

  let defs = `
    <defs>
      <marker id="arrowhead-gold" markerWidth="4.5" markerHeight="4.5" refX="2.7" refY="2.25" orient="auto">
        <polygon points="0 0, 4.5 2.25, 0 4.5" fill="rgba(245, 158, 11, 0.88)" />
      </marker>
      <marker id="arrowhead-hint" markerWidth="4.5" markerHeight="4.5" refX="2.7" refY="2.25" orient="auto">
        <polygon points="0 0, 4.5 2.25, 0 4.5" fill="rgba(16, 185, 129, 0.92)" />
      </marker>
    </defs>
  `;

  let paths = '';
  for (const arr of arrows) {
    const start = squareToSvgCoords(arr.from);
    const end = squareToSvgCoords(arr.to);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy);
    if (len < 10) continue;

    // Shorten end slightly so arrowhead sits cleanly inside target square
    const ratio = (len - 24) / len;
    const tx = start.x + dx * ratio;
    const ty = start.y + dy * ratio;

    const isHint = arr.color === '#10b981';
    const stroke = isHint ? 'rgba(16, 185, 129, 0.92)' : 'rgba(245, 158, 11, 0.85)';
    const marker = isHint ? 'url(#arrowhead-hint)' : 'url(#arrowhead-gold)';

    paths += `
      <line
        x1="${start.x}" y1="${start.y}"
        x2="${tx}" y2="${ty}"
        stroke="${stroke}"
        stroke-width="18"
        stroke-linecap="round"
        marker-end="${marker}"
      />
    `;
  }

  el.arrowsSvg.innerHTML = defs + paths;
}

function renderEvaluationBar() {
  if (!userSettings.showEval) {
    el.evalContainer.classList.add('hidden');
    return;
  }
  el.evalContainer.classList.remove('hidden');

  const displayChess = getDisplayChessInstance();
  const { display, whitePercent } = evaluateBoardForBar(displayChess);
  el.evalFillWhite.style.height = `${whitePercent}%`;
  el.evalScoreText.textContent = display;
}

function formatClock(ms, enabled = true) {
  if (!enabled || ms <= 0 && !state.clocks.enabled && (!state.onlineRoom || state.onlineRoom.initialMs === 0)) {
    return '∞';
  }
  const clamped = Math.max(0, ms);
  const totalSec = Math.floor(clamped / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins === 0 && secs < 10) {
    const tenths = Math.floor((clamped % 1000) / 100);
    return `0:${String(secs).padStart(2, '0')}.${tenths}`;
  }
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderPlayerBars() {
  const displayChess = getDisplayChessInstance();
  const mat = computeCapturedAndMaterial(displayChess);

  const bottomColor = state.flipped ? 'b' : 'w';
  const topColor = state.flipped ? 'w' : 'b';

  const playersInfo = getPlayersDisplayInfo();
  const topP = playersInfo[topColor];
  const botP = playersInfo[bottomColor];

  el.topAvatar.textContent = topP.avatar;
  el.topTitle.textContent = topP.title;
  el.topName.textContent = topP.name;
  el.topConn.className = `conn-indicator ${topP.connected ? 'online' : 'offline'}`;

  el.bottomAvatar.textContent = botP.avatar;
  el.bottomTitle.textContent = botP.title;
  el.bottomName.textContent = botP.name;
  el.bottomConn.className = `conn-indicator ${botP.connected ? 'online' : 'offline'}`;

  // Captured pieces icons
  const pieceUnicode = {
    w: { q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
    b: { q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
  };

  const topCapturedList = topColor === 'w' ? mat.capturedByWhite : mat.capturedByBlack;
  const botCapturedList = bottomColor === 'w' ? mat.capturedByWhite : mat.capturedByBlack;

  el.topCaptured.textContent = topCapturedList
    .map((t) => pieceUnicode[topColor === 'w' ? 'b' : 'w'][t])
    .join('');
  el.bottomCaptured.textContent = botCapturedList
    .map((t) => pieceUnicode[bottomColor === 'w' ? 'b' : 'w'][t])
    .join('');

  const topAdv = topColor === 'w' ? mat.whiteAdvantage : mat.blackAdvantage;
  const botAdv = bottomColor === 'w' ? mat.whiteAdvantage : mat.blackAdvantage;

  if (topAdv > 0) {
    el.topMaterial.textContent = `+${topAdv}`;
    el.topMaterial.classList.remove('hidden');
  } else {
    el.topMaterial.classList.add('hidden');
  }

  if (botAdv > 0) {
    el.bottomMaterial.textContent = `+${botAdv}`;
    el.bottomMaterial.classList.remove('hidden');
  } else {
    el.bottomMaterial.classList.add('hidden');
  }

  const activeTurn = state.chess.turn();
  el.topBar.classList.toggle('active-turn', !state.gameEnded && activeTurn === topColor);
  el.bottomBar.classList.toggle('active-turn', !state.gameEnded && activeTurn === bottomColor);

  renderClocksOnly();
}

function renderClocksOnly() {
  const bottomColor = state.flipped ? 'b' : 'w';
  const topColor = state.flipped ? 'w' : 'b';

  let wMs = 0;
  let bMs = 0;
  let timed = false;

  if (state.mode === 'online' && state.onlineRoom) {
    timed = state.onlineRoom.initialMs > 0;
    wMs = state.onlineRoom.clocks.w;
    bMs = state.onlineRoom.clocks.b;
  } else {
    timed = state.clocks.enabled;
    wMs = state.clocks.w;
    bMs = state.clocks.b;
  }

  const topMs = topColor === 'w' ? wMs : bMs;
  const botMs = bottomColor === 'w' ? wMs : bMs;

  el.topClock.textContent = timed ? formatClock(topMs, true) : '∞';
  el.bottomClock.textContent = timed ? formatClock(botMs, true) : '∞';

  el.topClock.classList.toggle('low-time', timed && topMs > 0 && topMs < 30000);
  el.bottomClock.classList.toggle('low-time', timed && botMs > 0 && botMs < 30000);
}

function getPlayersDisplayInfo() {
  if (state.mode === 'online' && state.onlineRoom) {
    const rw = state.onlineRoom.players.w;
    const rb = state.onlineRoom.players.b;
    return {
      w: rw
        ? { name: rw.name, avatar: rw.avatar || '♔', title: rw.title, connected: rw.connected }
        : { name: 'Đang chờ đối thủ...', avatar: '♙', title: 'SOLO', connected: false },
      b: rb
        ? { name: rb.name, avatar: rb.avatar || '♚', title: rb.title, connected: rb.connected }
        : { name: 'Đang chờ đối thủ...', avatar: '♟', title: 'SOLO', connected: false }
    };
  }

  if (state.mode === 'ai') {
    const aiNames = {
      1: { name: 'AI Tập Sự', title: '800', avatar: '♟' },
      2: { name: 'AI Câu Lạc Bộ', title: '1250', avatar: '♞' },
      3: { name: 'AI Kiện Tượng', title: '1650', avatar: '♜' },
      4: { name: 'AI Đại Kiện Tượng', title: 'GM', avatar: '♚' }
    };
    const bot = aiNames[state.aiLevel] || aiNames[3];
    const me = {
      name: userProfile.name,
      avatar: userProfile.avatar,
      title: userProfile.title,
      connected: true
    };
    const ai = { ...bot, connected: true };
    return state.aiPlayerColor === 'w' ? { w: me, b: ai } : { w: ai, b: me };
  }

  // Local 2P mode
  return {
    w: {
      name: `${userProfile.name} (Trắng)`,
      avatar: '♔',
      title: userProfile.title,
      connected: true
    },
    b: {
      name: 'Kỳ Thủ 2 (Đen)',
      avatar: '♚',
      title: 'SOLO',
      connected: true
    }
  };
}

function renderStatusBanner() {
  el.openingDisplay.textContent = detectOpeningName(state.moveHistory);

  const c = getDisplayChessInstance();
  const turn = c.turn();
  el.turnDot.className = `turn-dot ${turn === 'w' ? 'white' : 'black'}`;

  if (state.gameEnded && state.gameResult) {
    el.turnText.textContent = state.gameResult.winner === 'draw' ? 'Hòa cờ' : state.gameResult.winner === 'w' ? 'Trắng thắng' : 'Đen thắng';
    el.turnPill.classList.remove('in-check');
    return;
  }

  if (state.aiThinking) {
    el.turnText.textContent = 'AI đang suy nghĩ...';
    el.turnPill.classList.remove('in-check');
    return;
  }

  if (c.inCheck()) {
    el.turnText.textContent = `Chiếu tướng · Lượt ${turn === 'w' ? 'Trắng' : 'Đen'}`;
    el.turnPill.classList.add('in-check');
  } else {
    el.turnText.textContent = `Lượt ${turn === 'w' ? 'Trắng' : 'Đen'}`;
    el.turnPill.classList.remove('in-check');
  }
}

function renderMoveHistoryTable() {
  const moves = state.moveHistory;
  el.moveCountBadge.textContent = moves.length;

  if (moves.length === 0) {
    el.movesTbody.innerHTML = `
      <tr class="empty-moves-row">
        <td colspan="3">Hãy thực hiện nước đi đầu tiên trên bàn cờ!</td>
      </tr>
    `;
    return;
  }

  let rowsHtml = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const wMove = moves[i];
    const bMove = moves[i + 1];

    const wActive =
      (state.viewStepIndex === -1 && i === moves.length - 1) || state.viewStepIndex === i;
    const bActive =
      bMove && ((state.viewStepIndex === -1 && i + 1 === moves.length - 1) || state.viewStepIndex === i + 1);

    rowsHtml += `
      <tr>
        <td>${moveNum}.</td>
        <td class="move-cell ${wActive ? 'active-step' : ''}" data-step="${i}">${wMove.san}</td>
        <td class="move-cell ${bActive ? 'active-step' : ''}" ${bMove ? `data-step="${i + 1}"` : ''}>
          ${bMove ? bMove.san : ''}
        </td>
      </tr>
    `;
  }

  el.movesTbody.innerHTML = rowsHtml;

  el.movesTbody.querySelectorAll('[data-step]').forEach((cell) => {
    cell.addEventListener('click', () => {
      const idx = parseInt(cell.getAttribute('data-step'), 10);
      state.viewStepIndex = idx === state.moveHistory.length - 1 ? -1 : idx;
      renderAll();
    });
  });

  // Auto-scroll to bottom when at live position
  if (state.viewStepIndex === -1) {
    const wrap = document.getElementById('moves-table-wrap');
    if (wrap) wrap.scrollTop = wrap.scrollHeight;
  }
}

// ============================================================================
// INTERACTIVE POINTER DRAG-AND-DROP & CLICK-TO-MOVE
// ============================================================================
let dragState = {
  active: false,
  fromSquare: null,
  ghostEl: null,
  rightClickStart: null
};

function bindBoardPointerEvents() {
  el.board.addEventListener('contextmenu', (e) => e.preventDefault());

  el.board.addEventListener('pointerdown', (e) => {
    const sqEl = e.target.closest('.square');
    if (!sqEl) return;
    const sqName = sqEl.getAttribute('data-square');

    // Right-click on PC: start tactical arrow or square highlight
    if (e.button === 2) {
      dragState.rightClickStart = sqName;
      return;
    }

    if (e.button !== 0) return;

    // Clear right-click annotations on left click
    if (state.rightClickSquares.size > 0 || state.customArrows.length > 0) {
      state.rightClickSquares.clear();
      state.customArrows = [];
      renderBoard();
      renderArrows();
    }

    // If user clicked a valid destination square for currently selected piece
    if (state.selectedSquare && state.selectedSquare !== sqName) {
      const moved = attemptMove(state.selectedSquare, sqName);
      if (moved) return;
    }

    const piece = state.chess.get(sqName);
    if (!piece || !canCurrentUserMovePiece(piece.color)) {
      state.selectedSquare = null;
      state.legalMovesForSelected = [];
      renderBoard();
      return;
    }

    // Select square & calculate legal moves
    state.selectedSquare = sqName;
    state.legalMovesForSelected = state.chess.moves({ square: sqName, verbose: true });
    renderBoard();

    // Start dragging ghost piece
    dragState.active = true;
    dragState.fromSquare = sqName;

    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.innerHTML = renderPieceSVG(piece.type, piece.color, userSettings.pieceSet);
    ghost.style.left = `${e.clientX}px`;
    ghost.style.top = `${e.clientY}px`;
    document.body.appendChild(ghost);
    dragState.ghostEl = ghost;
  });

  window.addEventListener('pointermove', (e) => {
    if (!dragState.active || !dragState.ghostEl) return;
    dragState.ghostEl.style.left = `${e.clientX}px`;
    dragState.ghostEl.style.top = `${e.clientY}px`;
  });

  window.addEventListener('pointerup', (e) => {
    // Handle right-click release (arrow or square highlight)
    if (e.button === 2 && dragState.rightClickStart) {
      const targetEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.square');
      const endSq = targetEl?.getAttribute('data-square');
      if (endSq) {
        if (endSq === dragState.rightClickStart) {
          if (state.rightClickSquares.has(endSq)) state.rightClickSquares.delete(endSq);
          else state.rightClickSquares.add(endSq);
          renderBoard();
        } else {
          const existingIdx = state.customArrows.findIndex(
            (a) => a.from === dragState.rightClickStart && a.to === endSq
          );
          if (existingIdx >= 0) state.customArrows.splice(existingIdx, 1);
          else state.customArrows.push({ from: dragState.rightClickStart, to: endSq });
          renderArrows();
        }
      }
      dragState.rightClickStart = null;
      return;
    }

    if (!dragState.active) return;

    if (dragState.ghostEl) {
      dragState.ghostEl.remove();
      dragState.ghostEl = null;
    }

    const targetEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('.square');
    const toSquare = targetEl?.getAttribute('data-square');
    const fromSquare = dragState.fromSquare;

    dragState.active = false;
    dragState.fromSquare = null;

    if (fromSquare && toSquare && fromSquare !== toSquare) {
      attemptMove(fromSquare, toSquare);
    }
  });
}

// ============================================================================
// PROMOTION MODAL & GAMEOVER MODAL
// ============================================================================
function openPromotionModal(from, to, color) {
  state.pendingPromotion = { from, to, color };
  const pieces = ['q', 'r', 'b', 'n'];
  el.promotionOptions.innerHTML = pieces
    .map(
      (p) => `
      <button type="button" class="promo-piece-btn" data-promo="${p}">
        ${renderPieceSVG(p, color, userSettings.pieceSet)}
      </button>
    `
    )
    .join('');

  el.promotionOptions.querySelectorAll('[data-promo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const promo = btn.getAttribute('data-promo');
      const pending = state.pendingPromotion;
      state.pendingPromotion = null;
      el.promotionModal.classList.add('hidden');
      if (pending) {
        attemptMove(pending.from, pending.to, promo);
      }
    });
  });

  el.promotionModal.classList.remove('hidden');
}

function showGameOverModal(result) {
  if (!result) return;
  el.gameoverIcon.textContent = result.winner === 'draw' ? '½' : '♔';
  el.gameoverTitle.textContent =
    result.winner === 'draw'
      ? 'Ván đấu Hòa cờ'
      : result.winner === 'w'
      ? 'Quân Trắng chiến thắng'
      : 'Quân Đen chiến thắng';
  el.gameoverSubtitle.textContent = result.message || '';
  el.gameoverModal.classList.remove('hidden');
}

// ============================================================================
// CUSTOMIZATION STUDIO & THEME APPLICATION
// ============================================================================
function applySettingsToDOM() {
  const html = document.documentElement;
  html.setAttribute('data-ui-theme', userSettings.uiTheme);
  html.setAttribute('data-board-theme', userSettings.boardTheme);

  const bt = BOARD_THEMES[userSettings.boardTheme] || BOARD_THEMES.emerald;
  html.style.setProperty('--sq-light', bt.light);
  html.style.setProperty('--sq-dark', bt.dark);
  html.style.setProperty('--board-border', bt.border);
  html.style.setProperty('--coord-light', bt.coordLight);
  html.style.setProperty('--coord-dark', bt.coordDark);
  html.style.setProperty('--sq-last-move', bt.lastMove);
  html.style.setProperty('--sq-selected', bt.selected);

  document.body.classList.toggle('board-3d', Boolean(userSettings.board3d));
  document.body.classList.toggle('hide-legal', !userSettings.showLegal);
  document.body.classList.toggle('hide-coords', !userSettings.showCoords);
  document.body.classList.toggle('tabletop-mode', Boolean(userSettings.tabletopMode));

  soundEngine.pack = userSettings.soundPack || 'wood';

  // Sync checkboxes
  document.getElementById('select-sound-pack').value = userSettings.soundPack;
  document.getElementById('chk-board-3d').checked = Boolean(userSettings.board3d);
  document.getElementById('chk-show-eval').checked = Boolean(userSettings.showEval);
  document.getElementById('chk-show-legal').checked = Boolean(userSettings.showLegal);
  document.getElementById('chk-show-coords').checked = Boolean(userSettings.showCoords);
  document.getElementById('chk-auto-queen').checked = Boolean(userSettings.autoQueen);
  document.getElementById('chk-auto-flip').checked = Boolean(userSettings.autoFlipLocal);
  document.getElementById('chk-tabletop-mode').checked = Boolean(userSettings.tabletopMode);
}

function buildCustomizationStudio() {
  // 1. Board Themes Grid
  const boardGrid = document.getElementById('board-theme-grid');
  boardGrid.innerHTML = Object.values(BOARD_THEMES)
    .map(
      (t) => `
      <button type="button" class="theme-card ${userSettings.boardTheme === t.id ? 'active' : ''}" data-board-id="${t.id}">
        <div class="theme-swatch">
          <span style="background:${t.light}"></span>
          <span style="background:${t.dark}"></span>
          <span style="background:${t.dark}"></span>
          <span style="background:${t.light}"></span>
        </div>
        <div class="theme-meta">
          <strong>${t.name}</strong>
          <small>${t.subtitle}</small>
        </div>
      </button>
    `
    )
    .join('');

  boardGrid.querySelectorAll('[data-board-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      userSettings.boardTheme = btn.getAttribute('data-board-id');
      saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
      applySettingsToDOM();
      buildCustomizationStudio();
      soundEngine.play('move');
    });
  });

  // 2. Piece Sets Grid
  const pieceGrid = document.getElementById('piece-set-grid');
  pieceGrid.innerHTML = Object.values(PIECE_SETS)
    .map(
      (ps) => `
      <button type="button" class="piece-set-card ${userSettings.pieceSet === ps.id ? 'active' : ''}" data-piece-set="${ps.id}">
        <div class="theme-meta">
          <strong>${ps.name}</strong>
          <small>${ps.subtitle}</small>
        </div>
        <div class="piece-set-preview">
          ${renderPieceSVG('k', 'w', ps.id)}
          ${renderPieceSVG('n', 'b', ps.id)}
        </div>
      </button>
    `
    )
    .join('');

  pieceGrid.querySelectorAll('[data-piece-set]').forEach((btn) => {
    btn.addEventListener('click', () => {
      userSettings.pieceSet = btn.getAttribute('data-piece-set');
      saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
      buildCustomizationStudio();
      renderBoard();
      soundEngine.play('move');
    });
  });

  // 3. UI Atmosphere Themes
  const uiGrid = document.getElementById('ui-theme-grid');
  uiGrid.innerHTML = Object.values(UI_THEMES)
    .map(
      (u) => `
      <button type="button" class="ui-theme-btn ${userSettings.uiTheme === u.id ? 'active' : ''}" data-ui-id="${u.id}">
        <span class="ui-dot" style="background:${u.bg}"></span>
        <span>${u.name}</span>
      </button>
    `
    )
    .join('');

  uiGrid.querySelectorAll('[data-ui-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      userSettings.uiTheme = btn.getAttribute('data-ui-id');
      saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
      applySettingsToDOM();
      buildCustomizationStudio();
    });
  });
}

// ============================================================================
// PLAYER PROFILE MODAL
// ============================================================================
function renderProfileToDOM() {
  el.headerAvatar.textContent = userProfile.avatar;
  el.headerUsername.textContent = userProfile.name;
  el.profileCardAvatar.textContent = userProfile.avatar;
  el.profileCardTitle.textContent = userProfile.title;
  el.profileCardName.textContent = userProfile.name;
}

function buildProfileModalPickers() {
  el.inputProfileName.value = userProfile.name;

  el.titlePickerGrid.innerHTML = TITLE_LIST.map(
    (t) => `<button type="button" class="title-pick-btn ${userProfile.title === t ? 'active' : ''}" data-title="${t}">${t}</button>`
  ).join('');

  el.titlePickerGrid.querySelectorAll('[data-title]').forEach((btn) => {
    btn.addEventListener('click', () => {
      userProfile.title = btn.getAttribute('data-title');
      buildProfileModalPickers();
    });
  });

  el.avatarPickerGrid.innerHTML = AVATAR_LIST.map(
    (av) => `<button type="button" class="avatar-pick-btn ${userProfile.avatar === av ? 'active' : ''}" data-avatar="${av}">${av}</button>`
  ).join('');

  el.avatarPickerGrid.querySelectorAll('[data-avatar]').forEach((btn) => {
    btn.addEventListener('click', () => {
      userProfile.avatar = btn.getAttribute('data-avatar');
      buildProfileModalPickers();
    });
  });
}

// ============================================================================
// CHAT & REACTIONS
// ============================================================================
function appendChatMessage(msg) {
  const div = document.createElement('div');
  if (msg.system) {
    div.className = 'chat-msg system';
    div.textContent = msg.text;
  } else {
    div.className = 'chat-msg';
    div.innerHTML = `
      <div class="chat-msg-head">
        <span>${escapeHtml(msg.avatar || '♟️')}</span>
        <span>${escapeHtml(msg.sender || 'Kỳ Thủ')}</span>
      </div>
      <div>${escapeHtml(msg.text)}</div>
    `;
  }
  el.chatMessages.appendChild(div);
  el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
}

function renderChatHistory(list) {
  el.chatMessages.innerHTML = '';
  if (list.length === 0) {
    appendChatMessage({
      system: true,
      text: 'Chào mừng đến với phòng đấu! Hãy gửi lời chào tới đối thủ.'
    });
    return;
  }
  list.forEach((m) => appendChatMessage(m));
}

function sendChatMessage(text) {
  const clean = String(text || '').trim();
  if (!clean) return;

  if (state.mode === 'online' && state.onlineRoom && state.socket) {
    state.socket.emit('room:chat', {
      name: userProfile.name,
      avatar: userProfile.avatar,
      text: clean
    });
  } else {
    appendChatMessage({
      sender: userProfile.name,
      avatar: userProfile.avatar,
      text: clean
    });
    if (state.mode === 'ai') {
      setTimeout(() => {
        const replies = [
          'Nước đi thú vị đấy! Để tôi tính toán kỹ hơn 🤔',
          'Chúc bạn một ván đấu thật xuất sắc! 👑',
          'Thế trận đang rất cân bằng và kịch tính! 🔥',
          'Cẩn thận với những đòn chiến thuật bất ngờ nhé! ⚡'
        ];
        appendChatMessage({
          sender: 'Đại Kiện Tượng AI',
          avatar: '🤖',
          text: replies[Math.floor(Math.random() * replies.length)]
        });
      }, 650);
    }
  }
}

function spawnFloatingReaction(emoji, sender) {
  const node = document.createElement('div');
  node.className = 'floating-reaction';
  node.innerHTML = `<span>${escapeHtml(emoji)}</span><small>${escapeHtml(sender)}</small>`;
  el.reactionsOverlay.appendChild(node);
  soundEngine.play('tick');
  setTimeout(() => node.remove(), 2200);
}

// ============================================================================
// UI EVENT BINDINGS
// ============================================================================
function switchMode(newMode, announce = true) {
  state.mode = newMode;
  updateModeTabsUI(newMode);

  if (newMode === 'online') {
    el.profileModeLabel.textContent = 'Chế độ: Solo Online 1v1';
    if (!state.onlineRoom) {
      el.waitingOverlay.classList.add('hidden');
    }
  } else if (newMode === 'ai') {
    el.profileModeLabel.textContent = 'Chế độ: Đấu Máy AI';
    startNewAiOrLocalGame('ai', announce);
  } else if (newMode === 'local') {
    el.profileModeLabel.textContent = 'Chế độ: 2 Người 1 Máy';
    startNewAiOrLocalGame('local', announce);
  }
  renderAll();
}

function updateModeTabsUI(activeMode) {
  document.querySelectorAll('.mode-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === activeMode);
  });
  el.sectionOnline.classList.toggle('hidden', activeMode !== 'online');
  el.sectionAi.classList.toggle('hidden', activeMode !== 'ai');
  el.sectionLocal.classList.toggle('hidden', activeMode !== 'local');
}

function setRightTab(tabName) {
  document.querySelectorAll('.panel-tab').forEach((b) => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
  });
  document.getElementById('tab-pane-moves').classList.toggle('active', tabName === 'moves');
  document.getElementById('tab-pane-chat').classList.toggle('active', tabName === 'chat');
  document.getElementById('tab-pane-customize').classList.toggle('active', tabName === 'customize');
}

function setMobileView(view) {
  el.appLayout.setAttribute('data-mobile-view', view);
  document.querySelectorAll('.mob-nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-mob-view') === view);
  });
  if (view === 'moves' || view === 'chat' || view === 'customize') {
    setRightTab(view);
  }
}

function bindUIEvents() {
  bindBoardPointerEvents();

  // Mode Switcher Pills
  document.querySelectorAll('.mode-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      const m = btn.getAttribute('data-mode');
      switchMode(m, true);
    });
  });

  // Right Panel Tabs
  document.querySelectorAll('.panel-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      setRightTab(btn.getAttribute('data-tab'));
    });
  });

  // Mobile Bottom Nav
  document.querySelectorAll('.mob-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setMobileView(btn.getAttribute('data-mob-view'));
    });
  });

  // Header Customize shortcut
  document.getElementById('btn-open-customize').addEventListener('click', () => {
    setRightTab('customize');
    if (window.innerWidth <= 960) {
      setMobileView('customize');
    }
  });

  // Profile Modal Open/Close/Save
  const openProfile = () => {
    buildProfileModalPickers();
    el.profileModal.classList.remove('hidden');
  };
  document.getElementById('btn-open-profile').addEventListener('click', openProfile);
  document.getElementById('btn-edit-profile-inline').addEventListener('click', openProfile);
  document.getElementById('profile-card-avatar').addEventListener('click', openProfile);
  document.getElementById('btn-close-profile').addEventListener('click', () => {
    el.profileModal.classList.add('hidden');
  });
  document.getElementById('btn-save-profile').addEventListener('click', () => {
    const newName = el.inputProfileName.value.trim();
    if (newName) userProfile.name = newName.slice(0, 22);
    saveJSON(STORAGE_KEYS.PROFILE, userProfile);
    renderProfileToDOM();
    renderPlayerBars();
    el.profileModal.classList.add('hidden');
    showToast('✅ Đã lưu hồ sơ kỳ thủ!');
  });

  // Online Room Buttons
  document.getElementById('btn-create-room').addEventListener('click', createOnlineRoom);
  document.getElementById('btn-quick-match').addEventListener('click', quickMatchOnline);
  document.getElementById('btn-join-code').addEventListener('click', () => {
    const code = document.getElementById('input-room-code').value.trim().toUpperCase();
    joinOnlineRoomByCode(code);
  });
  document.getElementById('input-room-code').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      joinOnlineRoomByCode(e.target.value.trim().toUpperCase());
    }
  });
  document.getElementById('btn-leave-room').addEventListener('click', leaveOnlineRoom);
  document.getElementById('btn-refresh-lobby').addEventListener('click', () => {
    if (state.socket) state.socket.emit('lobby:list');
    showToast('🔄 Đã làm mới danh sách phòng!');
  });

  // Copy Room Code & Invite Link
  document.getElementById('btn-copy-code').addEventListener('click', () => {
    if (!state.onlineRoom) return;
    copyText(state.onlineRoom.code, `📋 Đã sao chép mã phòng: ${state.onlineRoom.code}`);
  });

  const copyInviteLink = () => {
    if (!state.onlineRoom) return;
    const url = `${window.location.origin}/?room=${state.onlineRoom.code}`;
    copyText(url, '🔗 Đã sao chép Link mời bạn bè! Hãy gửi qua Messenger/Zalo.');
  };
  document.getElementById('btn-copy-link').addEventListener('click', copyInviteLink);
  document.getElementById('btn-waiting-copy-link').addEventListener('click', copyInviteLink);
  document.getElementById('btn-waiting-hide').addEventListener('click', () => {
    el.waitingOverlay.classList.add('hidden');
  });

  // AI Mode Level & Start
  document.querySelectorAll('#ai-level-grid .ai-lvl-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#ai-level-grid .ai-lvl-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.aiLevel = parseInt(btn.getAttribute('data-level'), 10);
    });
  });
  document.getElementById('btn-start-ai').addEventListener('click', () => {
    startNewAiOrLocalGame('ai', true);
    setMobileView('board');
  });

  // Local 2P Mode Start
  document.getElementById('btn-start-local').addEventListener('click', () => {
    startNewAiOrLocalGame('local', true);
    setMobileView('board');
  });

  // Action Dock Controls
  document.getElementById('btn-new-game').addEventListener('click', () => {
    if (state.mode === 'online') {
      if (state.onlineRoom && state.onlineRoom.status === 'ended') {
        state.socket.emit('game:rematch');
        showToast('🔄 Đã gửi lời mời tái đấu tới đối thủ!');
      } else if (!state.onlineRoom) {
        createOnlineRoom();
      } else {
        showToast('ℹ️ Ván đấu đang diễn ra. Hãy bấm Đầu Hàng hoặc Cầu Hòa nếu muốn kết thúc sớm.');
      }
    } else {
      startNewAiOrLocalGame(state.mode, true);
    }
  });

  document.getElementById('btn-flip-board').addEventListener('click', () => {
    state.flipped = !state.flipped;
    renderAll();
  });

  document.getElementById('btn-hint').addEventListener('click', () => {
    if (state.gameEnded) return;
    const best = findBestMove(state.chess, 3);
    if (best) {
      state.hintArrow = { from: best.from, to: best.to };
      renderArrows();
      showToast(`Gợi ý nước đi: ${best.san} (${best.from.toUpperCase()} → ${best.to.toUpperCase()})`);
    }
  });

  document.getElementById('btn-undo').addEventListener('click', () => {
    if (state.mode === 'online') {
      if (state.onlineRoom && state.onlineRoom.status === 'playing' && state.moveHistory.length > 0) {
        state.socket.emit('game:undo-request');
        showToast('↩️ Đã gửi yêu cầu xin đi lại cho đối thủ.');
      }
      return;
    }
    if (state.moveHistory.length === 0 || state.gameEnded) return;

    // In AI mode, undo 2 plies (AI + Human) so it returns to Human's turn
    const pliesToUndo = state.mode === 'ai' && state.moveHistory.length >= 2 ? 2 : 1;
    for (let i = 0; i < pliesToUndo; i++) {
      state.chess.undo();
      state.moveHistory.pop();
    }
    state.lastMove = state.moveHistory[state.moveHistory.length - 1] || null;
    state.viewStepIndex = -1;
    state.hintArrow = null;
    renderAll();
  });

  document.getElementById('btn-offer-draw').addEventListener('click', () => {
    if (state.mode === 'online') {
      if (state.onlineRoom && state.onlineRoom.status === 'playing') {
        state.socket.emit('game:draw-offer');
        showToast('🤝 Đã gửi lời đề nghị Hòa cờ!');
      }
    } else if (!state.gameEnded && state.moveHistory.length >= 2) {
      state.gameEnded = true;
      state.gameResult = {
        winner: 'draw',
        reason: 'agreement',
        message: 'Ván đấu kết thúc Hòa theo thỏa thuận!'
      };
      showGameOverModal(state.gameResult);
      renderAll();
    }
  });

  document.getElementById('btn-resign').addEventListener('click', () => {
    if (state.gameEnded) return;
    if (state.mode === 'online') {
      if (state.onlineRoom && state.onlineRoom.status === 'playing') {
        state.socket.emit('game:resign');
      }
    } else {
      state.gameEnded = true;
      const loser = state.mode === 'ai' ? state.aiPlayerColor : state.chess.turn();
      const winner = loser === 'w' ? 'b' : 'w';
      state.gameResult = {
        winner,
        reason: 'resign',
        message: `${loser === 'w' ? 'Quân Trắng' : 'Quân Đen'} đã nhận thua.`
      };
      showGameOverModal(state.gameResult);
      soundEngine.play('gameover');
      renderAll();
    }
  });

  // Incoming Draw/Undo Offer Accept/Decline
  document.getElementById('btn-offer-accept').addEventListener('click', () => {
    if (!state.socket) return;
    if (state.pendingOfferType === 'draw') {
      state.socket.emit('game:draw-respond', { accept: true });
    } else if (state.pendingOfferType === 'undo') {
      state.socket.emit('game:undo-respond', { accept: true });
    }
    el.incomingOfferBanner.classList.add('hidden');
  });

  document.getElementById('btn-offer-decline').addEventListener('click', () => {
    if (!state.socket) return;
    if (state.pendingOfferType === 'draw') {
      state.socket.emit('game:draw-respond', { accept: false });
    } else if (state.pendingOfferType === 'undo') {
      state.socket.emit('game:undo-respond', { accept: false });
    }
    el.incomingOfferBanner.classList.add('hidden');
  });

  // Promotion cancel & Gameover buttons
  document.getElementById('btn-cancel-promotion').addEventListener('click', () => {
    state.pendingPromotion = null;
    el.promotionModal.classList.add('hidden');
  });

  document.getElementById('btn-gameover-rematch').addEventListener('click', () => {
    if (state.mode === 'online' && state.onlineRoom) {
      state.socket.emit('game:rematch');
      showToast('🔄 Đã gửi yêu cầu Tái đấu! Đang chờ đối thủ đồng ý...');
    } else {
      startNewAiOrLocalGame(state.mode, true);
    }
  });

  document.getElementById('btn-gameover-inspect').addEventListener('click', () => {
    el.gameoverModal.classList.add('hidden');
  });

  // Replay Navigation Buttons
  document.getElementById('btn-step-first').addEventListener('click', () => {
    if (state.moveHistory.length === 0) return;
    state.viewStepIndex = 0;
    renderAll();
  });
  document.getElementById('btn-step-prev').addEventListener('click', () => {
    if (state.moveHistory.length === 0) return;
    if (state.viewStepIndex === -1) {
      state.viewStepIndex = Math.max(0, state.moveHistory.length - 2);
    } else {
      state.viewStepIndex = Math.max(0, state.viewStepIndex - 1);
    }
    renderAll();
  });
  document.getElementById('btn-step-next').addEventListener('click', () => {
    if (state.viewStepIndex === -1) return;
    if (state.viewStepIndex >= state.moveHistory.length - 1) {
      state.viewStepIndex = -1;
    } else {
      state.viewStepIndex++;
    }
    renderAll();
  });
  document.getElementById('btn-step-last').addEventListener('click', () => {
    state.viewStepIndex = -1;
    renderAll();
  });

  // Emoji Reactions
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      if (state.mode === 'online' && state.onlineRoom && state.socket) {
        state.socket.emit('room:reaction', { emoji, name: userProfile.name });
      } else {
        spawnFloatingReaction(emoji, userProfile.name);
      }
    });
  });

  // FEN / PGN Tools
  document.getElementById('btn-copy-fen').addEventListener('click', () => {
    copyText(state.chess.fen(), '📋 Đã sao chép chuỗi FEN hiện tại!');
  });
  document.getElementById('btn-copy-pgn').addEventListener('click', () => {
    const pgn = state.chess.pgn() || state.moveHistory.map((m, i) => (i % 2 === 0 ? `${i / 2 + 1}. ${m.san}` : m.san)).join(' ');
    copyText(pgn || 'Chưa có nước đi', '📋 Đã sao chép biên bản PGN!');
  });
  document.getElementById('btn-load-fen-toggle').addEventListener('click', () => {
    document.getElementById('fen-load-drawer').classList.toggle('hidden');
  });
  document.getElementById('btn-apply-fen').addEventListener('click', () => {
    if (state.mode === 'online' && state.onlineRoom) {
      showToast('⚠️ Không thể nạp FEN tùy chỉnh khi đang đấu phòng Online!');
      return;
    }
    const rawFen = document.getElementById('input-custom-fen').value.trim();
    try {
      state.chess.load(rawFen);
      state.moveHistory = [];
      state.lastMove = null;
      state.viewStepIndex = -1;
      state.gameEnded = false;
      document.getElementById('fen-load-drawer').classList.add('hidden');
      renderAll();
      showToast('✅ Đã nạp thế cờ FEN thành công!');
    } catch (_) {
      showToast('❌ Chuỗi FEN không hợp lệ!');
    }
  });

  // Chat Form & Quick Chips
  el.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChatMessage(el.chatInput.value);
    el.chatInput.value = '';
  });
  document.querySelectorAll('.chat-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      sendChatMessage(chip.getAttribute('data-msg'));
    });
  });

  // Customization Toggles & Sound Select
  document.getElementById('select-sound-pack').addEventListener('change', (e) => {
    userSettings.soundPack = e.target.value;
    saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
    applySettingsToDOM();
    soundEngine.play('move');
  });

  const bindToggle = (id, key) => {
    document.getElementById(id).addEventListener('change', (e) => {
      userSettings[key] = e.target.checked;
      saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
      applySettingsToDOM();
      renderAll();
    });
  };
  bindToggle('chk-board-3d', 'board3d');
  bindToggle('chk-show-eval', 'showEval');
  bindToggle('chk-show-legal', 'showLegal');
  bindToggle('chk-show-coords', 'showCoords');
  bindToggle('chk-auto-queen', 'autoQueen');
  bindToggle('chk-auto-flip', 'autoFlipLocal');
  bindToggle('chk-tabletop-mode', 'tabletopMode');

  document.getElementById('btn-reset-custom').addEventListener('click', () => {
    userSettings = { ...defaultSettings };
    saveJSON(STORAGE_KEYS.SETTINGS, userSettings);
    applySettingsToDOM();
    buildCustomizationStudio();
    renderAll();
    showToast('🔄 Đã khôi phục giao diện mặc định!');
  });
}

// ============================================================================
// UTILITIES
// ============================================================================
function showToast(message) {
  const item = document.createElement('div');
  item.className = 'toast-item';
  item.textContent = message;
  el.toastContainer.appendChild(item);
  setTimeout(() => {
    item.style.opacity = '0';
    item.style.transition = 'opacity 0.25s ease';
    setTimeout(() => item.remove(), 260);
  }, 3200);
}

function copyText(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => fallbackCopy(text, successMsg));
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg);
  } catch (_) {}
  ta.remove();
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Boot application
init();

