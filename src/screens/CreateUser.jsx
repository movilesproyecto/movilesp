import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, RadioButton, Text, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function CreateUser({ navigation }) {
  const theme = useTheme();
  const { addUser, showSnackbar, Roles } = useAppContext();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(Roles.USER);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    const res = addUser({ nombre, correo, password, rol: role });
    setLoading(false);
    if (res.success) {
      if (typeof showSnackbar === 'function') showSnackbar('Usuario creado correctamente');
      navigation.goBack();
    } else {
      if (typeof showSnackbar === 'function') showSnackbar(res.message || 'Error al crear usuario');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.form}>
        <Text style={{ marginBottom: 8, fontWeight: '700' }}>Crear nuevo usuario</Text>
        <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
        <TextInput label="Correo" value={correo} onChangeText={setCorreo} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        <TextInput label="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

        <Text style={{ marginTop: 8 }}>Rol</Text>
        <RadioButton.Group onValueChange={(v) => setRole(v)} value={role}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton value={Roles.USER} />
            <Text>Usuario</Text>
            <RadioButton value={Roles.ADMIN} />
            <Text>Administrador</Text>
            <RadioButton value={Roles.SUPERADMIN} />
            <Text>Superadmin</Text>
          </View>
        </RadioButton.Group>

        <Button mode="contained" onPress={onSubmit} loading={loading} style={{ marginTop: 12 }}>
          Crear
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 16 },
  input: { marginBottom: 8 },
});
