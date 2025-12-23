import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, useTheme, Card, Divider, Chip } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import ImageCarousel from '../components/ImageCarousel';

export default function DepartmentForm({ route, navigation }) {
  const dept = route?.params?.department;
  const theme = useTheme();
  const { user, canCreateDepartment, canEditDepartment, createDepartment, editDepartment } = useAppContext();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [description, setDescription] = useState('');
  const [amenity, setAmenity] = useState('');
  const [amenities, setAmenities] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [pickingImage, setPickingImage] = useState(false);

  useEffect(() => {
    if (dept) {
      setName(dept.name || '');
      setAddress(dept.address || '');
      setBedrooms(dept.bedrooms?.toString() || '');
      setPricePerNight(dept.pricePerNight?.toString() || '');
      setDescription(dept.description || '');
      setAmenities(dept.amenities || []);
      setImages(dept.images || []);
    }
  }, [dept]);

  const pickImageFromGallery = async () => {
    try {
      setPickingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        if (selectedImage.uri) {
          setImages([...images, selectedImage.uri]);
          Alert.alert('Éxito', 'Imagen agregada a la galería');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la galería');
    } finally {
      setPickingImage(false);
    }
  };

  const isValidImageUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const pathname = urlObj.pathname.toLowerCase();
      return validExtensions.some(ext => pathname.endsWith(ext));
    } catch {
      return false;
    }
  };

  const onAddImage = () => {
    setImageError('');
    if (!imageUrl.trim()) {
      setImageError('Por favor ingresa una URL');
      return;
    }
    if (!isValidImageUrl(imageUrl)) {
      setImageError('URL inválida. Usa un enlace a JPG, PNG, GIF o WEBP');
      return;
    }
    setImages([...images, imageUrl]);
    setImageUrl('');
  };

  const onRemoveImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const onAddAmenity = () => {
    if (amenity.trim() && !amenities.includes(amenity.trim())) {
      setAmenities([...amenities, amenity.trim()]);
      setAmenity('');
    }
  };

  const onRemoveAmenity = (idx) => {
    setAmenities(amenities.filter((_, i) => i !== idx));
  };

  const onSave = () => {
    if (!name.trim() || !address.trim() || !bedrooms.trim() || !pricePerNight.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    const bedroomsNum = parseInt(bedrooms, 10);
    const priceNum = parseFloat(pricePerNight);

    if (bedroomsNum < 1) {
      Alert.alert('Error', 'Habitaciones debe ser al menos 1');
      return;
    }

    if (priceNum < 0) {
      Alert.alert('Error', 'Precio no puede ser negativo');
      return;
    }

    const data = {
      name,
      address,
      bedrooms: bedroomsNum,
      pricePerNight: priceNum,
      description,
      amenities,
      images,
      rating: dept?.rating || 4.0,
    };

    if (dept) {
      if (!canEditDepartment(user)) {
        Alert.alert('Acceso denegado', 'No puedes editar departamentos.');
        navigation.goBack();
        return;
      }
      editDepartment(dept.id, data);
      Alert.alert('Guardado', 'Departamento actualizado.');
    } else {
      if (!canCreateDepartment(user)) {
        Alert.alert('Acceso denegado', 'No puedes crear departamentos.');
        navigation.goBack();
        return;
      }
      createDepartment(name, address, data);
      Alert.alert('Creado', 'Departamento creado correctamente.');
    }
    navigation.navigate('Departamentos');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back button */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {dept ? 'Editar Departamento' : 'Nuevo Departamento'}
        </Text>
      </View>

      <View style={{ padding: 16 }}>
      <Text variant="headlineSmall" style={{ color: theme.colors.text, marginBottom: 16, fontWeight: '700' }}>
        {dept ? 'Editar Departamento' : 'Nuevo Departamento'}
      </Text>

      {/* Galería actual */}
      {images.length > 0 && (
        <>
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Title title={`Galería (${images.length} imagen${images.length !== 1 ? 's' : ''})`} />
            <Card.Content>
              <ImageCarousel images={images} />
              <View style={styles.imageList}>
                {images.map((img, idx) => (
                  <Chip
                    key={idx}
                    onClose={() => onRemoveImage(idx)}
                    mode="outlined"
                    style={{ marginRight: 8, marginBottom: 8 }}
                  >
                    Imagen {idx + 1}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
          <Divider style={{ marginVertical: 12 }} />
        </>
      )}

      {/* Agregar imágenes */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Agregar imágenes" />
        <Card.Content>
          <Button
            mode="contained"
            icon="image-plus"
            onPress={pickImageFromGallery}
            disabled={pickingImage}
            style={{ marginBottom: 12 }}
            buttonColor={theme.colors.primary}
          >
            {pickingImage ? 'Cargando...' : 'Seleccionar de galería'}
          </Button>

          <Divider style={{ marginVertical: 12 }} />

          <Text style={{ color: theme.colors.disabled, marginBottom: 8 }}>O ingresa una URL:</Text>
          <TextInput
            mode="outlined"
            label="URL de imagen (JPG, PNG, GIF, WEBP)"
            value={imageUrl}
            onChangeText={(text) => {
              setImageUrl(text);
              setImageError('');
            }}
            placeholder="https://example.com/image.jpg"
            style={{ marginBottom: 8 }}
          />
          {imageError ? (
            <Text style={{ color: theme.colors.error, marginBottom: 8 }}>{imageError}</Text>
          ) : null}
          <Button mode="outlined" onPress={onAddImage}>
            Agregar por URL
          </Button>
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 12 }} />

      {/* Datos principales */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title="Información del departamento" />
        <Card.Content>
          <TextInput
            mode="outlined"
            label="Nombre *"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            mode="outlined"
            label="Dirección *"
            value={address}
            onChangeText={setAddress}
            style={{ marginBottom: 12 }}
          />
          <TextInput
            mode="outlined"
            label="Habitaciones *"
            value={bedrooms}
            onChangeText={setBedrooms}
            keyboardType="numeric"
            style={{ marginBottom: 12 }}
          />
          <TextInput
            mode="outlined"
            label="Precio por noche ($) *"
            value={pricePerNight}
            onChangeText={setPricePerNight}
            keyboardType="decimal-pad"
            style={{ marginBottom: 12 }}
          />
          <TextInput
            mode="outlined"
            label="Descripción"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 12 }}
          />
        </Card.Content>
      </Card>

      <Divider style={{ marginVertical: 12 }} />

      {/* Amenidades */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Title title={`Amenidades (${amenities.length})`} />
        <Card.Content>
          <View style={styles.amenityInput}>
            <TextInput
              mode="outlined"
              label="Agregar amenidad"
              value={amenity}
              onChangeText={setAmenity}
              placeholder="WiFi, Cocina, A/C..."
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button mode="contained" compact onPress={onAddAmenity} style={{ justifyContent: 'center' }}>
              +
            </Button>
          </View>
          {amenities.length > 0 && (
            <View style={styles.amenityList}>
              {amenities.map((am, idx) => (
                <Chip
                  key={idx}
                  icon="check-circle-outline"
                  onClose={() => onRemoveAmenity(idx)}
                  mode="flat"
                  style={{ marginRight: 8, marginBottom: 8 }}
                >
                  {am}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        <Button mode="contained" buttonColor={theme.colors.primary} onPress={onSave} style={{ marginBottom: 12 }}>
          {dept ? 'Guardar cambios' : 'Crear departamento'}
        </Button>
        <Button mode="outlined" onPress={() => navigation.goBack()}>
          Cancelar
        </Button>
      </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
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
  card: { marginBottom: 12, borderRadius: 10 },
  imageList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  amenityInput: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12 },
  amenityList: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 },
  actionButtons: { marginBottom: 24, marginTop: 12 },
});
