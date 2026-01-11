import React, { useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar, Card, useTheme, RadioButton } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

export default function RegisterScreen({ navigation }) {
  const { register, apiRegister } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Nuevo estado para la visibilidad de la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();

  const validateEmail = (value) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const isFormValid =
    nombre.length >= 3 &&
    validateEmail(email) &&
    password.length >= 6 &&
    password === confirmPassword &&
    telefono.length >= 7 &&
    genero.length > 0;

  const handleRegister = () => {
    if (!nombre || !email || !password || !confirmPassword) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (nombre.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
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
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!telefono || telefono.length < 7) {
      setError('Introduce un número de teléfono válido.');
      return;
    }
    if (!genero) {
      setError('Selecciona un género.');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      
      // Intentar registrar en el backend primero
      if (apiRegister) {
        const apiResult = await apiRegister(nombre, email, password);
        if (apiResult.success) {
          alert('Registro exitoso. Por favor inicia sesión con tus datos.');
          if (navigation) {
            navigation.navigate('Login');
          }
          return;
        }
        // Si la llamada al backend respondió con error, mostrarlo y no fallbackear
        setError(apiResult.message || 'Error al registrar en el servidor');
        return;
      }

      // Fallback: registrar localmente si no hay cliente API disponible
      const result = register(nombre, email, password, { telefono, genero });
      if (result.success) {
        alert('Registro exitoso. Por favor inicia sesión con tus datos.');
        if (navigation) {
          navigation.navigate('Login');
        }
      } else {
        setError(result.message);
      }
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* KeyboardAvoidingView asegura que el teclado no tape el formulario */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header decorativo */}
          <View style={[styles.headerDecor, { backgroundColor: theme.colors.secondary }]}>
            <FontAwesome name="user-plus" size={44} color="white" />
            <Text style={styles.headerTitle}>Crear Cuenta</Text>
            <Text style={styles.headerSubtitle}>Únete a nuestra comunidad</Text>
          </View>

          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.stepIndicator, { color: theme.colors.primary }]}>Datos Personales</Text>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Nombre Completo</Text>
                <TextInput
                  label="Ingresa tu nombre completo"
                  mode="outlined"
                  value={nombre}
                  onChangeText={setNombre}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  autoCapitalize="words"
                  left={<TextInput.Icon icon="account" color={theme.colors.primary} />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                {nombre.length > 0 && nombre.length < 3 && (
                  <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={12} color={theme.colors.error} />
                    <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Mínimo 3 caracteres</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Correo Electrónico</Text>
                <TextInput
                  label="tu@email.com"
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
                    <FontAwesome name="exclamation-circle" size={12} color={theme.colors.error} />
                    <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Correo inválido</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.stepIndicator, { color: theme.colors.primary, marginTop: 20 }]}>Seguridad</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Contraseña</Text>
                <TextInput
                  label="Crea una contraseña segura"
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  left={<TextInput.Icon icon="lock" color={theme.colors.primary} />}
                  right={
                    <TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      onPress={() => setShowPassword(!showPassword)}
                      color={theme.colors.primary}
                    />
                  }
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                {password.length > 0 && password.length < 6 && (
                  <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={12} color={theme.colors.error} />
                    <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Mínimo 6 caracteres</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Confirmar Contraseña</Text>
                <TextInput
                  label="Repite tu contraseña"
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  left={<TextInput.Icon icon="lock-check" color={theme.colors.primary} />}
                  right={
                    <TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      onPress={() => setShowPassword(!showPassword)}
                      color={theme.colors.primary}
                    />
                  }
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                {confirmPassword.length > 0 && password !== confirmPassword && (
                  <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={12} color={theme.colors.error} />
                    <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Las contraseñas no coinciden</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.stepIndicator, { color: theme.colors.primary, marginTop: 20 }]}>Contacto</Text>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Teléfono</Text>
                <TextInput
                  label="+1 (555) 000-0000"
                  mode="outlined"
                  value={telefono}
                  onChangeText={setTelefono}
                  style={[styles.input, { backgroundColor: theme.colors.surface }]}
                  keyboardType="phone-pad"
                  left={<TextInput.Icon icon="phone" color={theme.colors.primary} />}
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                {telefono.length > 0 && telefono.length < 7 && (
                  <View style={styles.errorContainer}>
                    <FontAwesome name="exclamation-circle" size={12} color={theme.colors.error} />
                    <Text style={[styles.fieldError, { color: theme.colors.error, marginLeft: 6 }]}>Número demasiado corto</Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Género</Text>
                <View style={[styles.genderCard, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline }]}>
                  <RadioButton.Group onValueChange={setGenero} value={genero}>
                    <View style={styles.radioGroup}>
                      <View style={styles.radioItem}>
                        <RadioButton 
                          value="male"
                          color={theme.colors.primary}
                        />
                        <Text style={[{ marginLeft: 8, color: theme.colors.text }]}>👨 Masculino</Text>
                      </View>
                      <View style={styles.radioItem}>
                        <RadioButton 
                          value="female"
                          color={theme.colors.primary}
                        />
                        <Text style={[{ marginLeft: 8, color: theme.colors.text }]}>👩 Femenino</Text>
                      </View>
                      <View style={styles.radioItem}>
                        <RadioButton 
                          value="other"
                          color={theme.colors.primary}
                        />
                        <Text style={[{ marginLeft: 8, color: theme.colors.text }]}>🤝 Otro</Text>
                      </View>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>

              <Button
                mode="contained"
                loading={loading}
                disabled={!isFormValid || loading}
                onPress={handleRegister}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>

              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
                <Text style={[styles.dividerText, { color: theme.colors.placeholder }]}>¿Ya tienes cuenta?</Text>
                <View style={[styles.dividerLine, { backgroundColor: theme.colors.outline }]} />
              </View>

              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={[styles.loginButton, { borderColor: theme.colors.primary }]}
                labelStyle={[styles.loginButtonLabel, { color: theme.colors.primary }]}
              >
                Inicia Sesión
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar 
        visible={!!error} 
        onDismiss={() => setError('')} 
        duration={3000} 
        style={[styles.snackbar, { backgroundColor: theme.colors.error }]}
      >
        <Text style={{ color: '#FFFFFF' }}>{error}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 13,
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
  stepIndicator: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
  genderCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  button: {
    marginTop: 20,
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
  loginButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 4,
  },
  loginButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  snackbar: {
    borderRadius: 8,
    marginHorizontal: 16,
  },
});