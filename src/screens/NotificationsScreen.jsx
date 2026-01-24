import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  StatusBar, // Importado para el fix
  Platform, // Importado para el fix
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Text,
  useTheme,
  Divider,
  Badge,
  Button,
  Chip,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppContext } from "../context/AppContext";

const NotificationsScreen = ({ navigation }) => {
  const theme = useTheme();
  const { notifications, unreadCount, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, deleteAllNotifications, authToken } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Cargar notificaciones al abrir la pantalla
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!authToken) return;
    setLoading(true);
    await fetchNotifications();
    setLoading(false);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Marcar notificación como leída
  const markAsRead = async (id) => {
    await markNotificationAsRead(id);
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    Alert.alert(
      "Éxito",
      "Todas las notificaciones han sido marcadas como leídas"
    );
  };

  // Limpiar todas las notificaciones
  const clearAllNotifications = async () => {
    Alert.alert(
      "Eliminar todas",
      "¿Estás seguro de que deseas eliminar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            await deleteAllNotifications();
            Alert.alert(
              "Éxito",
              "Todas las notificaciones han sido eliminadas"
            );
          },
          style: "destructive",
        },
      ]
    );
  };

  // Manejar click en notificación
  const handleNotificationPress = async (notification) => {
    await markAsRead(notification.id);

    if (notification.department_id) {
      navigation.navigate("DepartmentDetail", {
        department: { id: notification.department_id },
      });
    }
  };

  // Filtrar notificaciones
  const filteredNotifications = filterType
    ? notifications.filter((n) => n.type === filterType)
    : notifications;

  const types = ["success", "warning", "info", "error"];

  const getTypeLabel = (type) => {
    const labels = {
      success: "Éxito",
      warning: "Advertencia",
      info: "Información",
      error: "Error",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success":
        return "#4CAF50";
      case "warning":
        return "#FF9800";
      case "error":
        return "#F44336";
      case "info":
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header corregido */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <FontAwesome
              name="bell"
              size={28}
              color="#fff"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.headerTitle}>Notificaciones</Text>
          </View>
        </View>

        {unreadCount > 0 && (
          <Badge size={24} style={styles.badge}>
            {unreadCount}
          </Badge>
        )}
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {loading ? (
          <View style={[styles.centerContainer, { marginTop: 100 }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 10, color: theme.colors.text }}>Cargando notificaciones...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={[styles.emptyContainer, { marginTop: 100 }]}>
            <FontAwesome name="inbox" size={64} color={theme.colors.disabled} />
            <Text style={{ fontSize: 18, color: theme.colors.text, marginTop: 20 }}>
              Sin notificaciones
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.disabled, marginTop: 10, textAlign: 'center' }}>
              Cuando tengas notificaciones nuevas aparecerán aquí
            </Text>
          </View>
        ) : (
          <>
            {/* Filtros - RESTAURADO VISUALMENTE */}
            {notifications.length > 0 && (
              <View style={styles.filterContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              <Chip
                selected={filterType === null}
                onPress={() => setFilterType(null)}
                style={[
                  styles.filterChip,
                  filterType === null && styles.filterChipActive,
                ]}
              >
                Todas
              </Chip>
              {types.map((type) => (
                <Chip
                  key={type}
                  selected={filterType === type}
                  onPress={() => setFilterType(type)}
                  style={[
                    styles.filterChip,
                    filterType === type && styles.filterChipActive,
                  ]}
                >
                  {getTypeLabel(type)}
                </Chip>
              ))}
                </ScrollView>
              </View>
            )}

            {/* Botones de acción - RESTAURADO VISUALMENTE */}
            {notifications.length > 0 && (
              <View style={styles.actionButtons}>
            {unreadCount > 0 && (
                <Button
                mode="outlined"
                size="small"
                onPress={markAllAsRead}
                icon="check-all"
                style={{ flex: 1, marginRight: 8 }}
              >
                Marcar todas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                mode="outlined"
                size="small"
                onPress={clearAllNotifications}
                icon="trash-can"
                style={{ flex: 1 }}
                textColor="#F44336"
              >
                Limpiar
              </Button>
            )}
            </View>
            )}

            {/* Lista de notificaciones */}
            {filteredNotifications.length > 0 ? (
              <Card style={styles.card}>
                {filteredNotifications.map((notification, index) => (
                  <View key={notification.id}>
                    <View style={styles.notificationItemWrapper}>
                      <TouchableOpacity
                        style={[
                          styles.notificationItem,
                          !notification.read && styles.unreadItem,
                        ]}
                        onPress={() => handleNotificationPress(notification)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.iconContainer,
                            {
                              backgroundColor:
                                getTypeColor(notification.type) + "20",
                            },
                          ]}
                        >
                          <FontAwesome
                            name={notification.icon}
                            size={20}
                            color={getTypeColor(notification.type)}
                          />
                        </View>

                        <View style={styles.notificationContent}>
                          <View style={styles.titleRow}>
                            <Text
                              style={[
                                styles.title,
                                !notification.read && styles.unreadTitle,
                              ]}
                            >
                              {notification.title}
                            </Text>
                            {!notification.read && (
                              <View style={styles.unreadDot} />
                            )}
                          </View>
                          <Text style={styles.message}>{notification.message}</Text>
                          <Text style={styles.timestamp}>
                            {notification.timestamp}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => deleteNotification(notification.id)}
                      >
                        <FontAwesome name="trash" size={16} color="#F44336" />
                      </TouchableOpacity>
                    </View>
                    {index < filteredNotifications.length - 1 && <Divider />}
                  </View>
                ))}
              </Card>
            ) : (
              <View style={styles.emptyContainer}>
                <FontAwesome
                  name="bell-o"
                  size={60}
                  color={theme.colors.disabled}
                />
                <Text style={styles.emptyText}>
                  {filterType
                    ? "No hay notificaciones de este tipo"
                    : "No tienes notificaciones"}
                </Text>
                <Text style={styles.emptySubText}>
                  Te notificaremos sobre cambios importantes
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingBottom: 20,
      // FIX NOTCH:
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 40 : 60,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center", // Alineación centrada para que se vea bien
      elevation: 4,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    badge: {
      backgroundColor: "#FF5252",
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      overflow: "hidden",
      elevation: 2,
    },
    notificationItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      paddingVertical: 12,
      paddingHorizontal: 12,
      flex: 1,
    },
    unreadItem: {
      backgroundColor: theme.colors.primary + "08",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      flex: 1,
    },
    unreadTitle: {
      fontWeight: "bold",
    },
    message: {
      fontSize: 12,
      color: theme.colors.disabled,
      marginTop: 4,
      lineHeight: 18,
    },
    timestamp: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 6,
      opacity: 0.6,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.primary,
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 16,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.disabled,
      marginTop: 8,
      textAlign: "center",
    },
    filterContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16, // Restaurado
      backgroundColor: theme.colors.surface, // Restaurado a Surface para que se vea la caja
      marginBottom: 8,
    },
    filterScroll: {
      flexDirection: "row",
    },
    filterChip: {
      marginRight: 8,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.outline,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    actionButtons: {
      flexDirection: "row",
      paddingHorizontal: 16, // Restaurado
      paddingVertical: 12,
      gap: 8,
    },
    notificationItemWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    deleteButton: {
      padding: 12,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default NotificationsScreen;
