import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Chip,
  Button,
  Divider,
  Avatar,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const SearchScreen = ({ navigation }) => {
  const theme = useTheme();
  const { departments } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState('0');
  const [maxPrice, setMaxPrice] = useState('10000');
  const [minRating, setMinRating] = useState('0');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  const allAmenities = ['WiFi', 'Cocina', 'A/C', 'TV', 'Lavadora', 'Estacionamiento', 'Jardín'];

  // Filtrar y ordenar departamentos
  const filteredDepartments = useMemo(() => {
    let result = departments.filter((dept) => {
      const matchesSearch = dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = dept.pricePerNight >= parseInt(minPrice) && dept.pricePerNight <= parseInt(maxPrice);
      const matchesRating = dept.rating >= parseFloat(minRating);
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.some(amenity => dept.amenities?.includes(amenity));

      return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
    });

    // Ordenar
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.pricePerNight - b.pricePerNight;
        case 'price-desc':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [searchQuery, minPrice, maxPrice, minRating, selectedAmenities, sortBy, departments]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Departamentos</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Búsqueda */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.label, { color: theme.colors.text }]}>Buscar</Text>
            <View style={[styles.searchInput, { borderColor: theme.colors.primary }]}>
              <FontAwesome name="search" size={16} color={theme.colors.disabled} />
              <RNTextInput
                placeholder="Nombre, ubicación..."
                placeholderTextColor={theme.colors.disabled}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Filtro de Precio */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.label, { color: theme.colors.text }]}>Rango de Precio</Text>
            <View style={styles.priceRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[styles.smallLabel, { color: theme.colors.disabled }]}>Mínimo</Text>
                <View style={[styles.priceInput, { borderColor: theme.colors.primary }]}>
                  <RNTextInput
                    placeholder="0"
                    placeholderTextColor={theme.colors.disabled}
                    value={minPrice}
                    onChangeText={setMinPrice}
                    keyboardType="numeric"
                    style={{ flex: 1, color: theme.colors.text }}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.smallLabel, { color: theme.colors.disabled }]}>Máximo</Text>
                <View style={[styles.priceInput, { borderColor: theme.colors.primary }]}>
                  <RNTextInput
                    placeholder="10000"
                    placeholderTextColor={theme.colors.disabled}
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                    keyboardType="numeric"
                    style={{ flex: 1, color: theme.colors.text }}
                  />
                </View>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Calificación Mínima */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.label, { color: theme.colors.text }]}>Calificación Mínima</Text>
            <View style={styles.ratingSelector}>
              {[0, 3, 3.5, 4, 4.5, 5].map((rating) => (
                <TouchableOpacity
                  key={rating}
                  onPress={() => setMinRating(rating.toString())}
                  style={[
                    styles.ratingBtn,
                    minRating === rating.toString() && styles.ratingBtnActive,
                    { borderColor: theme.colors.primary }
                  ]}
                >
                  <Text style={[
                    styles.ratingBtnText,
                    minRating === rating.toString() && { color: 'white' }
                  ]}>
                    {rating === 0 ? 'Todo' : rating}⭐
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Amenidades */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.label, { color: theme.colors.text }]}>Amenidades</Text>
            <View style={styles.amenitiesGrid}>
              {allAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  selected={selectedAmenities.includes(amenity)}
                  onPress={() => toggleAmenity(amenity)}
                  style={styles.amenityChip}
                  mode={selectedAmenities.includes(amenity) ? 'flat' : 'outlined'}
                >
                  {amenity}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Ordenamiento */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.label, { color: theme.colors.text }]}>Ordenar por</Text>
            <View style={styles.sortOptions}>
              {[
                { value: 'name', label: 'Nombre' },
                { value: 'price-asc', label: 'Precio ↑' },
                { value: 'price-desc', label: 'Precio ↓' },
                { value: 'rating', label: 'Calificación' },
              ].map((option) => (
                <Chip
                  key={option.value}
                  selected={sortBy === option.value}
                  onPress={() => setSortBy(option.value)}
                  style={{ marginRight: 8, marginBottom: 8 }}
                  mode={sortBy === option.value ? 'flat' : 'outlined'}
                >
                  {option.label}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Resultados */}
        <Text style={[styles.resultsTitle, { color: theme.colors.text }]}>
          {filteredDepartments.length} resultado{filteredDepartments.length !== 1 ? 's' : ''}
        </Text>

        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept) => (
            <TouchableOpacity
              key={dept.id}
              onPress={() => navigation.navigate('DepartmentDetail', { departmentId: dept.id })}
            >
              <Card style={[styles.resultCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.resultContent}>
                  <Avatar.Image
                    size={80}
                    source={{ uri: dept.images?.[0] || 'https://via.placeholder.com/80' }}
                  />
                  <View style={styles.resultInfo}>
                    <Text style={[styles.resultName, { color: theme.colors.text }]}>{dept.name}</Text>
                    <View style={styles.resultMeta}>
                      <FontAwesome name="map-marker" size={12} color={theme.colors.disabled} />
                      <Text style={[styles.resultLocation, { color: theme.colors.disabled }]}>
                        {dept.address}
                      </Text>
                    </View>
                    <View style={styles.resultBottom}>
                      <Text style={[styles.resultPrice, { color: theme.colors.primary }]}>
                        ${dept.pricePerNight}
                      </Text>
                      <View style={styles.ratingBadge}>
                        <FontAwesome name="star" size={12} color="#FFB800" />
                        <Text style={styles.ratingValue}>{dept.rating}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Card style={[styles.emptyCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={styles.emptyContent}>
              <FontAwesome name="inbox" size={40} color={theme.colors.disabled} />
              <Text style={[styles.emptyText, { color: theme.colors.disabled }]}>
                No se encontraron departamentos
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      gap: 12,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      flex: 1,
    },
    card: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 12,
    },
    smallLabel: {
      fontSize: 12,
      marginBottom: 6,
    },
    searchInput: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      gap: 8,
    },
    priceInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
    },
    input: {
      flex: 1,
      fontSize: 14,
    },
    priceRow: {
      flexDirection: 'row',
    },
    ratingSelector: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    ratingBtn: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
    },
    ratingBtnActive: {
      backgroundColor: '#FFB800',
      borderColor: '#FFB800',
    },
    ratingBtnText: {
      fontSize: 12,
      fontWeight: '600',
    },
    amenitiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    amenityChip: {
      marginBottom: 8,
    },
    sortOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    resultsTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginHorizontal: 16,
      marginVertical: 12,
    },
    resultCard: {
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
    },
    resultContent: {
      flexDirection: 'row',
      padding: 12,
      gap: 12,
    },
    resultInfo: {
      flex: 1,
      justifyContent: 'space-between',
    },
    resultName: {
      fontSize: 14,
      fontWeight: '600',
    },
    resultMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    resultLocation: {
      fontSize: 12,
    },
    resultBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
    },
    resultPrice: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#FFF3E0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    ratingValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#E65100',
    },
    emptyCard: {
      marginHorizontal: 16,
      marginVertical: 20,
      borderRadius: 12,
    },
    emptyContent: {
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 14,
      marginTop: 12,
    },
  });

export default SearchScreen;
