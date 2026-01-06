import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar, // Asegúrate de que esto esté importado
  Platform,
} from "react-native";
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
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppContext } from "../context/AppContext";

const AdminDashboard = ({ navigation }) => {
  const theme = useTheme();
  const { departments, user } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState("departamentos");
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  // Simulación de datos
  const [reservations] = useState([
    {
      id: 1,
      user: "Johan Gamer",
      dept: departments[0]?.name,
      dates: "15-20 Feb",
      status: "pendiente",
      total: 750,
    },
    {
      id: 2,
      user: "María López",
      dept: departments[1]?.name,
      dates: "10-15 Feb",
      status: "aprobada",
      total: 600,
    },
    {
      id: 3,
      user: "Carlos Pérez",
      dept: departments[2]?.name,
      dates: "5-10 Feb",
      status: "completada",
      total: 1200,
    },
  ]);

  const [users] = useState([
    {
      id: 1,
      email: "johan11gamerez@gmail.com",
      role: "user",
      reservations: 12,
      status: "activo",
    },
    {
      id: 2,
      email: "admin@demo.com",
      role: "admin",
      reservations: 0,
      status: "activo",
    },
    {
      id: 3,
      email: "user@example.com",
      role: "user",
      reservations: 5,
      status: "activo",
    },
  ]);

  // Estadísticas
  const stats = [
    {
      label: "Departamentos",
      value: departments.length,
      icon: "building",
      color: "#3B82F6",
    },
    {
      label: "Reservas",
      value: reservations.length,
      icon: "calendar",
      color: "#10B981",
    },
    { label: "Usuarios", value: users.length, icon: "users", color: "#F59E0B" },
    {
      label: "Ingresos Totales",
      value: `$${reservations.reduce((sum, r) => sum + r.total, 0)}`,
      icon: "dollar",
      color: "#8B5CF6",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente":
        return "#FFA500";
      case "aprobada":
        return "#4CAF50";
      case "completada":
        return "#2196F3";
      case "cancelada":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header mejorado */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Panel Administrativo</Text>
          <Text style={styles.headerSubtitle}>
            Gestión completa del sistema
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <FontAwesome name="bell" size={20} color="white" />
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationCount}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Estadísticas Rápidas - Mejorado */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📊 Resumen General
          </Text>
          <TouchableOpacity>
            <FontAwesome
              name="refresh"
              size={18}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <Card
              key={idx}
              style={[
                styles.statCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderLeftWidth: 4,
                  borderLeftColor: stat.color,
                },
              ]}
            >
              <Card.Content style={styles.statContent}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: stat.color + "15" },
                  ]}
                >
                  <FontAwesome name={stat.icon} size={22} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  {stat.label}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Tabs - Mejorado */}
        <View style={styles.tabsContainer}>
          {["departamentos", "reservas", "usuarios"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && [
                  styles.tabActive,
                  {
                    backgroundColor: theme.colors.primary + "10",
                    borderBottomColor: theme.colors.primary,
                  },
                ],
              ]}
            >
              <View style={styles.tabContent_}>
                <FontAwesome
                  name={
                    tab === "departamentos"
                      ? "home"
                      : tab === "reservas"
                      ? "calendar"
                      : "users"
                  }
                  size={16}
                  color={
                    activeTab === tab
                      ? theme.colors.primary
                      : theme.colors.placeholder
                  }
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color:
                        activeTab === tab
                          ? theme.colors.primary
                          : theme.colors.placeholder,
                      fontWeight: activeTab === tab ? "600" : "500",
                    },
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenido por Tab */}
        {activeTab === "departamentos" && (
          <View style={styles.tabContentSection}>
            <View style={styles.tabHeader}>
              <View>
                <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
                  🏠 Departamentos
                </Text>
                <Text
                  style={[
                    styles.tabSubtitle,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  {departments.length} propiedades
                </Text>
              </View>
              <Button
                mode="contained"
                onPress={() => navigation.navigate("DepartmentForm")}
                compact
                contentStyle={{ height: 40, paddingHorizontal: 12 }}
                style={{ borderRadius: 8 }}
                icon="plus"
              >
                Nuevo
              </Button>
            </View>

            {departments.map((dept) => (
              <Card
                key={dept.id}
                style={[
                  styles.itemCard,
                  { backgroundColor: theme.colors.surface },
                ]}
                onPress={() => {
                  setSelectedDept(dept);
                  setShowModal(true);
                }}
              >
                <View style={styles.itemContent}>
                  <Avatar.Image
                    size={70}
                    source={{
                      uri: dept.images?.[0] || "https://via.placeholder.com/70",
                    }}
                    style={styles.deptAvatar}
                  />
                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                      <Text
                        style={[styles.itemName, { color: theme.colors.text }]}
                        numberOfLines={1}
                      >
                        {dept.name}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <FontAwesome name="star" size={12} color="#FBBF24" />
                        <Text style={styles.ratingText}>
                          {dept.rating || "4.5"}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.itemMeta,
                        { color: theme.colors.placeholder },
                      ]}
                      numberOfLines={1}
                    >
                      📍 {dept.address}
                    </Text>
                    <View style={styles.itemBottom}>
                      <Text
                        style={[
                          styles.itemPrice,
                          { color: theme.colors.primary },
                        ]}
                      >
                        ${dept.pricePerNight}/noche
                      </Text>
                      <Text
                        style={[
                          styles.itemCapacity,
                          { color: theme.colors.placeholder },
                        ]}
                      >
                        {dept.bedrooms} hab • {dept.bathrooms || 2} baños
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: theme.colors.primary + "10" },
                    ]}
                  >
                    <FontAwesome
                      name="pencil"
                      size={16}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: "#DC262620" },
                    ]}
                  >
                    <FontAwesome name="trash" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === "reservas" && (
          <View style={styles.tabContentSection}>
            <View>
              <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
                📅 Reservas
              </Text>
              <Text
                style={[
                  styles.tabSubtitle,
                  { color: theme.colors.placeholder },
                ]}
              >
                {reservations.length} reservas activas
              </Text>
            </View>

            {reservations.map((res) => (
              <Card
                key={res.id}
                style={[
                  styles.itemCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.reservationContent}>
                  <View
                    style={[
                      styles.statusIndicator,
                      { backgroundColor: getStatusColor(res.status) },
                    ]}
                  />
                  <View style={styles.reservationInfo}>
                    <Text
                      style={[styles.resName, { color: theme.colors.text }]}
                    >
                      {res.user}
                    </Text>
                    <Text
                      style={[
                        styles.resDept,
                        { color: theme.colors.placeholder },
                      ]}
                    >
                      📍 {res.dept}
                    </Text>
                    <View style={styles.resDateRow}>
                      <Text
                        style={[
                          styles.resDates,
                          { color: theme.colors.placeholder },
                        ]}
                      >
                        📅 {res.dates}
                      </Text>
                      <Text
                        style={[
                          styles.resTotal,
                          { color: theme.colors.primary, fontWeight: "700" },
                        ]}
                      >
                        ${res.total}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <Chip
                      label={res.status}
                      style={{
                        backgroundColor: getStatusColor(res.status) + "20",
                      }}
                      textStyle={{
                        color: getStatusColor(res.status),
                        fontWeight: "600",
                        fontSize: 12,
                      }}
                    />
                    <Button
                      mode="text"
                      compact
                      size="small"
                      style={{ marginTop: 8 }}
                    >
                      Revisar
                    </Button>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {activeTab === "usuarios" && (
          <View style={styles.tabContentSection}>
            <View>
              <Text style={[styles.tabTitle, { color: theme.colors.text }]}>
                👥 Usuarios
              </Text>
              <Text
                style={[
                  styles.tabSubtitle,
                  { color: theme.colors.placeholder },
                ]}
              >
                {users.length} usuarios registrados
              </Text>
            </View>

            {users.map((usr) => (
              <Card
                key={usr.id}
                style={[
                  styles.itemCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <View style={styles.userContent}>
                  <Avatar.Text
                    size={50}
                    label={usr.email.charAt(0).toUpperCase()}
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <View style={styles.userInfo}>
                    <Text
                      style={[styles.userName, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {usr.email}
                    </Text>
                    <View style={styles.userMeta}>
                      <Chip
                        label={
                          usr.role === "admin"
                            ? "👨‍💼 Admin"
                            : usr.role === "root"
                            ? "🔐 Root"
                            : "👤 Usuario"
                        }
                        compact
                        style={{
                          backgroundColor:
                            usr.role === "admin"
                              ? "#DC262620"
                              : usr.role === "root"
                              ? "#8B5CF620"
                              : "#3B82F620",
                          marginRight: 6,
                        }}
                        textStyle={{
                          color:
                            usr.role === "admin"
                              ? "#DC2626"
                              : usr.role === "root"
                              ? "#8B5CF6"
                              : "#3B82F6",
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      />
                      <Text
                        style={[
                          styles.userStat,
                          { color: theme.colors.placeholder },
                        ]}
                      >
                        {usr.reservations} reservas
                      </Text>
                    </View>
                  </View>
                  <View style={styles.userStatusArea}>
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor:
                            usr.status === "activo" ? "#10B981" : "#94A3B8",
                        },
                      ]}
                    />
                    <TouchableOpacity
                      style={[
                        styles.userActionBtn,
                        { backgroundColor: theme.colors.primary + "10" },
                      ]}
                    >
                      <FontAwesome
                        name="cog"
                        size={16}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>
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
                navigation.navigate("DepartmentForm", {
                  departmentId: selectedDept?.id,
                });
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
    scrollView: {
      paddingBottom: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      // AQUÍ ESTÁ EL CAMBIO IMPORTANTE:
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 35 : 60,
      paddingBottom: 14,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    backButton: {
      padding: 8,
    },
    headerContent: {
      flex: 1,
      marginHorizontal: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "white",
    },
    headerSubtitle: {
      fontSize: 12,
      color: "#F1F5F9",
      marginTop: 2,
    },
    notificationButton: {
      padding: 8,
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      right: 0,
      top: 0,
      backgroundColor: "#EC4899",
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    notificationCount: {
      color: "white",
      fontSize: 11,
      fontWeight: "bold",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginHorizontal: 16,
      marginTop: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 8,
      gap: 10,
      marginBottom: 12,
    },
    statCard: {
      width: "48%",
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    statContent: {
      alignItems: "center",
      paddingVertical: 16,
    },
    statIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      textAlign: "center",
      fontWeight: "500",
    },
    tabsContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#E2E8F0",
      marginHorizontal: 16,
      marginTop: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderBottomWidth: 2,
      borderBottomColor: "transparent",
    },
    tabActive: {
      borderBottomWidth: 3,
    },
    tabContent_: {
      flexDirection: "row",
      alignItems: "center",
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: "500",
    },
    tabContentSection: {
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    tabHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    tabTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    tabSubtitle: {
      fontSize: 12,
      marginTop: 2,
      fontWeight: "500",
    },
    itemCard: {
      marginBottom: 12,
      borderRadius: 12,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 2,
    },
    itemContent: {
      flexDirection: "row",
      padding: 12,
      gap: 12,
      flex: 1,
    },
    deptAvatar: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#E2E8F0",
    },
    itemInfo: {
      flex: 1,
      justifyContent: "space-between",
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    itemName: {
      fontSize: 15,
      fontWeight: "700",
      flex: 1,
    },
    itemMeta: {
      fontSize: 12,
      marginBottom: 6,
      fontWeight: "500",
    },
    itemBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },
    itemPrice: {
      fontSize: 15,
      fontWeight: "700",
    },
    itemCapacity: {
      fontSize: 11,
      fontWeight: "500",
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: "#FBBF2420",
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 6,
    },
    ratingText: {
      fontSize: 11,
      fontWeight: "700",
      color: "#F59E0B",
    },
    itemActions: {
      flexDirection: "row",
      gap: 8,
      paddingRight: 8,
      paddingVertical: 8,
      justifyContent: "center",
    },
    actionButton: {
      padding: 8,
      borderRadius: 8,
    },
    reservationContent: {
      flexDirection: "row",
      padding: 12,
      gap: 12,
      alignItems: "flex-start",
    },
    statusIndicator: {
      width: 4,
      height: "100%",
      borderRadius: 2,
    },
    reservationInfo: {
      flex: 1,
    },
    resName: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 4,
    },
    resDept: {
      fontSize: 12,
      marginBottom: 4,
      fontWeight: "500",
    },
    resDateRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 6,
    },
    resDates: {
      fontSize: 12,
      fontWeight: "500",
    },
    resTotal: {
      fontSize: 14,
    },
    statusContainer: {
      alignItems: "center",
    },
    userContent: {
      flexDirection: "row",
      padding: 12,
      gap: 12,
      alignItems: "center",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 15,
      fontWeight: "700",
      marginBottom: 6,
    },
    userMeta: {
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap",
    },
    userStat: {
      fontSize: 12,
      fontWeight: "500",
    },
    userStatusArea: {
      alignItems: "center",
      gap: 8,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    userActionBtn: {
      padding: 8,
      borderRadius: 8,
    },
  });

export default AdminDashboard;
