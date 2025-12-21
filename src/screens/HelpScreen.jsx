import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Card,
  Text,
  useTheme,
  Divider,
  List,
} from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const HelpScreen = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const faqs = [
    {
      id: 1,
      question: '¿Cómo hago una reserva?',
      answer:
        '1. Ve a la sección Departamentos\n2. Selecciona el departamento deseado\n3. Elige la fecha y duración\n4. Selecciona un método de pago\n5. Confirma tu reserva',
    },
    {
      id: 2,
      question: '¿Puedo cancelar mi reserva?',
      answer:
        'Sí, puedes cancelar tu reserva desde la sección Mis Reservas. Si cancelas con más de 48 horas de anticipación, recibirás un reembolso total.',
    },
    {
      id: 3,
      question: '¿Cuáles son los métodos de pago aceptados?',
      answer:
        'Aceptamos: Tarjeta de Crédito, Tarjeta de Débito, Transferencia Bancaria, Billetera Digital y Efectivo.',
    },
    {
      id: 4,
      question: '¿Cómo cambio mi contraseña?',
      answer:
        'Ve a Más > Cuenta > Contraseña e ingresa tu contraseña actual seguida de la nueva contraseña.',
    },
    {
      id: 5,
      question: '¿Dónde puedo ver mis facturas?',
      answer:
        'Todas tus facturas están disponibles en tu perfil bajo la sección "Comprobantes".',
    },
    {
      id: 6,
      question: '¿Cómo contacto al soporte?',
      answer:
        'Puedes escribirnos a support@apartamentos.com o usar el chat en vivo disponible en esta sección.',
    },
  ];

  const helpCategories = [
    {
      icon: 'book',
      title: 'Guía de Usuario',
      subtitle: 'Aprende a usar la app',
      color: '#3F51B5',
    },
    {
      icon: 'credit-card',
      title: 'Pagos y Facturación',
      subtitle: 'Información sobre pagos',
      color: '#009688',
    },
    {
      icon: 'calendar',
      title: 'Reservas',
      subtitle: 'Administra tus reservas',
      color: '#FF9800',
    },
    {
      icon: 'shield',
      title: 'Seguridad',
      subtitle: 'Protege tu cuenta',
      color: '#F44336',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <FontAwesome name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <FontAwesome
          name="question-circle"
          size={28}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.headerTitle}>Centro de Ayuda</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Help Categories */}
        <Text style={styles.sectionTitle}>Categorías</Text>
        <View style={styles.categoriesGrid}>
          {helpCategories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: category.color + '20' },
                ]}
              >
                <FontAwesome
                  name={category.icon}
                  size={24}
                  color={category.color}
                />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categorySubtitle}>
                {category.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Preguntas Frecuentes</Text>
        <Card style={styles.card}>
          {faqs.map((faq, index) => (
            <View key={faq.id}>
              <TouchableOpacity
                onPress={() =>
                  setExpandedFAQ(
                    expandedFAQ === faq.id ? null : faq.id
                  )
                }
                style={styles.faqHeader}
              >
                <FontAwesome
                  name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.colors.primary}
                  style={{ marginRight: 12 }}
                />
                <Text style={styles.faqQuestion}>
                  {faq.question}
                </Text>
              </TouchableOpacity>

              {expandedFAQ === faq.id && (
                <>
                  <Divider />
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>
                      {faq.answer}
                    </Text>
                  </View>
                </>
              )}
              {index < faqs.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* Contact Support */}
        <Text style={styles.sectionTitle}>Contacto Directo</Text>
        <Card style={styles.supportCard}>
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <FontAwesome name="envelope" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Correo Electrónico</Text>
              <Text style={styles.contactValue}>
                support@apartamentos.com
              </Text>
            </View>
          </View>

          <Divider />

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <FontAwesome name="phone" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>+57 300 123 4567</Text>
            </View>
          </View>

          <Divider />

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <FontAwesome name="clock-o" size={20} color="#4ECDC4" />
            </View>
            <View style={styles.contactContent}>
              <Text style={styles.contactLabel}>Atención</Text>
              <Text style={styles.contactValue}>
                Lun - Vie: 8:00 AM - 6:00 PM
              </Text>
            </View>
          </View>
        </Card>
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
      paddingTop: 30,
      flexDirection: 'row',
      alignItems: 'center',
      elevation: 4,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    categoryCard: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      marginBottom: 12,
      elevation: 2,
    },
    categoryIcon: {
      width: 50,
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    categorySubtitle: {
      fontSize: 10,
      color: theme.colors.disabled,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
      elevation: 2,
      overflow: 'hidden',
    },
    faqHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    faqQuestion: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
      flex: 1,
    },
    faqAnswer: {
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: theme.colors.background + '50',
    },
    faqAnswerText: {
      fontSize: 12,
      color: theme.colors.disabled,
      lineHeight: 20,
    },
    supportCard: {
      backgroundColor: theme.colors.surface,
      marginBottom: 20,
      elevation: 2,
      overflow: 'hidden',
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
    },
    contactIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: '#E0F2F1',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    contactContent: {
      flex: 1,
    },
    contactLabel: {
      fontSize: 12,
      color: theme.colors.disabled,
      marginBottom: 2,
    },
    contactValue: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.text,
    },
  });

export default HelpScreen;
