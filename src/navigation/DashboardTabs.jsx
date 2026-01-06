import React from "react";
import { Platform } from "react-native";
import { useTheme } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";

// Importación de pantallas
import InicioScreen from "../screens/InicioScreen";
import PerfilScreen from "../screens/PerfilScreen";
import ConfigScreen from "../screens/ConfigScreen";
import DepartmentsList from "../screens/DepartmentsList";
import DepartmentForm from "../screens/DepartmentForm";
import DepartmentDetail from "../screens/DepartmentDetail";
import ReservationsList from "../screens/ReservationsList";
import ReservationForm from "../screens/ReservationForm";
import PaymentScreen from "../screens/PaymentScreen";
import EditProfile from "../screens/EditProfile";
import UserManagement from "../screens/UserManagement";
import CreateUser from "../screens/CreateUser";
import Reports from "../screens/Reports";
import SuperAdminDashboard from "../screens/SuperAdminDashboard";
import FavoritesScreen from "../screens/FavoritesScreen";
import MoreScreen from "../screens/MoreScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import HelpScreen from "../screens/HelpScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import SearchScreen from "../screens/SearchScreen";
import ReviewScreen from "../screens/ReviewScreen";
import AdminDashboard from "../screens/AdminDashboard";
import CompareScreen from "../screens/CompareScreen";
import BudgetCalculatorScreen from "../screens/BudgetCalculatorScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import PromotionForm from "../screens/PromotionForm";

// --- DEFINICIÓN DE TODOS LOS STACKS ---
// Esto previene el error "Property doesn't exist"
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const ConfigStack = createNativeStackNavigator();
const FavoritesStack = createNativeStackNavigator();
const PerfilStack = createNativeStackNavigator();
const MoreStack = createNativeStackNavigator();

// --- STACKS DE NAVEGACIÓN ---

function DepartmentsStack() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.topBar },
        headerTintColor: theme.colors.onTopBar || theme.colors.text,
      }}
    >
      <Stack.Screen
        name="DepartmentsList"
        component={DepartmentsList}
        options={{ title: "Departamentos" }}
      />
      <Stack.Screen
        name="DepartmentDetail"
        component={DepartmentDetail}
        options={{ title: "Detalles" }}
      />
      <Stack.Screen
        name="DepartmentForm"
        component={DepartmentForm}
        options={{ title: "Departamento" }}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationsList}
        options={{ title: "Reservas" }}
      />
      <Stack.Screen
        name="ReservationForm"
        component={ReservationForm}
        options={{ title: "Nueva Reserva" }}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: "Método de Pago" }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ title: "Buscar", headerShown: false }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewScreen}
        options={{ title: "Reseñas", headerShown: false }}
      />
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{ title: "Comparar" }}
      />
      <Stack.Screen
        name="BudgetCalculator"
        component={BudgetCalculatorScreen}
        options={{ title: "Presupuesto" }}
      />
    </Stack.Navigator>
  );
}

function ConfigStackScreen() {
  const theme = useTheme();
  const {
    user,
    canManageUsers,
    canViewReports,
    canApproveReservation,
    canViewSuperAdminStats,
    isAdmin,
    isSuperAdmin,
  } = useAppContext();
  return (
    <ConfigStack.Navigator
      initialRouteName="ConfiguracionMain"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.topBar },
        headerTintColor: theme.colors.onTopBar || theme.colors.text,
      }}
    >
      <ConfigStack.Screen
        name="ConfiguracionMain"
        component={ConfigScreen}
        options={{ title: "Configuración" }}
      />
      <ConfigStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Editar perfil" }}
      />
      {canManageUsers(user) && (
        <>
          <ConfigStack.Screen
            name="UserManagement"
            component={UserManagement}
            options={{ title: "Gestionar usuarios" }}
          />
          <ConfigStack.Screen
            name="CreateUser"
            component={CreateUser}
            options={{ title: "Crear usuario" }}
          />
        </>
      )}
      {canViewReports(user) && (
        <ConfigStack.Screen
          name="Reports"
          component={Reports}
          options={{ title: "Reportes" }}
        />
      )}
      {(isAdmin(user) || isSuperAdmin(user)) && (
        <>
          <ConfigStack.Screen
            name="Promotions"
            component={PromotionsScreen}
            options={{ title: "Promociones" }}
          />
          <ConfigStack.Screen
            name="PromotionForm"
            component={PromotionForm}
            options={{ title: "Promoción" }}
          />
        </>
      )}
      {canApproveReservation(user) && (
        <ConfigStack.Screen
          name="ReservationApprovals"
          component={require("../screens/ReservationApprovals").default}
          options={{ title: "Aprobaciones" }}
        />
      )}
      {canViewSuperAdminStats(user) && (
        <ConfigStack.Screen
          name="SuperAdminDashboard"
          component={SuperAdminDashboard}
          options={{ title: "Panel Super Admin" }}
        />
      )}
    </ConfigStack.Navigator>
  );
}

function FavoritesStackScreen() {
  const theme = useTheme();
  return (
    <FavoritesStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.topBar },
        headerTintColor: theme.colors.onTopBar || theme.colors.text,
      }}
    >
      <FavoritesStack.Screen
        name="FavoritesMain"
        component={FavoritesScreen}
        options={{ title: "Mis Favoritos" }}
      />
      <FavoritesStack.Screen
        name="DepartmentDetail"
        component={DepartmentDetail}
        options={{ title: "Detalles" }}
      />
      <FavoritesStack.Screen
        name="ReservationForm"
        component={ReservationForm}
        options={{ title: "Nueva Reserva" }}
      />
      <FavoritesStack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ title: "Método de Pago" }}
      />
    </FavoritesStack.Navigator>
  );
}

function PerfilStackScreen() {
  const theme = useTheme();
  return (
    <PerfilStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.topBar },
        headerTintColor: theme.colors.onTopBar || theme.colors.text,
      }}
    >
      <PerfilStack.Screen
        name="PerfilMain"
        component={PerfilScreen}
        options={{ title: "Mi Perfil" }}
      />
      <PerfilStack.Screen
        name="ConfigScreen"
        component={ConfigScreen}
        options={{ title: "Configuración" }}
      />
      <PerfilStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Editar perfil" }}
      />
    </PerfilStack.Navigator>
  );
}

function MoreStackScreen() {
  const theme = useTheme();
  const { user, isAdmin, isSuperAdmin } = useAppContext();
  return (
    <MoreStack.Navigator
      initialRouteName="MoreMain"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.topBar },
        headerTintColor: theme.colors.onTopBar || theme.colors.text,
      }}
    >
      <MoreStack.Screen
        name="MoreMain"
        component={MoreScreen}
        options={{ title: "Más Opciones", headerShown: false }}
      />
      <MoreStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: "Notificaciones", headerShown: false }}
      />
      <MoreStack.Screen
        name="Help"
        component={HelpScreen}
        options={{ title: "Centro de Ayuda", headerShown: false }}
      />
      <MoreStack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: "Privacidad", headerShown: false }}
      />
      <MoreStack.Screen
        name="SuperAdminDashboard"
        component={SuperAdminDashboard}
        options={{ title: "Panel Super Admin", headerShown: false }}
      />
      {isAdmin(user) && (
        <MoreStack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ title: "Panel Admin", headerShown: false }}
        />
      )}
      {isSuperAdmin(user) && (
        <MoreStack.Screen
          name="UserManagement"
          component={UserManagement}
          options={{ title: "Gestión de Usuarios", headerShown: false }}
        />
      )}
      <MoreStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: "Editar perfil" }}
      />
    </MoreStack.Navigator>
  );
}

// --- COMPONENTE PRINCIPAL ---

export default function DashboardTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.placeholder,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "700",
          // Ajuste para evitar que el texto choque con el borde en Android
          marginBottom: Platform.OS === "ios" ? 0 : 5,
        },
        tabBarStyle: {
          // Alturas optimizadas: 80 para iOS (con área segura), 65 para Android
          height: Platform.OS === "ios" ? 80 : 65,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          elevation: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
        tabBarIcon: ({ color }) => {
          let iconName = "home";
          switch (route.name) {
            case "Inicio":
              iconName = "home";
              break;
            case "Departamentos":
              iconName = "building";
              break;
            case "Favoritos":
              iconName = "heart";
              break;
            case "Perfil":
              iconName = "user-circle";
              break;
            case "Mas":
              iconName = "bars";
              break;
          }
          return <FontAwesome name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={InicioScreen} />
      <Tab.Screen
        name="Departamentos"
        component={DepartmentsStack}
        options={{ tabBarLabel: "Deptos" }}
      />
      <Tab.Screen name="Favoritos" component={FavoritesStackScreen} />
      <Tab.Screen name="Perfil" component={PerfilStackScreen} />
      <Tab.Screen
        name="Mas"
        component={MoreStackScreen}
        options={{ tabBarLabel: "Más" }}
      />
    </Tab.Navigator>
  );
}
