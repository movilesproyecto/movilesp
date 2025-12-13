import React from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function ImageCarousel({ images = [] }) {
  const theme = useTheme();
  if (!images || images.length === 0) return null;
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {images.map((uri, i) => (
          <Image key={i} source={{ uri }} style={[styles.image, { backgroundColor: theme.colors.surface }]} resizeMode="cover" />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: 180, marginBottom: 10 },
  image: { width: width - 32, height: 180, borderRadius: 8, marginHorizontal: 16 },
});
