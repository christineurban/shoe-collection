interface ColorMapping {
  background: string;
  isGradient?: boolean;
}

const COLOR_MAP: Record<string, ColorMapping> = {
  red: { background: '#F56565' },
  pink: { background: '#ED64A6' },
  purple: { background: '#9F7AEA' },
  blue: { background: '#4299E1' },
  green: { background: '#48BB78' },
  yellow: { background: '#ECC94B' },
  orange: { background: '#ED8936' },
  brown: { background: '#8B4513' },
  black: { background: '#2D3748' },
  white: { background: '#FFFFFF' },
  silver: { background: '#CBD5E0' },
  gold: { background: '#D4AF37' },
  copper: { background: '#B87333' },
  bronze: { background: '#CD7F32' },
  gray: { background: '#718096' },
  nude: { background: '#E3B5A4' },
  beige: { background: '#E8DCC4' },
  clear: { background: '#E2E8F0' },
  teal: { background: '#319795' },
  navy: { background: '#2C5282' },
  turquoise: { background: '#38B2AC' },
  aqua: { background: '#4FD1C5' },
  coral: { background: '#FC8181' },
  magenta: { background: '#D53F8C' },
  lavender: { background: '#B794F4' },
  mint: { background: '#9AE6B4' },
  peach: { background: '#FBD38D' },
  burgundy: { background: '#9B2C2C' },
  mauve: { background: '#B83280' },
  holographic: {
    background: 'linear-gradient(90deg, #FF69B4, #4299E1, #48BB78, #ECC94B)',
    isGradient: true
  },
  iridescent: {
    background: 'linear-gradient(90deg, #9F7AEA, #4299E1, #48BB78)',
    isGradient: true
  },
  metallic: {
    background: 'linear-gradient(90deg, #718096, #A0AEC0, #CBD5E0)',
    isGradient: true
  },
  shimmer: {
    background: 'linear-gradient(90deg, #FFFFFF, #EDF2F7)',
    isGradient: true
  },
  glitter: {
    background: 'linear-gradient(45deg, #FFD700, #FFA07A, #FF69B4, #9F7AEA)',
    isGradient: true
  },
  multi: {
    background: 'linear-gradient(90deg, #F56565, #ED64A6, #9F7AEA, #4299E1, #48BB78, #ECC94B)',
    isGradient: true
  },
  multichrome: {
    background: 'linear-gradient(90deg, #F56565, #ED64A6, #9F7AEA, #4299E1, #48BB78, #ECC94B)',
    isGradient: true
  }
};

export const getColorMapping = (colorName: string): ColorMapping => {
  const normalizedColor = colorName.toLowerCase().trim();
  return COLOR_MAP[normalizedColor] || { background: '#F7FAFC' };
};

// Function to determine if a color is light or dark
const isLightColor = (hexColor: string): boolean => {
  // Remove any # prefix
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  // Using the formula from WCAG 2.0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5;
};

export const getTextColor = (backgroundColor: string): string => {
  // For gradients, always use white text
  if (backgroundColor.includes('gradient')) {
    return '#FFFFFF';
  }

  // For solid colors, determine based on luminance
  return isLightColor(backgroundColor) ? '#2D3748' : '#FFFFFF';
};
