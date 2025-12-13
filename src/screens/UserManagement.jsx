import React from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, Divider, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function UserManagement({ navigation }) {
  const theme = useTheme();
  const { user, registeredUsers, canManageUsers, isSuperAdmin, changeUserRole, removeUser } = useAppContext();

  if (!canManageUsers(user)) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Card style={{ padding: 16 }}>
          <Text>No tienes permiso para ver esta sección.</Text>
          <Divider style={{ marginVertical: 8 }} />
          <Button onPress={() => navigation.navigate('ConfiguracionMain')}>Volver</Button>
        </Card>
      </View>
    );
  }

  const onPromote = (u) => {
    const target = u.rol === 'user' ? 'admin' : 'superadmin';
    // require confirmation
    Alert.alert('Cambiar rol', `Asignar rol ${target} a ${u.correo}?`, [
      { text: 'Cancelar' },
      { text: 'Confirmar', onPress: () => changeUserRole(u.correo, target) },
    ]);
  };

  const onRemove = (u) => {
    Alert.alert('Eliminar usuario', `Eliminar ${u.correo}?`, [
      { text: 'Cancelar' },
      { text: 'Eliminar', style: 'destructive', onPress: () => removeUser(u.correo) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Button mode="contained" onPress={() => navigation.navigate('CreateUser')} style={{ marginBottom: 12 }}>
        Crear usuario
      </Button>
      <FlatList
        data={registeredUsers}
        keyExtractor={(i) => i.correo}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={{ fontWeight: '700' }}>{item.nombre}</Text>
              <Text style={{ color: theme.colors.disabled }}>{item.correo} · {item.rol}</Text>
            </Card.Content>
            <Card.Actions>
              {isSuperAdmin(user) ? (
                <Button onPress={() => onPromote(item)}>Promover</Button>
              ) : (
                <Button onPress={() => onPromote(item)}>Promover (admin)</Button>
              )}
              <Button onPress={() => onRemove(item)} mode="outlined">Eliminar</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
