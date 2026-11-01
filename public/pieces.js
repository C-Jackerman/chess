// ============================================================================
// ROYAL CHESS ARENA — CUSTOM PIECE SETS, BOARD THEMES, SOUND & OPENINGS
// ============================================================================

export const BOARD_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald Royal',
    subtitle: 'Giải đấu cổ điển',
    light: '#eeeed2',
    dark: '#769656',
    border: '#2d3b22',
    coordLight: '#769656',
    coordDark: '#eeeed2',
    lastMove: 'rgba(255, 255, 51, 0.48)',
    selected: 'rgba(186, 202, 43, 0.75)'
  },
  wood: {
    id: 'wood',
    name: 'Walnut Grandmaster',
    subtitle: 'Gỗ óc chó thượng hạng',
    light: '#f0d9b5',
    dark: '#b58863',
    border: '#4a2f1d',
    coordLight: '#b58863',
    coordDark: '#f0d9b5',
    lastMove: 'rgba(247, 236, 93, 0.48)',
    selected: 'rgba(218, 165, 32, 0.65)'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Midnight Cyberpunk',
    subtitle: 'Neon tương lai',
    light: '#242947',
    dark: '#111428',
    border: '#00f5d4',
    coordLight: '#00f5d4',
    coordDark: '#ff2a85',
    lastMove: 'rgba(0, 245, 212, 0.34)',
    selected: 'rgba(255, 42, 133, 0.5)'
  },
  ocean: {
    id: 'ocean',
    name: 'Oceanic Glass',
    subtitle: 'Đại dương pha lê',
    light: '#dce9f5',
    dark: '#4b7399',
    border: '#1e354d',
    coordLight: '#4b7399',
    coordDark: '#dce9f5',
    lastMove: 'rgba(56, 189, 248, 0.45)',
    selected: 'rgba(14, 165, 233, 0.65)'
  },
  marble: {
    id: 'marble',
    name: 'Imperial Marble',
    subtitle: 'Cẩm thạch hoàng gia',
    light: '#e8ecef',
    dark: '#636e7b',
    border: '#22272e',
    coordLight: '#636e7b',
    coordDark: '#e8ecef',
    lastMove: 'rgba(167, 139, 250, 0.45)',
    selected: 'rgba(139, 92, 246, 0.6)'
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Sunset',
    subtitle: 'Hoa anh đào hoàng hôn',
    light: '#fceef2',
    dark: '#c96f8b',
    border: '#592538',
    coordLight: '#c96f8b',
    coordDark: '#fceef2',
    lastMove: 'rgba(251, 191, 36, 0.45)',
    selected: 'rgba(244, 63, 94, 0.55)'
  },
  nordic: {
    id: 'nordic',
    name: 'Nordic Ice',
    subtitle: 'Băng giá Bắc Âu',
    light: '#e6f0f5',
    dark: '#5b8291',
    border: '#233942',
    coordLight: '#5b8291',
    coordDark: '#e6f0f5',
    lastMove: 'rgba(45, 212, 191, 0.42)',
    selected: 'rgba(20, 184, 166, 0.6)'
  },
  royal_gold: {
    id: 'royal_gold',
    name: 'Onyx & Gold',
    subtitle: 'Hắc ngọc & Hoàng kim',
    light: '#f3e5ab',
    dark: '#3d3522',
    border: '#d4af37',
    coordLight: '#3d3522',
    coordDark: '#f3e5ab',
    lastMove: 'rgba(212, 175, 55, 0.48)',
    selected: 'rgba(245, 158, 11, 0.65)'
  }
};

export const PIECE_SETS = {
  staunton: {
    id: 'staunton',
    name: 'Neo-Staunton Pro',
    subtitle: 'Chuẩn giải đấu quốc tế'
  },
  imperial: {
    id: 'imperial',
    name: 'Royal Imperial',
    subtitle: 'Hoàng gia chạm khắc'
  },
  neon: {
    id: 'neon',
    name: 'Cyber Neon Glow',
    subtitle: 'Quang phổ điện tử'
  },
  minimal: {
    id: 'minimal',
    name: 'Bauhaus Minimal',
    subtitle: 'Hình học tối giản'
  },
  crystal: {
    id: 'crystal',
    name: '3D Faceted Crystal',
    subtitle: 'Lăng kính pha lê'
  }
};

export const UI_THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Dark Obsidian',
    bg: '#0b0f19',
    panel: '#131a2a',
    text: '#f8fafc'
  },
  midnight: {
    id: 'midnight',
    name: 'Cyber Amethyst',
    bg: '#0d091a',
    panel: '#18112e',
    text: '#f5f3ff'
  },
  espresso: {
    id: 'espresso',
    name: 'Grandmaster Club',
    bg: '#14100d',
    panel: '#211b16',
    text: '#fdf8f5'
  },
  alabaster: {
    id: 'alabaster',
    name: 'Light Alabaster',
    bg: '#f1f5f9',
    panel: '#ffffff',
    text: '#0f172a'
  }
};

export const AVATAR_LIST = [
  '👑', '♔', '♕', '♞', '🦁', '🐉',
  '🦅', '⚡', '🔥', '💎', '🦊', '🐯',
  '🥷', '🧙‍♂️', '🤖', '🌟'
];

export const TITLE_LIST = [
  'GM', 'IM', 'FM', 'CM', 'PRO', 'KING', 'SOLO', 'VIP', 'BOSS'
];

// Base Staunton SVG paths for K, Q, R, B, N, P
function getStauntonPaths(type, isWhite, styleVariant = 'staunton') {
  const uid = `${styleVariant}_${type}_${isWhite ? 'w' : 'b'}`;

  let fillUrl = `url(#grad_${uid})`;
  let strokeColor = isWhite ? '#1e293b' : '#090d16';
  let strokeWidth = '1.6';
  let innerStroke = isWhite ? '#64748b' : '#cbd5e1';
  let extraFilter = 'filter="url(#piece-shadow)"';

  let stop1 = isWhite ? '#ffffff' : '#3b4252';
  let stop2 = isWhite ? '#e2e8f0' : '#1e222d';
  let stop3 = isWhite ? '#cbd5e1' : '#0f1117';

  if (styleVariant === 'imperial') {
    stop1 = isWhite ? '#fffbeb' : '#4a1d1f';
    stop2 = isWhite ? '#fde68a' : '#2a0f12';
    stop3 = isWhite ? '#d97706' : '#140507';
    strokeColor = isWhite ? '#78350f' : '#fbbf24';
    innerStroke = isWhite ? '#b45309' : '#f59e0b';
    strokeWidth = '1.7';
  } else if (styleVariant === 'neon') {
    stop1 = isWhite ? '#083344' : '#3b0764';
    stop2 = isWhite ? '#061e29' : '#1f0438';
    stop3 = isWhite ? '#020b10' : '#0c0117';
    strokeColor = isWhite ? '#00f5d4' : '#ff2a85';
    innerStroke = isWhite ? '#38bdf8' : '#f472b6';
    strokeWidth = '2.1';
  } else if (styleVariant === 'crystal') {
    stop1 = isWhite ? '#f0f9ff' : '#312e81';
    stop2 = isWhite ? '#bae6fd' : '#1e1b4b';
    stop3 = isWhite ? '#38bdf8' : '#090721';
    strokeColor = isWhite ? '#0369a1' : '#818cf8';
    innerStroke = isWhite ? '#0284c7' : '#a5b4fc';
    strokeWidth = '1.6';
  }

  const defs = `
    <defs>
      <linearGradient id="grad_${uid}" x1="15%" y1="10%" x2="85%" y2="90%">
        <stop offset="0%" stop-color="${stop1}" />
        <stop offset="55%" stop-color="${stop2}" />
        <stop offset="100%" stop-color="${stop3}" />
      </linearGradient>
    </defs>
  `;

  // Minimalist Bauhaus geometric set
  if (styleVariant === 'minimal') {
    return renderMinimalistPiece(type, isWhite, defs, fillUrl, strokeColor, innerStroke);
  }

  let body = '';
  switch (type) {
    case 'p':
      body = `
        <path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21.2 16,24 16,27.5 C 16,30 17.8,31.5 17.8,31.5 L 13.5,36 L 31.5,36 L 27.2,31.5 C 27.2,31.5 29,30 29,27.5 C 29,24 27.5,21.2 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z"
          fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" />
        <path d="M 11.5,37 L 33.5,37 C 34.5,37 35,38 35,39.5 L 10,39.5 C 10,38 10.5,37 11.5,37 z"
          fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
        <path d="M 16,33.5 L 29,33.5" stroke="${innerStroke}" stroke-width="1.2" stroke-linecap="round" fill="none" />
      `;
      break;

    case 'r':
      body = `
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z" />
          <path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z" />
          <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z" />
          <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z" />
          <path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14" />
          <path d="M 12,32 L 14,29.5 L 31,29.5 L 33,32 L 12,32 z" />
          <path d="M 15,19 L 30,19" stroke="${innerStroke}" stroke-width="1.2" fill="none" />
          <path d="M 15,27.5 L 30,27.5" stroke="${innerStroke}" stroke-width="1.2" fill="none" />
        </g>
      `;
      break;

    case 'n':
      body = `
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" />
          <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
          <circle cx="15.5" cy="14.5" r="1.3" fill="${innerStroke}" stroke="none" />
          <path d="M 11.5,37 L 36.5,37" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
        </g>
      `;
      break;

    case 'b':
      body = `
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
          <circle cx="22.5" cy="8" r="2.3" />
          <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="${innerStroke}" stroke-width="1.4" fill="none" />
        </g>
      `;
      break;

    case 'q':
      body = `
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
          <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="14" cy="9" r="2" />
          <circle cx="22.5" cy="8" r="2.2" />
          <circle cx="31" cy="9" r="2" />
          <circle cx="39" cy="12" r="2" />
          <path d="M 11.5,30 C 15,29 30,29 33.5,30" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 12,33.5 C 18,32.5 27,32.5 33,33.5" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
        </g>
      `;
      break;

    case 'k':
      body = `
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 22.5,11.63 L 22.5,6" stroke-width="2.2" />
          <path d="M 20,8 L 25,8" stroke-width="2.2" />
          <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" />
          <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" />
          <path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 11.5,37 C 17,34 27,34 32.5,37" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
        </g>
      `;
      break;
  }

  return `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-${styleVariant}" ${extraFilter}>${defs}${body}</svg>`;
}

function renderMinimalistPiece(type, isWhite, defs, fillUrl, strokeColor, innerStroke) {
  let shape = '';
  switch (type) {
    case 'p':
      shape = `
        <circle cx="22.5" cy="15.5" r="5.5" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8"/>
        <path d="M14,37 L17.5,23 L27.5,23 L31,37 Z" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
    case 'r':
      shape = `
        <path d="M13,12 L13,18 L15,18 L15,37 L30,37 L30,18 L32,18 L32,12 L28,12 L28,15 L24.5,15 L24.5,12 L20.5,12 L20.5,15 L17,15 L17,12 Z" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
    case 'n':
      shape = `
        <path d="M14,37 L16,22 L12,22 L15,12 L25,9 L31,16 C31,24 30,31 31,37 Z" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="20" cy="15" r="1.5" fill="${innerStroke}"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
    case 'b':
      shape = `
        <circle cx="22.5" cy="9.5" r="2.2" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.6"/>
        <path d="M14,37 C14,22 18,13 22.5,12 C27,13 31,22 31,37 Z" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="19" y1="21" x2="26" y2="21" stroke="${innerStroke}" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="22.5" y1="17.5" x2="22.5" y2="24.5" stroke="${innerStroke}" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
    case 'q':
      shape = `
        <polygon points="12,37 9,15 16.5,24 22.5,12 28.5,24 36,15 33,37" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="9" cy="12.5" r="1.6" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.4"/>
        <circle cx="22.5" cy="9.5" r="1.8" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.4"/>
        <circle cx="36" cy="12.5" r="1.6" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.4"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
    case 'k':
      shape = `
        <line x1="22.5" y1="6" x2="22.5" y2="12" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="19.5" y1="9" x2="25.5" y2="9" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round"/>
        <polygon points="13,37 11,17 18,22 22.5,13 27,22 34,17 32,37" fill="${fillUrl}" stroke="${strokeColor}" stroke-width="1.8" stroke-linejoin="round"/>
        <line x1="11" y1="39" x2="34" y2="39" stroke="${strokeColor}" stroke-width="2.4" stroke-linecap="round"/>
      `;
      break;
  }
  return `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-minimal">${defs}${shape}</svg>`;
}

export function renderPieceSVG(type, color, pieceSet = 'staunton') {
  return getStauntonPaths(type.toLowerCase(), color === 'w', pieceSet);
}

// ============================================================================
// PROCEDURAL WEB AUDIO SOUND ENGINE
// ============================================================================
class ChessSoundEngine {
  constructor() {
    this.ctx = null;
    this.pack = 'wood'; // 'wood' | 'crystal' | 'muted'
  }

  ensureContext() {
    if (this.pack === 'muted') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  play(type) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const isCrystal = this.pack === 'crystal';

    if (type === 'move') {
      this.tone(ctx, isCrystal ? 520 : 195, isCrystal ? 280 : 95, 0.075, isCrystal ? 'sine' : 'triangle', 0.22);
    } else if (type === 'capture') {
      this.tone(ctx, isCrystal ? 680 : 150, isCrystal ? 180 : 55, 0.11, 'sawtooth', 0.28);
      this.tone(ctx, isCrystal ? 340 : 280, 90, 0.08, 'triangle', 0.2, now + 0.02);
    } else if (type === 'check') {
      this.tone(ctx, 587.33, 587.33, 0.14, 'sine', 0.25, now);
      this.tone(ctx, 880, 880, 0.22, 'sine', 0.25, now + 0.09);
    } else if (type === 'castle') {
      this.tone(ctx, 210, 110, 0.07, 'triangle', 0.22, now);
      this.tone(ctx, 250, 130, 0.08, 'triangle', 0.22, now + 0.09);
    } else if (type === 'promote') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        this.tone(ctx, freq, freq, 0.14, 'sine', 0.18, now + idx * 0.06);
      });
    } else if (type === 'gameover') {
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        this.tone(ctx, freq, freq, 0.24, 'triangle', 0.22, now + idx * 0.09);
      });
    } else if (type === 'tick') {
      this.tone(ctx, 900, 900, 0.03, 'sine', 0.08, now);
    }
  }

  tone(ctx, startFreq, endFreq, duration, waveType = 'sine', gainVal = 0.2, startTime = ctx.currentTime) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = waveType;
      osc.frequency.setValueAtTime(startFreq, startTime);
      if (startFreq !== endFreq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);
      }
      gain.gain.setValueAtTime(gainVal, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    } catch (_) {}
  }
}

export const soundEngine = new ChessSoundEngine();

// ============================================================================
// CHESS OPENING RECOGNIZER
// ============================================================================
const OPENINGS = [
  { moves: 'e4 e5 Nf3 Nc6 Bb5', name: 'Khai cuộc Tây Ban Nha (Ruy Lopez)' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4 Bc5', name: 'Khai cuộc Ý (Giuoco Piano)' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4 Nf6', name: 'Phòng thủ Hai Mã (Two Knights)' },
  { moves: 'e4 e5 Nf3 Nc6 Bc4', name: 'Khai cuộc Ý (Italian Game)' },
  { moves: 'e4 e5 Nf3 Nc6 d4', name: 'Khai cuộc Scotland (Scotch Game)' },
  { moves: 'e4 e5 f4', name: 'Gambit Vua (King\'s Gambit)' },
  { moves: 'e4 e5 Nc3', name: 'Ván cờ Viên (Vienna Game)' },
  { moves: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6', name: 'Phòng thủ Sicilian Najdorf' },
  { moves: 'e4 c5 Nf3 Nc6', name: 'Phòng thủ Sicilian Cổ điển' },
  { moves: 'e4 c5', name: 'Phòng thủ Sicilian (Sicilian Defense)' },
  { moves: 'e4 e6 d4 d5', name: 'Phòng thủ Pháp (French Defense)' },
  { moves: 'e4 e6', name: 'Phòng thủ Pháp (French Defense)' },
  { moves: 'e4 c6 d4 d5', name: 'Phòng thủ Caro-Kann' },
  { moves: 'e4 c6', name: 'Phòng thủ Caro-Kann' },
  { moves: 'e4 d5', name: 'Phòng thủ Scandinavian' },
  { moves: 'e4 d6 d4 Nf6', name: 'Phòng thủ Pirc' },
  { moves: 'e4 Nf6', name: 'Phòng thủ Alekhine' },
  { moves: 'd4 d5 c4 e6', name: 'Gambit Hậu Từ chối (QGD)' },
  { moves: 'd4 d5 c4 dxc4', name: 'Gambit Hậu Chấp nhận (QGA)' },
  { moves: 'd4 d5 c4 c6', name: 'Phòng thủ Slav (Slav Defense)' },
  { moves: 'd4 d5 c4', name: 'Gambit Hậu (Queen\'s Gambit)' },
  { moves: 'd4 d5 Bf4', name: 'Hệ thống London (London System)' },
  { moves: 'd4 Nf6 c4 g6 Nc3 Bg7', name: 'Phòng thủ Ấn Độ Vua (King\'s Indian)' },
  { moves: 'd4 Nf6 c4 e6 Nc3 Bb4', name: 'Phòng thủ Nimzo-Indian' },
  { moves: 'd4 Nf6 c4 c5', name: 'Phòng thủ Benoni' },
  { moves: 'd4 f5', name: 'Phòng thủ Hà Lan (Dutch Defense)' },
  { moves: 'c4', name: 'Khai cuộc Anh (English Opening)' },
  { moves: 'Nf3 d5 g3', name: 'Khai cuộc Réti' },
  { moves: 'e4 e5', name: 'Khai cuộc Mở (Ván cờ Vua)' },
  { moves: 'd4 d5', name: 'Khai cuộc Đóng (Ván cờ Hậu)' }
];

export function detectOpeningName(moveHistory) {
  if (!moveHistory || moveHistory.length === 0) {
    return 'Thế trận Khởi đầu • Sẵn sàng giao đấu';
  }
  const sanString = moveHistory.map((m) => (typeof m === 'string' ? m : m.san)).join(' ');
  for (const op of OPENINGS) {
    if (sanString.startsWith(op.moves)) {
      return op.name;
    }
  }
  return `Trung cuộc • Nước thứ ${Math.ceil(moveHistory.length / 2)}`;
}
