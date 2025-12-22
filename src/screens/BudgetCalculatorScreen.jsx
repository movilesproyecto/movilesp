import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Text, TextInput, Button, Card, useTheme, SegmentedButtons } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

export default function BudgetCalculatorScreen() {
  const theme = useTheme();
  const { departments } = useAppContext();
  
  const [selectedDeptId, setSelectedDeptId] = useState(departments[0]?.id || '');
  const [days, setDays] = useState('30');
  const [period, setPeriod] = useState('monthly'); // 'daily', 'weekly', 'monthly', 'yearly'

  const selectedDept = departments.find(d => d.id === selectedDeptId);
  const daysValue = parseInt(days) || 0;

  const calculations = useMemo(() => {
    if (!selectedDept || daysValue <= 0) return null;

    const nightlyRate = selectedDept.pricePerNight || 0;
    const totalCost = nightlyRate * daysValue;
    const dailyAvg = daysValue > 0 ? totalCost / daysValue : 0;
    const weeklyAvg = dailyAvg * 7;
    const monthlyAvg = dailyAvg * 30;
    const yearlyAvg = dailyAvg * 365;

    return {
      nightlyRate,
      totalCost,
      dailyAvg,
      weeklyAvg,
      monthlyAvg,
      yearlyAvg,
      daysStaying: daysValue,
    };
  }, [selectedDept, daysValue]);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 20 }]}>
        <FontAwesome name="calculator" size={28} color="white" />
        <Text style={styles.headerTitle}>Calculadora de Presupuesto</Text>
      </View>

      <View style={styles.content}>
        {/* Seleccionar departamento */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Selecciona un Departamento</Text>
            
            <ScrollView horizontal style={{ marginVertical: 12 }}>
              {departments.map((dept) => (
                <Button
                  key={dept.id}
                  mode={selectedDeptId === dept.id ? 'contained' : 'outlined'}
                  onPress={() => setSelectedDeptId(dept.id)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  compact
                >
                  {dept.name.substring(0, 15)}...
                </Button>
              ))}
            </ScrollView>

            {selectedDept && (
              <View style={[styles.deptInfo, { backgroundColor: theme.colors.surfaceVariant, borderLeftColor: theme.colors.primary, borderLeftWidth: 4 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={[styles.deptName, { color: theme.colors.text }]}>{selectedDept.name}</Text>
                    <Text style={[styles.deptAddress, { color: theme.colors.placeholder }]}>📍 {selectedDept.address}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>${selectedDept.pricePerNight}</Text>
                    <Text style={styles.priceTagSubtext}>por noche</Text>
                  </View>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Input de días */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Duración de la Estancia</Text>
            
            <TextInput
              label="Número de días"
              mode="outlined"
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
              style={{ marginVertical: 12 }}
              left={<TextInput.Icon icon="calendar-clock" color={theme.colors.primary} />}
            />

            <Text style={[styles.inputHint, { color: theme.colors.placeholder }]}>
              Ingresa cuántos días deseas hospedarte
            </Text>
          </Card.Content>
        </Card>

        {/* Resultados */}
        {calculations && (
          <Card style={[styles.card, { backgroundColor: theme.colors.primary + '15', borderColor: theme.colors.primary, borderWidth: 2 }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Desglose de Costos</Text>

              <View style={styles.resultGrid}>
                <ResultItem
                  icon="calendar"
                  label="Total Días"
                  value={calculations.daysStaying.toString()}
                  theme={theme}
                />
                <ResultItem
                  icon="dollar"
                  label="Costo Diario"
                  value={`$${calculations.dailyAvg.toFixed(2)}`}
                  theme={theme}
                />
                <ResultItem
                  icon="calendar-week-4"
                  label="Costo Semanal"
                  value={`$${calculations.weeklyAvg.toFixed(2)}`}
                  theme={theme}
                />
                <ResultItem
                  icon="calendar-month"
                  label="Costo Mensual (30 días)"
                  value={`$${calculations.monthlyAvg.toFixed(2)}`}
                  theme={theme}
                />
              </View>

              {/* Total principal */}
              <View style={[styles.totalBox, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
                <Text style={styles.totalAmount}>${calculations.totalCost.toFixed(2)}</Text>
                <Text style={styles.totalSubtext}>Por {calculations.daysStaying} noche{calculations.daysStaying !== 1 ? 's' : ''}</Text>
              </View>

              {/* Detalles adicionales */}
              <View style={[styles.detailsBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                <DetailRow label="Tarifa por noche" value={`$${calculations.nightlyRate}`} theme={theme} />
                <DetailRow label="Número de noches" value={calculations.daysStaying.toString()} theme={theme} />
                <DetailRow label="Subtotal" value={`$${calculations.totalCost.toFixed(2)}`} theme={theme} highlight />
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Mensaje cuando no hay selección */}
        {!calculations && (
          <View style={[styles.emptyCalc, { backgroundColor: theme.colors.surfaceVariant }]}>
            <FontAwesome name="info-circle" size={48} color={theme.colors.disabled} />
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>Completa los datos para ver el cálculo</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ResultItem({ icon, label, value, theme }) {
  return (
    <View style={[styles.resultItem, { backgroundColor: theme.colors.surface }]}>
      <FontAwesome name={icon} size={24} color={theme.colors.primary} />
      <Text style={[styles.resultLabel, { color: theme.colors.placeholder }]}>{label}</Text>
      <Text style={[styles.resultValue, { color: theme.colors.primary }]}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value, theme, highlight }) {
  return (
    <View style={[styles.detailRow, { borderBottomColor: theme.colors.outline, borderBottomWidth: 1, paddingVertical: 10 }]}>
      <Text style={[styles.detailLabel, { color: highlight ? theme.colors.primary : theme.colors.text, fontWeight: highlight ? '700' : '500' }]}>
        {label}
      </Text>
      <Text style={[styles.detailValue, { color: highlight ? theme.colors.primary : theme.colors.text, fontWeight: highlight ? '700' : '500' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 12,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  deptInfo: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  deptName: {
    fontSize: 14,
    fontWeight: '600',
  },
  deptAddress: {
    fontSize: 12,
    marginTop: 4,
  },
  priceTag: {
    alignItems: 'center',
  },
  priceTagText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  priceTagSubtext: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  inputHint: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 16,
  },
  resultItem: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  totalBox: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 8,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  detailsBox: {
    padding: 12,
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 13,
  },
  emptyCalc: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
  },
});
