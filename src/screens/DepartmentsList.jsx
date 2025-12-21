import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FAB, useTheme, Searchbar, Button as PaperButton, TextInput, ActivityIndicator } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function DepartmentsList({ navigation }) {
  const theme = useTheme();
  const { user, canCreateDepartment, canEditDepartment, departments } = useAppContext();
  const insets = useSafeAreaInsets();
  const [sortBy, setSortBy] = useState('none'); // 'priceAsc' | 'priceDesc' | 'bedrooms'
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedroomsFilter, setBedroomsFilter] = useState('all');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.surface }]} onPress={() => navigation.navigate('DepartmentDetail', { department: item })}>
      {item.images && item.images[0] ? (
        <Image source={{ uri: item.images[0] }} style={styles.thumb} />
      ) : null}
      <View style={{ flex: 1, paddingLeft: item.images && item.images[0] ? 12 : 0 }}>
        <Text style={[styles.title, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.disabled }]}>{item.address} · {item.bedrooms} hab · ${item.pricePerNight}/noche</Text>
        <Text style={[styles.desc, { color: theme.colors.text }]} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardActions}>
          <PaperButton mode="contained" buttonColor={theme.colors.primary} onPress={() => navigation.navigate('DepartmentDetail', { department: item })}>Ver detalles</PaperButton>
          {canEditDepartment(user) && (
            <PaperButton mode="outlined" onPress={() => navigation.navigate('DepartmentForm', { department: item })} style={{ marginLeft: 8 }}>Editar</PaperButton>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filtered = useMemo(() => {
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

      <Searchbar placeholder="Buscar por nombre o dirección" value={query} onChangeText={setQuery} style={{ marginVertical: 8 }} />

      <View style={styles.searchButtonRow}>
        <PaperButton icon="magnify" mode="contained" onPress={() => navigation.navigate('Search')} style={{ flex: 1 }}>Búsqueda Avanzada</PaperButton>
      </View>

      <View style={styles.sortRow}>
        <PaperButton icon="currency-usd" mode={sortBy === 'priceAsc' ? 'contained' : 'outlined'} onPress={() => setSortBy('priceAsc')}>Precio ↑</PaperButton>
        <PaperButton icon="currency-usd" mode={sortBy === 'priceDesc' ? 'contained' : 'outlined'} onPress={() => setSortBy('priceDesc')} style={{ marginLeft: 8 }}>Precio ↓</PaperButton>
        <PaperButton icon="bed" mode={sortBy === 'bedrooms' ? 'contained' : 'outlined'} onPress={() => setSortBy('bedrooms')} style={{ marginLeft: 8 }}>Más hab.</PaperButton>
        <PaperButton icon="star-outline" mode={sortBy === 'rating' ? 'contained' : 'outlined'} onPress={() => setSortBy('rating')} style={{ marginLeft: 8 }}>Mejor valorados</PaperButton>
        <PaperButton icon="filter-remove-outline" mode={sortBy === 'none' ? 'contained' : 'text'} onPress={() => setSortBy('none')} style={{ marginLeft: 8 }}>Limpiar</PaperButton>
      </View>

      <View style={styles.resultsRow}>
        <Text style={{ marginRight: 8, color: theme.colors.text }}>Resultados por página:</Text>
        <PaperButton mode={pageSize === 6 ? 'contained' : 'outlined'} onPress={() => { setPageSize(6); setPage(1); }}>6</PaperButton>
        <PaperButton mode={pageSize === 12 ? 'contained' : 'outlined'} onPress={() => { setPageSize(12); setPage(1); }} style={{ marginLeft: 8 }}>12</PaperButton>
        <PaperButton mode={pageSize === 24 ? 'contained' : 'outlined'} onPress={() => { setPageSize(24); setPage(1); }} style={{ marginLeft: 8 }}>24</PaperButton>
      </View>

      <View style={styles.filtersRow}>
        <TextInput mode="outlined" label="Precio min" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={styles.filterInput} />
        <TextInput mode="outlined" label="Precio max" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={styles.filterInput} />
        <View style={styles.bedroomFilters}>
          <PaperButton mode={bedroomsFilter === 'all' ? 'contained' : 'outlined'} onPress={() => setBedroomsFilter('all')}>Todos</PaperButton>
          <PaperButton mode={bedroomsFilter === '1' ? 'contained' : 'outlined'} onPress={() => setBedroomsFilter('1')}>1</PaperButton>
          <PaperButton mode={bedroomsFilter === '2' ? 'contained' : 'outlined'} onPress={() => setBedroomsFilter('2')}>2</PaperButton>
          <PaperButton mode={bedroomsFilter === '3' ? 'contained' : 'outlined'} onPress={() => setBedroomsFilter('3')}>3+</PaperButton>
        </View>
      </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  thumb: { width: 120, height: 80, borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  subtitle: { marginTop: 4 },
  desc: { marginTop: 6 },
  actions: { marginLeft: 12, justifyContent: 'center' },
  cardActions: { flexDirection: 'row', marginTop: 8 },
  filtersRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  filterInput: { flex: 1, marginRight: 8 },
  bedroomFilters: { flexDirection: 'row', flexWrap: 'wrap' },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' },
  resultsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' },
  searchButtonRow: { flexDirection: 'row', marginBottom: 12 },
});
