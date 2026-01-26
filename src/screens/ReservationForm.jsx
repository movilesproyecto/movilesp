import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme, Text, Button, Card } from 'react-native-paper';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useAppContext } from '../context/AppContext';

// Configurar idioma español para el calendario
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
};
LocaleConfig.defaultLocale = 'es';

export default function ReservationForm({ route, navigation }) {
  const preDept = route?.params?.department;
  const theme = useTheme();
  const { user, canCreateReservation, departments = [], reservations = [], reservation, fetchDepartments, getAvailableSlots } = useAppContext();

  useEffect(() => {
    if (!departments || departments.length === 0) {
      fetchDepartments();
    }
  }, [departments, fetchDepartments]);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
  }, [user, navigation]);
  // Obtener el minDate como mañana (después de hoy)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [dept, setDept] = useState(preDept ? preDept.id : (departments && departments.length > 0 ? departments[0].id : null));
  const [selectedDate, setSelectedDate] = useState(minDateStr);
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState('1h');
  const [showCalendar, setShowCalendar] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    if (preDept) setDept(preDept.id);
  }, [preDept]);

  useEffect(() => {
    if (!dept && departments && departments.length) setDept(departments[0].id);
  }, [departments]);

  // Fetch available slots when department or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!dept || !selectedDate) return;
      setLoadingSlots(true);
      const result = await getAvailableSlots(dept, selectedDate);
      if (result.success) {
        setAvailableSlots(result.slots);
        // If current time is not available, set to first available
        if (!result.slots.includes(time)) {
          setTime(result.slots[0] || '09:00');
        }
      } else {
        // If error, assume all slots available (fallback)
        setAvailableSlots(['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']);
      }
      setLoadingSlots(false);
    };
    fetchSlots();
  }, [dept, selectedDate, getAvailableSlots]);

  const onSubmit = () => {
    if (!canCreateReservation(user)) { 
      Alert.alert('Acceso denegado', 'No puedes crear reservas.'); 
      navigation.goBack(); 
      return; 
    }

    // Validar que no exista una reserva del mismo usuario en el mismo departamento y fecha
    const yaReservado = reservations.some(res => 
      res.deptId === dept && res.date === selectedDate && (res.status === 'confirmed' || res.status === 'pending')
    );

    if (yaReservado) {
      Alert.alert(
        'Departamento no disponible',
        'Ya tienes una reserva confirmada o pendiente para este departamento en esta fecha. Por favor, elige otro día o departamento.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Validar que el horario esté disponible
    if (!availableSlots.includes(time)) {
      Alert.alert(
        'Horario no disponible',
        'Este horario ya no está disponible. Por favor, selecciona otro horario.',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Obtener el departamento seleccionado para pasar a la pantalla de pago
    const selectedDept = departments.find(d => d.id === dept);

    // Navegar a la pantalla de pago con los datos de la reserva
    navigation.navigate('Payment', {
      reservation: {
        deptId: dept,
        date: selectedDate,
        time,
        duration,
      },
      department: selectedDept,
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="headlineMedium" style={{ fontWeight: 'bold', marginBottom: 8 }}>Nueva Reserva</Text>
          <Text style={{ color: theme.colors.disabled }}>Completa los detalles de tu reserva</Text>
        </Card.Content>
      </Card>

      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text style={[styles.label, { color: theme.colors.text }]}>Departamento</Text>
          {departments && departments.length > 0 ? (
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
              <Picker selectedValue={dept} onValueChange={(v) => setDept(v)}>
                {departments.map((d) => (
                  <Picker.Item key={d.id} label={`${d.name}`} value={d.id} />
                ))}
              </Picker>
            </View>
          ) : (
            <Text style={{ color: theme.colors.text, textAlign: 'center', marginVertical: 10 }}>Cargando departamentos...</Text>
          )}

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Fecha</Text>
          {!showCalendar && (
            <View 
              style={[styles.dateButton, { borderColor: theme.colors.outline, backgroundColor: theme.colors.surface }]}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 16, fontWeight: '600' }}>
                📅 {new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
              <Button 
                mode="text" 
                onPress={() => setShowCalendar(true)}
                textColor={theme.colors.primary}
              >
                Cambiar fecha
              </Button>
            </View>
          )}

          {showCalendar && (
            <View style={[styles.calendarContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
              <Calendar
                current={selectedDate}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setShowCalendar(false);
                }}
                minDate={minDateStr}
                monthFormat={'MMMM yyyy'}
                hideExtraDays={true}
                disableAllTouchEventsForDisabledDays={true}
                theme={{
                  backgroundColor: theme.colors.surface,
                  calendarBackground: theme.colors.surface,
                  textSectionTitleColor: theme.colors.text,
                  textSectionTitleDisabledColor: theme.colors.disabled,
                  selectedDayBackgroundColor: theme.colors.primary,
                  selectedDayTextColor: '#fff',
                  todayTextColor: theme.colors.primary,
                  dayTextColor: theme.colors.text,
                  textDisabledColor: theme.colors.disabled,
                  dotColor: theme.colors.primary,
                  selectedDotColor: '#fff',
                  arrowColor: theme.colors.primary,
                  disabledArrowColor: theme.colors.disabled,
                  monthTextColor: theme.colors.text,
                  indicatorColor: theme.colors.primary,
                  textDayFontSize: 16,
                  textMonthFontSize: 16,
                  textDayHeaderFontSize: 13,
                }}
                style={{ marginBottom: 16 }}
              />
              <Button 
                mode="outlined"
                onPress={() => setShowCalendar(false)}
                style={{ marginBottom: 8 }}
              >
                Cerrar calendario
              </Button>
            </View>
          )}

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Hora</Text>
          {loadingSlots ? (
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
              <Text style={{ padding: 12, color: theme.colors.disabled }}>Cargando horarios disponibles...</Text>
            </View>
          ) : (
            <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
              <Picker selectedValue={time} onValueChange={(v) => setTime(v)}>
                {availableSlots.map((slot) => (
                  <Picker.Item key={slot} label={slot} value={slot} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={[styles.label, { color: theme.colors.text, marginTop: 16 }]}>Duración</Text>
          <View style={[styles.pickerWrapper, { borderColor: theme.colors.outline }]}>
            <Picker selectedValue={duration} onValueChange={setDuration}>
              <Picker.Item label="1 hora" value="1h" />
              <Picker.Item label="2 horas" value="2h" />
              <Picker.Item label="3 horas" value="3h" />
              <Picker.Item label="4 horas" value="4h" />
              <Picker.Item label="1 día" value="1d" />
              <Picker.Item label="2 días" value="2d" />
              <Picker.Item label="1 semana" value="1w" />
            </Picker>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonGroup}>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={{ flex: 1, marginRight: 8 }}>
          Volver
        </Button>
        <Button mode="contained" onPress={onSubmit} style={{ flex: 1 }}>
          Ir al pago
        </Button>
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  headerCard: { marginBottom: 16, borderRadius: 12 },
  card: { marginBottom: 16, borderRadius: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 8 },
  dateButton: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 8, 
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  },
  calendarContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  pickerWrapper: { borderWidth: 1, borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', gap: 12 },
});