import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme, IconButton } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import ConfirmDialog from '../components/ConfirmDialog';

export default function ReservationsList({ navigation }) {
  const { user, canCreateReservation, canDeleteReservation, canApproveReservation, reservations, departments, fetchReservations, authToken, apiDeleteReservation, completeReservation, cancelReservationStatus } = useAppContext();
  
  // Debug logs
  console.log('ReservationsList - User:', user);
  console.log('ReservationsList - canApproveReservation:', canApproveReservation ? canApproveReservation(user) : 'function not available');
  console.log('ReservationsList - Reservations:', reservations?.length || 0);
  
  const [filterDate, setFilterDate] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [completeDialogVisible, setCompleteDialogVisible] = useState(false);
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [reservationToComplete, setReservationToComplete] = useState(null);
  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Cargar reservaciones cuando el componente monta o el usuario se autentica
  useEffect(() => {
    console.log('ReservationsList useEffect, authToken:', !!authToken);
    if (authToken) {
      loadReservations();
    }
  }, [authToken]);

  const loadReservations = async () => {
    console.log('loadReservations called');
    setLoading(true);
    await fetchReservations();
    setLoading(false);
    console.log('reservations after load:', reservations);
  };

  const filtered = useMemo(() => {
    const result = (reservations || []).filter(r => {
      if (filterDate && r.date !== filterDate) return false;
      if (filterDept && String(r.deptId) !== String(filterDept)) return false;
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const deptMatch = r.departmentName?.toLowerCase().includes(searchLower);
        if (!deptMatch) return false;
      }
      return true;
    });
    console.log('filtered reservations:', result);
    return result;
  }, [reservations, filterDate, filterDept, searchText]);

  const openDeleteDialog = (reservation) => {
    setReservationToDelete(reservation);
    setDeleteDialogVisible(true);
  };

  const openCompleteDialog = (reservation) => {
    setReservationToComplete(reservation);
    setCompleteDialogVisible(true);
  };

  const openCancelDialog = (reservation) => {
    setReservationToCancel(reservation);
    setCancelDialogVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservationToDelete) return;
    
    setDeleting(true);
    const result = await apiDeleteReservation(reservationToDelete.id);
    setDeleting(false);
    setDeleteDialogVisible(false);
    
    if (result.success) {
      alert('Reserva eliminada correctamente');
      // Recargar la lista después de eliminar
      await loadReservations();
    } else {
      alert(`Error: ${result.message || 'No se pudo eliminar la reserva'}`);
    }
    setReservationToDelete(null);
  };

  const handleConfirmComplete = async () => {
    if (!reservationToComplete) return;
    
    setCompleting(true);
    const result = await completeReservation(reservationToComplete.id);
    setCompleting(false);
    setCompleteDialogVisible(false);
    
    if (result.success) {
      alert('Reserva completada correctamente');
      // La lista ya se actualiza automáticamente en el contexto, pero recargamos para estar seguros
      await loadReservations();
    } else {
      alert(`Error: ${result.message || 'No se pudo completar la reserva'}`);
    }
    setReservationToComplete(null);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;
    
    setCancelling(true);
    const result = await cancelReservationStatus(reservationToCancel.id);
    setCancelling(false);
    setCancelDialogVisible(false);
    
    if (result.success) {
      alert('Reserva cancelada correctamente');
      // La lista ya se actualiza automáticamente en el contexto, pero recargamos para estar seguros
      await loadReservations();
    } else {
      alert(`Error: ${result.message || 'No se pudo cancelar la reserva'}`);
    }
    setReservationToCancel(null);
  };

  const renderItem = ({ item }) => {
    const canManageThisReservation = canApproveReservation(user);
    const canDeleteThisReservation = canDeleteReservation(user) || (canManageThisReservation && item.status === 'cancelled');

    return (
      <View
        style={[styles.card, { backgroundColor: '#fff', borderColor: '#ddd' }]}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('ReservationDetail', { reservation: item })}
          style={{ flex: 1 }}
        >
          <Text style={[styles.dept, { color: '#007bff' }]}>{item.departmentName}</Text>
          <Text style={[styles.meta, { color: '#666' }]}>{item.date} · {item.time} · {item.duration}</Text>
          <Text style={[styles.status, {
            color: item.status === 'confirmed' ? '#4CAF50' :
                   item.status === 'completed' ? '#2196F3' :
                   item.status === 'cancelled' ? '#F44336' : '#FF9800'
          }]}>
            {item.status === 'confirmed' ? '✓ Confirmada' :
             item.status === 'completed' ? '✓ Completada' :
             item.status === 'cancelled' ? '✗ Cancelada' : '○ Pendiente'}
          </Text>
        </TouchableOpacity>

        {/* Botones de acción para administradores */}
        {canManageThisReservation && (
          <View style={styles.actionButtons}>
            {item.status === 'confirmed' && (
              <>
                <IconButton
                  icon="check-circle-outline"
                  iconColor="#4CAF50"
                  size={20}
                  onPress={() => openCompleteDialog(item)}
                  style={{ margin: 0 }}
                />
                <IconButton
                  icon="cancel"
                  iconColor="#FF9800"
                  size={20}
                  onPress={() => openCancelDialog(item)}
                  style={{ margin: 0 }}
                />
              </>
            )}
            {canDeleteThisReservation && (
              <IconButton
                icon="trash-can-outline"
                iconColor="#EF4444"
                size={20}
                onPress={() => openDeleteDialog(item)}
                style={{ margin: 0 }}
              />
            )}
          </View>
        )}

        {/* Botón de eliminar para usuarios normales */}
        {!canManageThisReservation && canDeleteThisReservation && (
          <IconButton
            icon="trash-can-outline"
            iconColor="#EF4444"
            size={20}
            onPress={() => openDeleteDialog(item)}
            style={{ margin: 0 }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f5f5f5' }] }>
      {!authToken ? (
        <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', marginTop: 50 }}>
          Debes iniciar sesión para ver tus reservas.
        </Text>
      ) : (
        <>
          <View style={styles.headerRow}>
            <Text style={[styles.header, { color: '#000' }]}>Reservas</Text>
            {canCreateReservation(user) && <Button title="Nueva" onPress={() => navigation.navigate('ReservationForm')} />}
          </View>
          <View style={styles.filtersRow}>
            <TextInput placeholder="Fecha (YYYY-MM-DD)" value={filterDate} onChangeText={setFilterDate} style={styles.filterInput} />
            <View style={styles.pickerWrapper}>
              <Picker selectedValue={filterDept} onValueChange={(v) => setFilterDept(v)}>
                <Picker.Item label="Todos" value="" />
                {(departments || []).map(d => <Picker.Item key={d.id} label={d.name} value={d.id} />)}
              </Picker>
            </View>
            <TextInput placeholder="Buscar departamento" value={searchText} onChangeText={setSearchText} style={styles.filterInput} />
            <Button title="Limpiar" onPress={() => { setFilterDate(''); setFilterDept(''); setSearchText(''); }} />
          </View>
          <Text style={{ color: '#000', fontSize: 16, marginBottom: 10 }}>
            Total reservas: {filtered.length} | Cargando: {loading ? 'Sí' : 'No'}
          </Text>

          <FlatList
            data={filtered}
            keyExtractor={(i) => String(i.id)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 24 }}
            onRefresh={loadReservations}
            refreshing={loading}
            ListEmptyComponent={
              <Text style={[styles.empty, { color: '#666' }]}>
                {loading ? 'Cargando...' : 'No hay reservaciones'}
              </Text>
            }
          />

          {/* Diálogo de confirmación para completar */}
          <ConfirmDialog
            visible={completeDialogVisible}
            title="Completar Reserva"
            message={`¿Estás seguro de que deseas marcar como completada la reserva de "${reservationToComplete?.departmentName}" para el ${reservationToComplete?.date}?`}
            confirmText="Completar"
            cancelText="Cancelar"
            onConfirm={handleConfirmComplete}
            onCancel={() => {
              setCompleteDialogVisible(false);
              setReservationToComplete(null);
            }}
            isDangerous={false}
          />

          {/* Diálogo de confirmación para cancelar */}
          <ConfirmDialog
            visible={cancelDialogVisible}
            title="Cancelar Reserva"
            message={`¿Estás seguro de que deseas cancelar la reserva de "${reservationToCancel?.departmentName}" para el ${reservationToCancel?.date}?`}
            confirmText="Cancelar Reserva"
            cancelText="Cancelar"
            onConfirm={handleConfirmCancel}
            onCancel={() => {
              setCancelDialogVisible(false);
              setReservationToCancel(null);
            }}
            isDangerous={true}
          />

          {/* Diálogo de confirmación para eliminar */}
          <ConfirmDialog
            visible={deleteDialogVisible}
            title="Eliminar Reserva"
            message={`¿Estás seguro de que deseas eliminar la reserva de "${reservationToDelete?.departmentName}" para el ${reservationToDelete?.date}? Esta acción no se puede deshacer.`}
            confirmText="Eliminar"
            cancelText="Cancelar"
            onConfirm={handleConfirmDelete}
            onCancel={() => {
              setDeleteDialogVisible(false);
              setReservationToDelete(null);
            }}
            isDangerous={true}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  header: { fontSize: 20, fontWeight: '700' },
  card: { padding: 14, borderRadius: 10, marginBottom: 10, elevation: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dept: { fontSize: 16, fontWeight: '600' },
  meta: { marginTop: 4 },
  status: { marginTop: 8, fontSize: 12, fontWeight: '500' },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
  filtersRow: { marginBottom: 12 },
  filterInput: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 8, marginBottom: 8 },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  actionButtons: { flexDirection: 'row', alignItems: 'center' },
});
