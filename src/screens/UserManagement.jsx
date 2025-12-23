import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Alert,
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
  Divider,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const UserManagement = ({ navigation }) => {
  const theme = useTheme();
  const { user, isSuperAdmin } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'user',
  });
  const [users, setUsers] = useState([
    { id: 1, nombre: 'Johan Gamer', email: 'johan11gamerez@gmail.com', rol: 'user', status: 'activo' },
    { id: 2, nombre: 'Admin Demo', email: 'admin@demo.com', rol: 'admin', status: 'activo' },
    { id: 3, nombre: 'Root System', email: 'root@demo.com', rol: 'superadmin', status: 'activo' },
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Verificar permisos
  if (!isSuperAdmin(user)) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <FontAwesome name="lock" size={50} color={theme.colors.disabled} />
          <Text style={[styles.deniedText, { color: theme.colors.text }]}>
            Acceso Denegado
          </Text>
          <Text style={[styles.deniedSubtext, { color: theme.colors.disabled }]}>
            Solo SuperAdmin puede acceder
          </Text>
        </View>
      </View>
    );
  }

  const handleCreateUser = () => {
    if (!formData.nombre.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newUser = {
      id: users.length + 1,
      nombre: formData.nombre,
      email: formData.email,
      rol: formData.rol,
      status: 'activo',
    };

    setUsers([...users, newUser]);
    setFormData({ nombre: '', email: '', password: '', rol: 'user' });
    setShowModal(false);
    Alert.alert('Éxito', `Usuario ${newUser.nombre} creado con rol ${newUser.rol}`);
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            setUsers(users.filter(u => u.id !== userId));
            setShowDetailModal(false);
            Alert.alert('Éxito', 'Usuario eliminado correctamente');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case 'superadmin':
        return '#E91E63';
      case 'admin':
        return '#FF9800';
      case 'user':
        return '#4CAF50';
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
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Info Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {users.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
                  Total Usuarios
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                  {users.filter(u => u.status === 'activo').length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
                  Activos
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#E91E63' }]}>
                  {users.filter(u => u.rol === 'superadmin').length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.disabled }]}>
                  SuperAdmins
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Botón Crear Usuario */}
        <Button
          mode="contained"
          onPress={() => setShowModal(true)}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
          icon="plus"
        >
          Crear Nuevo Usuario
        </Button>

        {/* Lista de Usuarios */}
        <Text style={[styles.usersTitle, { color: theme.colors.text }]}>
          Usuarios del Sistema
        </Text>

        {users.map((u) => (
          <TouchableOpacity
            key={u.id}
            onPress={() => {
              setSelectedUser(u);
              setShowDetailModal(true);
            }}
          >
            <Card style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.userCardContent}>
                <Avatar.Text
                  size={50}
                  label={u.nombre.substring(0, 2).toUpperCase()}
                  style={{ backgroundColor: getRoleColor(u.rol) }}
                />
                <View style={styles.userCardInfo}>
                  <Text style={[styles.userCardName, { color: theme.colors.text }]}>
                    {u.nombre}
                  </Text>
                  <Text style={[styles.userCardEmail, { color: theme.colors.disabled }]}>
                    {u.email}
                  </Text>
                  <View style={styles.userCardMeta}>
                    <Chip
                      label={u.rol.toUpperCase()}
                      compact
                      style={{
                        backgroundColor: getRoleColor(u.rol) + '20',
                      }}
                      textStyle={{
                        color: getRoleColor(u.rol),
                        fontSize: 11,
                        fontWeight: '700',
                      }}
                    />
                    <Chip
                      label={u.status}
                      compact
                      style={{
                        backgroundColor: '#4CAF5020',
                      }}
                      textStyle={{
                        color: '#4CAF50',
                        fontSize: 11,
                      }}
                    />
                  </View>
                </View>
                <FontAwesome
                  name="chevron-right"
                  size={16}
                  color={theme.colors.disabled}
                />
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Crear Usuario */}
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={[styles.modalContent, { backgroundColor: theme.colors.background }]}
        >
          <View style={[styles.modalHeader, { backgroundColor: theme.colors.primary }]}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Crear Usuario</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalScroll}>
            {/* Nombre */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                Nombre Completo
              </Text>
              <View style={[styles.formInput, { borderColor: theme.colors.primary }]}>
                <RNTextInput
                  placeholder="Juan Pérez"
                  placeholderTextColor={theme.colors.disabled}
                  value={formData.nombre}
                  onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                  style={{ color: theme.colors.text }}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                Correo Electrónico
              </Text>
              <View style={[styles.formInput, { borderColor: theme.colors.primary }]}>
                <RNTextInput
                  placeholder="usuario@ejemplo.com"
                  placeholderTextColor={theme.colors.disabled}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  style={{ color: theme.colors.text }}
                />
              </View>
            </View>

            {/* Contraseña */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                Contraseña
              </Text>
              <View style={[styles.formInput, { borderColor: theme.colors.primary }]}>
                <RNTextInput
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.disabled}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry
                  style={{ color: theme.colors.text }}
                />
              </View>
            </View>

            {/* Rol */}
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                Rol del Usuario
              </Text>
              <View style={styles.roleSelector}>
                {[
                  { value: 'user', label: 'Usuario Regular', icon: 'user', color: '#4CAF50' },
                  { value: 'admin', label: 'Administrador', icon: 'cog', color: '#FF9800' },
                  { value: 'superadmin', label: 'Super Admin', icon: 'shield', color: '#E91E63' },
                ].map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    onPress={() => setFormData({ ...formData, rol: role.value })}
                    style={[
                      styles.roleOption,
                      {
                        borderColor: formData.rol === role.value ? role.color : theme.colors.disabled,
                        backgroundColor: formData.rol === role.value ? role.color + '10' : 'transparent',
                      },
                    ]}
                  >
                    <FontAwesome
                      name={role.icon}
                      size={20}
                      color={formData.rol === role.value ? role.color : theme.colors.disabled}
                    />
                    <Text
                      style={[
                        styles.roleOptionText,
                        {
                          color: formData.rol === role.value ? role.color : theme.colors.disabled,
                          fontWeight: formData.rol === role.value ? '700' : '400',
                        },
                      ]}
                    >
                      {role.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Botones */}
            <View style={styles.formButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowModal(false)}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleCreateUser}
                style={{ flex: 1 }}
              >
                Crear
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {/* Modal Detalle Usuario */}
      <Portal>
        <Dialog
          visible={showDetailModal}
          onDismiss={() => setShowDetailModal(false)}
          style={{ backgroundColor: theme.colors.background }}
        >
          <Dialog.Title style={{ color: theme.colors.text }}>
            {selectedUser?.nombre}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.disabled, marginBottom: 8 }}>
              📧 {selectedUser?.email}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 8, fontWeight: '600' }}>
              Rol: {selectedUser?.rol?.toUpperCase()}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
              Estado: {selectedUser?.status}
            </Text>

            {selectedUser?.rol === 'user' && (
              <View style={{ backgroundColor: '#FFF3E0', padding: 8, borderRadius: 6, marginBottom: 12 }}>
                <Text style={{ color: '#E65100', fontSize: 12 }}>
                  💡 Puedes cambiar el rol de este usuario a Admin o SuperAdmin
                </Text>
              </View>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDetailModal(false)}>Cerrar</Button>
            {selectedUser?.rol !== 'superadmin' && (
              <Button
                mode="contained"
                buttonColor="#FF6B6B"
                onPress={() => handleDeleteUser(selectedUser?.id)}
              >
                Eliminar
              </Button>
            )}
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
      flex: 1,
      marginLeft: 12,
    },
    deniedText: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 12,
    },
    deniedSubtext: {
      fontSize: 14,
      marginTop: 6,
    },
    card: {
      marginHorizontal: 16,
      marginVertical: 12,
      borderRadius: 12,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      textAlign: 'center',
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: '#E0E0E0',
    },
    createButton: {
      marginHorizontal: 16,
      marginVertical: 12,
      borderRadius: 8,
    },
    createButtonContent: {
      paddingVertical: 8,
    },
    usersTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginHorizontal: 16,
      marginVertical: 12,
    },
    userCard: {
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
    },
    userCardContent: {
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
      gap: 12,
    },
    userCardInfo: {
      flex: 1,
    },
    userCardName: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    userCardEmail: {
      fontSize: 12,
      marginBottom: 6,
    },
    userCardMeta: {
      flexDirection: 'row',
      gap: 6,
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      margin: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    modalScroll: {
      padding: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    formInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    roleSelector: {
      gap: 8,
    },
    roleOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      borderWidth: 2,
      gap: 12,
    },
    roleOptionText: {
      fontSize: 13,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
      marginVertical: 20,
      marginBottom: 40,
    },
  });

export default UserManagement;
