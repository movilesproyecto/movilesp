import React, { useState } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar, Card, useTheme, RadioButton } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAppContext();
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
    setTimeout(() => {
      setLoading(false);
      // Intenta registrar el usuario con validación de correo único
      const result = register(nombre, email, password, { telefono, genero });
      if (result.success) {
        // Registro exitoso, navega al Dashboard
        if (navigation && typeof navigation.replace === 'function') {
          navigation.replace('Dashboard');
        }
      } else {
        // Mostrar error si el correo ya existe
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
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Crear cuenta</Text>
              
              <TextInput
                label="Nombre completo"
                mode="outlined"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
                autoCapitalize="words"
              />
              {nombre.length > 0 && nombre.length < 3 && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>Mínimo 3 caracteres</Text>
              )}

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
                secureTextEntry={!showPassword} // Controlado por el estado
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)} 
                  />
                }
              />
              {password.length > 0 && password.length < 6 && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>Mínimo 6 caracteres</Text>
              )}

              <TextInput
                label="Confirmar contraseña"
                mode="outlined"
                secureTextEntry={!showPassword} // Controlado por el estado
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                right={
                  <TextInput.Icon 
                    icon={showPassword ? "eye-off" : "eye"} 
                    onPress={() => setShowPassword(!showPassword)} 
                  />
                }
              />
              {/* MOVIDO: Mensaje de error de contraseña ahora está en el lugar correcto */}
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>Las contraseñas no coinciden</Text>
              )}

              <TextInput
                label="Teléfono"
                mode="outlined"
                value={telefono}
                onChangeText={setTelefono}
                style={styles.input}
                keyboardType="phone-pad"
              />
              {telefono.length > 0 && telefono.length < 7 && (
                <Text style={[styles.fieldError, { color: theme.colors.error }]}>Número demasiado corto</Text>
              )}

              <Text style={{ marginBottom: 6, marginTop: 10 }}>Género</Text>
              <RadioButton.Group onValueChange={setGenero} value={genero}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
                  <View style={styles.radioItem}>
                    <RadioButton value="male" />
                    <Text>Masculino</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="female" />
                    <Text>Femenino</Text>
                  </View>
                  <View style={styles.radioItem}>
                    <RadioButton value="other" />
                    <Text>Otro</Text>
                  </View>
                </View>
              </RadioButton.Group>

              <Button
                mode="contained"
                loading={loading}
                disabled={!isFormValid || loading}
                onPress={handleRegister}
                style={styles.button}
              >
                Registrarse
              </Button>

              <View style={styles.loginContainer}>
                <Text>¿Ya tienes cuenta? </Text>
                <Button mode="text" onPress={() => navigation.goBack()} style={styles.loginButton}>
                  Inicia sesión
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000} style={{ backgroundColor: theme.colors.snackbar }}>
        <Text style={{ color: theme.colors.onSnackbar }}>{error}</Text>
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20, // Espacio extra al final del scroll
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
    marginBottom: 18,
  },
  input: {
    marginBottom: 10, // Reducido ligeramente para mejor densidad
  },
  fieldError: {
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 5, // Pequeña indentación para el error
  },
  button: {
    marginTop: 12,
    paddingVertical: 6,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginButton: {
    padding: 0,
  },
  radioItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 10
  }
});