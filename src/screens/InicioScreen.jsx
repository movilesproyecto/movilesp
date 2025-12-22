import React from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, Dimensions, StatusBar } from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function InicioScreen() {
  const { user, departments, reservations, canCreateDepartment } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;

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
    <ScrollView style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header mejorado */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View>
          <Text style={[styles.greeting, { color: '#FFFFFF' }]}>¡Hola, {user?.nombre || 'Invitado'}! 👋</Text>
          <Text style={[styles.sub, { color: 'rgba(255,255,255,0.8)' }]}>Bienvenido a DeptBook</Text>
        </View>
      </View>

      {/* Stats Cards - Mejorado */}
      <View style={[styles.statsContainer, { paddingHorizontal: 16, marginVertical: 16 }]}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }]}>
          <Card.Content>
            <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{summary.departments}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>Departamentos</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.secondary, borderLeftWidth: 4 }]}>
          <Card.Content>
            <Text style={[styles.statNumber, { color: theme.colors.secondary }]}>{summary.activeReservations}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>Reservas activas</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.tertiary, borderLeftWidth: 4 }]}>
          <Card.Content>
            <Text style={[styles.statNumber, { color: theme.colors.tertiary }]}>{summary.availableRooms}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.placeholder }]}>Disponibles</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={[styles.actionsRow, { paddingHorizontal: 16, gap: 10 }]}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Departamentos')} 
          style={[styles.actionBtn, { flex: 1 }]}
          contentStyle={styles.actionBtnContent}
        >
          📍 Ver Departamentos
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('Departamentos', { screen: 'ReservationForm' })} 
          style={[styles.actionBtn, { flex: 1 }]}
          contentStyle={styles.actionBtnContent}
        >
          📅 Nueva Reserva
        </Button>
      </View>

      {/* Featured Section */}
      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>✨ Destacados</Text>
        <View style={styles.gridContainer}>
          {featured.map((item) => (
            <View key={item.id} style={[styles.gridItem, { width: screenWidth > 600 ? '48%' : '100%' }]}>
              <Card style={[styles.deptCard, { backgroundColor: theme.colors.surface }]}>
                {item.images && item.images[0] ? (
                  <Card.Cover source={{ uri: item.images[0] }} style={{ height: 150 }} />
                ) : (
                  <View style={[styles.placeholderImg, { backgroundColor: theme.colors.surfaceVariant }]} />
                )}
                <Card.Content style={{ paddingVertical: 12 }}>
                  <Text style={[styles.upTitle, { color: theme.colors.text }]} numberOfLines={2}>{item.name}</Text>
                  <Text style={[styles.upMeta, { color: theme.colors.placeholder, marginBottom: 6 }]} numberOfLines={1}>
                    🛏️ {item.bedrooms} hab · 💰 ${item.pricePerNight}
                  </Text>
                  {item.rating && (
                    <View style={styles.ratingContainer}>
                      <Text style={[styles.ratingText, { color: '#FBBF24', fontWeight: '700' }]}>
                        ⭐ {item.rating}
                      </Text>
                    </View>
                  )}
                </Card.Content>
                <Card.Actions>
                  <Button 
                    mode="text" 
                    compact 
                    onPress={() => navigation.navigate('Departamentos', { screen: 'DepartmentDetail', params: { department: item } })}
                    style={{ flex: 1 }}
                  >
                    Ver detalles
                  </Button>
                </Card.Actions>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* Próximas Reservas */}
      {canCreateDepartment(user) && (
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Departamentos', { screen: 'DepartmentForm' })} 
            style={{ borderRadius: 8 }}
          >
            ➕ Crear Departamento
          </Button>
        </View>
      )}

      <View style={{ paddingHorizontal: 16, marginTop: 20, marginBottom: 20 }}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📅 Próximas Reservas</Text>
        {upcoming.length > 0 ? (
          upcoming.map((item) => (
            <Card key={item.id} style={[styles.upCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <Text style={[styles.upTitle, { color: theme.colors.text }]}>{item.title}</Text>
                <Text style={[styles.upMeta, { color: theme.colors.placeholder }]}>🏢 {item.dept}</Text>
                <Text style={[styles.upMeta, { color: theme.colors.primary, fontWeight: '600' }]}>📅 {item.date} · ⏰ {item.time}</Text>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Card style={[styles.upCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[{ color: theme.colors.placeholder, fontStyle: 'italic' }]}>No hay reservas próximas</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { 
    flex: 1,
  },
  header: { 
    backgroundColor: 'inherit',
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  greeting: { 
    fontWeight: '700',
    fontSize: 24,
  },
  sub: { 
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },
  statsContainer: {
    gap: 10,
  },
  statCard: { 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  statNumber: { 
    fontSize: 22, 
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: { 
    gap: 10,
  },
  actionBtn: { 
    borderRadius: 8,
  },
  actionBtnContent: {
    paddingVertical: 8,
  },
  section: { 
    marginTop: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    marginBottom: 12,
  },
  gridContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  gridItem: { 
    marginBottom: 8,
  },
  placeholderImg: {
    height: 150,
  },
  ratingContainer: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
  },
  upCard: { 
    marginBottom: 10, 
    borderRadius: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  upTitle: { 
    fontWeight: '700', 
    fontSize: 14,
  },
  upMeta: { 
    marginTop: 4, 
    fontSize: 12,
    fontWeight: '500',
  },
  deptCard: { 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
});
