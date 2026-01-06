import React, { useMemo, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
  Share,
  Linking,
  Platform,
} from "react-native";
import { CommonActions } from "@react-navigation/native";
import {
  Card,
  Text,
  Button,
  useTheme,
  Divider,
  Avatar,
  Badge,
  Modal,
  Portal,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useAppContext } from "../context/AppContext";

const MoreScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout, isDarkTheme, setIsDarkMode, isSuperAdmin, isAdmin } =
    useAppContext();
  const [aboutVisible, setAboutVisible] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Funciones para las opciones
  const handleRateApp = async () => {
    try {
      const url =
        Platform.select({
          ios: "itms-apps://apps.apple.com/app/id6479831622",
          android:
            "https://play.google.com/store/apps/details?id=com.app.departamentos",
          web: "https://www.google.com/search?q=app+departamentos",
        }) || "https://www.google.com/search?q=app+departamentos";

      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo abrir la tienda de aplicaciones. Intenta manualmente desde tu tienda de apps."
      );
    }
  };

  const handleShareApp = async () => {
    try {
      const message = Platform.select({
        ios: "Descubre nuestra app de gestión de departamentos: https://apps.apple.com/app/id1234567890",
        android:
          "Descubre nuestra app de gestión de departamentos: https://play.google.com/store/apps/details?id=com.moviles.departamentos",
      });

      await Share.share({
        message: message || "Descubre nuestra app de gestión de departamentos",
        title: "Compartir Aplicación",
        url: "https://apps.apple.com/app/id1234567890",
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir la aplicación");
    }
  };

  const handleAboutPress = () => {
    setAboutVisible(true);
  };

  const menuOptions = [
    {
      id: 1,
      icon: "bell",
      title: "Notificaciones",
      subtitle: "Gestiona tus alertas",
      color: "#FF6B6B",
      action: () => navigation.navigate("Notifications"),
    },
    {
      id: 2,
      icon: "question-circle",
      title: "Centro de Ayuda",
      subtitle: "Preguntas frecuentes",
      color: "#4ECDC4",
      action: () => navigation.navigate("Help"),
    },
    {
      id: 3,
      icon: "shield",
      title: "Privacidad y Seguridad",
      subtitle: "Controla tu privacidad",
      color: "#45B7D1",
      action: () => navigation.navigate("Privacy"),
    },
    {
      id: 4,
      icon: "star",
      title: "Califica la App",
      subtitle: "Danos tu opinión",
      color: "#FFA502",
      action: handleRateApp,
    },
    {
      id: 5,
      icon: "share-alt",
      title: "Compartir",
      subtitle: "Invita a tus amigos",
      color: "#95E1D3",
      action: handleShareApp,
    },
    {
      id: 6,
      icon: "info-circle",
      title: "Acerca de",
      subtitle: "Versión 1.0.0",
      color: "#8E7CC3",
      action: handleAboutPress,
    },
  ];

  // Agregar opción de SuperAdmin si el usuario es superadmin
  if (isSuperAdmin(user)) {
    menuOptions.unshift({
      id: 0.5,
      icon: "users",
      title: "Gestión de Usuarios",
      subtitle: "Crear y gestionar usuarios",
      color: "#2196F3",
      action: () => navigation.navigate("UserManagement"),
    });
    menuOptions.unshift({
      id: 0,
      icon: "bar-chart",
      title: "Panel Super Admin",
      subtitle: "Estadísticas del sistema",
      color: "#E91E63",
      action: () => navigation.navigate("SuperAdminDashboard"),
    });
  }

  // Agregar opción de Admin si el usuario es admin
  if (isAdmin(user)) {
    menuOptions.unshift({
      id: -1,
      icon: "cog",
      title: "Panel de Administrador",
      subtitle: "Gestión de departamentos",
      color: "#FF9800",
      action: () => navigation.navigate("AdminDashboard"),
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome
          name="ellipsis-h"
          size={28}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>Más Opciones</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* User Card Summary - Mejorado */}
        <Card
          style={[
            styles.userCard,
            { backgroundColor: theme.colors.surface, borderRadius: 12 },
          ]}
        >
          <Card.Content style={styles.userContent}>
            <View style={styles.userCardTop}>
              <Avatar.Text
                size={60}
                label={user?.nombre?.substring(0, 1) || "U"}
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
              <View style={styles.userInfoContainer}>
                <View style={styles.userTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[styles.userName, { color: theme.colors.text }]}
                    >
                      {user?.nombre}
                    </Text>
                    <Text
                      style={[
                        styles.userEmail,
                        { color: theme.colors.disabled },
                      ]}
                    >
                      {user?.email}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.roleBadge,
                      { backgroundColor: theme.colors.primary + "20" },
                    ]}
                  >
                    <FontAwesome
                      name="shield"
                      size={10}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.roleBadgeText,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {user?.rol?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* --- AQUI ESTA EL CAMBIO VISUAL --- */}
                <View style={styles.memberBadge}>
                  <FontAwesome
                    name="calendar"
                    size={14}
                    color={theme.colors.primary} // Icono con color visible
                  />
                  <Text style={styles.memberText}>Miembro desde 2024</Text>
                </View>
                {/* ---------------------------------- */}
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: "#E3F2FD" }]}>
              <FontAwesome name="list" size={20} color="#1976D2" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reservas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: "#E8F5E9" }]}>
              <FontAwesome name="check-circle" size={20} color="#388E3C" />
            </View>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: "#FFF3E0" }]}>
              <FontAwesome name="star" size={20} color="#F57C00" />
            </View>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Options */}
        <Text style={styles.sectionTitle}>Opciones Rápidas</Text>
        <Card style={styles.menuCard}>
          {menuOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity onPress={option.action} style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: option.color + "20" },
                    ]}
                  >
                    <FontAwesome
                      name={option.icon}
                      size={20}
                      color={option.color}
                    />
                  </View>
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{option.title}</Text>
                  <Text style={styles.menuSubtitle}>{option.subtitle}</Text>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={theme.colors.disabled}
                />
              </TouchableOpacity>
              {index < menuOptions.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* Account Management */}
        <Text style={styles.sectionTitle}>Cuenta</Text>
        <Card style={styles.accountCard}>
          <TouchableOpacity style={styles.accountItem}>
            <FontAwesome name="lock" size={20} color={theme.colors.primary} />
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Contraseña</Text>
              <Text style={styles.accountSubtitle}>Cambia tu contraseña</Text>
            </View>
            <FontAwesome
              name="chevron-right"
              size={16}
              color={theme.colors.disabled}
            />
          </TouchableOpacity>

          <Divider />

          <View style={styles.accountItem}>
            <FontAwesome name="moon-o" size={20} color={theme.colors.primary} />
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Modo Oscuro</Text>
              <Text style={styles.accountSubtitle}>
                Cambia el tema de la aplicación
              </Text>
            </View>
            <Switch
              value={isDarkTheme}
              onValueChange={setIsDarkMode}
              color={theme.colors.primary}
            />
          </View>
        </Card>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2024 Todos los derechos reservados
          </Text>
        </View>
      </ScrollView>

      {/* Modal Acerca de */}
      <Portal>
        <Modal
          visible={aboutVisible}
          onDismiss={() => setAboutVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View
            style={[
              styles.aboutModal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAboutVisible(false)}
            >
              <FontAwesome name="times" size={24} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.aboutHeader}>
              <View
                style={[
                  styles.aboutIcon,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <FontAwesome name="building" size={40} color="#fff" />
              </View>
              <Text style={styles.aboutTitle}>Gestión de Departamentos</Text>
              <Text style={styles.aboutVersion}>v1.0.0</Text>
            </View>

            <Divider style={{ marginVertical: 16 }} />

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Descripción</Text>
              <Text style={styles.aboutText}>
                Aplicación móvil para la gestión integral de departamentos,
                reservas y administración de usuarios.
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Características</Text>
              <Text style={styles.aboutText}>
                • Búsqueda y exploración de departamentos{"\n"}• Sistema de
                reservas{"\n"}• Gestión de favoritos{"\n"}• Administración de
                perfil{"\n"}• Notificaciones en tiempo real{"\n"}• Panel de
                administrador
              </Text>
            </View>

            <View style={styles.aboutSection}>
              <Text style={styles.aboutSectionTitle}>Contacto</Text>
              <Text style={styles.aboutText}>
                Email: soporte@departamentos.com{"\n"}
                Teléfono: +1 (555) 000-0000
              </Text>
            </View>

            <Button
              mode="contained"
              onPress={() => setAboutVisible(false)}
              style={{ marginTop: 16 }}
            >
              Cerrar
            </Button>
          </View>
        </Modal>
      </Portal>
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
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 45 : 60,
      flexDirection: "row",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#fff",
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    userCard: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 3,
      borderRadius: 12,
    },
    userContent: {
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    userCardTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      marginBottom: 12,
    },
    avatar: {
      marginRight: 0,
      backgroundColor: theme.colors.primary,
      marginTop: 2,
    },
    userInfoContainer: {
      flex: 1,
      justifyContent: "space-between",
    },
    userTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 8,
      marginBottom: 8,
    },
    roleBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    roleBadgeText: {
      fontSize: 10,
      fontWeight: "700",
    },
    logoutButtonCard: {
      marginHorizontal: 0,
      borderRadius: 8,
    },
    logoutButtonContent: {
      paddingVertical: 8,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 12,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    // --- ESTILOS CORREGIDOS PARA EL BADGE ---
    memberBadge: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      backgroundColor: theme.colors.primary + "20", // Fondo más visible
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      alignSelf: "flex-start", // Ajusta el ancho al contenido
      gap: 8,
    },
    memberText: {
      fontSize: 13,
      color: theme.colors.text, // Texto oscuro/claro según tema (no disabled)
      fontWeight: "600",
    },
    // ----------------------------------------
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text,
      marginBottom: 10,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    menuCard: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 2,
      overflow: "hidden",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    menuIcon: {
      marginRight: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    menuSubtitle: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    accountCard: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 2,
      overflow: "hidden",
    },
    accountItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    accountContent: {
      flex: 1,
      marginLeft: 12,
    },
    accountTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    accountSubtitle: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    logoutBtn: {
      marginHorizontal: 0,
      marginBottom: 16,
      borderColor: "#FF6B6B",
    },
    logoutLabel: {
      color: "#FF6B6B",
      fontSize: 14,
      fontWeight: "600",
    },
    appInfo: {
      alignItems: "center",
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.disabled + "20",
    },
    appVersion: {
      fontSize: 12,
      color: theme.colors.disabled,
      fontWeight: "500",
    },
    appCopyright: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 4,
      opacity: 0.7,
    },
    modalContent: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
      paddingHorizontal: 16,
    },
    aboutModal: {
      borderRadius: 16,
      padding: 24,
      maxHeight: "85%",
      width: "100%",
      elevation: 5,
    },
    closeButton: {
      alignSelf: "flex-end",
      marginBottom: 12,
    },
    aboutHeader: {
      alignItems: "center",
      marginBottom: 12,
    },
    aboutIcon: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    aboutTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      textAlign: "center",
    },
    aboutVersion: {
      fontSize: 14,
      color: theme.colors.disabled,
      marginTop: 4,
    },
    aboutSection: {
      marginVertical: 12,
    },
    aboutSectionTitle: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.primary,
      marginBottom: 8,
    },
    aboutText: {
      fontSize: 13,
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

export default MoreScreen;
