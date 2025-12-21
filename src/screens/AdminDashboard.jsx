import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Button,
  Chip,
  Avatar,
  Modal,
  Portal,
  Dialog,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const AdminDashboard = ({ navigation }) => {
  const theme = useTheme();
  const { departments, user } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState('departamentos');
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // Simulación de datos
  const [reservations] = useState([
    { id: 1, user: 'Johan Gamer', dept: departments[0]?.name, dates: '15-20 Feb', status: 'pendiente', total: 750 },
    { id: 2, user: 'María López', dept: departments[1]?.name, dates: '10-15 Feb', status: 'aprobada', total: 600 },
    { id: 3, user: 'Carlos Pérez', dept: departments[2]?.name, dates: '5-10 Feb', status: 'completada', total: 1200 },
  ]);

  const [users] = useState([
    { id: 1, email: 'johan11gamerez@gmail.com', role: 'user', reservations: 12, status: 'activo' },
    { id: 2, email: 'admin@demo.com', role: 'admin', reservations: 0, status: 'activo' },
    { id: 3, email: 'user@example.com', role: 'user', reservations: 5, status: 'activo' },
  ]);

  // Estadísticas
  const stats = [
    { label: 'Departamentos', value: departments.length, icon: 'building', color: '#3B82F6' },
    { label: 'Reservas', value: reservations.length, icon: 'calendar', color: '#10B981' },
    { label: 'Usuarios', value: users.length, icon: 'users', color: '#F59E0B' },
    { label: 'Ingresos Totales', value: `$${reservations.reduce((sum, r) => sum + r.total, 0)}`, icon: 'dollar', color: '#8B5CF6' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente':
        return '#FFA500';
      case 'aprobada':
        return '#4CAF50';
      case 'completada':
        return '#2196F3';
      case 'cancelada':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panel de Administrador</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Estadísticas Rápidas */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Resumen</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <Card key={idx} style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content style={styles.statContent}>
                <View
                  style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}
                >
                  <FontAwesome name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['departamentos', 'reservas', 'usuarios'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && [styles.tabActive, { borderBottomColor: theme.colors.primary }],
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: activeTab === tab ? theme.colors.primary : theme.colors.disabled,
                    fontWeight: activeTab === tab ? '600' : '400',
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido por Tab */}
        {activeTab === 'departamentos' && (
          <View style={styles.tabContent}>
            <View style={styles.tabHeader}>
              <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
                Gestión de Departamentos
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('DepartmentForm')}
                compact
                contentStyle={{ height: 32 }}
              >
                <FontAwesome name="plus" size={14} /> Nuevo
              </Button>
            </View>

            {departments.map((dept) => (
              <Card
                key={dept.id}
                style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}
                onPress={() => {
                  setSelectedDept(dept);
                  setShowModal(true);
                }}
              >
                <View style={styles.itemContent}>
                  <Avatar.Image
                    size={60}
                    source={{ uri: dept.images?.[0] || 'https://via.placeholder.com/60' }}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, { color: theme.colors.text }]}>
                      {dept.name}
                    </Text>
                    <Text style={[styles.itemMeta, { color: theme.colors.disabled }]}>
                      {dept.address}
                    </Text>
                    <View style={styles.itemBottom}>
                      <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
                        ${dept.pricePerNight}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <FontAwesome name="star" size={12} color="#FFB800" />
                        <Text style={styles.ratingText}>{dept.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="pencil" size={16} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="trash" size={16} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'reservas' && (
          <View style={styles.tabContent}>
            <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
              Gestión de Reservas
            </Text>

            {reservations.map((res) => (
              <Card key={res.id} style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.reservationContent}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.resName, { color: theme.colors.text }]}>
                      {res.user}
                    </Text>
                    <Text style={[styles.resDept, { color: theme.colors.disabled }]}>
                      📍 {res.dept}
                    </Text>
                    <Text style={[styles.resDates, { color: theme.colors.disabled }]}>
                      📅 {res.dates}
                    </Text>
                    <Text style={[styles.resTotal, { color: theme.colors.primary }]}>
                      Total: {res.total}
                    </Text>
                  </View>
                  <View style={styles.statusContainer}>
                    <Chip
                      label={res.status}
                      style={{
                        backgroundColor: getStatusColor(res.status) + '20',
                        marginBottom: 8,
                      }}
                      textStyle={{ color: getStatusColor(res.status), fontWeight: '600' }}
                    />
                    <Button mode="text" compact size="small">
                      Acción
                    </Button>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === 'usuarios' && (
          <View style={styles.tabContent}>
            <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
              Gestión de Usuarios
            </Text>

            {users.map((usr) => (
              <Card key={usr.id} style={[styles.itemCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.userContent}>
                  <Avatar.Text size={50} label={usr.email.charAt(0).toUpperCase()} />
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>
                      {usr.email}
                    </Text>
                    <View style={styles.userMeta}>
                      <Chip
                        label={usr.role}
                        compact
                        style={{
                          backgroundColor: usr.role === 'admin' ? '#FF6B6B20' : '#4CAF5020',
                        }}
                        textStyle={{
                          color: usr.role === 'admin' ? '#FF6B6B' : '#4CAF50',
                          fontSize: 12,
                        }}
                      />
                      <Text style={[styles.userStat, { color: theme.colors.disabled }]}>
                        {usr.reservations} reservas
                      </Text>
                      <Chip
                        label={usr.status}
                        size="small"
                        style={{ backgroundColor: '#4CAF5020' }}
                        textStyle={{ color: '#4CAF50', fontSize: 11 }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity>
                    <FontAwesome name="cog" size={18} color={theme.colors.disabled} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal de Detalles */}
      <Portal>
        <Dialog
          visible={showModal && selectedDept}
          onDismiss={() => setShowModal(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title>{selectedDept?.name}</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
              📍 {selectedDept?.address}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
              🛏️ {selectedDept?.bedrooms} habitaciones
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 8 }}>
              💰 ${selectedDept?.pricePerNight}/noche
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
              ⭐ Calificación: {selectedDept?.rating}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModal(false)}>Cerrar</Button>
            <Button
              mode="contained"
              onPress={() => {
                navigation.navigate('DepartmentForm', { departmentId: selectedDept?.id });
                setShowModal(false);
              }}
            >
              Editar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
      gap: 8,
      marginBottom: 16,
    },
    statCard: {
      width: '48%',
      borderRadius: 12,
    },
    statContent: {
      alignItems: 'center',
      paddingVertical: 12,
    },
    statIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      textAlign: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
      marginHorizontal: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomWidth: 3,
    },
    tabLabel: {
      fontSize: 14,
    },
    tabContent: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    tabHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    tabTitle: {
      fontSize: 16,
      fontWeight: '600',
    },
    itemCard: {
      marginBottom: 12,
      borderRadius: 12,
    },
    itemContent: {
      flexDirection: 'row',
      padding: 12,
      gap: 12,
      flex: 1,
    },
    itemInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    itemName: {
      fontSize: 14,
      fontWeight: '600',
    },
    itemMeta: {
      fontSize: 12,
    },
    itemBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    itemPrice: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FFF3E0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#E65100',
    },
    itemActions: {
      flexDirection: 'row',
      gap: 12,
      paddingRight: 12,
      justifyContent: 'center',
    },
    actionButton: {
      padding: 8,
    },
    reservationContent: {
      flexDirection: 'row',
      padding: 12,
      gap: 12,
      alignItems: 'flex-start',
    },
    resName: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    resDept: {
      fontSize: 12,
      marginBottom: 4,
    },
    resDates: {
      fontSize: 12,
      marginBottom: 8,
    },
    resTotal: {
      fontSize: 13,
      fontWeight: '600',
    },
    statusContainer: {
      alignItems: 'center',
    },
    userContent: {
      flexDirection: 'row',
      padding: 12,
      gap: 12,
      alignItems: 'center',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 6,
    },
    userMeta: {
      flexDirection: 'row',
      gap: 6,
      flexWrap: 'wrap',
    },
    userStat: {
      fontSize: 12,
      marginVertical: 4,
    },
  });

export default AdminDashboard;
