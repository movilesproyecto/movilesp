import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Card, Button, Text, useTheme, Chip, FAB, Dialog, Portal } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppContext } from '../context/AppContext';

export default function PromotionsScreen({ navigation }) {
  const theme = useTheme();
  const { user, isAdmin, isSuperAdmin, promotions, deletePromotion, togglePromotionStatus } = useAppContext();
  const insets = useSafeAreaInsets();
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const canEditPromotions = isAdmin(user) || isSuperAdmin(user);

  const handleDeletePromotion = (id) => {
    deletePromotion(id);
    setDialogVisible(false);
  };

  const renderPromotionItem = ({ item }) => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ fontWeight: '700', color: theme.colors.primary }}>
              {item.title}
            </Text>
            <Text style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              {item.description}
            </Text>
          </View>
          <View style={[styles.discountBadge, { backgroundColor: '#F59E0B' }]}>
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>
              -{item.discount}%
            </Text>
          </View>
        </View>

        <View style={styles.codeRow}>
          <Chip 
            icon="content-copy" 
            onPress={() => {}}
            style={{ backgroundColor: theme.colors.tertiary }}
            textStyle={{ color: 'white' }}
          >
            {item.code}
          </Chip>
          {item.active ? (
            <Chip 
              icon="check-circle" 
              style={{ backgroundColor: '#10B981', marginLeft: 8 }}
              textStyle={{ color: 'white' }}
            >
              Activa
            </Chip>
          ) : (
            <Chip 
              icon="close-circle" 
              style={{ backgroundColor: '#EF4444', marginLeft: 8 }}
              textStyle={{ color: 'white' }}
            >
              Inactiva
            </Chip>
          )}
        </View>

        <Text style={{ color: theme.colors.disabled, fontSize: 12, marginTop: 12 }}>
          📅 {item.startDate} - {item.endDate}
        </Text>

        {canEditPromotions && (
          <View style={styles.actionButtons}>
            <Button 
              mode="outlined" 
              size="small"
              onPress={() => navigation.navigate('PromotionForm', { promotion: item })}
              style={{ flex: 1, marginRight: 8 }}
            >
              Editar
            </Button>
            <Button 
              mode="outlined" 
              size="small"
              onPress={() => togglePromotionStatus(item.id)}
              buttonColor={item.active ? '#EF4444' : '#10B981'}
              style={{ flex: 1, marginRight: 8 }}
            >
              {item.active ? 'Desactivar' : 'Activar'}
            </Button>
            <Button 
              mode="outlined" 
              size="small"
              onPress={() => {
                setSelectedPromotion(item);
                setDialogVisible(true);
              }}
              buttonColor="#EF4444"
              style={{ flex: 1 }}
            >
              Eliminar
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        style={{ paddingHorizontal: 16, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 20 }}
      >
        <Text variant="headlineSmall" style={{ fontWeight: '700', marginBottom: 16 }}>
          🎉 Promociones Activas
        </Text>

        {promotions.length === 0 ? (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content style={{ alignItems: 'center', paddingVertical: 40 }}>
              <FontAwesome name="inbox" size={40} color={theme.colors.disabled} />
              <Text style={{ color: theme.colors.disabled, marginTop: 12 }}>
                No hay promociones disponibles
              </Text>
            </Card.Content>
          </Card>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={promotions}
            keyExtractor={(item) => item.id}
            renderItem={renderPromotionItem}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          />
        )}
      </ScrollView>

      {canEditPromotions && (
        <FAB
          icon="plus"
          label="Nueva Promoción"
          style={{ position: 'absolute', right: 16, bottom: 16 + insets.bottom }}
          onPress={() => navigation.navigate('PromotionForm')}
        />
      )}

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Eliminar Promoción</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que deseas eliminar esta promoción?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button 
              onPress={() => handleDeletePromotion(selectedPromotion.id)}
              buttonColor="#EF4444"
              textColor="white"
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  card: { 
    marginBottom: 12, 
    borderRadius: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  discountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
});
