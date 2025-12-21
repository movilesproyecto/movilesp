import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, RadioButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';

const PaymentScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { createReservation } = useAppContext();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  const reservationData = route?.params?.reservation || {};
  const department = route?.params?.department || {};

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Tarjeta de Crédito',
      description: 'Visa, MasterCard, American Express',
      icon: 'credit-card',
      color: '#3498db',
    },
    {
      id: 'debit_card',
      name: 'Tarjeta Débito',
      description: 'Tarjeta de débito de tu banco',
      icon: 'credit-card',
      color: '#2ecc71',
    },
    {
      id: 'bank_transfer',
      name: 'Transferencia Bancaria',
      description: 'Transferencia directa a la cuenta',
      icon: 'bank',
      color: '#e74c3c',
    },
    {
      id: 'mobile_payment',
      name: 'Billetera Digital',
      description: 'Apple Pay, Google Pay, Nequi',
      icon: 'mobile',
      color: '#9b59b6',
    },
    {
      id: 'cash',
      name: 'Efectivo',
      description: 'Pago en efectivo al momento',
      icon: 'money',
      color: '#f39c12',
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Advertencia', 'Por favor selecciona un método de pago');
      return;
    }

    setLoading(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      setLoading(false);

      // Crear la reserva
      const result = createReservation({
        deptId: reservationData.deptId,
        date: reservationData.date,
        time: reservationData.time,
        duration: reservationData.duration,
        paymentMethod: selectedMethod,
        status: 'confirmed',
      });

      if (result.success) {
        Alert.alert(
          'Pago realizado',
          `Tu pago con ${paymentMethods.find(m => m.id === selectedMethod)?.name} ha sido procesado exitosamente.\n\nTu reserva ha sido confirmada.`,
          [
            {
              text: 'Ver reservas',
              onPress: () => {
                navigation.navigate('Reservations');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Ocurrió un error al procesar el pago');
      }
    }, 2000);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <FontAwesome name="credit-card" size={32} color="white" />
        <Text style={styles.headerTitle}>Método de Pago</Text>
        <Text style={styles.headerSubtitle}>Selecciona cómo deseas pagar</Text>
      </View>

      {/* Resumen de la reserva */}
      <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={styles.summaryTitle}>Resumen de la reserva</Text>
          {department?.name && (
            <SummaryRow label="Departamento" value={department.name} theme={theme} />
          )}
          {reservationData?.date && (
            <SummaryRow label="Fecha" value={reservationData.date} theme={theme} />
          )}
          {reservationData?.time && (
            <SummaryRow label="Hora" value={reservationData.time} theme={theme} />
          )}
          {reservationData?.duration && (
            <SummaryRow label="Duración" value={reservationData.duration} theme={theme} />
          )}
          {department?.pricePerNight && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                Total a pagar
              </Text>
              <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
                ${department.pricePerNight.toLocaleString('es-CO')}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Métodos de pago */}
      <Text style={[styles.methodsTitle, { color: theme.colors.text }]}>
        Selecciona un método de pago
      </Text>

      <View style={styles.methodsList}>
        {paymentMethods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            isSelected={selectedMethod === method.id}
            onSelect={() => setSelectedMethod(method.id)}
            theme={theme}
          />
        ))}
      </View>

      {/* Información adicional */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.infoRow}>
            <FontAwesome name="shield" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text, marginLeft: 12 }]}>
              Tu información de pago es segura y encriptada
            </Text>
          </View>
          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <FontAwesome name="info-circle" size={20} color={theme.colors.primary} />
            <Text style={[styles.infoText, { color: theme.colors.text, marginLeft: 12 }]}>
              Este es un pago simulado para demostración
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={loading}
        >
          Volver
        </Button>
        <Button
          mode="contained"
          onPress={handlePayment}
          style={styles.payButton}
          loading={loading}
          disabled={!selectedMethod || loading}
        >
          {loading ? 'Procesando...' : 'Confirmar Pago'}
        </Button>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

// Componente para mostrar cada método de pago
const PaymentMethodCard = ({ method, isSelected, onSelect, theme }) => (
  <Card
    style={[
      styles.methodCard,
      {
        backgroundColor: theme.colors.surface,
        borderColor: isSelected ? theme.colors.primary : theme.colors.disabled,
        borderWidth: isSelected ? 2 : 1,
      },
    ]}
    onPress={onSelect}
  >
    <View style={styles.methodCardContent}>
      <View style={styles.methodLeft}>
        <View
          style={[
            styles.methodIcon,
            { backgroundColor: method.color },
          ]}
        >
          <FontAwesome name={method.icon} size={24} color="white" />
        </View>
        <View style={styles.methodTexts}>
          <Text
            style={[
              styles.methodName,
              { color: theme.colors.text },
            ]}
          >
            {method.name}
          </Text>
          <Text
            style={[
              styles.methodDescription,
              { color: theme.colors.disabled },
            ]}
          >
            {method.description}
          </Text>
        </View>
      </View>
      <RadioButton
        value={method.id}
        status={isSelected ? 'checked' : 'unchecked'}
        onPress={onSelect}
        color={theme.colors.primary}
      />
    </View>
  </Card>
);

// Componente para mostrar filas del resumen
const SummaryRow = ({ label, value, theme }) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, { color: theme.colors.disabled }]}>
      {label}
    </Text>
    <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  methodsList: {
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  methodCard: {
    borderRadius: 12,
    marginBottom: 0,
  },
  methodCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodTexts: {
    flex: 1,
  },
  methodName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 12,
  },
  infoCard: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
  },
  payButton: {
    flex: 1,
  },
});

export default PaymentScreen;
