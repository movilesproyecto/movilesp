import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Divider,
  Badge,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const NotificationsScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleBack = () => {
    navigation.goBack();
  };

  const notifications = [
    {
      id: 1,
      title: 'Reserva Confirmada',
      message: 'Tu reserva en Departamento Premium ha sido confirmada',
      timestamp: 'Hace 2 horas',
      type: 'success',
      icon: 'check-circle',
      read: false,
    },
    {
      id: 2,
      title: 'Nueva Disponibilidad',
      message: 'El departamento que te interesaba ahora está disponible',
      timestamp: 'Hace 5 horas',
      type: 'info',
      icon: 'bell',
      read: false,
    },
    {
      id: 3,
      title: 'Pago Recibido',
      message: 'Tu pago de $150,000 ha sido procesado correctamente',
      timestamp: 'Hace 1 día',
      type: 'success',
      icon: 'check-circle',
      read: true,
    },
    {
      id: 4,
      title: 'Recordatorio de Reserva',
      message: 'Tu reserva vence en 3 días. Recuerda confirmar tu llegada',
      timestamp: 'Hace 2 días',
      type: 'warning',
      icon: 'exclamation-circle',
      read: true,
    },
    {
      id: 5,
      title: 'Reseña Completada',
      message: 'Completa una reseña del departamento donde te hospedaste',
      timestamp: 'Hace 3 días',
      type: 'info',
      icon: 'star',
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'error':
        return '#F44336';
      case 'info':
      default:
        return theme.colors.primary;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        {notifications.length > 0 ? (
          <Card style={styles.card}>
            {notifications.map((notification, index) => (
              <View key={notification.id}>
                <TouchableOpacity
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.unreadItem,
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          getTypeColor(notification.type) + '20',
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
                    <Text style={styles.message}>
                      {notification.message}
                    </Text>
                    <Text style={styles.timestamp}>
                      {notification.timestamp}
                    </Text>
                  </View>
                </TouchableOpacity>
                {index < notifications.length - 1 && <Divider />}
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
              No tienes notificaciones
            </Text>
            <Text style={styles.emptySubText}>
              Te notificaremos sobre cambios importantes
            </Text>
          </View>
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
      padding: 20,
      paddingTop: 30,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      elevation: 4,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    badge: {
      backgroundColor: '#FF5252',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    card: {
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
      elevation: 2,
    },
    notificationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    unreadItem: {
      backgroundColor: theme.colors.primary + '08',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    notificationContent: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    unreadTitle: {
      fontWeight: 'bold',
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 16,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.disabled,
      marginTop: 8,
      textAlign: 'center',
    },
  });

export default NotificationsScreen;
