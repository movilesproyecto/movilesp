import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Snackbar,
  Card,
  useTheme,
} from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppContext } from "../context/AppContext";

export default function LoginScreen({ navigation }) {
  const { loginWithCredentials } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const validateEmail = (value) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
    return re.test(String(value).toLowerCase());
  };

  const isFormValid = validateEmail(email) && password.length >= 6;

  const handleLogin = () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Introduce un correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const result = loginWithCredentials(email, password);
      if (result.success) {
        setError("");
        if (navigation && typeof navigation.replace === "function") {
          navigation.replace("Dashboard");
        }
      } else {
        setError(result.message || "Error al iniciar sesión.");
      }
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="light-content" />

        {/* Header decorativo con Safe Area dinámica */}
        <View
          style={[
            styles.headerDecor,
            {
              backgroundColor: theme.colors.primary,
              paddingTop: insets.top + 40,
            },
          ]}
        >
          <FontAwesome name="building" size={54} color="white" />
          <Text style={styles.headerTitle}>DeptBook</Text>
          <Text style={styles.headerSubtitle}>Gestor de Departamentos</Text>
        </View>

        {/* Contenedor de la tarjeta con efecto de superposición */}
        <View style={styles.cardWrapper}>
          <Card
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
          >
            <Card.Content>
              <Text style={[styles.title, { color: theme.colors.primary }]}>
                Iniciar sesión
              </Text>

              {/* Información de usuarios demo mejorada */}
              <Card
                style={[
                  styles.infoCard,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Card.Content>
                  <View style={styles.infoHeader}>
                    <FontAwesome
                      name="info-circle"
                      size={16}
                      color={theme.colors.primary}
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.infoTitle,
                        { color: theme.colors.primary, marginLeft: 8 },
                      ]}
                    >
                      Acceso Rápido (Demo)
                    </Text>
                  </View>

                  <View style={styles.userDemo}>
                    <FontAwesome
                      name="user"
                      size={12}
                      color={theme.colors.secondary}
                    />
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurface, marginLeft: 8 }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Usuario:</Text>{" "}
                      johan11gamerez@gmail.com
                    </Text>
                  </View>
                  <View style={styles.userDemo}>
                    <FontAwesome
                      name="shield"
                      size={12}
                      color={theme.colors.warning}
                    />
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurface, marginLeft: 8 }}
                    >
                      <Text style={{ fontWeight: "bold" }}>Admin:</Text>{" "}
                      admin@demo.com
                    </Text>
                  </View>
                </Card.Content>
              </Card>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Correo Electrónico
                </Text>
                <TextInput
                  label="Email"
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  left={
                    <TextInput.Icon icon="email" color={theme.colors.primary} />
                  }
                  outlineColor={theme.colors.outline}
                />
                {email.length > 0 && !validateEmail(email) && (
                  <View style={styles.errorContainer}>
                    <FontAwesome
                      name="exclamation-circle"
                      size={14}
                      color={theme.colors.error}
                    />
                    <Text
                      style={[
                        styles.fieldError,
                        { color: theme.colors.error, marginLeft: 6 },
                      ]}
                    >
                      Formato de correo inválido
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Contraseña
                </Text>
                <TextInput
                  label="Password"
                  mode="outlined"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  left={
                    <TextInput.Icon icon="lock" color={theme.colors.primary} />
                  }
                  outlineColor={theme.colors.outline}
                />
                {password.length > 0 && password.length < 6 && (
                  <View style={styles.errorContainer}>
                    <FontAwesome
                      name="exclamation-circle"
                      size={14}
                      color={theme.colors.error}
                    />
                    <Text
                      style={[
                        styles.fieldError,
                        { color: theme.colors.error, marginLeft: 6 },
                      ]}
                    >
                      Mínimo 6 caracteres
                    </Text>
                  </View>
                )}
              </View>

              <Button
                mode="contained"
                loading={loading}
                disabled={!isFormValid || loading}
                onPress={handleLogin}
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                {loading ? "Verificando..." : "Ingresar"}
              </Button>

              <View style={styles.divider}>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: theme.colors.outline },
                  ]}
                />
                <Text
                  style={[
                    styles.dividerText,
                    { color: theme.colors.placeholder },
                  ]}
                >
                  O registrarse
                </Text>
                <View
                  style={[
                    styles.dividerLine,
                    { backgroundColor: theme.colors.outline },
                  ]}
                />
              </View>

              <Button
                mode="outlined"
                onPress={() => navigation.push("Register")}
                style={styles.registerButton}
                labelStyle={{ color: theme.colors.primary }}
              >
                Crear Nueva Cuenta
              </Button>
            </Card.Content>
          </Card>
        </View>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError("")}
          duration={3000}
          style={[styles.snackbar, { backgroundColor: theme.colors.error }]}
        >
          {error}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  headerDecor: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  cardWrapper: { paddingHorizontal: 20, marginTop: -40 },
  card: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  infoCard: {
    marginBottom: 20,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderLeftColor: "#3a21cc",
  },
  infoHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoTitle: { fontSize: 13, fontWeight: "700" },
  userDemo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 4,
  },
  fieldError: { fontSize: 12, fontWeight: "500" },
  button: { marginTop: 10, borderRadius: 12 },
  buttonContent: { height: 48 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 12, fontWeight: "500" },
  registerButton: { borderRadius: 12, borderWidth: 1.5 },
  snackbar: { borderRadius: 8, marginHorizontal: 16 },
});
