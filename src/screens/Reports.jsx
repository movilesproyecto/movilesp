import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, Button } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function Reports({ navigation }) {
  const theme = useTheme();
  const { user, canViewReports, departments, reservations } = useAppContext();

  if (!canViewReports(user)) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Card style={{ padding: 16 }}>
          <Text>No tienes permiso para ver reportes.</Text>
          <Button onPress={() => navigation.navigate('ConfiguracionMain')}>Volver</Button>
        </Card>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={{ padding: 16, marginBottom: 12 }}>
        <Text variant="headlineSmall">Reportes</Text>
        <Text style={{ marginTop: 8 }}>Departamentos: {departments.length}</Text>
        <Text>Reservas: {reservations.length}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
});
