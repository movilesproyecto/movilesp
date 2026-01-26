import React, { useMemo, useState, useEffect } from 'react';
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
  const { user, isSuperAdmin, registeredUsers, addUser, fetchUsers, authToken } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    role: 'user',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    if (authToken) {
      fetchUsers();
    }
  }, [authToken, fetchUsers]);

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

  const handleCreateUser = async () => {
    if (!formData.nombre.trim() || !formData.correo.trim() || !formData.password.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return;
    }

    // Validar contraseña
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const result = await addUser({
        nombre: formData.nombre,
        correo: formData.correo,
        password: formData.password,
        role: formData.role,
      });

      setLoading(false);

      if (result.success) {
        Alert.alert('Éxito', `Usuario ${formData.nombre} creado como ${formData.role}`);
        setFormData({ nombre: '', correo: '', password: '', role: 'user' });
        setShowModal(false);
        // Recargar usuarios
        fetchUsers();
      } else {
        Alert.alert('Error', result.message || 'Error al crear usuario');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message || 'Ocurrió un error al crear el usuario');
    }
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
            // TODO: Implementar delete en API
            Alert.alert('Info', 'Función de eliminar aún no implementada');
            setShowDetailModal(false);
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        {/* Info Card */}
        <View style={{ marginHorizontal: 16, marginVertical: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Card style={[styles.statCard, { backgroundColor: theme.colors.primary + '15' }]}>
              <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                  {registeredUsers.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text, marginTop: 8 }]}>
                  Total Usuarios
                </Text>
              </Card.Content>
            </Card>
            <Card style={[styles.statCard, { backgroundColor: '#4CAF5015' }]}>
              <Card.Content style={{ alignItems: 'center', padding: 16 }}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                  {registeredUsers.filter(u => u.status === 'activo').length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.text, marginTop: 8 }]}>
                  Activos
                </Text>
              </Card.Content>
            </Card>
          </View>
          <Card style={[styles.statCard, { backgroundColor: '#E91E6315' }]}>
            <Card.Content style={{ alignItems: 'center', padding: 16 }}>
              <Text style={[styles.statNumber, { color: '#E91E63' }]}>
                {registeredUsers.filter(u => u.role === 'superadmin').length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.text, marginTop: 8 }]}>
                SuperAdmins
              </Text>
            </Card.Content>
          </Card>
        </View>

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

        {registeredUsers && registeredUsers.length > 0 ? (
          registeredUsers.map((u, index) => (
            <TouchableOpacity
              key={u.id || `user-${index}`}
              onPress={() => {
                setSelectedUser(u);
                setShowDetailModal(true);
              }}
            >
              <Card style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.userCardContent}>
                  <Avatar.Text
                    size={50}
                    label={(u.nombre || 'U').substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: getRoleColor(u.role) }}
                  />
                  <View style={styles.userCardInfo}>
                    <Text style={[styles.userCardName, { color: theme.colors.text }]}>
                      {u.nombre || 'Usuario'}
                    </Text>
                    <Text style={[styles.userCardEmail, { color: theme.colors.disabled }]}>
                      {u.correo || 'N/A'}
                    </Text>
                    <View style={styles.userCardMeta}>
                      <Chip
                        label={(u.role || 'user').toUpperCase()}
                        compact
                        style={{
                          backgroundColor: getRoleColor(u.role) + '20',
                        }}
                        textStyle={{
                          color: getRoleColor(u.role),
                          fontSize: 11,
                          fontWeight: '700',
                        }}
                      />
                      <Chip
                        label={u.status || 'activo'}
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
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 40 }}>
            <FontAwesome name="users" size={40} color={theme.colors.disabled} />
            <Text style={{ color: theme.colors.disabled, marginTop: 12 }}>
              No hay usuarios registrados
            </Text>
          </View>
        )}
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
                  value={formData.correo}
                  onChangeText={(text) => setFormData({ ...formData, correo: text })}
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
                    onPress={() => setFormData({ ...formData, role: role.value })}
                    style={[
                      styles.roleOption,
                      {
                        borderColor: formData.role === role.value ? role.color : theme.colors.disabled,
                        backgroundColor: formData.role === role.value ? role.color + '10' : 'transparent',
                      },
                    ]}
                  >
                    <FontAwesome
                      name={role.icon}
                      size={20}
                      color={formData.role === role.value ? role.color : theme.colors.disabled}
                    />
                    <Text
                      style={[
                        styles.roleOptionText,
                        {
                          color: formData.role === role.value ? role.color : theme.colors.disabled,
                          fontWeight: formData.role === role.value ? '700' : '400',
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
            {selectedUser?.nombre || 'Usuario'}
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: theme.colors.disabled, marginBottom: 8 }}>
              📧 {selectedUser?.correo || 'N/A'}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 8, fontWeight: '600' }}>
              Rol: {(selectedUser?.role || 'user').toUpperCase()}
            </Text>
            <Text style={{ color: theme.colors.text, marginBottom: 12 }}>
              Estado: {selectedUser?.status || 'activo'}
            </Text>

            {selectedUser?.role === 'user' && (
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
      paddingTop: 32,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: '#37474F',
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
    statCard: {
      flex: 1,
      borderRadius: 12,
      elevation: 3,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: 20,
    },
    statItem: {
      alignItems: 'center',
      flex: 1,
      paddingVertical: 8,
    },
    statNumber: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 13,
      textAlign: 'center',
      fontWeight: '500',
    },
    statDivider: {
      width: 1,
      height: 50,
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
