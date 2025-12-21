import React from 'react';
import { useTheme } from 'react-native-paper';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import InicioScreen from '../screens/InicioScreen';
import PerfilScreen from '../screens/PerfilScreen';
import ConfigScreen from '../screens/ConfigScreen';
import DepartmentsList from '../screens/DepartmentsList';
import DepartmentForm from '../screens/DepartmentForm';
import DepartmentDetail from '../screens/DepartmentDetail';
import ReservationsList from '../screens/ReservationsList';
import ReservationForm from '../screens/ReservationForm';
import PaymentScreen from '../screens/PaymentScreen';
import EditProfile from '../screens/EditProfile';
import UserManagement from '../screens/UserManagement';
import CreateUser from '../screens/CreateUser';
import Reports from '../screens/Reports';
import SuperAdminDashboard from '../screens/SuperAdminDashboard';
import FavoritesScreen from '../screens/FavoritesScreen';
import MoreScreen from '../screens/MoreScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import SearchScreen from '../screens/SearchScreen';
import ReviewScreen from '../screens/ReviewScreen';
import AdminDashboard from '../screens/AdminDashboard';
import { useAppContext } from '../context/AppContext';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function DepartmentsStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: true, headerStyle: { backgroundColor: theme.colors.topBar }, headerTintColor: theme.colors.onTopBar || theme.colors.text }}>
      <Stack.Screen name="DepartamentosList" component={DepartmentsList} options={{ title: 'Departamentos' }} />
      <Stack.Screen name="DepartmentDetail" component={DepartmentDetail} options={{ title: 'Detalles del departamento' }} />
      <Stack.Screen name="DepartmentForm" component={DepartmentForm} options={{ title: 'Departamento' }} />
      <Stack.Screen name="Reservations" component={ReservationsList} options={{ title: 'Reservas' }} />
      <Stack.Screen name="ReservationForm" component={ReservationForm} options={{ title: 'Nueva Reserva' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Método de Pago' }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Buscar', headerShown: false }} />
      <Stack.Screen name="Reviews" component={ReviewScreen} options={{ title: 'Reseñas', headerShown: false }} />
    </Stack.Navigator>
  );
}

const ConfigStack = createNativeStackNavigator();

function ConfigStackScreen() {
  const theme = useTheme();
  const { user, canManageUsers, canViewReports, canApproveReservation, canViewSuperAdminStats } = useAppContext();
  return (
    <ConfigStack.Navigator initialRouteName="ConfiguracionMain" screenOptions={{ headerShown: true, headerStyle: { backgroundColor: theme.colors.topBar }, headerTintColor: theme.colors.onTopBar || theme.colors.text }}>
      <ConfigStack.Screen name="ConfiguracionMain" component={ConfigScreen} options={{ title: 'Configuración' }} />
      <ConfigStack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Editar perfil' }} />
      {canManageUsers(user) && (
        <>
          <ConfigStack.Screen name="UserManagement" component={UserManagement} options={{ title: 'Gestionar usuarios' }} />
          <ConfigStack.Screen name="CreateUser" component={CreateUser} options={{ title: 'Crear usuario' }} />
        </>
      )}
      {canViewReports(user) && (
        <ConfigStack.Screen name="Reports" component={Reports} options={{ title: 'Reportes' }} />
      )}
      {canApproveReservation(user) && (
        <ConfigStack.Screen name="ReservationApprovals" component={require('../screens/ReservationApprovals').default} options={{ title: 'Aprobaciones' }} />
      )}
      {canViewSuperAdminStats(user) && (
        <ConfigStack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} options={{ title: 'Panel Super Admin' }} />
      )}
    </ConfigStack.Navigator>
  );
}

const MoreStack = createNativeStackNavigator();

function MoreStackScreen() {
  const theme = useTheme();
  const { user, isAdmin, isSuperAdmin } = useAppContext();
  return (
    <MoreStack.Navigator initialRouteName="MoreMain" screenOptions={{ headerShown: true, headerStyle: { backgroundColor: theme.colors.topBar }, headerTintColor: theme.colors.onTopBar || theme.colors.text }}>
      <MoreStack.Screen name="MoreMain" component={MoreScreen} options={{ title: 'Más Opciones', headerShown: false }} />
      <MoreStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notificaciones', headerShown: false }} />
      <MoreStack.Screen name="Help" component={HelpScreen} options={{ title: 'Centro de Ayuda', headerShown: false }} />
      <MoreStack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacidad y Seguridad', headerShown: false }} />
      <MoreStack.Screen name="SuperAdminDashboard" component={SuperAdminDashboard} options={{ title: 'Panel Super Admin', headerShown: false }} />
      {isAdmin(user) && (
        <MoreStack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Panel Admin', headerShown: false }} />
      )}
      {isSuperAdmin(user) && (
        <MoreStack.Screen name="UserManagement" component={UserManagement} options={{ title: 'Gestión de Usuarios', headerShown: false }} />
      )}
      <MoreStack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Editar perfil' }} />
    </MoreStack.Navigator>
  );
}

export default function DashboardTabs() {
  const theme = useTheme();
  const { user } = useAppContext();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.disabled,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          backgroundColor: theme.colors.topBar,
        },
        tabBarIcon: ({ color }) => {
          let iconName = 'home';
          switch (route.name) {
            case 'Inicio':
              iconName = 'home';
              break;
            case 'Departamentos':
              iconName = 'building';
              break;
            case 'Favoritos':
              iconName = 'heart';
              break;
            case 'Perfil':
              iconName = 'user';
              break;
            case 'Mas':
              iconName = 'ellipsis-h';
              break;
            default:
              iconName = 'home';
          }
          return (
            <FontAwesome
              name={iconName}
              size={24}
              color={color}
              style={{ marginTop: 2 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Departamentos" component={DepartmentsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Favoritos" component={FavoritesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Mas" component={MoreStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
