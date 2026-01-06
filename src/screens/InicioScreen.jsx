import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Card, Text, Button, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";

export default function InicioScreen() {
  const { user, departments, reservations, canCreateDepartment } =
    useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get("window").width;

  const summary = {
    departments: departments.length,
    activeReservations: reservations.filter(
      (r) =>
        r.status === "pending" ||
        r.status === "confirmed" ||
        r.status === "approved"
    ).length,
    availableRooms: Math.max(0, departments.length - reservations.length),
  };

  const upcoming = reservations.slice(0, 3).map((r, idx) => ({
    id: r.id || `u${idx}`,
    title: `Reserva ${r.id}`,
    dept: departments.find((d) => d.id === r.deptId)?.name || r.deptId,
    date: r.date,
    time: r.time,
  }));

  const featured = [...(departments || [])]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="light-content" />

      {/* Header ajustado */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.primary, paddingTop: insets.top + 8 },
        ]}
      >
        <View>
          <Text style={[styles.greeting, { color: "#FFFFFF" }]}>
            ¡Hola, {user?.nombre || "Invitado"}! 👋
          </Text>
          <Text style={[styles.sub, { color: "rgba(255,255,255,0.8)" }]}>
            Bienvenido a DeptBook
          </Text>
        </View>
      </View>

      <View style={styles.mainContainer}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card
            style={[styles.statCard, { borderLeftColor: theme.colors.primary }]}
          >
            <Card.Content>
              <Text
                style={[styles.statNumber, { color: theme.colors.primary }]}
              >
                {summary.departments}
              </Text>
              <Text style={styles.statLabel}>Deptos</Text>
            </Card.Content>
          </Card>
          <Card
            style={[
              styles.statCard,
              { borderLeftColor: theme.colors.secondary },
            ]}
          >
            <Card.Content>
              <Text
                style={[styles.statNumber, { color: theme.colors.secondary }]}
              >
                {summary.activeReservations}
              </Text>
              <Text style={styles.statLabel}>Activas</Text>
            </Card.Content>
          </Card>
          <Card
            style={[
              styles.statCard,
              { borderLeftColor: theme.colors.tertiary },
            ]}
          >
            <Card.Content>
              <Text
                style={[styles.statNumber, { color: theme.colors.tertiary }]}
              >
                {summary.availableRooms}
              </Text>
              <Text style={styles.statLabel}>Libres</Text>
            </Card.Content>
          </Card>
        </View>

        {/* CORRECCIÓN: Textos más cortos para que no se corten */}
        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Departamentos")}
            style={styles.actionBtn}
            contentStyle={styles.actionBtnContent}
            labelStyle={{ fontSize: 13, fontWeight: "700" }} // Ajuste de fuente
          >
            📍 Ver Deptos
          </Button>
          <Button
            mode="outlined"
            onPress={() =>
              navigation.navigate("Departamentos", {
                screen: "ReservationForm",
              })
            }
            style={styles.actionBtn}
            contentStyle={styles.actionBtnContent}
            labelStyle={{ fontSize: 13, fontWeight: "700" }}
          >
            📅 Reservar
          </Button>
        </View>

        {/* Featured Section */}
        <View style={{ marginTop: 12 }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            ✨ Destacados
          </Text>
          <View style={styles.gridContainer}>
            {featured.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.gridItem,
                  { width: screenWidth > 600 ? "48%" : "100%" },
                ]}
              >
                <Card
                  style={[
                    styles.deptCard,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  {item.images && item.images[0] ? (
                    <Card.Cover
                      source={{ uri: item.images[0] }}
                      style={{ height: 150 }}
                    />
                  ) : (
                    <View
                      style={[
                        styles.placeholderImg,
                        { backgroundColor: theme.colors.surfaceVariant },
                      ]}
                    />
                  )}
                  <Card.Content style={{ paddingVertical: 12 }}>
                    <Text
                      style={[styles.upTitle, { color: theme.colors.text }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.upMeta,
                        { color: theme.colors.placeholder, marginBottom: 6 },
                      ]}
                      numberOfLines={1}
                    >
                      🛏️ {item.bedrooms} hab · 💰 ${item.pricePerNight}
                    </Text>
                    {item.rating && (
                      <View style={styles.ratingContainer}>
                        <Text
                          style={[
                            styles.ratingText,
                            { color: "#FBBF24", fontWeight: "700" },
                          ]}
                        >
                          ⭐ {item.rating}
                        </Text>
                      </View>
                    )}
                  </Card.Content>
                  <Card.Actions>
                    <Button
                      mode="text"
                      compact
                      onPress={() =>
                        navigation.navigate("Departamentos", {
                          screen: "DepartmentDetail",
                          params: { department: item },
                        })
                      }
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

        {/* Botón Crear */}
        {canCreateDepartment(user) && (
          <View style={{ marginTop: 16 }}>
            <Button
              mode="contained"
              onPress={() =>
                navigation.navigate("Departamentos", {
                  screen: "DepartmentForm",
                })
              }
              style={{ borderRadius: 12 }}
            >
              ➕ Crear Departamento
            </Button>
          </View>
        )}

        {/* Próximas Reservas */}
        <View style={{ marginTop: 20, marginBottom: 40 }}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📅 Próximas Reservas
          </Text>
          {upcoming.length > 0 ? (
            upcoming.map((item) => (
              <Card
                key={item.id}
                style={[
                  styles.upCard,
                  { backgroundColor: theme.colors.surface },
                ]}
              >
                <Card.Content>
                  <Text style={[styles.upTitle, { color: theme.colors.text }]}>
                    {item.title}
                  </Text>
                  <Text
                    style={[styles.upMeta, { color: theme.colors.placeholder }]}
                  >
                    🏢 {item.dept}
                  </Text>
                  <Text
                    style={[
                      styles.upMeta,
                      { color: theme.colors.primary, fontWeight: "700" },
                    ]}
                  >
                    📅 {item.date} · ⏰ {item.time}
                  </Text>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Card
              style={[styles.upCard, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <Text
                  style={{
                    color: theme.colors.placeholder,
                    fontStyle: "italic",
                  }}
                >
                  No hay reservas próximas
                </Text>
              </Card.Content>
            </Card>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  greeting: { fontWeight: "700", fontSize: 26 },
  sub: { marginTop: 4, fontSize: 14, fontWeight: "500" },
  mainContainer: { paddingHorizontal: 16, marginTop: 20 },
  statsContainer: { flexDirection: "row", gap: 10, marginBottom: 20 }, // Cambiado a row para que se ajusten
  statCard: {
    flex: 1,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 4,
  },
  statNumber: { fontSize: 22, fontWeight: "800", marginBottom: 2 },
  statLabel: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  actionsRow: { flexDirection: "row", gap: 12, marginBottom: 10 },
  actionBtn: { flex: 1, borderRadius: 12 },
  actionBtnContent: { paddingVertical: 6 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridItem: { marginBottom: 8 },
  placeholderImg: { height: 150 },
  deptCard: { borderRadius: 16, elevation: 3, overflow: "hidden" },
  upCard: { marginBottom: 12, borderRadius: 12, elevation: 2 },
  upTitle: { fontWeight: "700", fontSize: 15 },
  upMeta: { marginTop: 4, fontSize: 13 },
});
