import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  useTheme,
  Chip,
  Divider,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation }) => {
  const theme = useTheme();
  const { getFavoriteDepartments, toggleFavorite } = useAppContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const favoriteDepartments = getFavoriteDepartments();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <FontAwesome
            name="heart"
            size={28}
            color={theme.colors.primary}
            style={{ marginRight: 10 }}
          />
          <Text style={styles.headerTitle}>Mis Favoritos</Text>
        </View>
        <Text style={styles.subTitle}>
          {favoriteDepartments.length} departamento{favoriteDepartments.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {favoriteDepartments.length > 0 ? (
          <>
            {/* Quick Stats */}
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Card.Content style={styles.statCardContent}>
                  <FontAwesome
                    name="star"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statValue}>
                    {(favoriteDepartments.reduce((sum, d) => sum + d.rating, 0) / favoriteDepartments.length).toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Calificación Promedio</Text>
                </Card.Content>
              </Card>

              <Card style={styles.statCard}>
                <Card.Content style={styles.statCardContent}>
                  <FontAwesome
                    name="dollar"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.statValue}>
                    ${Math.min(...favoriteDepartments.map(d => d.pricePerNight))}
                  </Text>
                  <Text style={styles.statLabel}>Precio Mínimo</Text>
                </Card.Content>
              </Card>
            </View>

            {/* Favorite Departments List */}
            <Card style={styles.card}>
              <Card.Title
                title="Departamentos Guardados"
                subtitle="Rápido acceso a tus favoritos"
                left={(props) => (
                  <FontAwesome
                    name="bookmark"
                    size={20}
                    color={theme.colors.primary}
                  />
                )}
              />
              <Divider />
              <Card.Content style={styles.departmentsContainer}>
                {favoriteDepartments.map((dept) => (
                  <View key={dept.id}>
                    <View style={styles.departmentItem}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('DepartmentDetail', {
                            department: dept,
                          })
                        }
                      >
                        <View>
                          <View style={styles.deptHeader}>
                            <Text style={styles.deptName}>{dept.name}</Text>
                            <View style={styles.ratingBadge}>
                              <FontAwesome
                                name="star"
                                size={12}
                                color="#FFB800"
                              />
                              <Text style={styles.ratingText}>
                                {dept.rating}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.location}>
                            <FontAwesome name="map-marker" /> {dept.address}
                          </Text>

                          <View style={styles.deptMeta}>
                            <Chip
                              icon="bed"
                              style={styles.chip}
                              textStyle={styles.chipText}
                            >
                              {dept.bedrooms} hab
                            </Chip>
                            <Chip
                              icon="shower"
                              style={styles.chip}
                              textStyle={styles.chipText}
                            >
                              {dept.bathrooms || 2} baños
                            </Chip>
                          </View>

                          <Text style={styles.price}>
                            ${dept.pricePerNight}
                            <Text style={styles.priceUnit}>/noche</Text>
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={styles.deptBottom}>
                        <Button
                          mode="contained"
                          size="small"
                          onPress={() =>
                            navigation.navigate('ReservationForm', {
                              department: dept,
                            })
                          }
                        >
                          Reservar
                        </Button>
                        <TouchableOpacity
                          onPress={() => toggleFavorite(dept.id)}
                          style={{ marginLeft: 8 }}
                        >
                          <FontAwesome name="trash" size={18} color={theme.colors.error} />
                        </TouchableOpacity>
                      </View>
                      <Divider style={{ marginTop: 12 }} />
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <FontAwesome
              name="heart-o"
              size={60}
              color={theme.colors.disabled}
            />
            <Text style={styles.emptyText}>No tienes favoritos aún</Text>
            <Text style={styles.emptySubText}>
              Guarda departamentos para verlos aquí rápidamente
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Departamentos')}
              style={styles.exploreBtn}
            >
              Explorar Departamentos
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      backgroundColor: theme.colors.primary,
      padding: 20,
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 30,
      elevation: 4,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    subTitle: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.8)',
      marginLeft: 38,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 8,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      elevation: 2,
    },
    statCardContent: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.primary,
      marginTop: 4,
    },
    statLabel: {
      fontSize: 11,
      color: theme.colors.disabled,
      marginTop: 4,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.colors.surface,
      marginBottom: 16,
      elevation: 2,
    },
    departmentsContainer: {
      paddingVertical: 8,
    },
    departmentItem: {
      paddingVertical: 12,
    },
    deptHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    deptName: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.text,
      flex: 1,
    },
    ratingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF3E0',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      gap: 4,
    },
    ratingText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#E65100',
    },
    location: {
      fontSize: 12,
      color: theme.colors.disabled,
      marginBottom: 8,
    },
    deptMeta: {
      flexDirection: 'row',
      gap: 8,
      marginVertical: 8,
    },
    chip: {
      height: 28,
      backgroundColor: theme.colors.primary + '15',
    },
    chipText: {
      fontSize: 11,
      color: theme.colors.primary,
    },
    deptBottom: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
      gap: 8,
    },
    price: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    priceUnit: {
      fontSize: 12,
      fontWeight: 'normal',
      color: theme.colors.disabled,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginTop: 16,
    },
    emptySubText: {
      fontSize: 13,
      color: theme.colors.disabled,
      marginTop: 8,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    exploreBtn: {
      marginTop: 24,
    },
  });

export default FavoritesScreen;
