import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function ReservationsList({ navigation }) {
  const theme = useTheme();
  const { user, canCreateReservation, reservations, departments, fetchReservations, authToken } = useAppContext();
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar reservaciones cuando el componente monta o el usuario se autentica
  useEffect(() => {
    if (authToken) {
      loadReservations();
    }
  }, [authToken]);

  const loadReservations = async () => {
    setLoading(true);
    await fetchReservations();
    setLoading(false);
  };

  const filtered = useMemo(() => {
    return (reservations || []).filter(r => {
      if (filterDate && r.date !== filterDate) return false;
      if (filterDept && String(r.deptId) !== String(filterDept)) return false;
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const deptMatch = r.departmentName?.toLowerCase().includes(searchLower);
        if (!deptMatch) return false;
      }
      return true;
    });
  }, [reservations, filterDate, filterDept, searchText]);

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline }]}
        onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
      >
        <Text style={[styles.dept, { color: theme.colors.primary }]}>{item.departmentName}</Text>
        <Text style={[styles.meta, { color: theme.colors.placeholder }]}>{item.date} · {item.time} · {item.duration}</Text>
        <Text style={[styles.status, { color: item.status === 'confirmed' ? '#4CAF50' : '#FF9800' }]}>
          {item.status === 'confirmed' ? '✓ Confirmada' : '○ Pendiente'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }] }>
      <View style={styles.headerRow}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Reservas</Text>
        {canCreateReservation(user) && <Button title="Nueva" onPress={() => navigation.navigate('ReservationForm')} />}
      </View>
      <View style={styles.filtersRow}>
        <TextInput placeholder="Fecha (YYYY-MM-DD)" value={filterDate} onChangeText={setFilterDate} style={styles.filterInput} />
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={filterDept} onValueChange={(v) => setFilterDept(v)}>
            <Picker.Item label="Todos" value="" />
            {(departments || []).map(d => <Picker.Item key={d.id} label={d.name} value={d.id} />)}
          </Picker>
        </View>
        <TextInput placeholder="Buscar departamento" value={searchText} onChangeText={setSearchText} style={styles.filterInput} />
        <Button title="Limpiar" onPress={() => { setFilterDate(''); setFilterDept(''); setSearchText(''); }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        onRefresh={loadReservations}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.colors.disabled }]}>
            {loading ? 'Cargando...' : 'No hay reservaciones'}
          </Text>
        }
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
  status: { marginTop: 8, fontSize: 12, fontWeight: '500' },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  filtersRow: { marginBottom: 12 },
  filterInput: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, marginBottom: 8 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
});
