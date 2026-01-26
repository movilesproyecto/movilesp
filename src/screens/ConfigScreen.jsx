import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Switch, List, Button, Divider, Text, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function ConfigScreen() {
  const { isDarkTheme, toggleTheme, logout, user, canManageUsers, canViewReports, canViewSuperAdminStats, isAdmin, isSuperAdmin } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('es');

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.colors.background }]} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }} keyboardShouldPersistTaps="handled">
      <Text style={{ textAlign: 'center', marginBottom: 8 }}>Configuración (debug)</Text>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }] }>
        <Card.Title title="Configuración" subtitle="Ajustes de la cuenta y la aplicación" />
        <Divider />
        <Card.Content>
          <Text style={{ marginBottom: 8, color: theme.colors.disabled }}>Usuario: {user?.correo || 'no-session'}</Text>
          <Text style={{ marginBottom: 8, color: theme.colors.disabled }}>Rol: {user ? (user.rol || '---') : 'anon'}</Text>
          <Text style={{ marginBottom: 8, color: theme.colors.disabled }}>Teléfono: {user?.telefono || '---'}</Text>
          <Text style={{ marginBottom: 8, color: theme.colors.disabled }}>Género: {user?.genero || '---'}</Text>
          {user && user.rol === 'superadmin' && <Text style={{ marginBottom: 8, color: theme.colors.primary }}>DEBUG: eres superadmin</Text>}
          <List.Section>
            <List.Subheader>Cuenta</List.Subheader>
            <List.Item title="Editar perfil" description="Actualiza tus datos personales" onPress={() => navigation.navigate('EditProfile')} left={() => <List.Icon icon="account-outline" />} />
            <List.Item title="Cambiar contraseña" description="Actualiza tu contraseña" onPress={() => { /* implementar */ }} left={() => <List.Icon icon="lock-outline" />} />

            <Divider style={{ marginVertical: 8 }} />

            <List.Subheader>Preferencias</List.Subheader>
            <List.Item title="Tema oscuro" description="Activa o desactiva el modo oscuro" right={() => <Switch value={isDarkTheme} onValueChange={toggleTheme} />} left={() => <List.Icon icon="theme-light-dark" />} />
            <List.Item title="Notificaciones" description="Recibir alertas de reservas" right={() => <Switch value={notificationsEnabled} onValueChange={() => setNotificationsEnabled((v) => !v)} />} left={() => <List.Icon icon="bell-outline" />} />
            <List.Item title="Idioma" description={language === 'es' ? 'Español' : 'English'} onPress={() => setLanguage(language === 'es' ? 'en' : 'es')} left={() => <List.Icon icon="translate" />} />
          </List.Section>

          <Divider style={{ marginVertical: 12 }} />

          <Text style={styles.note}>Opciones avanzadas</Text>

          {canViewReports(user) && (
            <Button mode="outlined" onPress={() => navigation.navigate('Reports')} style={styles.actionBtn}>Ver reportes</Button>
          )}

          {canManageUsers(user) && (
            <Button mode="outlined" onPress={() => navigation.navigate('UserManagement')} style={styles.actionBtn}>Gestionar usuarios</Button>
          )}

          {(isAdmin(user) || isSuperAdmin(user)) && (
            <Button mode="outlined" onPress={() => navigation.navigate('Promotions')} style={[styles.actionBtn, { backgroundColor: '#F59E0B30' }]}>🎉 Gestionar Promociones</Button>
          )}

          {canViewSuperAdminStats(user) && (
            <Button mode="contained" onPress={() => navigation.navigate('SuperAdminDashboard')} style={[styles.actionBtn, { marginBottom: 8, backgroundColor: theme.colors.primary }]}>📊 Panel Super Admin</Button>
          )}

          <Button mode="outlined" onPress={() => { /* export settings */ }} style={styles.actionBtn}>Exportar configuración</Button>
          <Button mode="contained" onPress={handleLogout} style={[styles.actionBtn, { marginTop: 8 }]} buttonColor={theme.colors.error}>Cerrar sesión</Button>

        </Card.Content>
      </Card>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 12,
  },
  card: {
    padding: 0,
  },
  note: {
    marginBottom: 8,
    color: '#666',
  },
  actionBtn: {
    marginVertical: 6,
  },
});
