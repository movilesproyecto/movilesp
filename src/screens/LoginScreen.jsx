

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar, Card, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { loginWithCredentials } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const validateEmail = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const isFormValid = validateEmail(email) && password.length >= 6;

  const handleLogin = () => {
    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Introduce un correo válido.');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Usa loginWithCredentials para verificar email/password contra usuarios registrados
      const result = loginWithCredentials(email, password);
      if (result.success) {
        setError('');
        // Navega al Dashboard
        if (navigation && typeof navigation.replace === 'function') {
          navigation.replace('Dashboard');
        }
      } else {
        setError(result.message || 'Error al iniciar sesión.');
      }
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Iniciar sesión</Text>
          
          {/* Demo users info */}
          <Card style={{ backgroundColor: theme.colors.surfaceVariant, marginBottom: 16 }}>
            <Card.Content>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
                Usuarios demo disponibles:
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                👤 Usuario: johan11gamerez@gmail.com / 123456
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                👨‍💼 Admin: admin@demo.com / admin123
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                🔐 Root: root@demo.com / root123
              </Text>
            </Card.Content>
          </Card>
          
          <TextInput
            label="Correo"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {email.length > 0 && !validateEmail(email) && (
            <Text style={[styles.fieldError, { color: theme.colors.error }]}>Correo inválido</Text>
          )}
          <TextInput
            label="Contraseña"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          {password.length > 0 && password.length < 6 && (
            <Text style={[styles.fieldError, { color: theme.colors.error }]}>Mínimo 6 caracteres</Text>
          )}
          <Button mode="contained" loading={loading} disabled={!isFormValid || loading} onPress={handleLogin} style={styles.button}>
            Entrar
          </Button>
          <View style={styles.registerContainer}>
            <Text>¿No tienes cuenta? </Text>
            <Button mode="text" onPress={() => navigation.push('Register')} style={styles.registerButton}>
              Registrarse
            </Button>
          </View>
        </Card.Content>
      </Card>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000} style={{ backgroundColor: theme.colors.snackbar }}>
        <Text style={{ color: theme.colors.onSnackbar }}>{error}</Text>
      </Snackbar>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 22,
    },
    card: {
      paddingVertical: 18,
      paddingHorizontal: 12,
      elevation: 5,
      borderRadius: 10,
      },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 16,
    },
    input: {
      marginBottom: 14,

    },
    button: {
      marginTop: 8,
      paddingVertical: 6,
    },
    registerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    registerButton: {
      padding: 0,
    },
  });