import React, { useLayoutEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity, // ✅ Agregado para corregir el error de pantalla roja
} from "react-native";
import {
  Card,
  Text,
  Button,
  useTheme,
  Chip,
  Divider,
  IconButton,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import ConfirmDialog from "../components/ConfirmDialog";

const FavoritesScreen = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { getFavoriteDepartments, toggleFavorite, apiDeleteDepartment, canDeleteDepartment, user } = useAppContext();

  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const styles = useMemo(() => createStyles(theme, insets), [theme, insets]);
  const favoriteDepartments = getFavoriteDepartments();

  // Función para compartir departamento por WhatsApp
  const shareToWhatsApp = async (dept) => {
    const message = `🏠 *${dept.name}*\n\n📍 ${dept.address}\n🛏️ ${dept.bedrooms} habitaciones\n🚿 ${dept.bathrooms || 1} baños\n💰 $${dept.pricePerNight}/noche\n⭐ Calificación: ${dept.rating}\n\nMe interesa este departamento! 😊`;

    try {
      // Usar expo-sharing para compartir
      if (await Sharing.isAvailableAsync()) {
        // Crear un archivo temporal con el mensaje
        const filename = 'departamento.txt';
        const fileUri = `${FileSystem.documentDirectory}${filename}`;

        // Escribir el mensaje en un archivo
        await FileSystem.writeAsStringAsync(fileUri, message, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        // Compartir el archivo
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: `Compartir ${dept.name}`,
        });
      } else {
        alert("Compartir no está disponible en tu dispositivo");
      }
    } catch (error) {
      console.log("Error al compartir:", error);
      // Fallback: mostrar el mensaje para copiar manualmente
      alert(`Mensaje para compartir:\n\n${message}\n\nCopia este mensaje y compártelo por WhatsApp.`);
    }
  };

  // Función para abrir el diálogo de confirmación
  const openDeleteDialog = (dept) => {
    setDepartmentToDelete(dept);
    setDeleteDialogVisible(true);
  };

  // Función para confirmar eliminación
  const handleConfirmDelete = async () => {
    if (!departmentToDelete) return;
    
    setDeleting(true);
    const result = await apiDeleteDepartment(departmentToDelete.id);
    setDeleting(false);
    setDeleteDialogVisible(false);
    
    if (result.success) {
      alert('Departamento eliminado correctamente');
    } else {
      alert(`Error: ${result.message || 'No se pudo eliminar el departamento'}`);
    }
    setDepartmentToDelete(null);
  };

  // 👇 ESTO ES LA CLAVE: Oculta la barra de arriba para quitar el espacio doble
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Personalizado */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <FontAwesome
            name="heart"
            size={28}
            color="#FFFFFF"
            style={{ marginRight: 12 }}
          />

          <View style={styles.textContainer}>
            <Text style={styles.headerTitle}>Mis Favoritos</Text>
            <Text style={styles.subTitle}>
              {favoriteDepartments.length}{" "}
              {favoriteDepartments.length === 1
                ? "propiedad guardada"
                : "propiedades guardadas"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {favoriteDepartments.length > 0 ? (
          <>
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content style={styles.statCardContent}>
                  <FontAwesome
                    name="star"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statValue}>
                    {(
                      favoriteDepartments.reduce(
                        (sum, d) => sum + d.rating,
                        0
                      ) / favoriteDepartments.length
                    ).toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Promedio</Text>
                </Card.Content>
              </Card>
              <Card style={styles.statCard}>
                <Card.Content style={styles.statCardContent}>
                  <FontAwesome
                    name="dollar"
                    size={20}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statValue}>
                    $
                    {Math.min(
                      ...favoriteDepartments.map((d) => d.pricePerNight)
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Precio Mínimo</Text>
                </Card.Content>
              </Card>
            </View>

            <Card style={styles.mainCard}>
              <Card.Title
                title="Departamentos Guardados"
                titleStyle={styles.cardTitle}
                left={(props) => (
                  <FontAwesome
                    name="bookmark"
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
              />
              <Divider />
              <Card.Content style={styles.departmentsContainer}>
                {favoriteDepartments.map((dept, index) => (
                  <View key={dept.id}>
                    <View style={styles.departmentItem}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Departamentos", {
                            screen: "DepartmentDetail",
                            params: { department: dept },
                          })
                        }
                      >
                        <View style={styles.deptHeader}>
                          <Text style={styles.deptName} numberOfLines={1}>
                            {dept.name}
                          </Text>
                          <View style={styles.ratingBadge}>
                            <FontAwesome
                              name="star"
                              size={10}
                              color="#E65100"
                            />
                            <Text style={styles.ratingText}>{dept.rating}</Text>
                          </View>
                        </View>
                        <Text style={styles.location} numberOfLines={1}>
                          <FontAwesome name="map-marker" /> {dept.address}
                        </Text>

                        <View style={styles.deptMeta}>
                          <Chip
                            icon="bed"
                            style={styles.chip}
                            textStyle={styles.chipText}
                          >
                            {dept.bedrooms} hab
                          </Chip>
                          <Chip
                            icon="shower"
                            style={styles.chip}
                            textStyle={styles.chipText}
                          >
                            {dept.bathrooms || 1} baños
                          </Chip>
                        </View>

                        <Text style={styles.price}>
                          ${dept.pricePerNight}{" "}
                          <Text style={styles.priceUnit}>/noche</Text>
                        </Text>
                      </TouchableOpacity>

                      <View style={styles.deptBottom}>
                        <Button
                          mode="contained"
                          onPress={() =>
                            navigation.navigate("Departamentos", {
                              screen: "ReservationForm",
                              params: { department: dept },
                            })
                          }
                          style={{ borderRadius: 10, flex: 1 }}
                          labelStyle={{ fontSize: 12, fontWeight: "700" }}
                        >
                          Reservar
                        </Button>
                        <IconButton
                          icon="share-outline"
                          iconColor={theme.colors.primary}
                          size={22}
                          onPress={() => shareToWhatsApp(dept)}
                        />
                        <IconButton
                          icon="heart"
                          iconColor={theme.colors.error}
                          size={22}
                          onPress={() => toggleFavorite(dept.id)}
                          title="Quitar de favoritos"
                        />
                        {canDeleteDepartment(user) && (
                          <IconButton
                            icon="trash-can-outline"
                            iconColor="#EF4444"
                            size={22}
                            onPress={() => openDeleteDialog(dept)}
                            title="Eliminar departamento"
                          />
                        )}
                      </View>
                    </View>
                    {index < favoriteDepartments.length - 1 && (
                      <Divider style={{ marginVertical: 12 }} />
                    )}
                  </View>
                ))}
              </Card.Content>
            </Card>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <FontAwesome
                name="heart"
                size={40}
                color={theme.colors.disabled}
              />
            </View>
            <Text style={styles.emptyText}>Tu lista está vacía</Text>
            <Text style={styles.emptySubText}>
              Guarda los departamentos que te gusten para acceder a ellos
              rápidamente.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Departamentos")}
              style={styles.exploreBtn}
            >
              Explorar Departamentos
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Eliminar Departamento"
        message={`¿Estás seguro de que deseas eliminar "${departmentToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogVisible(false);
          setDepartmentToDelete(null);
        }}
        isDangerous={true}
      />
    </View>
  );
};

const createStyles = (theme, insets) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      // Ajustado para quedar pegado arriba pero respetando el reloj (Notch)
      paddingTop: insets.top + 10,
      paddingBottom: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      elevation: 5,
      justifyContent: "center",
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    textContainer: {
      marginLeft: 12,
      flexDirection: "column",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: "#FFFFFF",
      marginBottom: 0,
      lineHeight: 26,
      includeFontPadding: false,
    },
    subTitle: {
      fontSize: 13,
      color: "rgba(255,255,255,0.8)",
      marginTop: 0,
      lineHeight: 16,
      includeFontPadding: false,
    },
    content: { flex: 1, paddingHorizontal: 16, marginTop: 16 },
    statsGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
    statCard: {
      flex: 1,
      borderRadius: 16,
      elevation: 2,
      backgroundColor: theme.colors.surface,
    },
    statCardContent: { alignItems: "center", paddingVertical: 12 },
    statValue: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.colors.primary,
      marginTop: 4,
    },
    statLabel: {
      fontSize: 10,
      color: theme.colors.placeholder,
      marginTop: 2,
      textAlign: "center",
    },
    mainCard: {
      borderRadius: 16,
      elevation: 3,
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
    },
    cardTitle: { fontSize: 16, fontWeight: "700" },
    departmentsContainer: { paddingVertical: 4 },
    departmentItem: { paddingVertical: 12 },
    deptHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    deptName: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.text,
      flex: 1,
      marginRight: 8,
    },
    ratingBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFF3E0",
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      gap: 4,
    },
    ratingText: { fontSize: 11, fontWeight: "800", color: "#E65100" },
    location: {
      fontSize: 12,
      color: theme.colors.placeholder,
      marginBottom: 8,
    },
    deptMeta: { flexDirection: "row", gap: 8, marginBottom: 12 },
    chip: { height: 28, backgroundColor: theme.colors.primary + "10" },
    chipText: { fontSize: 11, color: theme.colors.primary, fontWeight: "600" },
    deptBottom: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 10,
    },
    price: { fontSize: 18, fontWeight: "800", color: theme.colors.primary },
    priceUnit: {
      fontSize: 12,
      fontWeight: "400",
      color: theme.colors.placeholder,
    },
    emptyContainer: {
      flex: 1,
      paddingTop: 100,
      alignItems: "center",
      paddingHorizontal: 40,
    },
    emptyIconBg: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 8,
    },
    emptySubText: {
      fontSize: 14,
      color: theme.colors.placeholder,
      textAlign: "center",
      marginBottom: 24,
    },
    exploreBtn: { marginTop: 10, borderRadius: 12, width: "100%" },
  });

export default FavoritesScreen;
