import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { FAB, useTheme, Searchbar, Button as PaperButton, TextInput, ActivityIndicator, Collapse } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DepartmentsList({ navigation }) {
  const theme = useTheme();
  const { user, canCreateDepartment, canEditDepartment, departments, isFavorite, toggleFavorite, apiToggleFavorite, getPromotionsByDept, fetchDepartments } = useAppContext();
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState('none');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Refrescar cuando la pantalla se enfoca
  useFocusEffect(
    React.useCallback(() => {
      setPage(1);
      fetchDepartments();
    }, [fetchDepartments])
  );
  const renderItem = ({ item }) => {
    const favorited = isFavorite(item.id);
    const promotions = getPromotionsByDept(item.id);
    const bestPromo = promotions.length > 0 ? promotions.reduce((prev, curr) => curr.discount > prev.discount ? curr : prev) : null;

    return (
      <TouchableOpacity 
        style={[styles.card, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.tertiary }]} 
        onPress={() => navigation.navigate('DepartmentDetail', { department: item })}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          {item.images && item.images[0] ? (
            <Image source={{ uri: item.images[0] }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumbPlaceholder, { backgroundColor: theme.colors.surfaceVariant }]} />
          )}
          <View style={styles.badgeContainer}>
            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.badgeText}>${item.pricePerNight}</Text>
            </View>
            {item.rating && (
              <View style={[styles.ratingBadge, { backgroundColor: '#FBBF24' }]}>
                <Text style={styles.ratingText}>⭐ {item.rating}</Text>
              </View>
            )}
            {bestPromo && (
              <View style={[styles.promoBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.promoBadgeText}>-{bestPromo.discount}%</Text>
              </View>
            )}
            <TouchableOpacity 
              onPress={() => (apiToggleFavorite ? apiToggleFavorite(item.id) : toggleFavorite(item.id))}
              style={[styles.favBadge, { backgroundColor: favorited ? '#EF4444' : theme.colors.surfaceVariant }]}
            >
              <FontAwesome name={favorited ? 'heart' : 'heart-o'} size={16} color={favorited ? 'white' : theme.colors.disabled} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.subtitle, { color: theme.colors.placeholder }]}>📍 {item.address}</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoItem, { color: theme.colors.text }]}>🛏️ {item.bedrooms} hab</Text>
            <Text style={[styles.infoItem, { color: theme.colors.text }]}>🚿 {item.bathrooms || 2} baños</Text>
          </View>
          <Text style={[styles.desc, { color: theme.colors.placeholder }]} numberOfLines={2}>{item.description}</Text>
          <View style={styles.cardActions}>
            <PaperButton 
              mode="contained" 
              buttonColor={theme.colors.primary} 
              onPress={() => navigation.navigate('DepartmentDetail', { department: item })}
              style={{ flex: 1 }}
            >
              Ver detalles
            </PaperButton>
            {canEditDepartment(user) && (
              <PaperButton 
                mode="outlined" 
                onPress={() => navigation.navigate('DepartmentForm', { department: item })} 
                style={{ marginLeft: 8 }}
              >
                Editar
              </PaperButton>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (departments || []).filter((d) => {
      if (q && !(d.name.toLowerCase().includes(q) || d.address.toLowerCase().includes(q))) return false;
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Number.POSITIVE_INFINITY;
      if (d.pricePerNight < min || d.pricePerNight > max) return false;
      if (bedroomsFilter === '1' && d.bedrooms !== 1) return false;
      if (bedroomsFilter === '2' && d.bedrooms !== 2) return false;
      if (bedroomsFilter === '3' && d.bedrooms < 3) return false;
      return true;
    });
  }, [departments, query, minPrice, maxPrice, bedroomsFilter]);

  const sorted = useMemo(() => {
    const arr = [...(filtered || [])];
    if (sortBy === 'priceAsc') arr.sort((a, b) => a.pricePerNight - b.pricePerNight);
    else if (sortBy === 'priceDesc') arr.sort((a, b) => b.pricePerNight - a.pricePerNight);
    else if (sortBy === 'bedrooms') arr.sort((a, b) => b.bedrooms - a.bedrooms);
    else if (sortBy === 'rating') arr.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return arr;
  }, [filtered, sortBy]);

  const paginated = useMemo(() => sorted.slice(0, page * pageSize), [sorted, page]);

  const handleLoadMore = () => {
    if (loadingMore) return;
    if (paginated.length >= sorted.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 400);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>Departamentos (Alquiler)</Text>

      <Searchbar 
        placeholder="Buscar por nombre o dirección" 
        value={query} 
        onChangeText={setQuery} 
        style={{ marginVertical: 8 }} 
      />

      {/* Quick Sort Buttons - Compactos */}
      <View style={styles.quickSortRow}>
        <PaperButton 
          icon="currency-usd" 
          mode={sortBy === 'priceAsc' ? 'contained' : 'outlined'} 
          onPress={() => setSortBy('priceAsc')}
          compact
          size="small"
        >
          Precio ↑
        </PaperButton>
        <PaperButton 
          icon="currency-usd" 
          mode={sortBy === 'priceDesc' ? 'contained' : 'outlined'} 
          onPress={() => setSortBy('priceDesc')}
          compact
          size="small"
          style={{ marginHorizontal: 4 }}
        >
          Precio ↓
        </PaperButton>
        <PaperButton 
          icon="star-outline" 
          mode={sortBy === 'rating' ? 'contained' : 'outlined'} 
          onPress={() => setSortBy('rating')}
          compact
          size="small"
          style={{ marginHorizontal: 4 }}
        >
          Rating
        </PaperButton>
        <PaperButton 
          icon={showFilters ? "chevron-up" : "chevron-down"}
          mode="outlined"
          onPress={() => setShowFilters(!showFilters)}
          compact
          size="small"
          style={{ marginLeft: 4 }}
        >
          Más
        </PaperButton>
      </View>

      {/* Filtros expandibles */}
      {showFilters && (
        <View style={[styles.expandedFilters, { backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.outline }]}>
          {/* Page size selector */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Resultados por página:</Text>
            <View style={styles.pageSizeRow}>
              <PaperButton 
                mode={pageSize === 6 ? 'contained' : 'outlined'} 
                onPress={() => { setPageSize(6); setPage(1); }}
                compact
                size="small"
              >
                6
              </PaperButton>
              <PaperButton 
                mode={pageSize === 12 ? 'contained' : 'outlined'} 
                onPress={() => { setPageSize(12); setPage(1); }}
                compact
                size="small"
                style={{ marginHorizontal: 4 }}
              >
                12
              </PaperButton>
              <PaperButton 
                mode={pageSize === 24 ? 'contained' : 'outlined'} 
                onPress={() => { setPageSize(24); setPage(1); }}
                compact
                size="small"
              >
                24
              </PaperButton>
            </View>
          </View>

          {/* Price filters */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Rango de Precio:</Text>
            <View style={styles.priceRow}>
              <TextInput 
                mode="outlined" 
                label="Mín" 
                value={minPrice} 
                onChangeText={setMinPrice} 
                keyboardType="numeric" 
                style={styles.priceInput}
                dense
              />
              <TextInput 
                mode="outlined" 
                label="Máx" 
                value={maxPrice} 
                onChangeText={setMaxPrice} 
                keyboardType="numeric" 
                style={styles.priceInput}
                dense
              />
            </View>
          </View>

          {/* Bedrooms filter */}
          <View style={styles.filterSection}>
            <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Habitaciones:</Text>
            <View style={styles.bedroomFilterRow}>
              {['all', '1', '2', '3'].map((val) => (
                <PaperButton 
                  key={val}
                  mode={bedroomsFilter === val ? 'contained' : 'outlined'} 
                  onPress={() => setBedroomsFilter(val)}
                  compact
                  size="small"
                  style={{ marginRight: 4 }}
                >
                  {val === 'all' ? 'Todos' : val}
                </PaperButton>
              ))}
            </View>
          </View>

          {/* Clear filters */}
          <PaperButton 
            icon="filter-remove-outline"
            mode="outlined"
            onPress={() => {
              setSortBy('none');
              setMinPrice('');
              setMaxPrice('');
              setBedroomsFilter('all');
            }}
            style={{ marginTop: 8 }}
            compact
          >
            Limpiar Filtros
          </PaperButton>
        </View>
      )}

      <FlatList
        data={paginated}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          <View style={{ padding: 12, alignItems: 'center' }}>
            {loadingMore ? <ActivityIndicator animating={true} color={theme.colors.primary} /> : (paginated.length < sorted.length ? <Text style={{ color: theme.colors.disabled }}>Cargando más...</Text> : <Text style={{ color: theme.colors.disabled }}>No hay más resultados</Text>)}
          </View>
        )}
      />

      {canCreateDepartment(user) && (
        <FAB icon="plus" style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom }} onPress={() => navigation.navigate('DepartmentForm')} />
      )}
      
      <FAB 
        icon="calculator" 
        style={{ position: 'absolute', right: 16, bottom: 75 + insets.bottom }} 
        onPress={() => navigation.navigate('BudgetCalculator')}
        label="Presupuesto"
      />
      
      <FAB 
        icon="shuffle" 
        style={{ position: 'absolute', right: 16, bottom: 135 + insets.bottom }} 
        onPress={() => navigation.navigate('Compare')}
        label="Comparar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 20,
  },
  header: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 12,
    marginTop: 0
  },
  quickSortRow: {
    flexDirection: 'row',
    marginVertical: 8,
    gap: 4,
  },
  expandedFilters: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  pageSizeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priceInput: {
    flex: 1,
  },
  bedroomFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, 
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  cardHeader: {
    position: 'relative',
    overflow: 'hidden',
  },
  thumb: { 
    width: '100%',
    height: 180, 
    borderRadius: 0 
  },
  thumbPlaceholder: {
    width: '100%',
    height: 180,
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  ratingText: {
    fontWeight: '700',
    fontSize: 12,
  },
  promoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  promoBadgeText: {
    fontWeight: '700',
    fontSize: 12,
    color: 'white',
  },
  favBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  title: { 
    fontSize: 16, 
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: { 
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    fontSize: 12,
    fontWeight: '500',
  },
  desc: { 
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  cardActions: { 
    flexDirection: 'row', 
    gap: 8,
  },
  filtersRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12,
    gap: 8,
  },
  filterInput: { 
    flex: 1, 
  },
  bedroomFilters: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 6,
  },
  sortRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    flexWrap: 'wrap',
    gap: 6,
  },
  resultsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    flexWrap: 'wrap',
    gap: 8,
  },
  searchButtonRow: { 
    flexDirection: 'row', 
    marginBottom: 12 
  },
});
