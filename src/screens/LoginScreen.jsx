

import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Animated, useWindowDimensions } from 'react-native';
import { TextInput, Button, Text, Snackbar, Card, useTheme } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

export default function LoginScreen({ navigation }) {
  const { loginWithCredentials } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { width } = useWindowDimensions();

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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} contentContainerStyle={styles.scrollContent}>
      {/* Header decorativo */}
      <View style={[styles.headerDecor, { backgroundColor: theme.colors.primary }]}>
        <FontAwesome name="building" size={48} color="white" />
        <Text style={styles.headerTitle}>DeptBook</Text>
        <Text style={styles.headerSubtitle}>Gestor de Departamentos</Text>
      </View>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.title, { color: theme.colors.primary }]}>Iniciar sesión</Text>
          
          {/* Demo users info - Mejorado */}
          <Card style={[styles.infoCard, { backgroundColor: theme.colors.surfaceVariant }]}>
            <Card.Content>
              <View style={styles.infoHeader}>
                <FontAwesome name="info-circle" size={16} color={theme.colors.primary} />
                <Text variant="labelSmall" style={[styles.infoTitle, { color: theme.colors.primary, marginLeft: 8 }]}>
                  Usuarios Demo
                </Text>
              </View>
              
              <View style={styles.userDemo}>
                <FontAwesome name="user" size={14} color={theme.colors.secondary} />
                <Text variant="bodySmall" style={[{ color: theme.colors.onSurface, marginLeft: 8, flex: 1 }]}>
                  <Text style={{ fontWeight: 'bold' }}>Usuario:</Text> johan11gamerez@gmail.com / 123456
                </Text>
              </View>
              
              <View style={styles.userDemo}>
                <FontAwesome name="shield" size={14} color={theme.colors.warning} />
                <Text variant="bodySmall" style={[{ color: theme.colors.onSurface, marginLeft: 8, flex: 1 }]}>
                  <Text style={{ fontWeight: 'bold' }}>Admin:</Text> admin@demo.com / admin123
                </Text>
              </View>
              
              <View style={styles.userDemo}>
                <FontAwesome name="lock" size={14} color={theme.colors.error} />
                <Text variant="bodySmall" style={[{ color: theme.colors.onSurface, marginLeft: 8, flex: 1 }]}>
                  <Text style={{ fontWeight: 'bold' }}>Root:</Text> root@demo.com / root123
                </Text>
              </View>
            </Card.Content>
          </Card>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Correo Electrónico</Text>
            <TextInput
              label="Ingresa tu correo"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              autoCapitalize="none"
              keyboardType="email-address"
              left={<TextInput.Icon icon="email" color={theme.colors.primary} />}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {email.length > 0 && !validateEmail(email) && (
              <View style={styles.errorContainer}>
                <FontAwesome name="exclamation-circle" size={14} color={theme.colors.error} />
                <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Correo inválido</Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Contraseña</Text>
            <TextInput
              label="Ingresa tu contraseña"
              mode="outlined"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { backgroundColor: theme.colors.surface }]}
              left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {password.length > 0 && password.length < 6 && (
              <View style={styles.errorContainer}>
                <FontAwesome name="exclamation-circle" size={14} color={theme.colors.error} />
                <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Mínimo 6 caracteres</Text>
              </View>
            )}
          </View>

          <Button 
            mode="contained" 
            loading={loading} 
            disabled={!isFormValid || loading} 
            onPress={handleLogin} 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
            <Text style={[styles.dividerText, { color: theme.colors.placeholder }]}>¿No tienes cuenta?</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
          </View>

          <Button 
            mode="outlined" 
            onPress={() => navigation.push('Register')} 
            style={[styles.registerButton, { borderColor: theme.colors.primary }]}
            labelStyle={[styles.registerButtonLabel, { color: theme.colors.primary }]}
          >
            Crear Nueva Cuenta
          </Button>
        </Card.Content>
      </Card>

      <Snackbar 
        visible={!!error} 
        onDismiss={() => setError('')} 
        duration={3000} 
        style={[styles.snackbar, { backgroundColor: theme.colors.error }]}
      >
        <Text style={{ color: '#FFFFFF' }}>{error}</Text>
      </Snackbar>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerDecor: {
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#F1F5F9',
    marginTop: 4,
  },
  card: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoCard: {
    marginBottom: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1D4ED8',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  userDemo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
    borderRadius: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  fieldError: {
    fontSize: 12,
    fontWeight: '500',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  registerButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 4,
  },
  registerButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  snackbar: {
    borderRadius: 8,
    marginHorizontal: 16,
  },
});