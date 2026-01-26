# 📸 Integración de Imágenes en React Native

## Guía para conectar el frontend con el sistema de imágenes

---

## 1. Instalar librerías necesarias

```bash
npm install expo-image-picker expo-image axios
# O si usas React Native CLI:
npm install react-native-image-picker axios
```

---

## 2. Crear servicio para imágenes

**`src/services/imageService.js`**

```javascript
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const API_BASE_URL = 'http://192.168.100.61:8000/api'; // Cambiar según tu URL

const imageService = {
  /**
   * Seleccionar imagen de la galería
   */
  async pickImageFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  },

  /**
   * Tomar foto con la cámara
   */
  async takePhoto() {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      alert('Se requiere permiso para acceder a la cámara');
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      return result.assets[0];
    }
    return null;
  },

  /**
   * Subir una o múltiples imágenes
   */
  async uploadImages(departmentId, images, token, isPrimary = false) {
    const formData = new FormData();

    images.forEach((image, index) => {
      formData.append('images[]', {
        uri: image.uri,
        type: image.type || 'image/jpeg',
        name: image.fileName || `image_${index}.jpg`,
      });

      if (isPrimary && index === 0) {
        formData.append(`is_primary[${index}]`, 'true');
      }
    });

    try {
      const response = await axios.post(
        `${API_BASE_URL}/departments/${departmentId}/images`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error subiendo imágenes:', error);
      throw error;
    }
  },

  /**
   * Obtener todas las imágenes de un departamento
   */
  async getImages(departmentId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/departments/${departmentId}/images`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      throw error;
    }
  },

  /**
   * Obtener imagen primaria
   */
  async getPrimaryImage(departmentId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/departments/${departmentId}/images/primary`
      );
      return response.data;
    } catch (error) {
      console.error('Error obteniendo imagen primaria:', error);
      return null;
    }
  },

  /**
   * Marcar imagen como primaria
   */
  async setPrimaryImage(departmentId, imageId, token) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/departments/${departmentId}/images/${imageId}`,
        { is_primary: true },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error actualizando imagen primaria:', error);
      throw error;
    }
  },

  /**
   * Eliminar imagen
   */
  async deleteImage(departmentId, imageId, token) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/departments/${departmentId}/images/${imageId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      throw error;
    }
  },
};

export default imageService;
```

---

## 3. Componente para subir imágenes

**`src/components/ImageUploader.jsx`**

```jsx
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import imageService from '../services/imageService';
import { useAuth } from '../context/AuthContext';

export default function ImageUploader({ departmentId, onUploadSuccess }) {
  const { token } = useAuth();
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSelectImage = async () => {
    try {
      const image = await imageService.pickImageFromGallery();
      if (image) {
        setSelectedImages([...selectedImages, image]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await imageService.takePhoto();
      if (image) {
        setSelectedImages([...selectedImages, image]);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('Error', 'Selecciona al menos una imagen');
      return;
    }

    setLoading(true);
    try {
      const result = await imageService.uploadImages(
        departmentId,
        selectedImages,
        token
      );

      Alert.alert('Éxito', `${result.uploaded} imagen(es) subida(s)`);
      setSelectedImages([]);
      
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Error al subir');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Agregar Imágenes
      </Text>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#3498db',
            padding: 12,
            borderRadius: 8,
          }}
          onPress={handleSelectImage}
          disabled={loading}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            📱 Galería
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#27ae60',
            padding: 12,
            borderRadius: 8,
          }}
          onPress={handleTakePhoto}
          disabled={loading}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            📷 Cámara
          </Text>
        </TouchableOpacity>
      </View>

      {selectedImages.length > 0 && (
        <View>
          <Text style={{ marginBottom: 8 }}>
            {selectedImages.length} imagen(es) seleccionada(s)
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((image, index) => (
              <View key={index} style={{ marginRight: 8 }}>
                <Image
                  source={{ uri: image.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ color: '#fff' }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={{
              backgroundColor: '#2ecc71',
              padding: 12,
              borderRadius: 8,
              marginTop: 16,
            }}
            onPress={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                Subir {selectedImages.length} imagen(es)
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
```

---

## 4. Componente para mostrar galería

**`src/components/ImageGallery.jsx`**

```jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import imageService from '../services/imageService';
import { useAuth } from '../context/AuthContext';

export default function ImageGallery({ departmentId, isOwner }) {
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [primaryImageId, setPrimaryImageId] = useState(null);

  useEffect(() => {
    loadImages();
  }, [departmentId]);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getImages(departmentId);
      setImages(data);
      
      const primary = data.find(img => img.isPrimary);
      if (primary) {
        setPrimaryImageId(primary.id);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await imageService.deleteImage(departmentId, imageId, token);
              setImages(images.filter(img => img.id !== imageId));
              Alert.alert('Éxito', 'Imagen eliminada');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la imagen');
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = async (imageId) => {
    try {
      await imageService.setPrimaryImage(departmentId, imageId, token);
      setPrimaryImageId(imageId);
      loadImages();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la imagen principal');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text>No hay imágenes para este departamento</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
        Galería ({images.length})
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {images.map((image) => (
          <View key={image.id} style={{ width: '48%' }}>
            <Image
              source={{ uri: image.url }}
              style={{
                width: '100%',
                height: 150,
                borderRadius: 8,
              }}
            />

            {image.isPrimary && (
              <View
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  backgroundColor: '#f39c12',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 4,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                  Principal
                </Text>
              </View>
            )}

            {isOwner && (
              <View style={{ marginTop: 8, gap: 8 }}>
                {!image.isPrimary && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#3498db',
                      padding: 8,
                      borderRadius: 4,
                    }}
                    onPress={() => handleSetPrimary(image.id)}
                  >
                    <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>
                      Hacer Principal
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={{
                    backgroundColor: '#e74c3c',
                    padding: 8,
                    borderRadius: 4,
                  }}
                  onPress={() => handleDeleteImage(image.id)}
                >
                  <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12 }}>
                    Eliminar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
```

---

## 5. Uso en pantalla

**`src/screens/DepartmentDetailScreen.jsx`**

```jsx
import React, { useState } from 'react';
import { View, ScrollView, Tab, TabView } from 'react-native';
import ImageGallery from '../components/ImageGallery';
import ImageUploader from '../components/ImageUploader';

export default function DepartmentDetailScreen({ route }) {
  const { departmentId, isOwner } = route.params;
  const [tabIndex, setTabIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(refreshKey + 1);
    setTabIndex(0); // Volver a galería
  };

  return (
    <View style={{ flex: 1 }}>
      <TabView
        value={tabIndex}
        onIndexChange={setTabIndex}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'gallery':
              return (
                <ImageGallery
                  key={refreshKey}
                  departmentId={departmentId}
                  isOwner={isOwner}
                />
              );
            case 'upload':
              return (
                <ImageUploader
                  departmentId={departmentId}
                  onUploadSuccess={handleUploadSuccess}
                />
              );
            default:
              return null;
          }
        }}
        navigationState={{
          index: tabIndex,
          routes: [
            { key: 'gallery', title: '🖼️ Galería' },
            { key: 'upload', title: '➕ Subir' },
          ],
        }}
      />
    </View>
  );
}
```

---

## 6. Permisos necesarios

**`app.json`**

```json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Te permitimos acceder a tu galería",
          "cameraPermission": "Te permitimos acceder a tu cámara",
          "cameraRollPermission": "Te permitimos guardar fotos"
        }
      ]
    ]
  }
}
```

---

## 7. Variables de ambiente

**`.env`**

```
REACT_APP_API_URL=http://192.168.100.61:8000/api
REACT_APP_IMAGE_URL=http://192.168.100.61:8000/storage
```

---

## 8. Manejo de errores

```javascript
const handleImageError = (error) => {
  if (error.response?.status === 401) {
    // Token expirado
    Alert.alert('Sesión expirada', 'Por favor inicia sesión nuevamente');
  } else if (error.response?.status === 403) {
    // No autorizado
    Alert.alert('Permiso denegado', 'No puedes modificar este departamento');
  } else if (error.response?.status === 422) {
    // Validación
    Alert.alert('Error', error.response.data.message);
  } else {
    Alert.alert('Error', 'Algo salió mal');
  }
};
```

---

## 📱 Checklist de Implementación

- [ ] Instalar librerías (expo-image-picker, axios)
- [ ] Crear `imageService.js`
- [ ] Crear componente `ImageUploader.jsx`
- [ ] Crear componente `ImageGallery.jsx`
- [ ] Integrar en pantalla de detalle
- [ ] Configurar permisos en `app.json`
- [ ] Probar subida de imágenes
- [ ] Probar eliminación de imágenes
- [ ] Probar marcar como primaria
- [ ] Manejo de errores

---

**Versión:** 1.0  
**Fecha:** 17 de Enero, 2026
