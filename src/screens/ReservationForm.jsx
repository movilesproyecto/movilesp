import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Picker, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationForm({ route, navigation }) {
  const preDept = route?.params?.department;
  const theme = useTheme();
  const { user, canCreateReservation, createReservation, departments } = useAppContext();
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
    if (!canCreateReservation(user)) { Alert.alert('Acceso denegado', 'No puedes crear reservas.'); navigation.goBack(); return; }
    createReservation({ deptId: dept, date, time, duration });
    Alert.alert('Reserva creada', `Dept: ${dept}\nFecha: ${date} ${time}`);
    navigation.navigate('Reservations');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.header}>Nueva Reserva</Text>
      <Text style={styles.label}>Departamento</Text>
      <Picker selectedValue={dept} onValueChange={(v) => setDept(v)} style={styles.picker}>
        {(departments || []).map((d) => (
          <Picker.Item key={d.id} label={`${d.name} — ${d.address}`} value={d.id} />
        ))}
      </Picker>

      <Text style={styles.label}>Fecha</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />

      <Text style={styles.label}>Hora</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} />

      <Text style={styles.label}>Duración</Text>
      <TextInput style={styles.input} value={duration} onChangeText={setDuration} />

      <Button title="Reservar" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  label: { marginTop: 8, marginBottom: 4, color: '#333' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 10, marginBottom: 8 },
  picker: { backgroundColor: '#fff', marginBottom: 8 },
});
