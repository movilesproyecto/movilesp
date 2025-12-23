
import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

// Modern & Professional Color Palette
export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#334155', 
    secondary: '#64748B', 
    tertiary: '#0F172A', 
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: '#0F172A',
    error: '#DC2626',
  },
};

export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    // Primary Colors
    primary: '#334155', // Deep Blue (better contrast)
    secondary: '#475569', // Deep Purple (better contrast)
    tertiary: '#059669', // Deep Emerald (better contrast)
    
    // Backgrounds
    background: '#FFFFFF', // Pure white for light mode
    surface: '#F8FAFC', // Light gray for cards
    
    // Text Colors
    text: '#1E293B', // Darker text
    onSurface: '#1E293B',
    placeholder: '#94A3B8',
    
    // Status Colors
    success: '#059669',
    warning: '#D97706',
    error: '#E11D48',
    info: '#334155',
    
    // Custom colors
    topBar: '#334155', // Deep Blue
    onTopBar: '#FFFFFF',
    snackbar: '#1E293B', // Deep Purple
    onSnackbar: '#FFFFFF',
    accent: '#64748B', // Pink accent
    
    // Surface variants
    surfaceVariant: '#F3F4F6',
    outline: '#D1D5DB',
    
    disabled: '#E5E7EB',
    secondaryContainer: '#EDE9FE',
    tertiary: '#059669',
  },
};

export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    // Primary Colors
    primary: '#94A3B8', // Bright Blue (more visible)
    secondary: '#A78BFA', // Light Purple
    tertiary: '#34D399', // Light Emerald
    
    // Backgrounds
    background: '#111827', // Very dark background
    surface: '#1F2937', // Dark slate cards
    
    // Text Colors
    text: '#F9FAFB', // Very light text - MEJORADO
    onSurface: '#F0F4F8', // Even lighter for better contrast
    placeholder: '#D1D5DB', // Lighter placeholder
    
    // Status Colors
    success: '#34D399',
    warning: '#FCD34D',
    error: '#F87171',
    info: '#60A5FA',
    
    // Custom colors
    topBar: '#1F2937',
    onTopBar: '#F9FAFB',
    snackbar: '#A78BFA',
    onSnackbar: '#111827',
    accent: '#F472B6',
    
    // Surface variants
    surfaceVariant: '#374151',
    outline: '#4B5563',
    
    disabled: '#9CA3AF', // Lighter disabled text
    secondaryContainer: '#3F366B',
    tertiary: '#34D399',
  },
};

// default export kept for backward compatibility
export default PaperTheme;