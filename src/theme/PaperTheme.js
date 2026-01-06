import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
} from 'react-native-paper';

// --- TEMA BASE (Compatibilidad) ---
export const PaperTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: '#334155',    // Slate 700
    secondary: '#64748B',  // Slate 500
    tertiary: '#0F172A',   // Slate 900
    background: '#F8FAFC', // Slate 50
    surface: '#FFFFFF',
    text: '#0F172A',
    error: '#DC2626',
  },
};

// --- TEMA CLARO OPTIMIZADO ---
export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    // Primary Colors
    primary: '#334155',    // Slate 700 (Elegante y serio)
    secondary: '#475569',  // Slate 600
    tertiary: '#059669',   // Emerald 600 (Perfecto para "Disponible")
    
    // Backgrounds
    background: '#FFFFFF', 
    surface: '#F8FAFC',    // Gris muy tenue para tarjetas
    
    // Text Colors
    text: '#1E293B',       // Slate 800
    onSurface: '#1E293B',
    placeholder: '#94A3B8',
    
    // Status Colors
    success: '#059669',    // Esmeralda
    warning: '#D97706',    // Ámbar
    error: '#E11D48',      // Rosa/Rojo
    info: '#334155',       // Azul Slate
    
    // Custom colors para DeptBook
    topBar: '#334155',     // Color sólido para el Header
    onTopBar: '#FFFFFF',   // Texto sobre Header
    snackbar: '#1E293B',   // Fondo oscuro para notificaciones
    onSnackbar: '#FFFFFF',
    accent: '#64748B',     // Slate secundario
    
    // Surface variants
    surfaceVariant: '#F1F5F9', // Slate 100
    outline: '#E2E8F0',        // Slate 200 (Bordes finos)
    
    disabled: '#CBD5E1',
    secondaryContainer: '#F1F5F9',
  },
};

// --- TEMA OSCURO OPTIMIZADO ---
export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    // Primary Colors
    primary: '#94A3B8',    // Slate 400 (Más brillo en fondo oscuro)
    secondary: '#CBD5E1',  // Slate 300
    tertiary: '#34D399',   // Emerald 400
    
    // Backgrounds
    background: '#0F172A', // Slate 900 (Azul muy oscuro, no negro puro)
    surface: '#1E293B',    // Slate 800 para tarjetas flotantes
    
    // Text Colors
    text: '#F8FAFC',       
    onSurface: '#F1F5F9',  
    placeholder: '#64748B',
    
    // Status Colors
    success: '#34D399',
    warning: '#FBBF24',
    error: '#FB7185',
    info: '#60A5FA',
    
    // Custom colors
    topBar: '#1E293B',     // Fondo Slate 800
    onTopBar: '#F8FAFC',
    snackbar: '#94A3B8',
    onSnackbar: '#0F172A',
    accent: '#94A3B8',
    
    // Surface variants
    surfaceVariant: '#334155', // Slate 700
    outline: '#475569',        // Slate 600
    
    disabled: '#475569',
    secondaryContainer: '#334155',
  },
};

// default export para mantener compatibilidad
export default PaperTheme;