/** @type {const} */
const themeColors = {
  // Primary brand colors
  primary: { light: '#DC2626', dark: '#EF4444' },      // Red
  secondary: { light: '#000000', dark: '#FFFFFF' },    // Black (light) / White (dark)
  accent: { light: '#DC2626', dark: '#EF4444' },       // Red accent
  
  // Backgrounds
  background: { light: '#FFFFFF', dark: '#000000' },
  surface: { light: '#F3F4F6', dark: '#1A1A1A' },
  surface2: { light: '#E5E7EB', dark: '#262626' },
  
  // Text
  foreground: { light: '#000000', dark: '#FFFFFF' },
  muted: { light: '#6B7280', dark: '#9CA3AF' },
  
  // UI Elements
  border: { light: '#D1D5DB', dark: '#404040' },
  
  // Status colors
  success: { light: '#16A34A', dark: '#22C55E' },
  warning: { light: '#D97706', dark: '#FBBF24' },
  error: { light: '#DC2626', dark: '#EF4444' },
};

module.exports = { themeColors };
