const express = require('express');
const http = require('http');
const path = require('path');
const compression = require('compression');
const cors = require('cors');
const { Server } = require('socket.io');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

app.use(compression());
app.use(cors());
app.use(express.json());

// Serve chess.js ESM bundle directly from node_modules for browser client
app.get('/vendor/chess.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules', 'chess.js', 'dist', 'esm', 'chess.js'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (/\.(html|css|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// Health check for Render
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    activeRooms: rooms.size,
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// REAL-TIME MULTIPLAYER ROOM ENGINE
// ==========================================
const rooms = new Map();
const quickMatchQueue = []; // [{ socketId, playerId, name, avatar, title, timeControl }]

const TIME_CONTROLS = {
  '1+0': { initialMs: 60 * 1000, incrementMs: 0, label: 'Siêu Chớp 1+0' },
  '2+1': { initialMs: 120 * 1000, incrementMs: 1000, label: 'Siêu Chớp 2+1' },
  '3+0': { initialMs: 180 * 1000, incrementMs: 0, label: 'Chớp 3+0' },
  '3+2': { initialMs: 180 * 1000, incrementMs: 2000, label: 'Chớp 3+2' },
  '5+0': { initialMs: 300 * 1000, incrementMs: 0, label: 'Chớp 5+0' },
  '10+0': { initialMs: 600 * 1000, incrementMs: 0, label: 'Cờ Nhanh 10+0' },
  '15+10': { initialMs: 900 * 1000, incrementMs: 10000, label: 'Cờ Nhanh 15+10' },
  'unlimited': { initialMs: 0, incrementMs: 0, label: 'Không Giới Hạn' }
};

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (rooms.has(code));
  return code;
}

function createRoomObject({
  code,
  hostPlayer,
  timeControl = '10+0',
  colorPref = 'random',
  isPublic = true,
  roomName = ''
}) {
  const tc = TIME_CONTROLS[timeControl] || TIME_CONTROLS['10+0'];
  const chess = new Chess();

  let hostColor = 'w';
  if (colorPref === 'b') hostColor = 'b';
  else if (colorPref === 'random') hostColor = Math.random() < 0.5 ? 'w' : 'b';

  const room = {
    code,
    roomName: roomName || `Phòng của ${hostPlayer.name}`,
    isPublic: Boolean(isPublic),
    timeControl,
    timeControlLabel: tc.label,
    initialMs: tc.initialMs,
    incrementMs: tc.incrementMs,
    chess,
    status: 'waiting', // 'waiting' | 'playing' | 'ended'
    result: null, // { winner: 'w'|'b'|'draw', reason: string }
    players: {
      w: hostColor === 'w' ? { ...hostPlayer, connected: true } : null,
      b: hostColor === 'b' ? { ...hostPlayer, connected: true } : null
    },
    spectators: new Map(), // socketId -> { name, avatar }
    clocks: {
      w: tc.initialMs,
      b: tc.initialMs,
      lastTick: null
    },
    moveHistory: [], // [{ san, from, to, promotion, fen, color, wTime, bTime }]
    lastMove: null,
    drawOfferBy: null, // 'w' | 'b' | null
    undoRequestBy: null, // 'w' | 'b' | null
    rematchOffers: new Set(), // 'w', 'b'
    chat: [],
    createdAt: Date.now(),
    lastActivityAt: Date.now()
  };

  rooms.set(code, room);
  return room;
}

function serializeRoom(room) {
  updateRoomClock(room);
  return {
    code: room.code,
    roomName: room.roomName,
    isPublic: room.isPublic,
    timeControl: room.timeControl,
    timeControlLabel: room.timeControlLabel,
    initialMs: room.initialMs,
    incrementMs: room.incrementMs,
    fen: room.chess.fen(),
    pgn: room.chess.pgn(),
    turn: room.chess.turn(),
    status: room.status,
    result: room.result,
    inCheck: room.chess.inCheck(),
    players: {
      w: room.players.w
        ? {
            playerId: room.players.w.playerId,
            name: room.players.w.name,
            avatar: room.players.w.avatar,
            title: room.players.w.title,
            connected: room.players.w.connected
          }
        : null,
      b: room.players.b
        ? {
            playerId: room.players.b.playerId,
            name: room.players.b.name,
            avatar: room.players.b.avatar,
            title: room.players.b.title,
            connected: room.players.b.connected
          }
        : null
    },
    spectatorCount: room.spectators.size,
    clocks: {
      w: room.clocks.w,
      b: room.clocks.b
    },
    moveHistory: room.moveHistory,
    lastMove: room.lastMove,
    drawOfferBy: room.drawOfferBy,
    undoRequestBy: room.undoRequestBy,
    rematchOffers: Array.from(room.rematchOffers),
    chat: room.chat.slice(-50)
  };
}

function getLobbyRooms() {
  const list = [];
  for (const room of rooms.values()) {
    if (room.status === 'waiting' && room.isPublic) {
      const host = room.players.w || room.players.b;
      if (host && host.connected) {
        list.push({
          code: room.code,
          roomName: room.roomName,
          hostName: host.name,
          hostAvatar: host.avatar,
          hostTitle: host.title,
          hostColor: room.players.w ? 'w' : 'b',
          timeControl: room.timeControl,
          timeControlLabel: room.timeControlLabel,
          createdAt: room.createdAt
        });
      }
    } else if (room.status === 'playing' && room.isPublic) {
      list.push({
        code: room.code,
        roomName: room.roomName,
        hostName: `${room.players.w?.name || 'Trắng'} vs ${room.players.b?.name || 'Đen'}`,
        hostAvatar: room.players.w?.avatar || 'K',
        hostTitle: 'LIVE',
        status: 'playing',
        timeControl: room.timeControl,
        timeControlLabel: room.timeControlLabel,
        spectatorCount: room.spectators.size,
        createdAt: room.createdAt
      });
    }
  }
  return list.sort((a, b) => b.createdAt - a.createdAt).slice(0, 25);
}

function broadcastLobby() {
  io.emit('lobby:update', {
    rooms: getLobbyRooms(),
    onlineCount: io.engine.clientsCount
  });
}

function updateRoomClock(room) {
  if (room.status !== 'playing' || room.initialMs === 0 || !room.clocks.lastTick) {
    return;
  }
  // Only start ticking after White makes the first move
  if (room.moveHistory.length === 0) {
    room.clocks.lastTick = Date.now();
    return;
  }
  const now = Date.now();
  const elapsed = Math.max(0, now - room.clocks.lastTick);
  room.clocks.lastTick = now;

  const activeTurn = room.chess.turn();
  room.clocks[activeTurn] = Math.max(0, room.clocks[activeTurn] - elapsed);

  if (room.clocks[activeTurn] <= 0) {
    room.status = 'ended';
    const winner = activeTurn === 'w' ? 'b' : 'w';
    room.result = {
      winner,
      reason: 'timeout',
      message: `${winner === 'w' ? 'Quân Trắng' : 'Quân Đen'} thắng do đối thủ hết giờ!`
    };
    room.clocks.lastTick = null;
    io.to(room.code).emit('game:over', serializeRoom(room));
    broadcastLobby();
  }
}

function checkChessGameEnd(room) {
  const c = room.chess;
  if (!c.isGameOver()) return false;

  room.status = 'ended';
  room.clocks.lastTick = null;

  if (c.isCheckmate()) {
    const winner = c.turn() === 'w' ? 'b' : 'w';
    room.result = {
      winner,
      reason: 'checkmate',
      message: `Chiếu hết! ${winner === 'w' ? 'Quân Trắng' : 'Quân Đen'} giành chiến thắng!`
    };
  } else if (c.isStalemate()) {
    room.result = {
      winner: 'draw',
      reason: 'stalemate',
      message: 'Hòa cờ do Hết nước đi (Stalemate)!'
    };
  } else if (c.isThreefoldRepetition()) {
    room.result = {
      winner: 'draw',
      reason: 'repetition',
      message: 'Hòa cờ do Lặp lại thế cờ 3 lần!'
    };
  } else if (c.isInsufficientMaterial()) {
    room.result = {
      winner: 'draw',
      reason: 'insufficient',
      message: 'Hòa cờ do Không đủ lực lượng chiếu hết!'
    };
  } else if (c.isDraw()) {
    room.result = {
      winner: 'draw',
      reason: '50-move-rule',
      message: 'Hòa cờ theo luật 50 nước đi!'
    };
  }
  return true;
}

// Background clock ticker every 500ms for active timed games
setInterval(() => {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (room.status === 'playing' && room.initialMs > 0) {
      updateRoomClock(room);
    }
    // Clean up stale rooms older than 2 hours of inactivity
    if (now - room.lastActivityAt > 2 * 60 * 60 * 1000) {
      rooms.delete(code);
    }
  }
}, 500);

app.get('/api/rooms', (req, res) => {
  res.json({
    rooms: getLobbyRooms(),
    onlineCount: io.engine.clientsCount
  });
});

io.on('connection', (socket) => {
  let currentRoomCode = null;
  let currentPlayerId = null;

  socket.emit('lobby:update', {
    rooms: getLobbyRooms(),
    onlineCount: io.engine.clientsCount
  });
  broadcastLobby();

  socket.on('lobby:list', () => {
    socket.emit('lobby:update', {
      rooms: getLobbyRooms(),
      onlineCount: io.engine.clientsCount
    });
  });

  // Create a room
  socket.on('room:create', (payload = {}, callback) => {
    leaveCurrentRoom(socket);

    const player = {
      socketId: socket.id,
      playerId: payload.playerId || socket.id,
      name: (payload.name || 'Kỳ Thủ').slice(0, 24),
      avatar: payload.avatar || 'K',
      title: (payload.title || 'PRO').slice(0, 10)
    };
    currentPlayerId = player.playerId;

    const code = generateRoomCode();
    const room = createRoomObject({
      code,
      hostPlayer: player,
      timeControl: payload.timeControl || '10+0',
      colorPref: payload.colorPref || 'random',
      isPublic: payload.isPublic !== false,
      roomName: (payload.roomName || '').slice(0, 36)
    });

    currentRoomCode = code;
    socket.join(code);

    const assignedColor = room.players.w?.playerId === player.playerId ? 'w' : 'b';
    const serialized = serializeRoom(room);

    if (typeof callback === 'function') {
      callback({ ok: true, room: serialized, role: assignedColor });
    }
    socket.emit('room:joined', { room: serialized, role: assignedColor });
    broadcastLobby();
  });

  // Quick Match (Auto Matchmaking)
  socket.on('room:quickmatch', (payload = {}, callback) => {
    leaveCurrentRoom(socket);

    const player = {
      socketId: socket.id,
      playerId: payload.playerId || socket.id,
      name: (payload.name || 'Kỳ Thủ').slice(0, 24),
      avatar: payload.avatar || 'A',
      title: (payload.title || 'PRO').slice(0, 10)
    };
    currentPlayerId = player.playerId;
    const preferredTC = payload.timeControl || '10+0';

    // Try finding an open public waiting room with matching timeControl (or any open waiting room)
    let matchedRoom = null;
    for (const room of rooms.values()) {
      if (room.status === 'waiting' && room.isPublic) {
        const host = room.players.w || room.players.b;
        if (host && host.connected && host.playerId !== player.playerId && room.timeControl === preferredTC) {
          matchedRoom = room;
          break;
        }
      }
    }
    if (!matchedRoom) {
      for (const room of rooms.values()) {
        if (room.status === 'waiting' && room.isPublic) {
          const host = room.players.w || room.players.b;
          if (host && host.connected && host.playerId !== player.playerId) {
            matchedRoom = room;
            break;
          }
        }
      }
    }

    if (matchedRoom) {
      joinExistingRoom(socket, matchedRoom, player, callback);
    } else {
      const code = generateRoomCode();
      const room = createRoomObject({
        code,
        hostPlayer: player,
        timeControl: preferredTC,
        colorPref: 'random',
        isPublic: true,
        roomName: `Ghép Nhanh • ${player.name}`
      });
      currentRoomCode = code;
      socket.join(code);
      const assignedColor = room.players.w?.playerId === player.playerId ? 'w' : 'b';
      const serialized = serializeRoom(room);
      if (typeof callback === 'function') {
        callback({ ok: true, room: serialized, role: assignedColor, quickMatchWaiting: true });
      }
      socket.emit('room:joined', { room: serialized, role: assignedColor });
      broadcastLobby();
    }
  });

  // Join an existing room by code
  socket.on('room:join', (payload = {}, callback) => {
    const code = String(payload.code || '').trim().toUpperCase();
    const room = rooms.get(code);
    if (!room) {
      if (typeof callback === 'function') {
        callback({ ok: false, error: 'Không tìm thấy phòng với mã này!' });
      }
      return;
    }

    if (currentRoomCode && currentRoomCode !== code) {
      leaveCurrentRoom(socket);
    }

    const player = {
      socketId: socket.id,
      playerId: payload.playerId || socket.id,
      name: (payload.name || 'Kỳ Thủ').slice(0, 24),
      avatar: payload.avatar || 'B',
      title: (payload.title || 'PRO').slice(0, 10)
    };
    currentPlayerId = player.playerId;

    joinExistingRoom(socket, room, player, callback);
  });

  function joinExistingRoom(socket, room, player, callback) {
    currentRoomCode = room.code;
    room.lastActivityAt = Date.now();
    socket.join(room.code);

    let role = 'spectator';

    // 1. Check if reconnecting as existing White or Black player
    if (room.players.w && room.players.w.playerId === player.playerId) {
      room.players.w.socketId = socket.id;
      room.players.w.connected = true;
      room.players.w.name = player.name;
      room.players.w.avatar = player.avatar;
      room.players.w.title = player.title;
      role = 'w';
    } else if (room.players.b && room.players.b.playerId === player.playerId) {
      room.players.b.socketId = socket.id;
      room.players.b.connected = true;
      room.players.b.name = player.name;
      room.players.b.avatar = player.avatar;
      room.players.b.title = player.title;
      role = 'b';
    } else if (!room.players.w && room.status === 'waiting') {
      room.players.w = { ...player, connected: true };
      role = 'w';
    } else if (!room.players.b && room.status === 'waiting') {
      room.players.b = { ...player, connected: true };
      role = 'b';
    } else {
      room.spectators.set(socket.id, {
        name: player.name,
        avatar: player.avatar
      });
      role = 'spectator';
    }

    // Start game if both seats are filled and status was waiting
    if (room.status === 'waiting' && room.players.w && room.players.b) {
      room.status = 'playing';
      room.clocks.lastTick = Date.now();
      room.chat.push({
        id: Date.now() + '-' + Math.random(),
        system: true,
        text: `Trận đấu bắt đầu: ${room.players.w.name} (Trắng) vs ${room.players.b.name} (Đen)!`,
        time: Date.now()
      });
    }

    const serialized = serializeRoom(room);
    if (typeof callback === 'function') {
      callback({ ok: true, room: serialized, role });
    }
    socket.emit('room:joined', { room: serialized, role });
    io.to(room.code).emit('room:state', serialized);
    broadcastLobby();
  }

  // Make a move in an online room
  socket.on('game:move', (payload = {}, callback) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing') return;

    updateRoomClock(room);
    if (room.status !== 'playing') return;

    const turn = room.chess.turn();
    const activePlayer = room.players[turn];
    if (!activePlayer || activePlayer.playerId !== currentPlayerId) {
      if (typeof callback === 'function') {
        callback({ ok: false, error: 'Chưa tới lượt của bạn!' });
      }
      return;
    }

    try {
      const moveObj = {
        from: payload.from,
        to: payload.to,
        promotion: payload.promotion || 'q'
      };
      const moveResult = room.chess.move(moveObj);
      if (!moveResult) {
        if (typeof callback === 'function') {
          callback({ ok: false, error: 'Nước đi không hợp lệ!' });
        }
        return;
      }

      // Add increment if timed game
      if (room.initialMs > 0 && room.incrementMs > 0) {
        room.clocks[turn] += room.incrementMs;
      }
      room.clocks.lastTick = Date.now();
      room.lastActivityAt = Date.now();
      room.drawOfferBy = null;
      room.undoRequestBy = null;

      room.lastMove = {
        from: moveResult.from,
        to: moveResult.to,
        san: moveResult.san,
        color: moveResult.color,
        captured: moveResult.captured || null,
        flags: moveResult.flags
      };

      room.moveHistory.push({
        san: moveResult.san,
        from: moveResult.from,
        to: moveResult.to,
        promotion: moveResult.promotion || null,
        color: moveResult.color,
        captured: moveResult.captured || null,
        flags: moveResult.flags,
        fen: room.chess.fen(),
        wTime: room.clocks.w,
        bTime: room.clocks.b
      });

      const ended = checkChessGameEnd(room);
      const serialized = serializeRoom(room);

      if (typeof callback === 'function') {
        callback({ ok: true, move: room.lastMove, room: serialized });
      }

      io.to(room.code).emit('game:moved', {
        move: room.lastMove,
        room: serialized
      });

      if (ended) {
        io.to(room.code).emit('game:over', serialized);
        broadcastLobby();
      }
    } catch (err) {
      if (typeof callback === 'function') {
        callback({ ok: false, error: 'Nước đi không hợp lệ!' });
      }
    }
  });

  // Resign
  socket.on('game:resign', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing') return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor) return;

    room.status = 'ended';
    room.clocks.lastTick = null;
    const winner = myColor === 'w' ? 'b' : 'w';
    const loserName = room.players[myColor]?.name || (myColor === 'w' ? 'Trắng' : 'Đen');
    room.result = {
      winner,
      reason: 'resign',
      message: `${loserName} đã nhận thua. ${winner === 'w' ? 'Quân Trắng' : 'Quân Đen'} chiến thắng!`
    };

    const serialized = serializeRoom(room);
    io.to(room.code).emit('game:over', serialized);
    broadcastLobby();
  });

  // Offer / Respond to Draw
  socket.on('game:draw-offer', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing') return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor) return;

    if (room.drawOfferBy && room.drawOfferBy !== myColor) {
      // Both agreed to draw!
      room.status = 'ended';
      room.clocks.lastTick = null;
      room.result = {
        winner: 'draw',
        reason: 'agreement',
        message: 'Hòa cờ theo thỏa thuận của hai kỳ thủ!'
      };
      io.to(room.code).emit('game:over', serializeRoom(room));
      broadcastLobby();
      return;
    }

    room.drawOfferBy = myColor;
    io.to(room.code).emit('room:state', serializeRoom(room));
  });

  socket.on('game:draw-respond', ({ accept } = {}) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing' || !room.drawOfferBy) return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor || room.drawOfferBy === myColor) return;

    if (accept) {
      room.status = 'ended';
      room.clocks.lastTick = null;
      room.result = {
        winner: 'draw',
        reason: 'agreement',
        message: 'Hòa cờ theo thỏa thuận của hai kỳ thủ!'
      };
      room.drawOfferBy = null;
      io.to(room.code).emit('game:over', serializeRoom(room));
      broadcastLobby();
    } else {
      room.drawOfferBy = null;
      io.to(room.code).emit('room:state', serializeRoom(room));
    }
  });

  // Undo Request & Response in Online Mode
  socket.on('game:undo-request', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing' || room.moveHistory.length === 0) return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor) return;

    room.undoRequestBy = myColor;
    io.to(room.code).emit('room:state', serializeRoom(room));
  });

  socket.on('game:undo-respond', ({ accept } = {}) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'playing' || !room.undoRequestBy) return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor || room.undoRequestBy === myColor) return;

    if (accept && room.moveHistory.length > 0) {
      room.chess.undo();
      room.moveHistory.pop();
      const prev = room.moveHistory[room.moveHistory.length - 1] || null;
      room.lastMove = prev
        ? {
            from: prev.from,
            to: prev.to,
            san: prev.san,
            color: prev.color,
            captured: prev.captured,
            flags: prev.flags
          }
        : null;
    }
    room.undoRequestBy = null;
    io.to(room.code).emit('room:state', serializeRoom(room));
  });

  // Rematch
  socket.on('game:rematch', () => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room || room.status !== 'ended') return;

    const myColor =
      room.players.w?.playerId === currentPlayerId
        ? 'w'
        : room.players.b?.playerId === currentPlayerId
        ? 'b'
        : null;
    if (!myColor) return;

    room.rematchOffers.add(myColor);

    if (room.rematchOffers.has('w') && room.rematchOffers.has('b')) {
      // Swap colors & reset board
      const oldW = room.players.w;
      room.players.w = room.players.b;
      room.players.b = oldW;

      room.chess = new Chess();
      room.status = 'playing';
      room.result = null;
      room.clocks.w = room.initialMs;
      room.clocks.b = room.initialMs;
      room.clocks.lastTick = Date.now();
      room.moveHistory = [];
      room.lastMove = null;
      room.drawOfferBy = null;
      room.undoRequestBy = null;
      room.rematchOffers.clear();

      room.chat.push({
        id: Date.now() + '-' + Math.random(),
        system: true,
        text: `Tái đấu bắt đầu! Đổi màu quân: ${room.players.w.name} (Trắng) vs ${room.players.b.name} (Đen).`,
        time: Date.now()
      });

      io.to(room.code).emit('game:restarted', serializeRoom(room));
      broadcastLobby();
    } else {
      io.to(room.code).emit('room:state', serializeRoom(room));
    }
  });

  // Live Chat & Reactions
  socket.on('room:chat', (payload = {}) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    const text = String(payload.text || '').trim().slice(0, 200);
    if (!text) return;

    const msg = {
      id: Date.now() + '-' + Math.random(),
      sender: (payload.name || 'Kỳ Thủ').slice(0, 24),
      avatar: payload.avatar || 'K',
      text,
      time: Date.now()
    };
    room.chat.push(msg);
    if (room.chat.length > 80) room.chat.shift();
    io.to(room.code).emit('room:chat-message', msg);
  });

  socket.on('room:reaction', (payload = {}) => {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    if (!room) return;

    io.to(room.code).emit('room:reaction', {
      emoji: String(payload.emoji || 'GG').slice(0, 16),
      sender: (payload.name || 'Kỳ Thủ').slice(0, 24),
      color:
        room.players.w?.playerId === currentPlayerId
          ? 'w'
          : room.players.b?.playerId === currentPlayerId
          ? 'b'
          : 's'
    });
  });

  socket.on('room:leave', () => {
    leaveCurrentRoom(socket);
    broadcastLobby();
  });

  socket.on('disconnect', () => {
    if (currentRoomCode) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        if (room.players.w?.socketId === socket.id) {
          room.players.w.connected = false;
        }
        if (room.players.b?.socketId === socket.id) {
          room.players.b.connected = false;
        }
        room.spectators.delete(socket.id);

        // If room was waiting and host disconnected, remove after 30s if not reconnected
        if (room.status === 'waiting') {
          setTimeout(() => {
            const r = rooms.get(room.code);
            if (r && r.status === 'waiting') {
              const host = r.players.w || r.players.b;
              if (!host || !host.connected) {
                rooms.delete(r.code);
                broadcastLobby();
              }
            }
          }, 30000);
        }

        io.to(room.code).emit('room:state', serializeRoom(room));
      }
    }
    setTimeout(broadcastLobby, 200);
  });

  function leaveCurrentRoom(sock) {
    if (!currentRoomCode) return;
    const room = rooms.get(currentRoomCode);
    sock.leave(currentRoomCode);
    if (room) {
      room.spectators.delete(sock.id);
      if (room.status === 'waiting') {
        if (room.players.w?.playerId === currentPlayerId) room.players.w = null;
        if (room.players.b?.playerId === currentPlayerId) room.players.b = null;
        if (!room.players.w && !room.players.b) {
          rooms.delete(room.code);
        }
      } else if (room.status === 'playing') {
        if (room.players.w?.playerId === currentPlayerId) room.players.w.connected = false;
        if (room.players.b?.playerId === currentPlayerId) room.players.b.connected = false;
        io.to(room.code).emit('room:state', serializeRoom(room));
      }
    }
    currentRoomCode = null;
  }
});

// Fallback to index.html for SPA / invite links
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Royal Chess Arena Server running on http://localhost:${PORT}`);
});

