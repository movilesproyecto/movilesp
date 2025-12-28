import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Divider,
  Button,
  Portal,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const PrivacyScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [privacy, setPrivacy] = useState({
    profilePublic: false,
    showEmail: false,
    allowMessages: true,
    shareActivity: false,
    twoFactorAuth: false,
    emailNotifications: true,
    pushNotifications: true,
    loginAlerts: true,
  });

  // Estado para modales
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [devicesVisible, setDevicesVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  
  // Estado para formulario de cambiar contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Datos simulados de dispositivos
  const [activeDevices] = useState([
    {
      id: 1,
      name: 'iPhone 13 Pro',
      type: 'iOS',
      lastAccess: 'Hace 2 minutos',
      location: 'Quito, Ecuador',
      icon: 'mobile',
      current: true,
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'MacOS',
      lastAccess: 'Hace 1 hora',
      location: 'Quito, Ecuador',
      icon: 'laptop',
      current: false,
    },
    {
      id: 3,
      name: 'Windows PC',
      type: 'Windows',
      lastAccess: 'Hace 3 horas',
      location: 'Quito, Ecuador',
      icon: 'desktop',
      current: false,
    },
  ]);

  // Datos simulados de historial de acceso
  const [accessHistory] = useState([
    {
      id: 1,
      date: '28 Dic 2024',
      time: '11:54',
      device: 'iPhone 13 Pro',
      location: 'Quito, Ecuador',
      status: 'success',
      ip: '192.168.1.100',
    },
    {
      id: 2,
      date: '28 Dic 2024',
      time: '10:30',
      device: 'MacBook Pro',
      location: 'Quito, Ecuador',
      status: 'success',
      ip: '192.168.1.101',
    },
    {
      id: 3,
      date: '27 Dic 2024',
      time: '23:15',
      device: 'Windows PC',
      location: 'Quito, Ecuador',
      status: 'failed',
      ip: '192.168.1.102',
    },
    {
      id: 4,
      date: '27 Dic 2024',
      time: '15:45',
      device: 'iPhone 13 Pro',
      location: 'Quito, Ecuador',
      status: 'success',
      ip: '192.168.1.100',
    },
  ]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
  };

  // Funcionalidad: Cambiar contraseña
  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    Alert.alert('Éxito', 'Tu contraseña ha sido actualizada correctamente');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setChangePasswordVisible(false);
  };

  // Funcionalidad: Descargar datos
  const handleDownloadData = () => {
    Alert.alert(
      'Descargar Datos',
      'Se preparará un archivo con todos tus datos. Recibirás un email de confirmación.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Descargar',
          onPress: () => {
            Alert.alert('Éxito', 'Tu solicitud ha sido procesada. Revisa tu email en los próximos minutos.');
          },
        },
      ]
    );
  };

  const securitySections = [
    {
      title: 'Autenticación',
      items: [
        {
          icon: 'lock',
          label: 'Autenticación de Dos Factores',
          description: 'Añade una capa extra de seguridad',
          key: 'twoFactorAuth',
        },
        {
          icon: 'key',
          label: 'Cambiar Contraseña',
          description: 'Actualiza tu contraseña regularmente',
          action: true,
          onPress: () => setChangePasswordVisible(true),
        },
      ],
    },
    {
      title: 'Dispositivos y Sesiones',
      items: [
        {
          icon: 'mobile',
          label: 'Dispositivos Activos',
          description: 'Gestiona tus dispositivos conectados',
          action: true,
          onPress: () => setDevicesVisible(true),
        },
        {
          icon: 'history',
          label: 'Historial de Acceso',
          description: 'Ver intentos de inicio de sesión',
          action: true,
          onPress: () => setHistoryVisible(true),
        },
      ],
    },
    {
      title: 'Privacidad de Datos',
      items: [
        {
          icon: 'globe',
          label: 'Perfil Público',
          description: 'Otros usuarios pueden ver tu perfil',
          key: 'profilePublic',
        },
        {
          icon: 'envelope',
          label: 'Mostrar Email',
          description: 'Permite que otros vean tu correo',
          key: 'showEmail',
        },
        {
          icon: 'comments',
          label: 'Permitir Mensajes',
          description: 'Recibir mensajes de otros usuarios',
          key: 'allowMessages',
        },
        {
          icon: 'line-chart',
          label: 'Compartir Actividad',
          description: 'Mostrar tu actividad a amigos',
          key: 'shareActivity',
        },
      ],
    },
    {
      title: 'Notificaciones',
      items: [
        {
          icon: 'envelope',
          label: 'Notificaciones por Email',
          description: 'Recibir alertas importantes',
          key: 'emailNotifications',
        },
        {
          icon: 'bell',
          label: 'Notificaciones Push',
          description: 'Notificaciones en tu dispositivo',
          key: 'pushNotifications',
        },
        {
          icon: 'exclamation-circle',
          label: 'Alertas de Inicio de Sesión',
          description: 'Notificación cuando alguien accede',
          key: 'loginAlerts',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <FontAwesome
          name="shield"
          size={28}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>Privacidad y Seguridad</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Security Score */}
        <Card style={styles.scoreCard}>
          <Card.Content style={styles.scoreContent}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreValue}>85%</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={styles.scoreTitle}>Puntuación de Seguridad</Text>
              <Text style={styles.scoreDescription}>
                Tu cuenta está bien protegida. Considera activar la autenticación de dos factores.
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Security Sections */}
        {securitySections.map((section, sectionIndex) => (
          <View key={sectionIndex}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.card}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingIcon}>
                      <View
                        style={[
                          styles.iconBox,
                          {
                            backgroundColor: theme.colors.primary + '15',
                          },
                        ]}
                      >
                        <FontAwesome
                          name={item.icon}
                          size={20}
                          color={theme.colors.primary}
                        />
                      </View>
                    </View>

                    <View style={styles.settingContent}>
                      <Text style={styles.settingLabel}>
                        {item.label}
                      </Text>
                      <Text style={styles.settingDescription}>
                        {item.description}
                      </Text>
                    </View>

                    {item.key ? (
                      <Switch
                        value={privacy[item.key]}
                        onValueChange={() => handleToggle(item.key)}
                        color={theme.colors.primary}
                      />
                    ) : (
                      <TouchableOpacity onPress={item.onPress}>
                        <FontAwesome
                          name="chevron-right"
                          size={18}
                          color={theme.colors.disabled}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {itemIndex < section.items.length - 1 && (
                    <Divider />
                  )}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Data Management */}
        <Text style={styles.sectionTitle}>Gestión de Datos</Text>
        <Card style={styles.card}>
          <TouchableOpacity 
            style={styles.dangerItem}
            onPress={handleDownloadData}
          >
            <FontAwesome
              name="download"
              size={20}
              color={theme.colors.primary}
              style={{ marginRight: 12 }}
            />
            <View style={styles.dangerContent}>
              <Text style={styles.dangerLabel}>
                Descargar mis datos
              </Text>
              <Text style={styles.dangerDescription}>
                Obtén una copia de tus datos
              </Text>
            </View>
            <FontAwesome
              name="chevron-right"
              size={16}
              color={theme.colors.disabled}
            />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity
            style={styles.dangerItem}
            onPress={() =>
              Alert.alert(
                'Eliminar Cuenta',
                '¿Estás seguro? Esta acción no se puede deshacer.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () =>
                      Alert.alert(
                        'Confirmación',
                        'Tu cuenta ha sido marcada para eliminación'
                      ),
                  },
                ]
              )
            }
          >
            <FontAwesome
              name="trash"
              size={20}
              color="#F44336"
              style={{ marginRight: 12 }}
            />
            <View style={styles.dangerContent}>
              <Text style={[styles.dangerLabel, { color: '#F44336' }]}>
                Eliminar Cuenta
              </Text>
              <Text style={styles.dangerDescription}>
                Elimina permanentemente tu cuenta
              </Text>
            </View>
            <FontAwesome
              name="chevron-right"
              size={16}
              color="#F44336"
            />
          </TouchableOpacity>
        </Card>

        {/* Privacy Policy */}
        <Card style={styles.policyCard}>
          <Card.Content style={styles.policyContent}>
            <FontAwesome
              name="info-circle"
              size={20}
              color={theme.colors.primary}
              style={{ marginRight: 10 }}
            />
            <View style={styles.policyText}>
              <Text style={styles.policyTitle}>
                Política de Privacidad
              </Text>
              <Text style={styles.policyDescription}>
                Lee nuestra política completa para entender cómo protegemos tus datos
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Modal: Cambiar Contraseña */}
      <Portal>
        <Modal visible={changePasswordVisible} onDismiss={() => setChangePasswordVisible(false)} contentContainerStyle={styles.modalContent}>
          <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title="Cambiar Contraseña" />
            <Divider />
            <Card.Content style={styles.modalBody}>
              <Text style={styles.inputLabel}>Contraseña Actual</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.text }]}
                placeholder="Ingresa tu contraseña actual"
                secureTextEntry={true}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({...passwordForm, currentPassword: text})}
                placeholderTextColor={theme.colors.disabled}
              />

              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.text }]}
                placeholder="Ingresa tu nueva contraseña"
                secureTextEntry={true}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({...passwordForm, newPassword: text})}
                placeholderTextColor={theme.colors.disabled}
              />

              <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.outline, color: theme.colors.text }]}
                placeholder="Confirma tu nueva contraseña"
                secureTextEntry={true}
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({...passwordForm, confirmPassword: text})}
                placeholderTextColor={theme.colors.disabled}
              />

              <View style={styles.modalButtons}>
                <Button mode="outlined" onPress={() => setChangePasswordVisible(false)} style={{ flex: 1 }}>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={handleChangePassword} style={{ flex: 1, marginLeft: 8 }}>
                  Guardar
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>

        {/* Modal: Dispositivos Activos */}
        <Modal visible={devicesVisible} onDismiss={() => setDevicesVisible(false)} contentContainerStyle={styles.modalContent}>
          <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title="Dispositivos Activos" />
            <Divider />
            <Card.Content style={styles.modalBody}>
              {activeDevices.map((device, index) => (
                <View key={device.id}>
                  <View style={styles.deviceItem}>
                    <View style={[styles.deviceIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                      <FontAwesome name={device.icon} size={20} color={theme.colors.primary} />
                    </View>
                    <View style={styles.deviceInfo}>
                      <View style={styles.deviceNameRow}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        {device.current && <Text style={styles.currentBadge}>Este dispositivo</Text>}
                      </View>
                      <Text style={styles.deviceDetail}>{device.type} • {device.location}</Text>
                      <Text style={styles.deviceDetail}>Último acceso: {device.lastAccess}</Text>
                    </View>
                  </View>
                  {index < activeDevices.length - 1 && <Divider />}
                </View>
              ))}
              <Button mode="outlined" onPress={() => setDevicesVisible(false)} style={{ marginTop: 16 }}>
                Cerrar
              </Button>
            </Card.Content>
          </Card>
        </Modal>

        {/* Modal: Historial de Acceso */}
        <Modal visible={historyVisible} onDismiss={() => setHistoryVisible(false)} contentContainerStyle={styles.modalContent}>
          <Card style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title="Historial de Acceso" />
            <Divider />
            <Card.Content style={styles.modalBody}>
              {accessHistory.map((item, index) => (
                <View key={item.id}>
                  <View style={styles.historyItem}>
                    <View style={[styles.historyIcon, { backgroundColor: item.status === 'success' ? '#10B98115' : '#F4433615' }]}>
                      <FontAwesome 
                        name={item.status === 'success' ? 'check-circle' : 'times-circle'} 
                        size={18} 
                        color={item.status === 'success' ? '#10B981' : '#F44336'} 
                      />
                    </View>
                    <View style={styles.historyInfo}>
                      <View style={styles.historyDateRow}>
                        <Text style={styles.historyDate}>{item.date} • {item.time}</Text>
                        <Text style={[styles.historyStatus, { color: item.status === 'success' ? '#10B981' : '#F44336' }]}>
                          {item.status === 'success' ? 'Exitoso' : 'Fallido'}
                        </Text>
                      </View>
                      <Text style={styles.historyDetail}>{item.device} • {item.location}</Text>
                      <Text style={styles.historyDetail}>IP: {item.ip}</Text>
                    </View>
                  </View>
                  {index < accessHistory.length - 1 && <Divider />}
                </View>
              ))}
              <Button mode="outlined" onPress={() => setHistoryVisible(false)} style={{ marginTop: 16 }}>
                Cerrar
              </Button>
            </Card.Content>
          </Card>
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
      padding: 20,
      paddingTop: 30,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 4,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
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
    scoreCard: {
      backgroundColor: theme.colors.primary + '15',
      marginBottom: 20,
      elevation: 2,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    scoreContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    scoreCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    scoreValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    scoreInfo: {
      flex: 1,
    },
    scoreTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    scoreDescription: {
      fontSize: 12,
      color: theme.colors.disabled,
      lineHeight: 18,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 10,
      marginTop: 8,
    },
    card: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 2,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    settingIcon: {
      marginRight: 12,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
    settingDescription: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    dangerItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    dangerContent: {
      flex: 1,
      marginLeft: 12,
    },
    dangerLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
    dangerDescription: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    policyCard: {
      backgroundColor: theme.colors.primary + '10',
      marginBottom: 20,
      elevation: 2,
    },
    policyContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    policyText: {
      flex: 1,
      marginLeft: 8,
    },
    policyTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    policyDescription: {
      fontSize: 11,
      color: theme.colors.disabled,
    },
    modalContent: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 16,
    },
    modalCard: {
      maxHeight: '85%',
      width: '100%',
      borderRadius: 12,
    },
    modalBody: {
      maxHeight: 500,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 16,
    },
    inputLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 13,
    },
    deviceItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
    },
    deviceIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    deviceInfo: {
      flex: 1,
    },
    deviceNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    deviceName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
    currentBadge: {
      fontSize: 10,
      backgroundColor: theme.colors.primary + '20',
      color: theme.colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      fontWeight: '600',
    },
    deviceDetail: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
    historyItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
    },
    historyIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    historyInfo: {
      flex: 1,
    },
    historyDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    historyDate: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
    },
    historyStatus: {
      fontSize: 10,
      fontWeight: '600',
    },
    historyDetail: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 2,
    },
  });

export default PrivacyScreen;
