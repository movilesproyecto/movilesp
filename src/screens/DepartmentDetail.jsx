import React, { useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Text as RNText, TouchableOpacity, Linking } from 'react-native';
import { Card, Button, Divider, Text, useTheme, Chip, FAB } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';

export default function DepartmentDetail({ route, navigation }) {
  const { department, id } = route.params || {};
  const theme = useTheme();
  const { canEditDepartment, user, departments, userRatings = {}, setUserRating, isFavorite, toggleFavorite, getPromotionsByDept } = useAppContext();
  const [hoverRating, setHoverRating] = useState(0);
  
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
  const userRating = userRatings?.[department_to_use.id] || 0;
  const favorited = isFavorite(department_to_use.id);
  const applicablePromotions = getPromotionsByDept(department_to_use.id);

  const handleWhatsAppContact = () => {
    const phoneNumber = '1234567890'; // Cambiar por el número real
    const message = `Hola, estoy interesado en el departamento: ${department_to_use.name}. ¿Puedes brindarme más información?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    
    Linking.openURL(whatsappUrl).catch(() => {
      // Si no tiene WhatsApp, ofrecer alternativa
      alert('WhatsApp no está instalado en tu dispositivo');
    });
  };

  const handleRating = (rating) => {
    if (setUserRating) {
      setUserRating(department_to_use.id, rating);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
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
          <Card.Title 
            title={department_to_use.name} 
            subtitle={department_to_use.address}
            right={() => (
              <TouchableOpacity 
                onPress={() => toggleFavorite(department_to_use.id)}
                style={{ paddingRight: 16 }}
              >
                <FontAwesome 
                  name={favorited ? 'heart' : 'heart-o'} 
                  size={24} 
                  color={favorited ? '#EF4444' : theme.colors.disabled}
                />
              </TouchableOpacity>
            )}
          />
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

            <Text variant="titleMedium" style={{ marginBottom: 8, fontWeight: '600' }}>Tu valoración</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => handleRating(star)}
                  onLongPress={() => setHoverRating(star)}
                  onPressOut={() => setHoverRating(0)}
                  style={styles.starButton}
                >
                  <FontAwesome 
                    name={star <= (hoverRating || userRating) ? 'star' : 'star-o'}
                    size={28}
                    color={star <= (hoverRating || userRating) ? '#FBBF24' : theme.colors.disabled}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {userRating > 0 && (
              <Text style={{ color: theme.colors.primary, marginTop: 8, fontSize: 12, fontWeight: '600' }}>
                Tu calificación: {userRating}/5 ⭐
              </Text>
            )}

            {applicablePromotions.length > 0 && (
              <>
                <Divider style={{ marginVertical: 16 }} />
                <Text variant="titleMedium" style={{ marginBottom: 12, fontWeight: '600' }}>🎉 Promociones Disponibles</Text>
                {applicablePromotions.map((promo) => (
                  <View key={promo.id} style={[styles.promotionBadge, { backgroundColor: '#F59E0B20', borderColor: '#F59E0B', borderWidth: 1 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.colors.primary, fontWeight: '700', fontSize: 13 }}>
                        {promo.title}
                      </Text>
                      <Text style={{ color: theme.colors.onSurfaceVariant, fontSize: 12, marginTop: 4 }}>
                        Código: <Text style={{ fontWeight: '700' }}>{promo.code}</Text>
                      </Text>
                    </View>
                    <View style={[styles.promoDiscount, { backgroundColor: '#F59E0B' }]}>
                      <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
                        -{promo.discount}%
                      </Text>
                    </View>
                  </View>
                ))}
              </>
            )}

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
        
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB WhatsApp - fuera del ScrollView */}
      <FAB
        icon="whatsapp"
        label="Contactar"
        style={{ position: 'absolute', right: 16, bottom: 16 }}
        onPress={handleWhatsAppContact}
        color={theme.colors.onSecondary}
        backgroundColor="#25D366"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  backButton: { marginBottom: 8, alignSelf: 'flex-start', paddingLeft: 0 },
  card: { marginBottom: 12, borderRadius: 10, marginHorizontal: 0 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  ratingContainer: { 
    flexDirection: 'row', 
    gap: 12, 
    marginVertical: 12,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  starButton: {
    padding: 6,
  },
  promotionBadge: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  promoDiscount: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 12,
  },
});
