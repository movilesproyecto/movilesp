import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationsList({ navigation }) {
  const theme = useTheme();
  const { user, canCreateReservation, reservations, departments } = useAppContext();

  const renderItem = ({ item }) => {
    const dept = (departments || []).find((d) => d.id === item.deptId);
    const deptName = dept ? dept.name : item.deptId;
    return (
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => { /* could navigate to details */ }}>
        <Text style={[styles.dept, { color: theme.colors.text }]}>{deptName}</Text>
        <Text style={[styles.meta, { color: theme.colors.disabled }]}>{item.date} · {item.time} · {item.duration}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Reservas</Text>
        {canCreateReservation(user) && <Button title="Nueva" onPress={() => navigation.navigate('ReservationForm')} />}
      </View>
      <FlatList
        data={reservations}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  header: { fontSize: 20, fontWeight: '700' },
  card: { padding: 14, borderRadius: 10, marginBottom: 10, elevation: 1 },
  dept: { fontSize: 16, fontWeight: '600' },
  meta: { marginTop: 4 },
});
