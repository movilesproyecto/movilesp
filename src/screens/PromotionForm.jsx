import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { Card, Button, Text, useTheme, TextInput, Checkbox } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function PromotionForm({ route, navigation }) {
  const theme = useTheme();
  const { departments, addPromotion, updatePromotion } = useAppContext();
  const promotion = route?.params?.promotion;

  const [title, setTitle] = useState(promotion?.title || '');
  const [description, setDescription] = useState(promotion?.description || '');
  const [code, setCode] = useState(promotion?.code || '');
  const [discount, setDiscount] = useState(promotion?.discount?.toString() || '');
  const [startDate, setStartDate] = useState(promotion?.startDate || '');
  const [endDate, setEndDate] = useState(promotion?.endDate || '');
  const [selectedDepts, setSelectedDepts] = useState(promotion?.applicableDepts || []);

  const handleToggleDept = (deptId) => {
    if (selectedDepts.includes(deptId)) {
      setSelectedDepts(selectedDepts.filter(id => id !== deptId));
    } else {
      setSelectedDepts([...selectedDepts, deptId]);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !code.trim() || !discount.trim() || selectedDepts.length === 0) {
      alert('Por favor completa todos los campos');
      return;
    }

    const promotionData = {
      title,
      description,
      code: code.toUpperCase(),
      discount: parseInt(discount),
      startDate,
      endDate,
      applicableDepts: selectedDepts,
    };

    if (promotion) {
      updatePromotion(promotion.id, promotionData);
    } else {
      addPromotion(promotionData);
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" />
      
      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        <Button onPress={() => navigation.goBack()} style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
          ← Volver
        </Button>

        <Text variant="headlineSmall" style={{ fontWeight: '700', marginBottom: 20 }}>
          {promotion ? '✏️ Editar Promoción' : '🎉 Nueva Promoción'}
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <TextInput
              label="Título de la Promoción"
              value={title}
              onChangeText={setTitle}
              placeholder="Ej: Descuento Fin de Año"
              style={[styles.input, { backgroundColor: theme.colors.background }]}
              placeholderTextColor={theme.colors.disabled}
            />

            <TextInput
              label="Descripción"
              value={description}
              onChangeText={setDescription}
              placeholder="Ej: 20% descuento en todas las reservas"
              multiline
              numberOfLines={3}
              style={[styles.input, { backgroundColor: theme.colors.background, marginTop: 12 }]}
              placeholderTextColor={theme.colors.disabled}
            />

            <TextInput
              label="Código Promocional"
              value={code}
              onChangeText={setCode}
              placeholder="Ej: YEAR20"
              style={[styles.input, { backgroundColor: theme.colors.background, marginTop: 12 }]}
              placeholderTextColor={theme.colors.disabled}
            />

            <TextInput
              label="Descuento (%)"
              value={discount}
              onChangeText={setDiscount}
              placeholder="Ej: 20"
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: theme.colors.background, marginTop: 12 }]}
              placeholderTextColor={theme.colors.disabled}
            />

            <TextInput
              label="Fecha Inicio (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
              placeholder="Ej: 2025-12-01"
              style={[styles.input, { backgroundColor: theme.colors.background, marginTop: 12 }]}
              placeholderTextColor={theme.colors.disabled}
            />

            <TextInput
              label="Fecha Fin (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
              placeholder="Ej: 2025-12-31"
              style={[styles.input, { backgroundColor: theme.colors.background, marginTop: 12 }]}
              placeholderTextColor={theme.colors.disabled}
            />
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={{ fontWeight: '700', marginTop: 20, marginBottom: 12 }}>
          📍 Departamentos Aplicables
        </Text>

        {departments.map((dept) => (
          <Card key={dept.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text variant="titleSmall" style={{ fontWeight: '600' }}>
                  {dept.name}
                </Text>
                <Text style={{ color: theme.colors.disabled, fontSize: 12 }}>
                  ${dept.pricePerNight}/noche
                </Text>
              </View>
              <Checkbox
                status={selectedDepts.includes(dept.id) ? 'checked' : 'unchecked'}
                onPress={() => handleToggleDept(dept.id)}
                color={theme.colors.primary}
              />
            </Card.Content>
          </Card>
        ))}

        <Button 
          mode="contained" 
          buttonColor={theme.colors.primary}
          onPress={handleSave}
          style={{ marginTop: 20, marginBottom: 30 }}
        >
          {promotion ? 'Actualizar Promoción' : 'Crear Promoción'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  card: { 
    marginBottom: 12, 
    borderRadius: 10,
  },
  input: {
    height: 50,
  },
});
