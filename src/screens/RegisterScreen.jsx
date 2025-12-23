import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
        if (navigation) {
          alert("Registro exitoso por favor, inicia sesión con tus datos.");
          navigation.navigate('LoginScreen');
        }
      } else {
        // Mostrar error si el correo ya existe
        setError(result.message);
      }
    }, 800);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
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
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          {password.length > 0 && password.length < 6 && (
            <Text style={[styles.fieldError, { color: theme.colors.error }]}>Mínimo 6 caracteres</Text>
          )}
          <TextInput
            label="Confirmar contraseña"
            mode="outlined"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
          />
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

          <Text style={{ marginBottom: 6 }}>Género</Text>
          <RadioButton.Group onValueChange={setGenero} value={genero}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <RadioButton value="male" />
              <Text>Masculino</Text>
              <RadioButton value="female" />
              <Text>Femenino</Text>
              <RadioButton value="other" />
              <Text>Otro</Text>
            </View>
          </RadioButton.Group>
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={[styles.fieldError, { color: theme.colors.error }]}>Las contraseñas no coinciden</Text>
          )}
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
    marginBottom: 18,
  },
  input: {
    marginBottom: 14,
  },
  fieldError: {
    fontSize: 12,
    marginBottom: 8,
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
});