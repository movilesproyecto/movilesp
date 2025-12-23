import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme, Text, Button, Card } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationForm({ route, navigation }) {
  const preDept = route?.params?.department;
  const theme = useTheme();
  const { user, canCreateReservation, departments, reservation } = useAppContext();
  const [dept, setDept] = useState(preDept ? preDept.id : (departments && departments[0] ? departments[0].id : null));
  const [date, setDate] = useState('2025-12-20');
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('1h');

  useEffect(() => {
    if (preDept) setDept(preDept.id);
  }, [preDept]);

  useEffect(() => {
    if (!dept && departments && departments.length) setDept(departments[0].id);
  }, [departments]);

  const onSubmit = () => {
    if (!canCreateReservation(user)) {
      Alert.alert(
        'Acceso requerido',
        'Necesitas iniciar sesión para crear una reserva.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => navigation.navigate('Perfil') },
        ]
      );
      return;
    }

    const isAlreadyReserved = reservations?.some(res => 
      res.deptId === dept && res.date === date
    );

    if (isAlreadyReserved) {
      Alert.alert(
        'Departamento no disponible',
        'Este departamento ya tiene una reserva para la fecha seleccionada. Por favor, elige otro día.',
        [{ text: 'Entendido' }]
      );
      return; // Detenemos el proceso
    }

    // Obtener el departamento seleccionado para pasar a la pantalla de pago
    const selectedDept = departments.find(d => d.id === dept);

    // Navegar a la pantalla de pago con los datos de la reserva
    navigation.navigate('Payment', {
      reservation: {
        deptId: dept,
        date,
        time,
        duration,
      },
      department: selectedDept,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>Nueva Reserva</Text>
          <Text style={{ color: theme.colors.disabled }}>Completa los detalles de tu reserva</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.label, { color: theme.colors.text }]}>Departamento</Text>
          <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
            <Picker selectedValue={dept} onValueChange={(v) => setDept(v)}>
              {(departments || []).map((d) => (
                <Picker.Item key={d.id} label={`${d.name}`} value={d.id} />
              ))}
            </Picker>
          </View>

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Fecha (YYYY-MM-DD)</Text>
          <TextInput style={[styles.input, { borderColor: theme.colors.outline }]} value={date} onChangeText={setDate} placeholder="2025-12-20" />

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Hora (HH:MM)</Text>
          <TextInput style={[styles.input, { borderColor: theme.colors.outline }]} value={time} onChangeText={setTime} placeholder="09:00" />

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Duración</Text>
          <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
            <Picker selectedValue={duration} onValueChange={setDuration}>
              <Picker.Item label="1 hora" value="1h" />
              <Picker.Item label="2 horas" value="2h" />
              <Picker.Item label="3 horas" value="3h" />
              <Picker.Item label="4 horas" value="4h" />
              <Picker.Item label="1 día" value="1d" />
              <Picker.Item label="2 días" value="2d" />
              <Picker.Item label="1 semana" value="1w" />
            </Picker>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonGroup}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={{ flex: 1, marginRight: 8 }}>
          Volver
        </Button>
        <Button mode="contained" onPress={onSubmit} style={{ flex: 1 }}>
          Ir al pago
        </Button>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerCard: { marginBottom: 16, borderRadius: 12 },
  card: { marginBottom: 16, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  pickerWrapper: { borderWidth: 1, borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', gap: 12 },
});
