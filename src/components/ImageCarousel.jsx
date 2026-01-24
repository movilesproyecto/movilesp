import React, { useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function ImageCarousel({ images = [], imageBinary = null }) {
  const theme = useTheme();
  const [binaryImageUri, setBinaryImageUri] = useState(null);

  useEffect(() => {
    // Si hay imageBinary, convertirlo a blob URL para web
    if (imageBinary && typeof imageBinary === 'string') {
      try {
        if (imageBinary.startsWith('data:')) {
          // Ya es data URI, usarlo directamente
          setBinaryImageUri(imageBinary);
        } else if (imageBinary.startsWith('/')) {
          // Es base64 sin prefijo, agregar prefijo
          setBinaryImageUri('data:image/jpeg;base64,' + imageBinary);
        } else {
          // Intenta como está
          setBinaryImageUri('data:image/jpeg;base64,' + imageBinary);
        }
      } catch (error) {
        console.log('[ImageCarousel] Error procesando imageBinary:', error);
      }
    }
  }, [imageBinary]);
  
  // Si hay imageBinary procesado, usarlo
  if (binaryImageUri && typeof binaryImageUri === 'string') {
    console.log('[ImageCarousel] Usando imageBinary (base64)');
    return (
      <View style={styles.wrapper}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
          <Image 
            source={{ uri: binaryImageUri }} 
            style={[styles.image, { backgroundColor: theme.colors.surface }]} 
            resizeMode="cover"
            onError={(e) => console.log('[ImageCarousel] Error loading imageBinary:', e.nativeEvent?.error || 'Unknown error')}
            onLoad={() => console.log('[ImageCarousel] Imagen cargada exitosamente')}
          />
        </ScrollView>
      </View>
    );
  }
  
  if (!images || images.length === 0) return null;
  
  // Normalizar imágenes: pueden ser strings (URLs) u objetos con propiedad 'url'
  const normalizedImages = images.map(img => {
    if (typeof img === 'string') return img;
    if (typeof img === 'object' && img.url) return img.url;
    return null;
  }).filter(Boolean);
  
  if (normalizedImages.length === 0) return null;
  
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {normalizedImages.map((uri, i) => (
          <Image 
            key={i} 
            source={{ uri }} 
            style={[styles.image, { backgroundColor: theme.colors.surface }]} 
            resizeMode="cover"
            onError={(e) => console.log('[ImageCarousel] Error loading image:', uri, e.nativeEvent.error)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 180, marginBottom: 10 },
  image: { width: width - 32, height: 180, borderRadius: 8, marginHorizontal: 16 },
});
