import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Card, Text, useTheme, Button, Chip, Divider } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

export default function Reports({ navigation }) {
  const theme = useTheme();
  const { user, canViewReports, departments, reservations, registeredUsers, monthlyEarnings } = useAppContext();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  if (!canViewReports(user)) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Button onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>← Volver</Button>
        <Card style={[styles.centerCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={{ color: theme.colors.error }}>No tienes permiso para ver reportes.</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalUsers = registeredUsers.length;
    const totalDepts = departments.length;
    const totalReservations = reservations.length;
    const confirmedReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
    const pendingReservations = reservations.filter(r => r.status === 'pending').length;
    const rejectedReservations = reservations.filter(r => r.status === 'rejected').length;
    
    const totalEarnings = reservations.reduce((sum, res) => sum + (res.amount || 0), 0);
    const averageRating = totalDepts > 0 
      ? (departments.reduce((sum, dept) => sum + (dept.rating || 0), 0) / totalDepts).toFixed(1)
      : 0;

    return {
      totalUsers,
      totalDepts,
      totalReservations,
      confirmedReservations,
      pendingReservations,
      rejectedReservations,
      totalEarnings,
      averageRating,
    };
  }, [registeredUsers, departments, reservations]);

  // Datos para gráfico de reservas por estado
  const reservationsByStatus = [
    {
      name: 'Confirmadas',
      count: stats.confirmedReservations,
      color: theme.colors.primary,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Pendientes',
      count: stats.pendingReservations,
      color: theme.colors.warning,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Rechazadas',
      count: stats.rejectedReservations,
      color: theme.colors.error,
      legendFontColor: theme.colors.text,
    },
  ].filter(item => item.count > 0);

  // Datos para gráfico de ganancias mensuales (últimos 6 meses)
  const last6Months = monthlyEarnings.slice(-6);
  const earningsChartData = {
    labels: last6Months.map(m => m.month.slice(0, 3)),
    datasets: [
      {
        data: last6Months.map(m => m.earnings),
        color: (opacity = 1) => `rgba(134, 65, 250, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Datos para gráfico de departamentos por puntuación
  const deptsByRating = {
    labels: ['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐'],
    datasets: [
      {
        data: [
          departments.filter(d => d.rating === 5).length,
          departments.filter(d => d.rating === 4 || d.rating === 4.5).length,
          departments.filter(d => d.rating < 4).length,
        ],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
      },
    ],
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Botón volver */}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        ← Volver
      </Button>

      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.headerContent}>
            <FontAwesome name="bar-chart" size={28} color={theme.colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>Reportes</Text>
              <Text style={{ color: theme.colors.disabled, fontSize: 12 }}>Análisis completo del sistema</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Tarjetas de estadísticas principales */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          icon="users"
          color={theme.colors.primary}
          theme={theme}
        />
        <StatCard
          title="Departamentos"
          value={stats.totalDepts}
          icon="building"
          color="#1abc9c"
          theme={theme}
        />
        <StatCard
          title="Reservas"
          value={stats.totalReservations}
          icon="calendar"
          color="#e74c3c"
          theme={theme}
        />
        <StatCard
          title="Ganancias"
          value={`$${stats.totalEarnings}`}
          icon="money"
          color="#f39c12"
          theme={theme}
        />
      </View>

      {/* Resumen de reservas */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Estado de Reservas</Text>
          <View style={styles.reservationSummary}>
            <View style={styles.reservationItem}>
              <Chip icon="check-circle" mode="flat" style={{ backgroundColor: theme.colors.primary }}>
                {stats.confirmedReservations} Confirmadas
              </Chip>
            </View>
            <View style={styles.reservationItem}>
              <Chip icon="clock" mode="flat" style={{ backgroundColor: theme.colors.warning }}>
                {stats.pendingReservations} Pendientes
              </Chip>
            </View>
            <View style={styles.reservationItem}>
              <Chip icon="close-circle" mode="flat" style={{ backgroundColor: theme.colors.error }}>
                {stats.rejectedReservations} Rechazadas
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de ganancias */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Ganancias Mensuales (Últimos 6 meses)</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={earningsChartData}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: theme.colors.primary,
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de reservas por estado */}
      {reservationsByStatus.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Distribución de Reservas</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={reservationsByStatus}
                width={chartWidth}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                }}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="15"
                style={{ marginVertical: 8, borderRadius: 16 }}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Gráfico de departamentos por calificación */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Departamentos por Calificación</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={deptsByRating}
              width={chartWidth}
              height={220}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                barPercentage: 0.7,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Tabla de departamentos */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Listado de Departamentos</Text>
          {departments.length > 0 ? (
            <View>
              {departments.map((dept, index) => (
                <View key={dept.id}>
                  <View style={styles.deptRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', fontSize: 13 }}>{dept.name}</Text>
                      <Text style={{ fontSize: 11, color: theme.colors.disabled, marginTop: 2 }}>
                        {dept.bedrooms} hab · ${dept.pricePerNight}/noche
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontWeight: '600', color: theme.colors.primary }}>
                        ⭐ {dept.rating || '—'}
                      </Text>
                    </View>
                  </View>
                  {index < departments.length - 1 && <Divider style={{ marginVertical: 8 }} />}
                </View>
              ))}
            </View>
          ) : (
            <Text style={{ color: theme.colors.disabled }}>No hay departamentos</Text>
          )}
        </Card.Content>
      </Card>

      {/* Resumen de usuarios */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleLarge" style={{ fontWeight: 'bold', marginBottom: 12 }}>Resumen de Usuarios</Text>
          <View>
            <SummaryRow label="Total de usuarios" value={stats.totalUsers} theme={theme} />
            <SummaryRow label="Calificación promedio" value={`${stats.averageRating}/5`} theme={theme} />
            <SummaryRow label="Ingresos totales" value={`$${stats.totalEarnings.toLocaleString('es-CO')}`} theme={theme} />
          </View>
        </Card.Content>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// Componente StatCard
const StatCard = ({ title, value, icon, color, theme }) => (
  <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
    <Card.Content style={styles.statCardContent}>
      <FontAwesome name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color, marginTop: 8 }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
        {title}
      </Text>
    </Card.Content>
  </Card>
);

// Componente SummaryRow
const SummaryRow = ({ label, value, theme }) => (
  <View style={[styles.summaryRow, { borderBottomColor: theme.colors.disabled }]}>
    <Text style={{ color: theme.colors.text, fontSize: 13 }}>{label}</Text>
    <Text style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 13 }}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: { marginBottom: 12, alignSelf: 'flex-start' },
  headerCard: { marginBottom: 16, borderRadius: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: { width: '48%', borderRadius: 12 },
  statCardContent: { alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: 20, fontWeight: 'bold' },
  statLabel: { fontSize: 11, marginTop: 4, textAlign: 'center' },
  card: { marginBottom: 16, borderRadius: 12 },
  chartContainer: { alignItems: 'center', marginVertical: 8 },
  reservationSummary: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  reservationItem: { marginBottom: 8 },
  deptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  centerCard: { borderRadius: 12, marginTop: 20 },
});
