import React, { useMemo, useState } from 'react';
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
  useTheme,
  Divider,
  SegmentedButtons,
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggle = (key) => {
    setPrivacy({ ...privacy, [key]: !privacy[key] });
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
        },
        {
          icon: 'history',
          label: 'Historial de Acceso',
          description: 'Ver intentos de inicio de sesión',
          action: true,
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
                      <TouchableOpacity>
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
          <TouchableOpacity style={styles.dangerItem}>
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
  });

export default PrivacyScreen;
