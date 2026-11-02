// ============================================================================
// ROYAL CHESS — UNIFIED VECTOR SVG ICON SYSTEM, PIECE ASSETS, THEMES & AUDIO
// Strict compliance: ZERO emojis, ZERO Unicode symbols. 100% vector SVG paths.
// ============================================================================

export const BOARD_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Championship Walnut',
    subtitle: 'Gỗ óc chó & Ngà voi giải đấu',
    light: '#e8dfd1',
    dark: '#7c5c40',
    border: '#1c1814',
    coordLight: '#7c5c40',
    coordDark: '#e8dfd1',
    lastMove: 'rgba(212, 168, 83, 0.34)',
    selected: 'rgba(212, 168, 83, 0.50)'
  },
  marble: {
    id: 'marble',
    name: 'Tournament Classic',
    subtitle: 'Chuẩn giải đấu quốc tế',
    light: '#ebecd0',
    dark: '#5d8246',
    border: '#1c2419',
    coordLight: '#5d8246',
    coordDark: '#ebecd0',
    lastMove: 'rgba(234, 179, 8, 0.36)',
    selected: 'rgba(234, 179, 8, 0.52)'
  },
  royal_gold: {
    id: 'royal_gold',
    name: 'Architectural Slate',
    subtitle: 'Đá phiến & Bạch kim',
    light: '#dde2e8',
    dark: '#4b5869',
    border: '#181c22',
    coordLight: '#4b5869',
    coordDark: '#dde2e8',
    lastMove: 'rgba(212, 168, 83, 0.34)',
    selected: 'rgba(212, 168, 83, 0.48)'
  },
  wood: {
    id: 'wood',
    name: 'Rosewood & Maple',
    subtitle: 'Gỗ cẩm lai & Phong trắng',
    light: '#f0dec2',
    dark: '#8d4e35',
    border: '#26150e',
    coordLight: '#8d4e35',
    coordDark: '#f0dec2',
    lastMove: 'rgba(245, 158, 11, 0.36)',
    selected: 'rgba(217, 119, 6, 0.50)'
  },
  ocean: {
    id: 'ocean',
    name: 'Nordic Fjord',
    subtitle: 'Xanh biển Bắc Âu',
    light: '#d8e3eb',
    dark: '#3d5a73',
    border: '#15222e',
    coordLight: '#3d5a73',
    coordDark: '#d8e3eb',
    lastMove: 'rgba(56, 189, 248, 0.34)',
    selected: 'rgba(14, 165, 233, 0.48)'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Carbon Monolith',
    subtitle: 'Đen tuyền tối giản',
    light: '#b8c0cc',
    dark: '#2c323d',
    border: '#121418',
    coordLight: '#2c323d',
    coordDark: '#b8c0cc',
    lastMove: 'rgba(212, 168, 83, 0.32)',
    selected: 'rgba(212, 168, 83, 0.48)'
  },
  sakura: {
    id: 'sakura',
    name: 'Burgundy Club',
    subtitle: 'Đỏ rượu vang cổ điển',
    light: '#e6dcd5',
    dark: '#6e3438',
    border: '#241113',
    coordLight: '#6e3438',
    coordDark: '#e6dcd5',
    lastMove: 'rgba(212, 168, 83, 0.36)',
    selected: 'rgba(212, 168, 83, 0.50)'
  },
  nordic: {
    id: 'nordic',
    name: 'Alpine Sage',
    subtitle: 'Xanh xô thơm dịu mắt',
    light: '#e2e6df',
    dark: '#586e5e',
    border: '#1a211c',
    coordLight: '#586e5e',
    coordDark: '#e2e6df',
    lastMove: 'rgba(212, 168, 83, 0.34)',
    selected: 'rgba(212, 168, 83, 0.50)'
  }
};

export const PIECE_SETS = {
  staunton: {
    id: 'staunton',
    name: 'Championship Staunton',
    subtitle: 'Chuẩn giải đấu FIDE cổ điển'
  },
  imperial: {
    id: 'imperial',
    name: 'Imperial Brass & Onyx',
    subtitle: 'Hoàng kim & Hắc ngọc chạm khắc'
  },
  shogun: {
    id: 'shogun',
    name: 'Royal Shogun Armor',
    subtitle: 'Chiến giáp Samurai góc cạnh'
  },
  minimal: {
    id: 'minimal',
    name: 'Architectural Bauhaus',
    subtitle: 'Vector hình học tối giản'
  },
  crystal: {
    id: 'crystal',
    name: 'Nordic Faceted Crystal',
    subtitle: 'Pha lê đa diện Bắc Âu'
  },
  neon: {
    id: 'neon',
    name: 'Cyber Rim Tournament',
    subtitle: 'Viền phát sáng tương phản cao'
  }
};

export const UI_THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Carbon Studio',
    bg: '#0b0c0e',
    panel: '#121418',
    text: '#f3f4f6'
  },
  midnight: {
    id: 'midnight',
    name: 'Nordic Slate',
    bg: '#0d1117',
    panel: '#161b22',
    text: '#f0f6fc'
  },
  espresso: {
    id: 'espresso',
    name: 'Warm Walnut',
    bg: '#110f0d',
    panel: '#1a1613',
    text: '#f5f0eb'
  },
  alabaster: {
    id: 'alabaster',
    name: 'Graphite Matte',
    bg: '#121316',
    panel: '#181a1f',
    text: '#f3f4f6'
  }
};

export const AVATAR_LIST = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'K'
];

export const TITLE_LIST = [
  'GM', 'IM', 'FM', 'CM', 'PRO', 'KING', 'SOLO', 'VIP'
];

// ============================================================================
// UNIFIED PROFESSIONAL SVG ICON SYSTEM (Lucide Geometry + Custom Royal Chess)
// Stroke hierarchy:
//   nav: 1.85px | action: 2px | control: 1.65px | meta: 1.5px
// ============================================================================
export const ROYAL_ICONS = {
  // Brand & Custom Chess Icons
  'royal-logo': `
    <path d="M12 2.5L14.5 6L18 4.5L16.5 9H7.5L6 4.5L9.5 6L12 2.5Z" fill="#d4a853" stroke="#f3f4f6" stroke-width="1.4"/>
    <path d="M8.5 9H15.5L14.5 16.5H9.5L8.5 9Z" fill="#d4a853" fill-opacity="0.85" stroke="#f3f4f6" stroke-width="1.4"/>
    <path d="M6.5 16.5H17.5L19 20H5L6.5 16.5Z" fill="#d4a853" stroke="#f3f4f6" stroke-width="1.4"/>
    <line x1="4.5" y1="21.5" x2="19.5" y2="21.5" stroke="#d4a853" stroke-width="2"/>
  `,
  'home-play': `
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5" />
    <path d="M10 14.5l4.5 2.5-4.5 2.5v-5z" />
  `,
  'puzzle-shield': `
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  `,
  'book-open': `
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  `,
  'users': `
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  `,
  'bar-chart': `
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="3" y1="20" x2="21" y2="20" />
  `,
  'shopping-bag': `
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  `,
  'calendar': `
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  `,
  'settings': `
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  `,
  'mail': `
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  `,
  'moon-stars': `
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    <path d="M19 3v4" />
    <path d="M21 5h-4" />
  `,
  'crown': `
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" fill="currentColor" fill-opacity="0.2" />
  `,
  'vn-flag': `
    <rect x="2" y="4" width="20" height="16" rx="3" fill="#da251d" stroke="none" />
    <polygon points="12,7.2 13.35,10.8 17.2,10.8 14.1,13.05 15.3,16.7 12,14.45 8.7,16.7 9.9,13.05 6.8,10.8 10.65,10.8" fill="#ffff00" stroke="none" />
  `,
  // Chess-specific Custom SVG Icons (Section 50)
  'chess-king': `
    <path d="M12 3v3m-2-1.5h4" />
    <path d="M9 9c0-1.7 1.3-3 3-3s3 1.3 3 3c0 1.4-.8 2.6-2 3l1.5 5H9.5L11 12c-1.2-.4-2-1.6-2-3z" />
    <path d="M7 17h10l1 3H6l1-3z" />
  `,
  'chess-knight': `
    <path d="M16.5 18H7.5l1-6.5L6 11l1.5-5 5-2.5 4.5 2.5c1.5 2.5 1 7.5-.5 12z" />
    <path d="M6 21h12" />
    <circle cx="11.5" cy="7.5" r="0.8" fill="currentColor" />
  `,
  'chess-board': `
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  `,
  'analysis': `
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
    <path d="M9 8.5v4m0-2l2.5-2m-2.5 2l2.5 2" />
  `,
  'undo': `
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
  `,
  'shield-draw': `
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M8.5 12h7" />
  `,
  'flag': `
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  `,
  'maximize': `
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  `,
  'flip-board': `
    <path d="m17 2 4 4-4 4" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <path d="m7 22-4-4 4-4" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  `,
  'clock': `
    <circle cx="12" cy="12" r="9" />
    <polyline points="12 7 12 12 15 15" />
  `,
  'timer': `
    <line x1="10" y1="2" x2="14" y2="2" />
    <line x1="12" y1="14" x2="15" y2="11" />
    <circle cx="12" cy="14" r="8" />
  `,
  'user-color': `
    <circle cx="12" cy="8" r="4" />
    <path d="M5 20a7 7 0 0 1 14 0" />
  `,
  'gauge': `
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  `,
  'zap': `
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.22" />
  `,
  'lock-room': `
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1" />
  `,
  'lock': `
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  `,
  'refresh': `
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  `,
  'chevron-right': `
    <polyline points="9 18 15 12 9 6" />
  `,
  'chevron-down': `
    <polyline points="6 9 12 15 18 9" />
  `,
  'chevron-left': `
    <polyline points="15 18 9 12 15 6" />
  `,
  'chevrons-left': `
    <polyline points="11 17 6 12 11 7" />
    <polyline points="18 17 13 12 18 7" />
  `,
  'chevrons-right': `
    <polyline points="13 17 18 12 13 7" />
    <polyline points="6 17 11 12 6 7" />
  `,
  'arrow-right': `
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  `,
  'copy': `
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  `,
  'link': `
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  `,
  'chat': `
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  `,
  'send': `
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  `,
  'close': `
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  `,
  'check': `
    <polyline points="20 6 9 17 4 12" />
  `,
  'sparkles': `
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
  `,
  'trophy': `
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  `
};

const WEIGHT_MAP = {
  nav: '1.85',
  action: '2',
  control: '1.65',
  meta: '1.5'
};

export function renderIcon(name, { weight = 'control', className = '', size = 18 } = {}) {
  const pathMarkup = ROYAL_ICONS[name] || ROYAL_ICONS['sparkles'];
  const sw = WEIGHT_MAP[weight] || '1.75';
  return `<svg class="rc-icon rc-icon-${name} ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${pathMarkup}</svg>`;
}

// ============================================================================
// CUSTOM SVG MINI-SILHOUETTES FOR CAPTURED PIECES (NO UNICODE!)
// ============================================================================
export function renderCapturedPieceSVG(type, color = 'w') {
  const isWhite = color === 'w';
  const fill = isWhite ? '#e2e8f0' : '#94a3b8';
  const stroke = isWhite ? '#f8fafc' : '#475569';
  let d = '';
  switch (type) {
    case 'p':
      d = 'M12 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm-3.5 13h7l-1-5.5h-5L8.5 18zM6 20h12';
      break;
    case 'r':
      d = 'M7 5v3h2V6h2v2h2V6h2v2h2V5M8 8v9h8V8M6 19h12';
      break;
    case 'n':
      d = 'M8 18l1-6-2-.5L8.5 6l5-2 3.5 2.5c1 2.5.5 7.5-1 11.5H8zM6 20h12';
      break;
    case 'b':
      d = 'M12 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 14c0-5 2-9 4-10 2 1 4 5 4 10H8zM6 20h12';
      break;
    case 'q':
      d = 'M5 17L4 8l4.5 4L12 7l3.5 5L20 8l-1 9H5zM6 20h12';
      break;
    default:
      d = 'M12 3v3m-1.5-1.5h3M7 18L6 9l3.5 3L12 7l2.5 5L18 9l-1 9H7z';
  }
  return `<svg class="captured-piece-svg" width="15" height="15" viewBox="0 0 24 24" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}

// ============================================================================
// ARCHITECTURAL GRANDMASTER CREST AVATARS (100% VECTOR SVG)
// ============================================================================
const CREST_PALETTES = {
  A: { bg: '#181c24', border: '#64748b', accent: '#cbd5e1', icon: 'knight' },
  B: { bg: '#1c1914', border: '#b48a3e', accent: '#e2b968', icon: 'crown' },
  C: { bg: '#141e1b', border: '#10b981', accent: '#6ee7b7', icon: 'rook' },
  D: { bg: '#1e1618', border: '#e11d48', accent: '#fda4af', icon: 'queen' },
  E: { bg: '#161b26', border: '#38bdf8', accent: '#bae6fd', icon: 'bishop' },
  F: { bg: '#1d1a16', border: '#d97706', accent: '#fcd34d', icon: 'knight' },
  G: { bg: '#17191e', border: '#94a3b8', accent: '#f1f5f9', icon: 'rook' },
  K: { bg: '#1b1812', border: '#d4a853', accent: '#f3d28c', icon: 'crown' }
};

export function renderAvatarSVG(code = 'K') {
  const p = CREST_PALETTES[code] || CREST_PALETTES.K;
  let emblem = '';
  if (p.icon === 'crown') {
    emblem = `<path d="M8 25L10.5 14L15 19L20 11L25 19L29.5 14L32 25H8Z" fill="${p.accent}" fill-opacity="0.22" stroke="${p.accent}" stroke-width="1.75" stroke-linejoin="round"/><line x1="9" y1="28.5" x2="31" y2="28.5" stroke="${p.accent}" stroke-width="2" stroke-linecap="round"/>`;
  } else if (p.icon === 'knight') {
    emblem = `<path d="M13 28L14.5 19.5L11.5 18.5L13.5 11.5L21 8.5L26.5 12C28 16 27.5 22.5 25.5 28H13Z" fill="${p.accent}" fill-opacity="0.22" stroke="${p.accent}" stroke-width="1.75" stroke-linejoin="round"/><circle cx="18.5" cy="13.5" r="1.2" fill="${p.accent}"/>`;
  } else if (p.icon === 'rook') {
    emblem = `<path d="M12 11V15H14.5V12.5H17.5V15H22.5V12.5H25.5V15H28V11M13.5 15V26H26.5V15M11 28.5H29" fill="${p.accent}" fill-opacity="0.2" stroke="${p.accent}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>`;
  } else {
    emblem = `<circle cx="20" cy="11" r="2" fill="${p.accent}"/><path d="M12.5 27.5C12.5 19 16 14 20 13C24 14 27.5 19 27.5 27.5H12.5Z" fill="${p.accent}" fill-opacity="0.22" stroke="${p.accent}" stroke-width="1.75" stroke-linejoin="round"/>`;
  }
  return `
    <svg class="rc-avatar-svg" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="19" fill="${p.bg}" stroke="${p.border}" stroke-width="1.5"/>
      ${emblem}
    </svg>
  `;
}

// ============================================================================
// CHAMPIONSHIP STAUNTON VECTOR PIECES (HIGH-CRAFT CYLINDRICAL SHADING)
// ============================================================================
function getStauntonPaths(type, isWhite, styleVariant = 'staunton') {
  const uid = `${styleVariant}_${type}_${isWhite ? 'w' : 'b'}`;

  // Default: Championship Staunton (Warm Alabaster Ivory vs Satin Ebony Obsidian)
  let stop1 = isWhite ? '#ffffff' : '#434956';
  let stop2 = isWhite ? '#f4efe4' : '#242830';
  let stop3 = isWhite ? '#d5cab8' : '#101216';
  let strokeColor = isWhite ? '#1e2228' : '#0a0c0f';
  let innerStroke = isWhite ? '#2c313a' : '#d6c5a9';
  let strokeWidth = '1.5';

  if (styleVariant === 'imperial') {
    // Imperial Brass & Onyx
    stop1 = isWhite ? '#fff8e7' : '#3a2e21';
    stop2 = isWhite ? '#e8ca88' : '#1e1710';
    stop3 = isWhite ? '#b88c3b' : '#0d0a07';
    strokeColor = isWhite ? '#2a1f10' : '#090705';
    innerStroke = isWhite ? '#4a3519' : '#e5c168';
    strokeWidth = '1.5';
  } else if (styleVariant === 'crystal') {
    // Nordic Alabaster & Slate
    stop1 = isWhite ? '#ffffff' : '#475569';
    stop2 = isWhite ? '#e2e8f0' : '#273244';
    stop3 = isWhite ? '#cbd5e1' : '#111722';
    strokeColor = isWhite ? '#1e293b' : '#090d14';
    innerStroke = isWhite ? '#334155' : '#cbd5e1';
    strokeWidth = '1.5';
  } else if (styleVariant === 'neon') {
    // High-Contrast Tournament
    stop1 = isWhite ? '#ffffff' : '#383d47';
    stop2 = isWhite ? '#f8fafc' : '#1d2026';
    stop3 = isWhite ? '#e2e8f0' : '#0b0d10';
    strokeColor = '#0f172a';
    innerStroke = isWhite ? '#1e293b' : '#eab308';
    strokeWidth = '1.65';
  }

  const defs = `
    <defs>
      <linearGradient id="grad_${uid}" x1="14%" y1="10%" x2="86%" y2="85%">
        <stop offset="0%" stop-color="${stop1}" />
        <stop offset="52%" stop-color="${stop2}" />
        <stop offset="100%" stop-color="${stop3}" />
      </linearGradient>
    </defs>
  `;

  if (styleVariant === 'minimal') {
    return renderMinimalistPiece(type, isWhite, defs, `url(#grad_${uid})`, strokeColor, innerStroke);
  }
  if (styleVariant === 'shogun') {
    return renderShogunPiece(type, isWhite, uid);
  }
  if (styleVariant === 'crystal') {
    return renderCrystalPiece(type, isWhite, uid);
  }

  const fillUrl = `url(#grad_${uid})`;
  const shadowEllipse = `<ellipse cx="22.5" cy="40.2" rx="14.2" ry="2.2" fill="rgba(0,0,0,0.28)" />`;
  const imperialGem =
    styleVariant === 'imperial'
      ? `<circle cx="22.5" cy="23.5" r="1.6" fill="${isWhite ? '#d97706' : '#fbbf24'}" stroke="none"/>`
      : '';
  let body = '';

  switch (type) {
    case 'p':
      body = `
        ${shadowEllipse}
        <path d="M 22.5,9 C 19.0,9 16.3,11.7 16.3,15 C 16.3,17.4 17.8,19.5 19.9,20.4 C 16.8,22.2 15.0,25.5 15.0,29.2 C 15.0,31.4 16.9,32.8 16.9,32.8 L 12.2,37.2 L 32.8,37.2 L 28.1,32.8 C 28.1,32.8 30.0,31.4 30.0,29.2 C 30.0,25.5 28.2,22.2 25.1,20.4 C 27.2,19.5 28.7,17.4 28.7,15 C 28.7,11.7 26.0,9 22.5,9 z"
          fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M 10.5,37.2 L 34.5,37.2 C 35.4,37.2 36,38.1 36,39.5 L 9,39.5 C 9,38.1 9.6,37.2 10.5,37.2 z"
          fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linejoin="round" />
        <path d="M 18.2,20.4 L 26.8,20.4" stroke="${innerStroke}" stroke-width="1.25" stroke-linecap="round" fill="none" />
        <path d="M 15.2,34.6 L 29.8,34.6" stroke="${innerStroke}" stroke-width="1.25" stroke-linecap="round" fill="none" />
      `;
      break;

    case 'r':
      body = `
        ${shadowEllipse}
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,39.5 L 36,39.5 L 36,36.2 L 9,36.2 L 9,39.5 z" />
          <path d="M 12,36.2 L 12,32.2 L 33,32.2 L 33,36.2 L 12,36.2 z" />
          <path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z" />
          <path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z" />
          <path d="M 11,14 L 11,8.8 L 15.5,8.8 L 15.5,11.2 L 20,11.2 L 20,8.8 L 25,8.8 L 25,11.2 L 29.5,11.2 L 29.5,8.8 L 34,8.8 L 34,14" />
          <path d="M 12,32.2 L 14,29.5 L 31,29.5 L 33,32.2 L 12,32.2 z" />
          <path d="M 15,19 L 30,19" stroke="${innerStroke}" stroke-width="1.25" fill="none" />
          <path d="M 15,27.2 L 30,27.2" stroke="${innerStroke}" stroke-width="1.25" fill="none" />
        </g>
      `;
      break;

    case 'n':
      body = `
        ${shadowEllipse}
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 22,10 C 32.5,11 38.5,18 38,39.2 L 14.5,39.2 C 14.5,30 24.5,32.5 22.8,18" />
          <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" />
          <circle cx="15.2" cy="14.2" r="1.25" fill="${innerStroke}" stroke="none" />
          <path d="M 9.5,15.5 C 9,17 8,18.2 7.5,19" stroke="${innerStroke}" stroke-width="1.15" fill="none" />
          <path d="M 26.5,14.5 C 31.2,17.8 33.2,24.8 33.2,35.5" stroke="${innerStroke}" stroke-width="1.25" fill="none" />
          <path d="M 14.5,36.8 L 37.8,36.8" stroke="${innerStroke}" stroke-width="1.25" fill="none" />
        </g>
      `;
      break;

    case 'b':
      body = `
        ${shadowEllipse}
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
          <path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
          <circle cx="22.5" cy="8" r="2.2" fill="${fillUrl}" />
          <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" stroke="${innerStroke}" stroke-width="1.35" fill="none" />
        </g>
      `;
      break;

    case 'q':
      body = `
        ${shadowEllipse}
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z" />
          <path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z" />
          <circle cx="6" cy="12" r="1.9" fill="${fillUrl}" />
          <circle cx="14" cy="9" r="1.9" fill="${fillUrl}" />
          <circle cx="22.5" cy="8" r="2.1" fill="${fillUrl}" />
          <circle cx="31" cy="9" r="1.9" fill="${fillUrl}" />
          <circle cx="39" cy="12" r="1.9" fill="${fillUrl}" />
          <path d="M 11.5,30 C 18,28.5 27,28.5 33.5,30" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 12,33.5 C 18.5,32 26.5,32 33,33.5" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 11.5,36.8 C 18.5,35.5 26.5,35.5 33.5,36.8" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          ${imperialGem}
        </g>
      `;
      break;

    case 'k':
      body = `
        ${shadowEllipse}
        <g fill="${fillUrl}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 22.5,11.63 L 22.5,5.5" stroke="${strokeColor}" stroke-width="2.2" />
          <path d="M 19.5,8.2 L 25.5,8.2" stroke="${strokeColor}" stroke-width="2.2" />
          <path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="${fillUrl}" />
          <path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" />
          <path d="M 11.5,30 C 17,27 27,27 32.5,30" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          <path d="M 11.5,37 C 17,34 27,34 32.5,37" stroke="${innerStroke}" stroke-width="1.3" fill="none" />
          ${imperialGem}
        </g>
      `;
      break;
  }

  return `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-${styleVariant}">${defs}${body}</svg>`;
}

function renderShogunPiece(type, isWhite, uid) {
  const stop1 = isWhite ? '#fff5eb' : '#3a1d24';
  const stop2 = isWhite ? '#e6cdb5' : '#1f1216';
  const stop3 = isWhite ? '#b89472' : '#0d0709';
  const stroke = isWhite ? '#291c14' : '#090506';
  const accent = isWhite ? '#b45309' : '#f59e0b';
  const fillUrl = `url(#grad_${uid})`;
  const defs = `
    <defs>
      <linearGradient id="grad_${uid}" x1="15%" y1="8%" x2="85%" y2="92%">
        <stop offset="0%" stop-color="${stop1}" />
        <stop offset="55%" stop-color="${stop2}" />
        <stop offset="100%" stop-color="${stop3}" />
      </linearGradient>
    </defs>
  `;
  const shadow = `<ellipse cx="22.5" cy="40.2" rx="14.2" ry="2.2" fill="rgba(0,0,0,0.3)" />`;
  let shape = '';
  switch (type) {
    case 'p':
      shape = `
        <polygon points="22.5,8.5 29,15 26,21 31,34 34,39 11,39 14,34 19,21 16,15" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polygon points="22.5,12 25.5,15.5 22.5,19 19.5,15.5" fill="${accent}"/>
        <line x1="14" y1="35" x2="31" y2="35" stroke="${accent}" stroke-width="1.4"/>
      `;
      break;
    case 'r':
      shape = `
        <polygon points="9,12 14,9 17,12 22.5,9 28,12 31,9 36,12 33,17 31,34 35,39 10,39 14,34 12,17" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <line x1="13" y1="17" x2="32" y2="17" stroke="${accent}" stroke-width="1.5"/>
        <rect x="19.5" y="21" width="6" height="9" rx="1" fill="none" stroke="${accent}" stroke-width="1.3"/>
        <line x1="13" y1="35" x2="32" y2="35" stroke="${accent}" stroke-width="1.5"/>
      `;
      break;
    case 'n':
      shape = `
        <polygon points="12,39 15,24 9,23 7,18 14,10 16,6.5 20,9.5 26,8 34,15 35,27 33,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polygon points="15,13 19,12 17,15.5" fill="${accent}"/>
        <polyline points="23,11 29,17 29,34" fill="none" stroke="${accent}" stroke-width="1.4"/>
        <line x1="13" y1="35.5" x2="33" y2="35.5" stroke="${accent}" stroke-width="1.5"/>
      `;
      break;
    case 'b':
      shape = `
        <polygon points="22.5,6 26,11 24,13 31,21 29,34 34,39 11,39 16,34 14,21 21,13 19,11" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polygon points="22.5,16 26,22 22.5,28 19,22" fill="none" stroke="${accent}" stroke-width="1.4"/>
        <line x1="14" y1="35" x2="31" y2="35" stroke="${accent}" stroke-width="1.5"/>
      `;
      break;
    case 'q':
      shape = `
        <polygon points="10,39 13,33 8,14 16,22 16,9.5 22.5,19 22.5,7 22.5,19 29,9.5 29,22 37,14 32,33 35,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polygon points="22.5,22 26,27 22.5,31 19,27" fill="${accent}"/>
        <line x1="12.5" y1="35" x2="32.5" y2="35" stroke="${accent}" stroke-width="1.5"/>
      `;
      break;
    case 'k':
      shape = `
        <polygon points="18,6.5 22.5,4.5 27,6.5 24,11 21,11" fill="${accent}" stroke="${stroke}" stroke-width="1.2"/>
        <polygon points="10,39 12,32 7,17 15,21 22.5,11 30,21 38,17 33,32 35,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
        <polygon points="22.5,17 26.5,23.5 22.5,29.5 18.5,23.5" fill="${accent}"/>
        <line x1="12" y1="35" x2="33" y2="35" stroke="${accent}" stroke-width="1.5"/>
      `;
      break;
  }
  return `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-shogun">${defs}${shadow}${shape}</svg>`;
}

function renderCrystalPiece(type, isWhite, uid) {
  const stop1 = isWhite ? '#f8fafc' : '#334155';
  const stop2 = isWhite ? '#cbd5e1' : '#1e293b';
  const stop3 = isWhite ? '#94a3b8' : '#0f172a';
  const stroke = isWhite ? '#1e293b' : '#020617';
  const facet = isWhite ? '#ffffff' : '#64748b';
  const fillUrl = `url(#grad_${uid})`;
  const defs = `
    <defs>
      <linearGradient id="grad_${uid}" x1="10%" y1="5%" x2="90%" y2="95%">
        <stop offset="0%" stop-color="${stop1}" />
        <stop offset="50%" stop-color="${stop2}" />
        <stop offset="100%" stop-color="${stop3}" />
      </linearGradient>
    </defs>
  `;
  const shadow = `<ellipse cx="22.5" cy="40.2" rx="13.8" ry="2" fill="rgba(0,0,0,0.26)" />`;
  let shape = '';
  switch (type) {
    case 'p':
      shape = `
        <polygon points="22.5,8.5 28,14 25.5,20 31.5,35 34,39 11,39 13.5,35 19.5,20 17,14" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <line x1="22.5" y1="8.5" x2="22.5" y2="39" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
        <line x1="13.5" y1="35" x2="31.5" y2="35" stroke="${facet}" stroke-width="1.2"/>
      `;
      break;
    case 'r':
      shape = `
        <polygon points="12,10 33,10 30,17 31,34 34.5,39 10.5,39 14,34 15,17" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <line x1="18.5" y1="10" x2="18.5" y2="39" stroke="${facet}" stroke-width="1.15" opacity="0.7"/>
        <line x1="26.5" y1="10" x2="26.5" y2="39" stroke="${facet}" stroke-width="1.15" opacity="0.7"/>
        <line x1="14" y1="34" x2="31" y2="34" stroke="${facet}" stroke-width="1.2"/>
      `;
      break;
    case 'n':
      shape = `
        <polygon points="12,39 15.5,24 10,21 13,11 22.5,7.5 31.5,13.5 33.5,26 32.5,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <polyline points="22.5,7.5 21,21 32.5,39" fill="none" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
        <circle cx="17" cy="14" r="1.3" fill="${facet}"/>
      `;
      break;
    case 'b':
      shape = `
        <polygon points="22.5,7 30.5,19 29,34 34,39 11,39 16,34 14.5,19" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <line x1="22.5" y1="7" x2="22.5" y2="39" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
        <line x1="14.5" y1="19" x2="30.5" y2="19" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
      `;
      break;
    case 'q':
      shape = `
        <polygon points="10.5,39 13,33 8.5,14 17,22 22.5,8 28,22 36.5,14 32,33 34.5,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <line x1="22.5" y1="8" x2="22.5" y2="39" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
        <line x1="13" y1="33" x2="32" y2="33" stroke="${facet}" stroke-width="1.2"/>
      `;
      break;
    case 'k':
      shape = `
        <line x1="22.5" y1="5" x2="22.5" y2="11" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round"/>
        <line x1="19.5" y1="8" x2="25.5" y2="8" stroke="${stroke}" stroke-width="2.1" stroke-linecap="round"/>
        <polygon points="10.5,39 12.5,32 9.5,17 17.5,21 22.5,11 27.5,21 35.5,17 32.5,32 34.5,39" fill="${fillUrl}" stroke="${stroke}" stroke-width="1.55" stroke-linejoin="round"/>
        <line x1="22.5" y1="11" x2="22.5" y2="39" stroke="${facet}" stroke-width="1.2" opacity="0.75"/>
        <line x1="12.5" y1="32" x2="32.5" y2="32" stroke="${facet}" stroke-width="1.2"/>
      `;
      break;
  }
  return `<svg viewBox="0 0 45 45" class="chess-piece-svg piece-crystal">${defs}${shadow}${shape}</svg>`;
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
  const normType = String(type || 'p').toLowerCase();
  const isWhite = color === 'w';
  return getStauntonPaths(normType, isWhite, pieceSet);
}

// ============================================================================
// PROCEDURAL WEB AUDIO SOUND ENGINE
// ============================================================================
class ChessSoundEngine {
  constructor() {
    this.ctx = null;
    this.pack = 'wood';
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
    return 'Thế trận Khởi đầu - Sẵn sàng giao đấu';
  }
  const sanString = moveHistory.map((m) => (typeof m === 'string' ? m : m.san)).join(' ');
  for (const op of OPENINGS) {
    if (sanString.startsWith(op.moves)) {
      return op.name;
    }
  }
  return `Trung cuộc - Nước thứ ${Math.ceil(moveHistory.length / 2)}`;
}
