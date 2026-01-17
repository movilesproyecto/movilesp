import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Card, Text, useTheme, RadioButton } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function EditProfile({ navigation }) {
  const { user, setUser } = useAppContext();
  const theme = useTheme();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || '');
      setCorreo(user.correo || '');
      setTelefono(user.telefono || '');
      setDepartamento(user.departamento || '');
      setBio(user.bio || '');
      setGenero(user.genero || '');
    }
  }, [user]);

  const onSave = async () => {
    if (!nombre || !correo) {
      Alert.alert('Validación', 'Nombre y correo son obligatorios.');
      return;
    }

    try {
      // Update local context
      if (setUser) {
        setUser({
          ...user,
          nombre,
          correo,
          telefono,
          departamento,
          bio,
          genero
        });
      }
      Alert.alert('OK', 'Perfil actualizado');
      navigation.goBack();
    } catch (error) {
      console.log('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Editar perfil" />
        <Card.Content>
          <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput label="Correo" value={correo} onChangeText={setCorreo} style={styles.input} keyboardType="email-address" />
          <TextInput label="Teléfono" value={telefono} onChangeText={setTelefono} style={styles.input} />
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
          <TextInput label="Departamento" value={departamento} onChangeText={setDepartamento} style={styles.input} />
          <TextInput label="Biografía" value={bio} onChangeText={setBio} style={styles.input} multiline numberOfLines={3} />
        </Card.Content>
        <Card.Actions style={{ justifyContent: 'flex-end', padding: 12 }}>
          <Button mode="contained" onPress={onSave}>Guardar</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  card: { borderRadius: 10 },
  input: { marginBottom: 12, backgroundColor: 'transparent' },
});
