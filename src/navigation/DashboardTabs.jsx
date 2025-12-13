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
import EditProfile from '../screens/EditProfile';
import UserManagement from '../screens/UserManagement';
import CreateUser from '../screens/CreateUser';
import Reports from '../screens/Reports';
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
    </Stack.Navigator>
  );
}

const ConfigStack = createNativeStackNavigator();

function ConfigStackScreen() {
  const theme = useTheme();
  const { user, canManageUsers, canViewReports, canApproveReservation } = useAppContext();
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
    </ConfigStack.Navigator>
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
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
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
            case 'Perfil':
              iconName = 'user';
              break;
              case 'Configuracion':
                iconName = 'cog';
                break;
            default:
              iconName = 'home';
          }
          return (
            <FontAwesome
              name={iconName}
              size={26}
              color={color}
              style={{ marginTop: 4 }}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen name="Departamentos" component={DepartmentsStack} options={{ headerShown: false }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} />
      <Tab.Screen name="Configuracion" component={ConfigStackScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
