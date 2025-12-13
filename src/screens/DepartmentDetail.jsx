import React from 'react';
import { View, ScrollView, StyleSheet, Text as RNText } from 'react-native';
import { Card, Button, Divider, Text, useTheme, Chip } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';

export default function DepartmentDetail({ route, navigation }) {
  const { department } = route.params || {};
  const theme = useTheme();
  const { canEditDepartment, user } = useAppContext();

  if (!department) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Departamento no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Galería de imágenes */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={{ padding: 0 }}>
          {department.images && department.images.length > 0 ? (
            <ImageCarousel images={department.images} />
          ) : (
            <View style={{ height: 220, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backdrop }}>
              <RNText style={{ color: theme.colors.disabled }}>Sin imágenes</RNText>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Información principal */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title={department.name} subtitle={department.address} />
        <Divider />
        <Card.Content>
          <View style={styles.infoRow}>
            <Text style={{ color: theme.colors.disabled }}>Precio por noche:</Text>
            <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>${department.pricePerNight}</Text>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <Text style={{ color: theme.colors.disabled }}>Habitaciones:</Text>
            <Text variant="titleMedium">{department.bedrooms} hab</Text>
          </View>

          {department.rating && (
            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <Text style={{ color: theme.colors.disabled }}>Valoración:</Text>
              <Text variant="titleMedium">⭐ {department.rating.toFixed(1)}</Text>
            </View>
          )}

          <Divider style={{ marginVertical: 16 }} />

          <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: '600' }}>Descripción</Text>
          <Text style={{ color: theme.colors.onSurfaceVariant, lineHeight: 20 }}>{department.description}</Text>

          {department.amenities && department.amenities.length > 0 && (
            <>
              <Divider style={{ marginVertical: 16 }} />
              <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>Amenidades</Text>
              <View style={styles.amenitiesRow}>
                {department.amenities.map((amenity, idx) => (
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
          <Button mode="contained" buttonColor={theme.colors.primary} onPress={() => navigation.navigate('ReservationForm', { department })} style={{ marginBottom: 8 }}>
            Reservar ahora
          </Button>
          {canEditDepartment(user) && (
            <Button mode="outlined" onPress={() => navigation.navigate('DepartmentForm', { department })}>
              Editar departamento
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 12, borderRadius: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
});
