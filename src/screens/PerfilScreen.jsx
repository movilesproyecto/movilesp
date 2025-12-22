import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import { Avatar, Card, Text, Divider, Button, IconButton, useTheme, Chip, ProgressBar } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function PerfilScreen() {
  const { user, logout, roleLabel, reservations, departments, registeredUsers } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  const nombre = user?.nombre || 'Usuario';
  const inicial = nombre?.[0] ? nombre[0].toUpperCase() : 'U';

  // Calcular estadísticas del usuario
  const userStats = useMemo(() => {
    const userReservations = reservations.filter(r => r.user === user?.correo);
    const confirmedReservations = userReservations.filter(r => r.status === 'confirmed' || r.status === 'approved').length;
    const totalSpent = userReservations.reduce((sum, r) => sum + (r.amount || 0), 0);
    const memberSince = user?.ingreso || 'No registrado';
    
    return {
      totalReservations: userReservations.length,
      confirmedReservations,
      totalSpent,
      memberSince,
      accountStatus: 'Activo',
    };
  }, [user, reservations]);

  // Datos para gráfico de actividad (simulado)
  const activityData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        data: [2, 3, 2, 4, 3, 5],
        color: (opacity = 1) => `rgba(134, 65, 250, ${opacity})`,
      },
    ],
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header Card Mejorado */}
      <View style={[styles.headerGradient, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.avatarWrap}>
            <Avatar.Text 
              size={96} 
              label={inicial} 
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
              <FontAwesome name="check-circle" size={16} color="white" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: '#FFFFFF' }]}>{nombre}</Text>
            <View style={styles.roleContainer}>
              <Chip 
                icon="badge" 
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                textStyle={{ color: '#FFFFFF', fontWeight: '600', fontSize: 12 }}
              >
                {roleLabel(user)}
              </Chip>
            </View>
            <Text style={[styles.email, { color: 'rgba(255,255,255,0.8)' }]}>
              📧 {user?.correo}
            </Text>
          </View>
        </View>
        
        <View style={styles.actionsRow}>
          <Button 
            mode="contained-tonal" 
            size="small" 
            onPress={() => navigation.navigate('ConfiguracionMain', { screen: 'EditProfile' })}
            style={{ flex: 1, borderRadius: 8 }}
            buttonColor='rgba(255,255,255,0.3)'
            labelStyle={{ color: '#FFFFFF' }}
          >
            ✏️ Editar
          </Button>
          <TouchableOpacity 
            style={[styles.logoutBtn, { backgroundColor: 'rgba(220, 38, 38, 0.9)' }]}
            onPress={() => { 
              logout(); 
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); 
            }}
          >
            <FontAwesome name="sign-out" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Estadísticas principales - Mejorado */}
      <View style={[styles.statsSection, { paddingHorizontal: 16, marginVertical: 16 }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Mi Actividad</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Reservas"
            value={userStats.totalReservations}
            icon="calendar"
            color={theme.colors.primary}
            theme={theme}
          />
          <StatCard
            title="Confirmadas"
            value={userStats.confirmedReservations}
            icon="check-circle"
            color='#10B981'
            theme={theme}
          />
          <StatCard
            title="Gastado"
            value={`$${userStats.totalSpent}`}
            icon="dollar"
            color={theme.colors.warning}
            theme={theme}
          />
          <StatCard
            title="Miembro"
            value={userStats.memberSince}
            icon="calendar-check"
            color={theme.colors.secondary}
            theme={theme}
          />
        </View>
      </View>

      {/* Estado de cuenta - Mejorado */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface, marginHorizontal: 16, marginBottom: 16 }]}>
        <Card.Content>
          <View style={styles.accountStatusRow}>
            <View>
              <Text style={{ fontSize: 12, color: theme.colors.placeholder, fontWeight: '500' }}>Estado de Cuenta</Text>
              <Text style={[{ fontSize: 18, fontWeight: '700', marginTop: 4, color: theme.colors.text }]}>
                ✅ {userStats.accountStatus}
              </Text>
            </View>
            <Chip 
              icon="check-circle" 
              style={{ backgroundColor: '#10B98120' }}
              textStyle={{ color: '#10B981', fontWeight: '700' }}
            >
              Verificado
            </Chip>
          </View>
          <ProgressBar 
            progress={0.8} 
            style={{ marginTop: 14, height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceVariant }} 
            color={theme.colors.primary}
          />
          <Text style={{ fontSize: 11, color: theme.colors.placeholder, marginTop: 8, fontWeight: '500' }}>
            80% perfil completado
          </Text>
        </Card.Content>
      </Card>

      {/* Información Personal Detallada */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Información Personal" />
        <Divider />
        <Card.Content>
          <InfoDetailRow label="Correo" value={user?.correo || '-'} icon="envelope" theme={theme} />
          <InfoDetailRow label="Teléfono" value={user?.telefono || 'No especificado'} icon="phone" theme={theme} />
          <InfoDetailRow label="Género" value={user?.genero || 'No especificado'} icon="user" theme={theme} />
          <InfoDetailRow label="Departamento" value={user?.departamento || 'No especificado'} icon="building" theme={theme} />
          <InfoDetailRow label="Fecha de ingreso" value={user?.ingreso || '-'} icon="calendar" theme={theme} />
          <InfoDetailRow label="Biografía" value={user?.bio || 'Sin biografía'} icon="file-text" theme={theme} />
        </Card.Content>
      </Card>

      {/* Gráfico de actividad */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Actividad (últimos 6 meses)</Text>
          <View style={styles.chartContainer}>
            <BarChart
              data={activityData}
              width={chartWidth}
              height={200}
              chartConfig={{
                backgroundGradientFrom: theme.colors.surface,
                backgroundGradientTo: theme.colors.surface,
                color: (opacity = 1) => `${theme.colors.text}${Math.round(opacity * 255).toString(16)}`,
                labelColor: (opacity = 1) => `${theme.colors.text}${Math.round(opacity * 255).toString(16)}`,
                style: { borderRadius: 16 },
                barPercentage: 0.6,
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Preferencias y Configuración rápida */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Acceso Rápido" />
        <Divider />
        <Card.Content>
          <View style={styles.quickAccessGrid}>
            <QuickAccessButton
              label="Mis Reservas"
              icon="calendar"
              onPress={() => navigation.navigate('Departamentos', { screen: 'Reservations' })}
              theme={theme}
            />
            <QuickAccessButton
              label="Editar Perfil"
              icon="edit"
              onPress={() => navigation.navigate('ConfiguracionMain', { screen: 'EditProfile' })}
              theme={theme}
            />
            <QuickAccessButton
              label="Seguridad"
              icon="lock"
              onPress={() => navigation.navigate('Configuracion')}
              theme={theme}
            />
            <QuickAccessButton
              label="Ayuda"
              icon="question-circle"
              onPress={() => { /* help */ }}
              theme={theme}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Logros/Insignias */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Logros" />
        <Divider />
        <Card.Content>
          <View style={styles.badgesRow}>
            <BadgeItem label="Primera reserva" icon="star" unlocked={userStats.totalReservations > 0} theme={theme} />
            <BadgeItem label="5 reservas" icon="heart" unlocked={userStats.totalReservations >= 5} theme={theme} />
            <BadgeItem label="Cliente Platinum" icon="crown" unlocked={userStats.totalSpent >= 500} theme={theme} />
            <BadgeItem label="Explorador" icon="map" unlocked={departments.length > 0} theme={theme} />
          </View>
        </Card.Content>
      </Card>

      {/* Más opciones */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Más" />
        <Divider />
        <Card.Content>
          <Button mode="text" onPress={() => navigation.navigate('Configuracion')} style={{ marginVertical: 4 }}>
            Configuración avanzada
          </Button>
          <Button mode="text" onPress={() => { logout(); navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); }} labelStyle={{ color: 'red' }} style={{ marginVertical: 4 }}>
            Cerrar sesión
          </Button>
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
      <FontAwesome name={icon} size={20} color={color} />
      <Text style={[styles.statValue, { color, marginTop: 8 }]}>
        {value}
      </Text>
      <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
        {title}
      </Text>
    </Card.Content>
  </Card>
);

// Componente InfoDetailRow
const InfoDetailRow = ({ label, value, icon, theme }) => (
  <View style={[styles.infoDetailRow, { borderBottomColor: theme.colors.outline }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <FontAwesome name={icon} size={16} color={theme.colors.primary} style={{ marginRight: 12, width: 20 }} />
      <Text style={{ fontSize: 12, color: theme.colors.placeholder, width: 80 }}>{label}</Text>
    </View>
    <Text style={{ fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right', color: theme.colors.text }}>{value}</Text>
  </View>
);

// Componente QuickAccessButton
const QuickAccessButton = ({ label, icon, onPress, theme }) => (
  <Button
    mode="outlined"
    icon={icon}
    onPress={onPress}
    style={[styles.quickAccessBtn, { borderColor: theme.colors.primary }]}
    labelStyle={{ fontSize: 11 }}
  >
    {label}
  </Button>
);

// Componente BadgeItem
const BadgeItem = ({ label, icon, unlocked, theme }) => (
  <View style={styles.badgeItem}>
    <View style={[styles.badgeIcon, { backgroundColor: unlocked ? theme.colors.primary : theme.colors.disabled }]}>
      <FontAwesome name={icon} size={18} color="white" />
    </View>
    <Text style={{ fontSize: 10, marginTop: 4, textAlign: 'center', color: theme.colors.text }}>
      {label}
    </Text>
    {!unlocked && <Text style={{ fontSize: 8, color: theme.colors.disabled }}>Bloqueado</Text>}
  </View>
);

const styles = StyleSheet.create({
  screen: { 
    flex: 1, 
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerContent: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarWrap: { 
    marginRight: 16, 
    position: 'relative' 
  },
  statusBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 3, 
    borderColor: 'white' 
  },
  userInfo: { 
    flex: 1 
  },
  roleContainer: {
    marginVertical: 8,
  },
  name: { 
    fontWeight: '700',
    fontSize: 22,
  },
  email: { 
    marginTop: 4, 
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8,
  },
  logoutBtn: {
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsSection: {
    
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 10,
  },
  statCard: { 
    width: '48%', 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  statCardContent: { 
    alignItems: 'center', 
    paddingVertical: 16 
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 8 
  },
  statLabel: { 
    fontSize: 11, 
    marginTop: 6, 
    textAlign: 'center',
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: { 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  accountStatusRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  infoDetailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1 
  },
  chartContainer: { 
    alignItems: 'center', 
    marginVertical: 12 
  },
  quickAccessGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  quickAccessBtn: { 
    width: '48%', 
    marginBottom: 8,
    borderRadius: 8,
  },
  badgesRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12, 
    justifyContent: 'space-around' 
  },
  badgeItem: { 
    alignItems: 'center', 
    width: '22%' 
  },
  badgeIcon: { 
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});
