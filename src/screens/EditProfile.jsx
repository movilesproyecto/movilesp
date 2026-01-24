import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Card, Text, useTheme, RadioButton, ActivityIndicator } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import apiClient from '../services/apiClient';

export default function EditProfile({ navigation }) {
  const { user, setUser, updateUserProfile, authToken } = useAppContext();
  const theme = useTheme();
  
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [genero, setGenero] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [bio, setBio] = useState('');
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    if (user) {
      setNombre(user.nombre || user.name || '');
      setCorreo(user.correo || user.email || '');
      setOriginalEmail(user.correo || user.email || '');
      setTelefono(user.telefono || user.phone || '');
      setDepartamento(user.departamento || '');
      setBio(user.bio || '');
      setGenero(user.genero || user.gender || '');
    }
  }, [user]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const onSave = async () => {
    if (!nombre.trim()) {
      Alert.alert('Validación', 'El nombre es obligatorio.');
      return;
    }

    if (!validateEmail(correo)) {
      Alert.alert('Validación', 'Por favor ingresa un correo válido.');
      return;
    }

    // Validar contraseña si se intenta cambiar
    if (passwordNueva) {
      if (!passwordActual) {
        Alert.alert('Validación', 'Debes ingresarla contraseña actual para cambiarla.');
        return;
      }
      if (passwordNueva.length < 6) {
        Alert.alert('Validación', 'La nueva contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (passwordNueva !== passwordConfirm) {
        Alert.alert('Validación', 'Las contraseñas no coinciden.');
        return;
      }
    }

    setSaving(true);
    try {
      // Actualizar datos de perfil
      const updateData = {
        name: nombre.trim() || '',
        email: correo.trim() || '',
        phone: telefono.trim() || '',
        department: departamento.trim() || '',
        bio: bio.trim() || '',
        gender: genero || null,
      };

      // Si hay cambio de contraseña, agregarlo
      if (passwordNueva && passwordNueva.trim()) {
        updateData.current_password = passwordActual;
        updateData.password = passwordNueva;
        updateData.password_confirmation = passwordConfirm;
      }

      // Remover campos vacíos
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === '' || updateData[key] === null) {
          delete updateData[key];
        }
      });

      if (authToken) {
        // Llamar API para actualizar
        const res = await apiClient.put('/auth/profile', updateData);
        if (res.status >= 200 && res.status < 300) {
          const updatedUser = res.data?.user || res.data;
          
          // Actualizar contexto con los nuevos datos
          if (setUser) {
            const newUserData = {
              ...user,
              ...updatedUser,
              id: user.id,
              name: updatedUser.name || nombre,
              email: updatedUser.email || correo,
              phone: updatedUser.phone || telefono,
              department: updatedUser.department || departamento,
              bio: updatedUser.bio || bio,
              gender: updatedUser.gender || genero,
              // También mapear a variantes en español
              nombre: updatedUser.name || nombre,
              correo: updatedUser.email || correo,
              telefono: updatedUser.phone || telefono,
              departamento: updatedUser.department || departamento,
              genero: updatedUser.gender || genero,
            };
            setUser(newUserData);
          }

          // Actualizar en contexto si existe la función
          if (updateUserProfile) {
            updateUserProfile(originalEmail, {
              nombre,
              correo,
              telefono,
              departamento,
              bio,
              genero,
            });
          }

          Alert.alert('Éxito', 'Perfil actualizado correctamente');
          setPasswordActual('');
          setPasswordNueva('');
          setPasswordConfirm('');
          navigation.goBack();
        }
      } else {
        // Fallback: actualizar localmente sin API
        if (setUser) {
          setUser({
            ...user,
            nombre,
            correo,
            telefono,
            departamento,
            bio,
            genero,
          });
        }
        Alert.alert('Éxito', 'Perfil actualizado localmente');
        navigation.goBack();
      }
    } catch (error) {
      console.log('Error saving profile:', error);
      console.log('Error response data:', error.response?.data);
      const errorMsg = error.response?.data?.message || error.response?.data?.errors || error.message || 'No se pudo actualizar el perfil.';
      Alert.alert('Error', typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface, marginVertical: 16 }]}>
        <Card.Title title="Editar perfil" />
        <Card.Content>
          {/* Datos personales */}
          <Text variant="titleSmall" style={{ marginBottom: 12, fontWeight: '600' }}>Datos Personales</Text>
          
          <TextInput 
            label="Nombre" 
            value={nombre} 
            onChangeText={setNombre} 
            style={styles.input}
            editable={!saving}
          />
          
          <TextInput 
            label="Correo" 
            value={correo} 
            onChangeText={setCorreo} 
            style={styles.input}
            keyboardType="email-address"
            editable={!saving}
          />
          
          <TextInput 
            label="Teléfono" 
            value={telefono} 
            onChangeText={setTelefono} 
            style={styles.input}
            keyboardType="phone-pad"
            editable={!saving}
          />

          <Text style={{ marginBottom: 8, marginTop: 8 }}>Género</Text>
          <RadioButton.Group onValueChange={setGenero} value={genero}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                <RadioButton value="Masculino" disabled={saving} />
                <Text>Masculino</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                <RadioButton value="Femenino" disabled={saving} />
                <Text>Femenino</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value="Otro" disabled={saving} />
                <Text>Otro</Text>
              </View>
            </View>
          </RadioButton.Group>
          
          <TextInput 
            label="Departamento" 
            value={departamento} 
            onChangeText={setDepartamento} 
            style={styles.input}
            editable={!saving}
          />
          
          <TextInput 
            label="Biografía" 
            value={bio} 
            onChangeText={setBio} 
            style={styles.input} 
            multiline 
            numberOfLines={3}
            editable={!saving}
          />

          {/* Cambio de contraseña */}
          <Text variant="titleSmall" style={{ marginBottom: 12, marginTop: 20, fontWeight: '600' }}>Cambiar Contraseña (Opcional)</Text>
          
          <TextInput 
            label="Contraseña Actual" 
            value={passwordActual} 
            onChangeText={setPasswordActual} 
            style={styles.input}
            secureTextEntry
            editable={!saving}
          />
          
          <TextInput 
            label="Nueva Contraseña" 
            value={passwordNueva} 
            onChangeText={setPasswordNueva} 
            style={styles.input}
            secureTextEntry
            editable={!saving}
          />
          
          <TextInput 
            label="Confirmar Nueva Contraseña" 
            value={passwordConfirm} 
            onChangeText={setPasswordConfirm} 
            style={styles.input}
            secureTextEntry
            editable={!saving}
          />
        </Card.Content>
        
        <Card.Actions style={{ justifyContent: 'flex-end', padding: 12 }}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button 
            mode="contained" 
            onPress={onSave}
            disabled={saving}
            style={{ marginLeft: 8 }}
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Card.Actions>
      </Card>

      {saving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 8 },
  card: { borderRadius: 10 },
  input: { marginBottom: 12, backgroundColor: 'transparent' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
});
