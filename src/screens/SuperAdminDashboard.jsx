import React, { useMemo } from 'react';
import { ScrollView, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Card, Text, useTheme, Button } from 'react-native-paper';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const SuperAdminDashboard = ({ navigation }) => {
  const theme = useTheme();
  const { user, canViewSuperAdminStats, monthlyEarnings, registeredUsers, departments, reservations, isSuperAdmin } = useAppContext();
  
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  // Debug: Log para verificar datos
  console.log('SuperAdmin - User:', user?.role, 'isSuperAdmin:', isSuperAdmin(user), 'monthlyEarnings:', monthlyEarnings?.length);

  // Verificar que el usuario sea super admin
  if (!isSuperAdmin(user)) {
    return (
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Panel Super Admin</Text>
        </View>
        <Card style={[styles.card, { marginTop: 20 }]}>
          <Card.Content>
            <Text style={{ fontSize: 16, textAlign: 'center', color: theme.colors.error }}>
              No tienes permisos para acceder a este apartado.
            </Text>
            <Text style={{ fontSize: 12, textAlign: 'center', color: theme.colors.disabled, marginTop: 8 }}>
              Tu rol actual: {user?.role}
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalUsers = registeredUsers.length;
    const totalDepartments = departments.length;
    const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
    const totalEarnings = monthlyEarnings.reduce((sum, month) => sum + month.earnings, 0);
    const averageRating = departments.length > 0 
      ? (departments.reduce((sum, dept) => sum + (dept.rating || 0), 0) / departments.length).toFixed(1)
      : 0;

    return {
      totalUsers,
      totalDepartments,
      activeReservations,
      totalEarnings,
      averageRating,
    };
  }, [registeredUsers, departments, reservations, monthlyEarnings]);

  // Datos para el gráfico de líneas (últimos 6 meses)
  const last6Months = monthlyEarnings.slice(-6);
  const lineChartData = {
    labels: last6Months.map(m => m.month.slice(0, 3)),
    datasets: [
      {
        data: last6Months.map(m => m.earnings),
        color: (opacity = 1) => `rgba(134, 65, 250, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Datos para el gráfico de barras (ocupación)
  const occupancyData = {
    labels: last6Months.map(m => m.month.slice(0, 3)),
    datasets: [
      {
        data: last6Months.map(m => m.occupancy),
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      },
    ],
  };

  // Datos para el gráfico de pastel (distribución de reservas)
  const reservationStats = [
    {
      name: 'Confirmadas',
      count: reservations.filter(r => r.status === 'confirmed').length,
      color: theme.colors.primary,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Aprobadas',
      count: reservations.filter(r => r.status === 'approved').length,
      color: theme.colors.success,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Pendientes',
      count: reservations.filter(r => r.status === 'pending').length,
      color: theme.colors.warning,
      legendFontColor: theme.colors.text,
    },
    {
      name: 'Rechazadas',
      count: reservations.filter(r => r.status === 'rejected').length,
      color: theme.colors.error,
      legendFontColor: theme.colors.text,
    },
  ];

  const pieChartData = reservationStats.filter(rs => rs.count > 0).map(rs => ({
    ...rs,
    percentage: (rs.count / reservations.length * 100).toFixed(0),
  }));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <FontAwesome name="bar-chart" size={32} color="white" />
        <Text style={styles.headerTitle}>Panel Super Administrador</Text>
      </View>

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
          value={stats.totalDepartments}
          icon="building"
          color="#1abc9c"
          theme={theme}
        />
        <StatCard 
          title="Reservas Activas"
          value={stats.activeReservations}
          icon="calendar"
          color="#e74c3c"
          theme={theme}
        />
        <StatCard 
          title="Calificación Promedio"
          value={stats.averageRating}
          icon="star"
          color="#f39c12"
          theme={theme}
          suffix="/5"
        />
      </View>

      {/* Ganancias Totales */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Ganancias Totales (Año)</Text>
          <Text style={[styles.bigNumber, { color: theme.colors.primary }]}>
            ${stats.totalEarnings.toLocaleString('es-CO')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.disabled }]}>
            Basado en {monthlyEarnings.length} meses de historial
          </Text>
        </Card.Content>
      </Card>

      {/* Gráfico de Ganancias Mensuales */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Ganancias Mensuales (Últimos 6 meses)</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineChartData}
              width={chartWidth}
              height={250}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '6',
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

      {/* Gráfico de Ocupación */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Tasa de Ocupación (%)</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={occupancyData}
              width={chartWidth}
              height={250}
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

      {/* Tabla de Ganancias Mensuales Detallada */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Registro Detallado de Ganancias</Text>
          <View style={styles.tableContainer}>
            <View style={[styles.tableHeader, { borderBottomColor: theme.colors.disabled }]}>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Mes</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Ganancias</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Reservas</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Ocupación</Text>
            </View>
            {monthlyEarnings.map((month, index) => (
              <View key={index} style={[styles.tableRow, { backgroundColor: index % 2 === 0 ? theme.colors.surface : theme.colors.background }]}>
                <Text style={[styles.tableCell, { flex: 1 }]}>{month.month}</Text>
                <Text style={[styles.tableCell, { flex: 1, color: theme.colors.primary }]}>
                  ${month.earnings.toLocaleString('es-CO')}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{month.reservations}</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>{month.occupancy}%</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Gráfico de Distribución de Reservas */}
      {pieChartData.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={styles.cardTitle}>Distribución de Reservas</Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={250}
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

      {/* Resumen de Estadísticas */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Resumen General</Text>
          <EarningsSummary stats={stats} theme={theme} />
        </Card.Content>
      </Card>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

// Componente StatCard reutilizable
const StatCard = ({ title, value, icon, color, theme, suffix = '' }) => (
  <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
    <Card.Content style={styles.statCardContent}>
      <FontAwesome name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color }]}>
        {value}{suffix}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
        {title}
      </Text>
    </Card.Content>
  </Card>
);

// Componente ResumenEarnings
const EarningsSummary = ({ stats, theme }) => {
  const items = [
    { label: 'Total de Usuarios', value: stats.totalUsers },
    { label: 'Total de Departamentos', value: stats.totalDepartments },
    { label: 'Reservas Activas', value: stats.activeReservations },
    { label: 'Calificación Promedio', value: `${stats.averageRating}/5` },
    { label: 'Ingreso Total', value: `$${stats.totalEarnings.toLocaleString('es-CO')}` },
  ];

  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={[styles.summaryItem, { borderBottomColor: theme.colors.disabled }]}>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            {item.label}
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 8,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 12,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  tableContainer: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    fontWeight: 'bold',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tableCell: {
    fontSize: 11,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SuperAdminDashboard;
