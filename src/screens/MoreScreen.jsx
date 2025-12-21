import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  useTheme,
  Divider,
  Avatar,
  Badge,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const MoreScreen = ({ navigation }) => {
  const theme = useTheme();
  const { user, logout, isDarkTheme, setIsDarkMode, isSuperAdmin, isAdmin } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const menuOptions = [
    {
      id: 1,
      icon: 'bell',
      title: 'Notificaciones',
      subtitle: 'Gestiona tus alertas',
      color: '#FF6B6B',
      action: () => navigation.navigate('Notifications'),
    },
    {
      id: 2,
      icon: 'question-circle',
      title: 'Centro de Ayuda',
      subtitle: 'Preguntas frecuentes',
      color: '#4ECDC4',
      action: () => navigation.navigate('Help'),
    },
    {
      id: 3,
      icon: 'shield',
      title: 'Privacidad y Seguridad',
      subtitle: 'Controla tu privacidad',
      color: '#45B7D1',
      action: () => navigation.navigate('Privacy'),
    },
    {
      id: 4,
      icon: 'star',
      title: 'Califica la App',
      subtitle: 'Danos tu opinión',
      color: '#FFA502',
      action: () => Alert.alert('Gracias', 'Tu opinión es importante para nosotros'),
    },
    {
      id: 5,
      icon: 'share-alt',
      title: 'Compartir',
      subtitle: 'Invita a tus amigos',
      color: '#95E1D3',
      action: () => Alert.alert('Compartir', 'Comparte la app con tus amigos'),
    },
    {
      id: 6,
      icon: 'info-circle',
      title: 'Acerca de',
      subtitle: 'Versión 1.0.0',
      color: '#8E7CC3',
      action: () => Alert.alert('Acerca de', 'Aplicación de Gestión de Departamentos v1.0.0'),
    },
  ];

  // Agregar opción de SuperAdmin si el usuario es superadmin
  if (isSuperAdmin(user)) {
    menuOptions.unshift({
      id: 0.5,
      icon: 'users',
      title: 'Gestión de Usuarios',
      subtitle: 'Crear y gestionar usuarios',
      color: '#2196F3',
      action: () => navigation.navigate('UserManagement'),
    });
    menuOptions.unshift({
      id: 0,
      icon: 'bar-chart',
      title: 'Panel Super Admin',
      subtitle: 'Estadísticas del sistema',
      color: '#E91E63',
      action: () => navigation.navigate('SuperAdminDashboard'),
    });
  }

  // Agregar opción de Admin si el usuario es admin
  if (isAdmin(user)) {
    menuOptions.unshift({
      id: -1,
      icon: 'cog',
      title: 'Panel de Administrador',
      subtitle: 'Gestión de departamentos',
      color: '#FF9800',
      action: () => navigation.navigate('AdminDashboard'),
    });
  }

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', onPress: () => {}, style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          onPress: () => {
            logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
          style: 'destructive',
        },
      ]
    );
  };

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
        <Card style={[styles.userCard, { backgroundColor: theme.colors.surface, borderRadius: 12 }]}>
          <Card.Content style={styles.userContent}>
            <View style={styles.userCardTop}>
              <Avatar.Text
                size={60}
                label={user?.nombre?.substring(0, 1) || 'U'}
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
              <View style={styles.userInfoContainer}>
                <View style={styles.userTopRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.nombre}</Text>
                    <Text style={[styles.userEmail, { color: theme.colors.disabled }]}>{user?.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: theme.colors.primary + '20' }]}>
                    <FontAwesome name="shield" size={10} color={theme.colors.primary} />
                    <Text style={[styles.roleBadgeText, { color: theme.colors.primary }]}>
                      {user?.rol?.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View style={styles.memberBadge}>
                  <FontAwesome name="calendar" size={11} color={theme.colors.disabled} />
                  <Text style={[styles.memberText, { color: theme.colors.disabled }]}>Miembro desde 2024</Text>
                </View>
              </View>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            {/* Botón Logout en Tarjeta */}
            <Button
              mode="contained"
              buttonColor="#FF6B6B"
              textColor="white"
              onPress={handleLogout}
              icon="logout"
              style={styles.logoutButtonCard}
              contentStyle={styles.logoutButtonContent}
            >
              Cerrar Sesión
            </Button>
          </Card.Content>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#E3F2FD' }]}>
              <FontAwesome name="list" size={20} color="#1976D2" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reservas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#E8F5E9' }]}>
              <FontAwesome name="check-circle" size={20} color="#388E3C" />
            </View>
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statCircle, { backgroundColor: '#FFF3E0' }]}>
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
              <TouchableOpacity
                onPress={option.action}
                style={styles.menuItem}
              >
                <View style={styles.menuIcon}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: option.color + '20' },
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
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.accountItem}
          >
            <FontAwesome name="edit" size={20} color={theme.colors.primary} />
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Editar Perfil</Text>
              <Text style={styles.accountSubtitle}>
                Actualiza tu información
              </Text>
            </View>
            <FontAwesome
              name="chevron-right"
              size={16}
              color={theme.colors.disabled}
            />
          </TouchableOpacity>

          <Divider />

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

        {/* Logout Button */}
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutBtn}
          labelStyle={styles.logoutLabel}
          icon={() => <FontAwesome name="sign-out" size={16} color="#FF6B6B" />}
        >
          Cerrar Sesión
        </Button>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Versión 1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Todos los derechos reservados</Text>
        </View>
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
      padding: 20,
      paddingTop: 30,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 4,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
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
      flexDirection: 'row',
      alignItems: 'flex-start',
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
      justifyContent: 'space-between',
    },
    userTopRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: 8,
    },
    roleBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    roleBadgeText: {
      fontSize: 10,
      fontWeight: '700',
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
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    userEmail: {
      fontSize: 12,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    memberBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
      backgroundColor: theme.colors.primary + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      width: '70%',
      gap: 6,
    },
    memberText: {
      fontSize: 11,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statCircle: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    statNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 10,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    menuCard: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 2,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContent: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 14,
      fontWeight: '600',
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
      overflow: 'hidden',
    },
    accountItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    accountContent: {
      flex: 1,
      marginLeft: 12,
    },
    accountTitle: {
      fontSize: 14,
      fontWeight: '600',
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
      borderColor: '#FF6B6B',
    },
    logoutLabel: {
      color: '#FF6B6B',
      fontSize: 14,
      fontWeight: '600',
    },
    appInfo: {
      alignItems: 'center',
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: theme.colors.disabled + '20',
    },
    appVersion: {
      fontSize: 12,
      color: theme.colors.disabled,
      fontWeight: '500',
    },
    appCopyright: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 4,
      opacity: 0.7,
    },
  });

export default MoreScreen;
