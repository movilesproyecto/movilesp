import React from 'react';
import { View, FlatList, Alert, StyleSheet } from 'react-native';
import { Card, Text, Button, Divider, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationApprovals({ navigation }) {
  const theme = useTheme();
  const { user, reservations, canApproveReservation, approveReservation, rejectReservation } = useAppContext();

  if (!canApproveReservation(user)) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Card style={{ padding: 16 }}>
          <Text>No tienes permiso para gestionar aprobaciones.</Text>
          <Divider style={{ marginVertical: 8 }} />
          <Button onPress={() => navigation.goBack()}>Volver</Button>
        </Card>
      </View>
    );
  }

  const pending = reservations.filter((r) => r.status === 'pending');

  const onApprove = (id) => {
    Alert.alert('Aprobar reserva', 'Confirmar aprobación?', [
      { text: 'Cancelar' },
      { text: 'Aprobar', onPress: () => approveReservation(id) },
    ]);
  };

  const onReject = (id) => {
    Alert.alert('Rechazar reserva', 'Confirmar rechazo?', [
      { text: 'Cancelar' },
      { text: 'Rechazar', style: 'destructive', onPress: () => rejectReservation(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={pending}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={{ fontWeight: '700' }}>Reserva {item.id}</Text>
              <Text style={{ color: theme.colors.disabled }}>{item.date} · {item.time} · {item.duration}</Text>
              <Text style={{ marginTop: 6 }}>Departamento ID: {item.deptId}</Text>
              <Text>Solicitante: {item.user}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => onApprove(item.id)}>Aprobar</Button>
              <Button mode="outlined" onPress={() => onReject(item.id)}>Rechazar</Button>
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
