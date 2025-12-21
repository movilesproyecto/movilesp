import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
  Modal,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Button,
  Rating,
  Avatar,
  Divider,
  Dialog,
  Portal,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppContext } from '../context/AppContext';

const ReviewScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { departmentId } = route.params;
  const { user, departments } = useAppContext();
  const department = departments.find(d => d.id === departmentId);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Carlos López',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      rating: 5,
      title: 'Excelente departamento',
      text: 'Muy limpio, cómodo y el anfitrión fue muy atento. Sin dudas volvería a reservar.',
      date: '2024-01-15',
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      userName: 'María Gómez',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      rating: 4,
      title: 'Buena ubicación',
      text: 'El lugar está muy bien ubicado, pero el aire acondicionado es un poco viejo.',
      date: '2024-01-10',
      verified: true,
      helpful: 8,
    },
    {
      id: 3,
      userName: 'Juan Pérez',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5,
      title: 'Perfecto para familias',
      text: 'Espacioso, bien equipado y seguro. El dueño muy responsable.',
      date: '2024-01-05',
      verified: true,
      helpful: 15,
    },
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    text: '',
  });

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  ).toFixed(1);

  const handleSubmitReview = () => {
    if (!formData.title.trim() || !formData.text.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      userName: user?.email.split('@')[0] || 'Usuario',
      userAvatar: `https://i.pravatar.cc/150?img=${Math.random() * 70}`,
      rating: formData.rating,
      title: formData.title,
      text: formData.text,
      date: new Date().toISOString().split('T')[0],
      verified: true,
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);
    setFormData({ rating: 5, title: '', text: '' });
    setShowReviewForm(false);
    Alert.alert('Éxito', 'Tu reseña ha sido publicada');
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(r =>
      r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reseñas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumen de Calificaciones */}
        <Card style={[styles.summaryCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.summaryHeader}>
              <View style={styles.ratingBox}>
                <Text style={[styles.bigRating, { color: theme.colors.primary }]}>
                  {averageRating}
                </Text>
                <View style={styles.starsContainer}>
                  {[...Array(5)].map((_, i) => (
                    <FontAwesome
                      key={i}
                      name={i < Math.floor(averageRating) ? 'star' : 'star-o'}
                      size={16}
                      color="#FFB800"
                    />
                  ))}
                </View>
                <Text style={[styles.reviewCount, { color: theme.colors.disabled }]}>
                  {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
                </Text>
              </View>

              <View style={styles.ratingBreakdown}>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length;
                  const percentage = (count / reviews.length) * 100;
                  return (
                    <View key={rating} style={styles.breakdownRow}>
                      <Text style={[styles.breakdownLabel, { color: theme.colors.disabled }]}>
                        {rating}⭐
                      </Text>
                      <View style={[styles.breakdownBar, { backgroundColor: theme.colors.disabled }]}>
                        <View
                          style={[
                            styles.breakdownFill,
                            {
                              backgroundColor: '#FFB800',
                              width: `${percentage}%`,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.breakdownCount, { color: theme.colors.disabled }]}>
                        {count}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Botón para escribir reseña */}
        <Button
          mode="contained"
          onPress={() => setShowReviewForm(true)}
          style={styles.writeButton}
          contentStyle={styles.writeButtonContent}
        >
          Escribir una Reseña
        </Button>

        {/* Lista de Reseñas */}
        <Text style={[styles.reviewsTitle, { color: theme.colors.text }]}>
          Reseñas Recientes
        </Text>

        {reviews.map((review, index) => (
          <View key={review.id}>
            <Card style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                {/* Header de reseña */}
                <View style={styles.reviewHeader}>
                  <Avatar.Image size={40} source={{ uri: review.userAvatar }} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={styles.reviewNameRow}>
                      <Text style={[styles.reviewName, { color: theme.colors.text }]}>
                        {review.userName}
                      </Text>
                      {review.verified && (
                        <View style={[styles.verifiedBadge, { backgroundColor: '#4CAF50' }]}>
                          <FontAwesome name="check" size={10} color="white" />
                          <Text style={styles.verifiedText}>Verificado</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.ratingDate}>
                      {[...Array(5)].map((_, i) => (
                        <FontAwesome
                          key={i}
                          name={i < review.rating ? 'star' : 'star-o'}
                          size={12}
                          color="#FFB800"
                        />
                      ))}
                      <Text style={[styles.reviewDate, { color: theme.colors.disabled }]}>
                        {new Date(review.date).toLocaleDateString('es-AR')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Título y texto */}
                <Text style={[styles.reviewTitle, { color: theme.colors.text }]}>
                  {review.title}
                </Text>
                <Text style={[styles.reviewText, { color: theme.colors.text }]}>
                  {review.text}
                </Text>

                {/* Botones de utilidad */}
                <View style={styles.reviewActions}>
                  <TouchableOpacity
                    onPress={() => handleHelpful(review.id)}
                    style={styles.helpfulButton}
                  >
                    <FontAwesome name="thumbs-up" size={14} color={theme.colors.primary} />
                    <Text style={[styles.helpfulText, { color: theme.colors.primary }]}>
                      Útil ({review.helpful})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reportButton}>
                    <FontAwesome name="flag" size={14} color={theme.colors.disabled} />
                    <Text style={[styles.reportText, { color: theme.colors.disabled }]}>
                      Reportar
                    </Text>
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
            {index < reviews.length - 1 && <Divider />}
          </View>
        ))}
      </ScrollView>

      {/* Modal para escribir reseña */}
      <Modal
        visible={showReviewForm}
        onRequestClose={() => setShowReviewForm(false)}
        transparent
        animationType="slide"
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            {/* Header modal */}
            <View style={[styles.modalHeader, { backgroundColor: theme.colors.primary }]}>
              <TouchableOpacity onPress={() => setShowReviewForm(false)}>
                <FontAwesome name="times" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Tu Reseña</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalScroll}>
              {/* Información del departamento */}
              <Card style={[styles.deptCard, { backgroundColor: theme.colors.surface }]}>
                <Card.Content>
                  <Text style={[styles.deptName, { color: theme.colors.text }]}>
                    {department?.name}
                  </Text>
                </Card.Content>
              </Card>

              {/* Rating */}
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Tu Calificación
                </Text>
                <View style={styles.ratingSelector}>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      onPress={() => setFormData({ ...formData, rating })}
                      style={styles.starButton}
                    >
                      <FontAwesome
                        name={rating <= formData.rating ? 'star' : 'star-o'}
                        size={32}
                        color={rating <= formData.rating ? '#FFB800' : theme.colors.disabled}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Título */}
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Título de la Reseña
                </Text>
                <View style={[styles.formInput, { borderColor: theme.colors.primary }]}>
                  <RNTextInput
                    placeholder="Ej: Excelente lugar"
                    placeholderTextColor={theme.colors.disabled}
                    value={formData.title}
                    onChangeText={(text) => setFormData({ ...formData, title: text })}
                    style={{ color: theme.colors.text }}
                  />
                </View>
              </View>

              {/* Texto */}
              <View style={styles.formSection}>
                <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                  Tu Reseña
                </Text>
                <View style={[styles.formInputLarge, { borderColor: theme.colors.primary }]}>
                  <RNTextInput
                    placeholder="Comparte tu experiencia..."
                    placeholderTextColor={theme.colors.disabled}
                    value={formData.text}
                    onChangeText={(text) => setFormData({ ...formData, text })}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    style={{ color: theme.colors.text, padding: 8 }}
                  />
                </View>
              </View>

              {/* Botones */}
              <View style={styles.formButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setShowReviewForm(false)}
                  style={{ flex: 1, marginRight: 8 }}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmitReview}
                  style={{ flex: 1 }}
                >
                  Publicar
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
      justifyContent: 'space-between',
      padding: 16,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    summaryCard: {
      marginHorizontal: 16,
      marginVertical: 12,
      borderRadius: 12,
    },
    summaryHeader: {
      flexDirection: 'row',
      gap: 20,
    },
    ratingBox: {
      alignItems: 'center',
      width: 100,
    },
    bigRating: {
      fontSize: 36,
      fontWeight: 'bold',
    },
    starsContainer: {
      flexDirection: 'row',
      gap: 2,
      marginVertical: 4,
    },
    reviewCount: {
      fontSize: 12,
      marginTop: 4,
    },
    ratingBreakdown: {
      flex: 1,
    },
    breakdownRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 6,
    },
    breakdownLabel: {
      fontSize: 12,
      width: 30,
    },
    breakdownBar: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
    },
    breakdownFill: {
      height: '100%',
      borderRadius: 4,
    },
    breakdownCount: {
      fontSize: 12,
      width: 25,
      textAlign: 'right',
    },
    writeButton: {
      marginHorizontal: 16,
      marginVertical: 12,
    },
    writeButtonContent: {
      paddingVertical: 6,
    },
    reviewsTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginHorizontal: 16,
      marginVertical: 12,
    },
    reviewCard: {
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
    },
    reviewHeader: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    reviewNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    reviewName: {
      fontSize: 14,
      fontWeight: '600',
    },
    verifiedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    verifiedText: {
      fontSize: 10,
      color: 'white',
      fontWeight: '600',
    },
    ratingDate: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
    },
    reviewDate: {
      fontSize: 12,
      marginLeft: 8,
    },
    reviewTitle: {
      fontSize: 14,
      fontWeight: '600',
      marginVertical: 8,
    },
    reviewText: {
      fontSize: 13,
      lineHeight: 20,
      marginBottom: 12,
    },
    reviewActions: {
      flexDirection: 'row',
      gap: 16,
      marginTop: 12,
      borderTopWidth: 1,
      borderTopColor: '#E0E0E0',
      paddingTop: 12,
    },
    helpfulButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    helpfulText: {
      fontSize: 12,
      fontWeight: '600',
    },
    reportButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    reportText: {
      fontSize: 12,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: '90%',
      overflow: 'hidden',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
    },
    modalScroll: {
      padding: 16,
    },
    deptCard: {
      marginBottom: 16,
      borderRadius: 8,
    },
    deptName: {
      fontSize: 14,
      fontWeight: '600',
    },
    formSection: {
      marginBottom: 20,
    },
    formLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    ratingSelector: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    starButton: {
      padding: 8,
    },
    formInput: {
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    formInputLarge: {
      borderWidth: 1,
      borderRadius: 8,
      maxHeight: 150,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
      marginVertical: 20,
      marginBottom: 40,
    },
  });

export default ReviewScreen;
