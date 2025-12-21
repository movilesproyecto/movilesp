import React from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { Card, Button, Divider, Text, useTheme, Chip } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';

export default function DepartmentDetail({ route, navigation }) {
  const { department, id } = route.params || {};
  const theme = useTheme();
  const { canEditDepartment, user, departments } = useAppContext();
  
  // Si no viene departamento en params, buscarlo por ID
  const dept = department || (id ? departments.find(d => d.id === id) : null);

  if (!dept) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Button onPress={() => navigation.goBack()} style={{ marginBottom: 12 }}>← Volver</Button>
        <Text style={{ color: theme.colors.text }}>Departamento no encontrado</Text>
      </View>
    );
  }
  
  const department_to_use = dept;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Botón volver */}
      <Button
        mode="text"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        ← Volver
      </Button>

      {/* Galería de imágenes */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={{ padding: 0 }}>
          {department_to_use.images && department_to_use.images.length > 0 ? (
            <ImageCarousel images={department_to_use.images} />
          ) : (
            <View style={{ height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backdrop }}>
              <RNText style={{ color: theme.colors.disabled }}>Sin imágenes</RNText>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Información principal */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title={department_to_use.name} subtitle={department_to_use.address} />
        <Divider />
        <Card.Content>
          <View style={styles.priceRow}>
            <Text style={{ color: theme.colors.disabled }}>Precio por noche</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>${department_to_use.pricePerNight}</Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <View>
              <Text style={{ color: theme.colors.disabled, fontSize: 12 }}>Habitaciones</Text>
              <Text variant="titleMedium" style={{ marginTop: 4, fontWeight: '600' }}>{department_to_use.bedrooms} hab</Text>
            </View>
            {department_to_use.rating && (
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: theme.colors.disabled, fontSize: 12 }}>Valoración</Text>
                <Text variant="titleMedium" style={{ marginTop: 4, fontWeight: '600' }}>⭐ {department_to_use.rating.toFixed(1)}/5</Text>
              </View>
            )}
          </View>

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: '600' }}>Descripción</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>{department_to_use.description}</Text>

          {department_to_use.amenities && department_to_use.amenities.length > 0 && (
            <>
              <Divider style={{ marginVertical: 16 }} />
              <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>Amenidades</Text>
              <View style={styles.amenitiesRow}>
                {department_to_use.amenities.map((amenity, idx) => (
                  <Chip key={idx} icon="check-circle-outline" mode="outlined" style={{ marginRight: 8, marginBottom: 8 }}>
                    {amenity}
                  </Chip>
                ))}
              </View>
            </>
          )}
        </Card.Content>
      </Card>

      {/* Botones de acción */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Button mode="contained" buttonColor={theme.colors.primary} onPress={() => navigation.navigate('ReservationForm', { department: department_to_use })} style={{ marginBottom: 8 }}>
            Reservar ahora
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate('Reviews', { departmentId: department_to_use.id })} style={{ marginBottom: 8 }}>
            Ver Reseñas
          </Button>
          {canEditDepartment(user) && (
            <Button mode="outlined" onPress={() => navigation.navigate('DepartmentForm', { department: department_to_use })}>
              Editar departamento
            </Button>
          )}
        </Card.Content>
      </Card>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  backButton: { marginBottom: 8, alignSelf: 'flex-start' },
  card: { marginBottom: 12, borderRadius: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
