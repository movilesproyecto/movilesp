import React, { useLayoutEffect, useMemo } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import {
  Avatar,
  Card,
  Text,
  Button,
  useTheme,
  Chip,
  ProgressBar,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BarChart } from "react-native-chart-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

export default function PerfilScreen() {
  const { user, logout, roleLabel, reservations } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 72;

  // Validación: si no hay usuario, mostrar loading
  if (!user) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const nombre = user?.nombre || "Usuario";
  const inicial = nombre?.[0] ? nombre[0].toUpperCase() : "U";

  const userStats = useMemo(() => {
    const userReservations = reservations.filter(
      (r) => r.user === user?.correo
    );
    const confirmedReservations = userReservations.filter(
      (r) => r.status === "confirmed" || r.status === "approved"
    ).length;
    const totalSpent = userReservations.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );
    return {
      totalReservations: userReservations.length,
      confirmedReservations,
      totalSpent,
      memberSince: user?.ingreso || "Ene 2024",
      accountStatus: "Activo",
    };
  }, [user, reservations]);

  const activityData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [{ data: [2, 3, 2, 4, 3, 5] }],
  };

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={[
          styles.headerGradient,
          {
            backgroundColor: theme.colors.primary,
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarWrap}>
            <Avatar.Text
              size={72}
              label={inicial}
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <View style={[styles.statusBadge, { backgroundColor: "#10B981" }]}>
              <FontAwesome name="check" size={12} color="white" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.name, { color: "#FFFFFF" }]}>{nombre}</Text>

            {/* CORRECCIÓN AQUÍ: Chip de rol arreglado */}
            <View style={styles.roleContainer}>
              <Chip
                icon="shield"
                style={{ backgroundColor: "rgba(255,255,255,0.2)" }} // Quitamos height fijo
                textStyle={{
                  color: "#FFFFFF",
                  fontWeight: "600",
                  fontSize: 11,
                  paddingVertical: 2,
                }} // Ajustamos padding
                compact // Hace el chip más ajustado pero sin cortar
              >
                {roleLabel(user)}
              </Chip>
            </View>

            <Text style={[styles.email, { color: "rgba(255,255,255,0.7)" }]}>
              {user?.correo}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <Button
            mode="contained-tonal"
            onPress={() => {
              try {
                navigation.navigate("EditProfile");
              } catch (error) {
                console.log("Error en navegación:", error);
              }
            }}
            style={{ flex: 1, borderRadius: 8 }}
            buttonColor="rgba(255,255,255,0.2)"
            labelStyle={{ color: "#FFFFFF", fontSize: 12 }}
          >
            ✏️ Editar Perfil
          </Button>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: "#EF4444" }]}
            onPress={() => {
              logout();
            }}
          >
            <FontAwesome name="sign-out" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mainWrapper}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          📊 Mi Actividad
        </Text>
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
            color="#10B981"
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
            icon="user"
            color={theme.colors.secondary}
            theme={theme}
          />
        </View>

        <Card
          style={[
            styles.card,
            { backgroundColor: theme.colors.surface, marginTop: 16 },
          ]}
        >
          <Card.Content>
            <View style={styles.accountStatusRow}>
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.colors.placeholder,
                    fontWeight: "600",
                  }}
                >
                  Estado de Cuenta
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: theme.colors.text,
                  }}
                >
                  ✅ Verificado
                </Text>
              </View>
              <Button
                mode="text"
                compact
                labelStyle={{ color: theme.colors.primary, fontSize: 11 }}
              >
                Ver detalles
              </Button>
            </View>
            <ProgressBar
              progress={0.85}
              style={{ height: 6, borderRadius: 3, marginTop: 4 }}
              color={theme.colors.primary}
            />
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.placeholder,
                marginTop: 6,
                textAlign: "right",
              }}
            >
              85% completado
            </Text>
          </Card.Content>
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Datos Personales
        </Text>
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={{ paddingVertical: 4 }}>
            <InfoDetailRow
              label="Correo"
              value={user?.correo || "-"}
              icon="envelope"
              theme={theme}
            />
            <InfoDetailRow
              label="Teléfono"
              value={user?.telefono || "No registrado"}
              icon="phone"
              theme={theme}
            />
            <InfoDetailRow
              label="Género"
              value={user?.genero || "No especificado"}
              icon="user"
              theme={theme}
            />
          </Card.Content>
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
          Resumen Semestral
        </Text>
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.surface,
              alignItems: "center",
              paddingVertical: 12,
            },
          ]}
        >
          <BarChart
            data={activityData}
            width={chartWidth}
            height={180}
            chartConfig={{
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              color: (opacity = 1) => theme.colors.primary,
              labelColor: (opacity = 1) => theme.colors.placeholder,
              barPercentage: 0.5,
              decimalPlaces: 0,
            }}
            style={{ borderRadius: 16 }}
            fromZero
            withInnerLines={false}
          />
        </Card>

        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>
          📅 Mis Reservas
        </Text>
        {userStats.totalReservations > 0 ? (
          <View>
            {reservations
              .filter((r) => r.user === user?.correo)
              .slice(0, 5)
              .map((reservation) => (
                <Card
                  key={reservation.id}
                  style={[styles.card, { backgroundColor: theme.colors.surface, marginBottom: 8 }]}
                >
                  <Card.Content>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: theme.colors.text }}>
                        {reservation.deptId ? `Dept. #${reservation.deptId}` : "Departamento"}
                      </Text>
                      <Chip
                        style={{
                          backgroundColor:
                            reservation.status === "confirmed" || reservation.status === "approved"
                              ? "#D1FAE5"
                              : "#FEE2E2",
                        }}
                        textStyle={{
                          color:
                            reservation.status === "confirmed" || reservation.status === "approved"
                              ? "#065F46"
                              : "#7F1D1D",
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      >
                        {reservation.status === "confirmed" || reservation.status === "approved" ? "✓ Confirmada" : "⏳ Pendiente"}
                      </Chip>
                    </View>
                    <View style={{ gap: 6 }}>
                      <InfoDetailRow
                        label="Fecha"
                        value={reservation.date}
                        icon="calendar"
                        theme={theme}
                      />
                      <InfoDetailRow
                        label="Hora"
                        value={reservation.time}
                        icon="clock-o"
                        theme={theme}
                      />
                      <InfoDetailRow
                        label="Duración"
                        value={reservation.duration}
                        icon="hourglass"
                        theme={theme}
                      />
                      <InfoDetailRow
                        label="Monto"
                        value={`$${reservation.amount || 0}`}
                        icon="dollar"
                        theme={theme}
                      />
                    </View>
                  </Card.Content>
                </Card>
              ))}
            {userStats.totalReservations > 5 && (
              <Button
                mode="text"
                onPress={() => navigation.navigate("ReservationsList")}
                style={{ marginTop: 8 }}
              >
                Ver todas las reservas ({userStats.totalReservations})
              </Button>
            )}
          </View>
        ) : (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={{ alignItems: "center", paddingVertical: 20 }}>
              <FontAwesome name="calendar" size={32} color={theme.colors.placeholder} style={{ marginBottom: 8 }} />
              <Text style={{ color: theme.colors.placeholder, fontSize: 14, fontWeight: "600" }}>
                No tienes reservas aún
              </Text>
              <Text style={{ color: theme.colors.placeholder, fontSize: 12, marginTop: 4 }}>
                Comienza a explorar departamentos
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const StatCard = ({ title, value, icon, color, theme }) => (
  <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
    <Card.Content style={{ alignItems: "center", paddingVertical: 10 }}>
      <FontAwesome
        name={icon}
        size={18}
        color={color}
        style={{ marginBottom: 4 }}
      />
      <Text
        style={{ fontSize: 16, fontWeight: "800", color: theme.colors.text }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 9,
          color: theme.colors.placeholder,
          textTransform: "uppercase",
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </Card.Content>
  </Card>
);

const InfoDetailRow = ({ label, value, icon, theme }) => (
  <View style={[styles.infoRow, { borderBottomColor: theme.colors.outline }]}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FontAwesome
        name={icon}
        size={14}
        color={theme.colors.primary}
        style={{ width: 20 }}
      />
      <Text style={{ fontSize: 12, color: theme.colors.placeholder }}>
        {label}
      </Text>
    </View>
    <Text style={{ fontSize: 13, fontWeight: "600", color: theme.colors.text }}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerGradient: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrap: { position: "relative" },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  userInfo: { flex: 1, marginLeft: 16 },
  name: { fontWeight: "800", fontSize: 20 },
  email: { fontSize: 12, marginTop: 4 }, // Aumenté un poco el margen para separarlo del chip
  roleContainer: { marginVertical: 4, alignItems: "flex-start" },
  actionsRow: { flexDirection: "row", gap: 10 },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mainWrapper: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  statCard: { width: "48%", borderRadius: 12, elevation: 2 },
  card: { borderRadius: 16, elevation: 2, marginBottom: 12 },
  accountStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});
