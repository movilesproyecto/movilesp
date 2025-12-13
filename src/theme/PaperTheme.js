
import {
  MD3LightTheme as DefaultLightTheme,
  MD3DarkTheme as DefaultDarkTheme,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';

export const PaperTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // New palette (Teal + Coral)
    primary: '#0F6E68', // teal
    secondary: '#FF7A59', // coral accent
    background: '#F6F8FA',
    surface: '#FFFFFF',
    text: '#0F1720',
    error: '#D32F2F',
  },
};

export const PaperLightTheme = {
  ...DefaultLightTheme,
  colors: {
    ...DefaultLightTheme.colors,
    primary: '#0F6E68',
    background: '#F6F8FA',
    text: '#0F1720',
    topBar: '#0B4F4B',
    onTopBar: '#FFFFFF',
    snackbar: '#FF7A59',
    onSnackbar: '#ffffff',
  },
};

export const PaperDarkTheme = {
  ...DefaultDarkTheme,
  colors: {
    ...DefaultDarkTheme.colors,
    primary: '#66BFBF',
    background: '#081416',
    surface: '#0F2322',
    surfaceVariant: '#0C2A29',
    onSurface: '#E6F2F1',
    text: '#E6F2F1',
    placeholder: '#90BDBB',
    disabled: '#254B4A',
    outline: '#255E5C',
    backdrop: 'rgba(0,0,0,0.6)',
    // custom additions to improve contrast
    topBar: '#063B3A',
    onTopBar: '#E6F2F1',
    snackbar: '#FFAB91',
    onSnackbar: '#1B1B1B',
  },
};

// default export kept for backward compatibility
export default PaperTheme;