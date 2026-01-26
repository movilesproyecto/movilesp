import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationDetail({ route, navigation }) {
  const theme = useTheme();
  const { reservation = {}, department = {} } = route.params || {};
  const { deleteReservation, user } = useAppContext();

  const handleCancel = () => {
    Alert.alert('Cancelar reserva', '¿Estás seguro que deseas cancelar esta reserva?', [
      { text: 'No', style: 'cancel' },
      { text: 'Sí, cancelar', onPress: () => {
        deleteReservation(reservation.id);
        navigation.goBack();
      } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <Card style={[styles.card, { backgroundColor: '#fff' }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: '700', marginBottom: 6, color: '#000' }}>{department?.name || 'Reserva'}</Text>
          <Text style={{ color: '#666', marginBottom: 4 }}>Fecha: <Text style={{ color: '#000' }}>{reservation.date}</Text></Text>
          <Text style={{ color: '#666', marginBottom: 4 }}>Hora: <Text style={{ color: '#000' }}>{reservation.time}</Text></Text>
          <Text style={{ color: '#666', marginBottom: 8 }}>Duración: <Text style={{ color: '#000' }}>{reservation.duration}</Text></Text>
          <Text style={{ color: '#666', marginBottom: 4 }}>Usuario: <Text style={{ color: '#000' }}>{reservation.user}</Text></Text>
          <Text style={{ color: '#666', marginBottom: 12 }}>Estado: <Text style={{ color: '#000' }}>{reservation.status || 'pendiente'}</Text></Text>

          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => navigation.goBack()} style={{ flex: 1, marginRight: 8 }}>Volver</Button>
            <Button mode="contained" onPress={handleCancel} style={{ flex: 1 }}>
              Cancelar
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 12 },
  actions: { flexDirection: 'row', marginTop: 12 },
});
