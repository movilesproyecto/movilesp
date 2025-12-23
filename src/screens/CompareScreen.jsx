import React, { useMemo } from 'react';
import { View, ScrollView, StyleSheet, Image, FlatList, StatusBar } from 'react-native';
import { Text, Button, Card, useTheme, Chip } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

export default function CompareScreen({ navigation }) {
  const theme = useTheme();
  const { departments, selectedDepts, toggleDeptComparison, clearComparison } = useAppContext();

  const selectedDepartments = useMemo(() => {
    return departments.filter(d => selectedDepts.includes(d.id));
  }, [departments, selectedDepts]);

  if (selectedDepts.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 20 }]}>
          <FontAwesome name="exchange" size={28} color="white" />
          <Text style={styles.headerTitle}>Comparar Departamentos</Text>
        </View>
        
        <View style={styles.emptyState}>
          <FontAwesome name="inbox" size={64} color={theme.colors.disabled} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>Selecciona departamentos para comparar</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.placeholder }]}>Puedes comparar hasta 3 departamentos a la vez</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('DepartmentsList')}
            style={{ marginTop: 20 }}
          >
            Ir a Departamentos
          </Button>
        </View>
      </View>
    );
  }

  const comparisonFields = [
    { label: 'Precio/Noche', key: 'pricePerNight', format: (v) => `$${v}` },
    { label: 'Habitaciones', key: 'bedrooms', format: (v) => `${v} hab` },
    { label: 'Rating', key: 'rating', format: (v) => `⭐ ${v}` },
    { label: 'Descripción', key: 'description', format: (v) => v },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 20 }]}>
        <FontAwesome name="exchange" size={28} color="white" />
        <Text style={styles.headerTitle}>Comparar ({selectedDepts.length})</Text>
      </View>

      <ScrollView horizontal style={styles.compareTable}>
        {/* Primera columna: etiquetas */}
        <View style={{ paddingHorizontal: 8 }}>
          <View style={[styles.fieldCell, { backgroundColor: theme.colors.surfaceVariant, minWidth: 120 }]}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>Característica</Text>
          </View>
          {comparisonFields.map((field) => (
            <View key={field.key} style={[styles.fieldCell, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.outline, borderBottomWidth: 1 }]}>
              <Text style={[styles.fieldName, { color: theme.colors.text }]}>{field.label}</Text>
            </View>
          ))}
        </View>

        {/* Columnas de departamentos */}
        {selectedDepartments.map((dept) => (
          <View key={dept.id} style={{ paddingHorizontal: 8 }}>
            {/* Header con imagen y nombre */}
            <View style={[styles.deptColumn, { backgroundColor: theme.colors.surfaceVariant, borderTopColor: theme.colors.primary, borderTopWidth: 3, minWidth: 140 }]}>
              {dept.images && dept.images[0] ? (
                <Image source={{ uri: dept.images[0] }} style={styles.deptImage} />
              ) : (
                <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.outline }]} />
              )}
              <Text style={[styles.deptName, { color: theme.colors.text }]} numberOfLines={2}>{dept.name}</Text>
              <Button 
                size="small"
                mode="outlined"
                onPress={() => toggleDeptComparison(dept.id)}
                style={{ marginTop: 8 }}
              >
                Quitar
              </Button>
            </View>

            {/* Filas de datos */}
            {comparisonFields.map((field) => (
              <View 
                key={field.key} 
                style={[
                  styles.fieldCell, 
                  { 
                    backgroundColor: theme.colors.surface,
                    borderBottomColor: theme.colors.outline, 
                    borderBottomWidth: 1,
                    minWidth: 140
                  }
                ]}
              >
                <Text style={[styles.fieldValue, { color: theme.colors.text }]} numberOfLines={2}>
                  {field.format(dept[field.key] || 'N/A')}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('DepartmentsList')}
          style={{ flex: 1 }}
        >
          Agregar más
        </Button>
        <Button 
          mode="outlined" 
          onPress={clearComparison}
          style={{ flex: 1, marginLeft: 8 }}
        >
          Limpiar
        </Button>
      </View>
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
  compareTable: {
    flex: 1,
    paddingVertical: 12,
  },
  deptColumn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  deptImage: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  deptName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  fieldCell: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    minHeight: 50,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  fieldName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  fieldValue: {
    fontSize: 11,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
});
