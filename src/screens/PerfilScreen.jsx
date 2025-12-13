import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text, Divider, Button, IconButton, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';

export default function PerfilScreen() {
  const { user, logout, roleLabel } = useAppContext();
  const navigation = useNavigation();
  const theme = useTheme();

  const nombre = user?.nombre || 'Usuario';
  const inicial = nombre?.[0] ? nombre[0].toUpperCase() : 'U';

  const stats = {
    reservas: 12,
    asistencias: 48,
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }] }>
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }] }>
        <Card.Content style={styles.headerContent}>
          <View style={styles.avatarWrap}>
            <Avatar.Text size={88} label={inicial} />
          </View>
          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={styles.name}>{nombre}</Text>
            <Text style={[styles.role, { color: theme.colors.disabled }]}>{roleLabel(user)}</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: theme.colors.onSurface || theme.colors.text }]}>Correo: </Text>
              <Text style={[styles.metaValue, { color: theme.colors.onSurface || theme.colors.text }]}>{user?.correo || '-'}</Text>
            </View>
            <View style={styles.actionsRow}>
              <Button mode="contained" onPress={() => navigation.navigate('ConfiguracionMain', { screen: 'EditProfile' })} compact>Editar perfil</Button>
              <IconButton icon="logout-variant" onPress={() => { logout(); navigation.replace('Login'); }} accessibilityLabel="Cerrar sesión" />
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.cardsRow}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.reservas}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>Reservas</Text>
          </Card.Content>
        </Card>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={styles.statNumber}>{stats.asistencias}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>Asistencias</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }] }>
        <Card.Title title="Información" />
        <Divider />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.disabled }]}>Departamento</Text>
            <Text style={styles.infoValue}>{user?.departamento || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.disabled }]}>Teléfono</Text>
            <Text style={styles.infoValue}>{user?.telefono || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.disabled }]}>Fecha de ingreso</Text>
            <Text style={styles.infoValue}>{user?.ingreso || '-'}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => navigation.navigate('ConfiguracionMain')}>Cambiar contraseña</Button>
          <Button onPress={() => navigation.navigate('ConfiguracionMain')}>Ajustes</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  headerCard: { borderRadius: 12, marginBottom: 12 },
  headerContent: { flexDirection: 'row', alignItems: 'center' },
  avatarWrap: { marginRight: 12 },
  userInfo: { flex: 1 },
  name: { fontWeight: '700' },
  role: { marginTop: 4 },
  metaRow: { flexDirection: 'row', marginTop: 8, alignItems: 'center' },
  metaLabel: { fontWeight: '600' },
  metaValue: {},
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  cardsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  statCard: { flex: 1, marginHorizontal: 4, borderRadius: 10 },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { marginTop: 4 },
  infoCard: { borderRadius: 10, paddingBottom: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: {},
  infoValue: { fontWeight: '600' },
});
