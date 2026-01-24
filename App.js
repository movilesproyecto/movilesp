import React, { useRef, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Animated } from 'react-native';

import { AppProvider, useAppContext } from './src/context/AppContext';
import { PaperLightTheme, PaperDarkTheme } from './src/theme/PaperTheme';
import { Snackbar } from 'react-native-paper';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import DashboardTabs from './src/navigation/DashboardTabs';

const Stack = createNativeStackNavigator();

function AppInner() {
  const { isDarkTheme, paperTheme, user, loadingAuth } = useAppContext();
  // prefer paperTheme from context when available
  const resolvedTheme = paperTheme || (isDarkTheme ? PaperDarkTheme : PaperLightTheme);

  // Animated overlay for cross-fade between themes
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // when theme changes, animate an overlay using the new theme background
    Animated.sequence([
      Animated.timing(overlayOpacity, { toValue: 1, duration: 160, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [isDarkTheme]);

  // while auth state is loading, render null (or a splash) to avoid flicker
  if (loadingAuth === true) return null;

  return (
    <PaperProvider theme={resolvedTheme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, headerStyle: { backgroundColor: resolvedTheme.colors.topBar }, headerTintColor: resolvedTheme.colors.onTopBar }}>
          {!user ? (
            // auth flow
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            // protected app
            <Stack.Screen name="Dashboard" component={DashboardTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Animated.View pointerEvents="none" style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: resolvedTheme.colors.background,
        opacity: overlayOpacity,
      }} />

      {/* Global Snackbar from context */}
      <GlobalSnackbar />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}

function GlobalSnackbar() {
  const { snackbarVisible, snackbarMessage, setSnackbarVisible } = useAppContext();
  return (
    <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} action={{ label: 'OK', onPress: () => setSnackbarVisible(false) }}>
      {snackbarMessage}
    </Snackbar>
  );
}

