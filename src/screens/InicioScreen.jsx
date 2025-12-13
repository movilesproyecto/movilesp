import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function InicioScreen() {
  const { user, departments, reservations, canCreateDepartment } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();

  const summary = {
    departments: departments.length,
    activeReservations: reservations.filter(r => r.status === 'pending' || r.status === 'confirmed' || r.status === 'approved').length,
    availableRooms: Math.max(0, departments.length - reservations.length),
  };

  const upcoming = reservations.slice(0, 3).map((r, idx) => ({ id: r.id || `u${idx}`, title: `Reserva ${r.id}`, dept: departments.find(d => d.id === r.deptId)?.name || r.deptId, date: r.date, time: r.time }));
  const featured = [...(departments || [])].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  const renderUpcoming = ({ item }) => (
    <Card style={styles.upCard} key={item.id}>
      <Card.Content>
        <Text style={styles.upTitle}>{item.title}</Text>
        <Text style={[styles.upMeta, { color: theme.colors.disabled }]}>{item.dept} · {item.date} · {item.time}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }] }>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.greeting}>¡Hola, {user?.nombre || 'Invitado'}!</Text>
        <Text style={[styles.sub, { color: theme.colors.disabled }]}>Panel de administración de departamentos</Text>
      </View>

      <View style={styles.statsRow}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }] }>
          <Card.Content>
            <Text style={styles.statNumber}>{summary.departments}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>Departamentos</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }] }>
          <Card.Content>
            <Text style={styles.statNumber}>{summary.activeReservations}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>Reservas activas</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }] }>
          <Card.Content>
            <Text style={styles.statNumber}>{summary.availableRooms}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>Recursos disponibles</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.actionsRow}>
        <Button mode="contained" onPress={() => navigation.navigate('Departamentos')} style={styles.actionBtn}>Ver Departamentos</Button>
        <Button mode="outlined" onPress={() => navigation.navigate('Departamentos', { screen: 'ReservationForm' })} style={styles.actionBtn}>Nueva Reserva</Button>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Departamentos destacados</Text>
        <FlatList
          data={featured}
          keyExtractor={(i) => i.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card style={[styles.deptCard, { backgroundColor: theme.colors.surface }]}>
              {item.images && item.images[0] ? <Card.Cover source={{ uri: item.images[0] }} style={{ height: 120 }} /> : null}
              <Card.Content>
                <Text style={styles.upTitle}>{item.name}</Text>
                <Text style={[styles.upMeta, { color: theme.colors.disabled }]}>{item.bedrooms} hab · ${item.pricePerNight}/noche · ⭐ {item.rating || '—'}</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => navigation.navigate('Departamentos', { screen: 'DepartmentDetail', params: { id: item.id } })}>Ver detalles</Button>
              </Card.Actions>
            </Card>
          )}
        />

        {canCreateDepartment(user) && (
          <Button mode="contained" onPress={() => navigation.navigate('Departamentos', { screen: 'DepartmentForm' })} style={{ marginTop: 12 }}>
            Crear departamento
          </Button>
        )}

        <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 12 }]}>Próximas reservas</Text>
        <FlatList data={upcoming} renderItem={renderUpcoming} keyExtractor={(i) => i.id} horizontal={false} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  header: { marginBottom: 12 },
  greeting: { fontWeight: '700' },
  sub: { marginTop: 4 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  statCard: { flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 10 },
  statNumber: { fontSize: 22, fontWeight: '700' },
  statLabel: { marginTop: 4 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 },
  actionBtn: { flex: 1, marginHorizontal: 6 },
  section: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  upCard: { marginBottom: 8, borderRadius: 8 },
  upTitle: { fontWeight: '600' },
  upMeta: { marginTop: 4 },
  deptCard: { width: 260, marginRight: 12, borderRadius: 8 },
});
